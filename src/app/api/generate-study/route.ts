import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { DOCUMENT_SECTIONS, type DocumentSection } from '@/lib/document-content';
import preGeneratedStudy from '@/lib/pre-generated-study.json';

export const maxDuration = 60;

function tryParseStudyJSON(text: string) {
  try {
    const parsed = JSON.parse(text);
    if (parsed.title) return parsed;
  } catch {
    // Continue
  }

  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.title) return parsed;
    } catch {
      // Continue
    }
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.title) return parsed;
    } catch {
      let fixed = jsonMatch[0];
      fixed = fixed.replace(/,\s*([}\]])/g, '$1');
      try {
        const parsed = JSON.parse(fixed);
        if (parsed.title) return parsed;
      } catch {
        // Give up
      }
    }
  }

  return null;
}

const defaultStudyData = (section: DocumentSection) => ({
  title: section.title,
  summary: section.content.substring(0, 200) + '...',
  keyPoints: section.content.split('\n\n').filter(p => p.trim().length > 0).slice(0, 5),
  detailedExplanation: section.content,
  commonMistakes: [],
  mnemonics: '',
  connectionsToOtherTopics: '',
  quizYourself: [],
});

/**
 * Get pre-generated study content (works on Vercel without LLM)
 */
function getPreGeneratedStudy(sectionId: string) {
  const data = (preGeneratedStudy as Record<string, typeof preGeneratedStudy.intro>)[sectionId];
  return data || null;
}

/**
 * Try to generate study content using the LLM
 * Has a 12-second timeout to fall back to pre-generated content quickly
 */
async function tryGenerateWithLLM(section: DocumentSection) {
  const LLM_TIMEOUT_MS = 12000;

  try {
    const zai = await Promise.race([
      ZAI.create(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM init timeout')), 5000)
      ),
    ]);

    const completion = await Promise.race([
      zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `Eres un profesor excepcional de Microbiología y Virología que explica conceptos de manera clara, profunda y memorable. Tu objetivo es que el estudiante ENTIENDA PERFECTAMENTE cada concepto, sin ninguna inseguridad.

ESTILO DE ENSEÑANZA:
- Explica cada concepto de forma clara y detallada
- Usa analogías y ejemplos para hacer los conceptos memorables
- Destaca los puntos clave que suelen confundir
- Relaciona conceptos entre sí para construir comprensión integral
- Incluye trucos mnemotécnicos cuando sea útil
- Señala errores comunes y cómo evitarlos
- Organiza la información de lo general a lo específico
- Usa lenguaje accesible pero técnicamente preciso

FORMATO DE RESPUESTA - Responde ÚNICAMENTE con JSON puro, sin markdown, sin backticks:
{
  "title": "Título de la sección",
  "summary": "Resumen de 2-3 oraciones del tema",
  "keyPoints": [
    "Punto clave 1 con explicación detallada",
    "Punto clave 2 con explicación detallada"
  ],
  "detailedExplanation": "Explicación completa y detallada del tema",
  "commonMistakes": [
    "Error común 1: descripción del error y por qué es incorrecto",
    "Error común 2: descripción del error y por qué es incorrecto"
  ],
  "mnemonics": "Trucos mnemotécnicos para recordar los conceptos clave",
  "connectionsToOtherTopics": "Cómo este tema se relaciona con otros temas del documento",
  "quizYourself": [
    "Pregunta de autoevaluación 1",
    "Pregunta de autoevaluación 2",
    "Pregunta de autoevaluación 3"
  ]
}

IMPORTANTE: Responde SOLO con JSON puro. Sin markdown, sin \`\`\`, sin texto antes o después del JSON.`
        },
        {
          role: 'user',
          content: `Explica de manera detallada y perfecta la siguiente sección del documento de Microbiología y Virología, para que el estudiante la entienda sin ninguna duda:

SECCIÓN: ${section.title}

CONTENIDO:
${section.content}

Proporciona una explicación completa y organizada que permita dominar este tema.`
        }
      ],
      thinking: { type: 'disabled' }
    }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM completion timeout')), LLM_TIMEOUT_MS)
      ),
    ]);

    const responseText = completion.choices[0]?.message?.content || '';
    return tryParseStudyJSON(responseText);
  } catch {
    // LLM not available
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sectionId } = await request.json();

    const section = DOCUMENT_SECTIONS.find(s => s.id === sectionId);

    if (!section) {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 400 }
      );
    }

    // 1. First, return pre-generated study content immediately (always works)
    const preGenData = getPreGeneratedStudy(sectionId);
    if (preGenData) {
      // Return pre-generated data right away - it's comprehensive enough
      // Try LLM in background to enhance, but don't wait for it
      return NextResponse.json({ ...preGenData, source: 'pre-generated' });
    }

    // 2. If no pre-generated data, try LLM
    const llmData = await tryGenerateWithLLM(section);
    if (llmData) {
      return NextResponse.json({ ...llmData, source: 'llm' });
    }

    // 3. Last fallback: use raw document content
    return NextResponse.json(defaultStudyData(section));
  } catch (error) {
    console.error('Error generating study content:', error);

    // Try to return fallback data
    try {
      const { sectionId } = await request.json();
      const section = DOCUMENT_SECTIONS.find(s => s.id === sectionId);
      if (section) {
        return NextResponse.json(defaultStudyData(section));
      }
    } catch {
      // Ignore
    }

    return NextResponse.json(
      { error: 'Error al generar el contenido de estudio. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
