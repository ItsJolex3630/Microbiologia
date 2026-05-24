import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { DOCUMENT_SECTIONS, type DocumentSection } from '@/lib/document-content';

export const maxDuration = 120;

function tryParseStudyJSON(text: string) {
  // Try direct parse first
  try {
    const parsed = JSON.parse(text);
    if (parsed.title) return parsed;
  } catch {
    // Continue
  }

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.title) return parsed;
    } catch {
      // Continue
    }
  }

  // Try to find the outermost JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.title) return parsed;
    } catch {
      // Try to fix common JSON issues
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

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
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
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const parsed = tryParseStudyJSON(responseText);
    
    if (parsed) {
      return NextResponse.json(parsed);
    }
    
    // Fallback: return document content structured as study data
    console.warn('Failed to parse study JSON, using fallback');
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
