import { NextRequest, NextResponse } from 'next/server';
import { DOCUMENT_SECTIONS, type DocumentSection } from '@/lib/document-content';
import preGeneratedStudy from '@/lib/pre-generated-study.json';

// NOTE: Removed `export const maxDuration = 60` — Vercel Hobby only supports up to 10s.

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
 * Try to generate study content using the LLM with dynamic import.
 * Returns null if LLM is not available.
 */
async function tryGenerateWithLLM(section: DocumentSection) {
  const LLM_TIMEOUT_MS = 8000; // Must fit within Vercel's 10s limit

  try {
    // Dynamic import — if z-ai-web-dev-sdk is not available, this will throw
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    const zai = await Promise.race([
      ZAI.create(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM init timeout')), 3000)
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
  // Parse body ONCE before any try-catch
  let body: { sectionId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { sectionId } = body;

  try {
    const section = DOCUMENT_SECTIONS.find(s => s.id === sectionId);

    if (!section) {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 400 }
      );
    }

    // 1. First, return pre-generated study content immediately (always works)
    const preGenData = getPreGeneratedStudy(sectionId!);
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

    // Use already-parsed body for fallback
    try {
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
