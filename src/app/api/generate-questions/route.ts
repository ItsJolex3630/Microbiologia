import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { FULL_DOCUMENT_TEXT, DOCUMENT_SECTIONS } from '@/lib/document-content';

// Increase timeout for this API route
export const maxDuration = 120;

interface GeneratedQuestion {
  id: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
  explanation: string;
  trickType: string;
  difficulty: string;
}

const SYSTEM_PROMPT = `Eres un profesor experto en Microbiología y Virología que crea preguntas de examen extremadamente desafiantes y tramposas. Tu objetivo es hacer que el estudiante DUBE de sus conocimientos.

REGLAS ESTRICTAS:
- Crea preguntas de opción múltiple con 4 opciones (a, b, c, d)
- Las preguntas deben ser TRAMPOSAS: usa distractores muy creíbles que hagan dudar
- Incluye preguntas que parezcan tener respuestas obvias pero que en realidad sean incorrectas
- Mezcla conceptos similares para confundir (ej: bacterias vs virus, Gram+ vs Gram-, etc.)
- Usa terminología técnica precisa pero en contexto engañoso
- Algunas preguntas deben tener "casi correctas" como distractores
- Varía la dificultad: algunas muy tramposas, otras moderadas
- Todas las preguntas deben basarse EXCLUSIVAMENTE en el contenido del documento proporcionado
- NO repitas preguntas entre lotes

FORMATO DE RESPUESTA - Debes responder ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin backticks:
{
  "questions": [
    {
      "id": 1,
      "question": "texto de la pregunta",
      "options": { "a": "opción a", "b": "opción b", "c": "opción c", "d": "opción d" },
      "correctAnswer": "a",
      "explanation": "Explicación detallada",
      "trickType": "tipo de trampa",
      "difficulty": "media"
    }
  ]
}

IMPORTANTE: Responde SOLO con JSON puro. Sin markdown, sin \`\`\`, sin texto antes o después del JSON.`;

const topicHints = [
  'Enfócate en Introducción a la Microbiología y clasificación celular (procariotas, eucariotas, virus).',
  'Enfócate en Características Generales de las Bacterias (pared celular, peptidoglucano, plásmidos, flagelos).',
  'Enfócate en Clasificación de las Bacterias (forma, respiración, nutrición, tinción de Gram).',
  'Enfócate en Estructura Celular Bacteriana (citoplasma, ribosomas 70S, nucleoide, membrana, cápsula).',
  'Enfócate en Reproducción y Supervivencia Bacteriana (fisión binaria, conjugación, transformación, transducción, biopelículas, endosporas).',
  'Enfócate en Los Virus (parásitos obligados, virión, cápside, envoltura, especificidad).',
  'Enfócate en Clasificación Morfológica Viral (icosahédrica, helicoidal, envoltura lipídica).',
  'Enfócate en Clasificación por Ácido Nucleico (virus ADN, virus ARN, retrovirus, VIH, transcriptasa inversa).',
];

function getSectionHint(sectionId: string): string | null {
  const section = DOCUMENT_SECTIONS.find(s => s.id === sectionId);
  if (!section) return null;
  return `Enfócate EXCLUSIVAMENTE en: ${section.title}. Contenido:\n${section.content}`;
}

function tryParseJSON(text: string): GeneratedQuestion[] {
  // Try direct parse first
  try {
    const parsed = JSON.parse(text);
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions;
    }
  } catch {
    // Continue to other methods
  }

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    } catch {
      // Continue
    }
  }

  // Try to find the outermost JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    } catch {
      // Try to fix common JSON issues
      let fixed = jsonMatch[0];
      // Remove trailing commas before } or ]
      fixed = fixed.replace(/,\s*([}\]])/g, '$1');
      // Fix unquoted property names
      fixed = fixed.replace(/(\w+)\s*:/g, '"$1":');
      try {
        const parsed = JSON.parse(fixed);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed.questions;
        }
      } catch {
        // Give up
      }
    }
  }

  // Last resort: try to find individual question objects
  const questionMatches = text.match(/\{[^{}]*"question"[^{}]*\}/g);
  if (questionMatches) {
    const questions: GeneratedQuestion[] = [];
    for (const match of questionMatches) {
      try {
        const q = JSON.parse(match);
        if (q.question && q.options && q.correctAnswer) {
          questions.push(q);
        }
      } catch {
        // Skip invalid
      }
    }
    if (questions.length > 0) return questions;
  }

  return [];
}

async function generateBatch(
  count: number,
  batchNumber: number,
  batchSize: number,
  existingQuestionsCount: number,
  sectionId?: string | null
): Promise<GeneratedQuestion[]> {
  const zai = await ZAI.create();

  let topicHint: string;
  if (sectionId) {
    const sectionHint = getSectionHint(sectionId);
    topicHint = sectionHint || topicHints[batchNumber % topicHints.length];
  } else {
    topicHint = topicHints[batchNumber % topicHints.length];
  }

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Basándote en el siguiente documento de Microbiología y Virología, genera exactamente ${batchSize} preguntas de opción múltiple desafiantes.

${topicHint}

DOCUMENTO:
${FULL_DOCUMENT_TEXT}

Genera ${batchSize} preguntas tramposas y desafiantes. Los IDs deben empezar desde ${existingQuestionsCount + 1}. Responde SOLO con JSON.`,
      },
    ],
    thinking: { type: 'disabled' },
  });

  const responseText = completion.choices[0]?.message?.content || '';
  const questions = tryParseJSON(responseText);

  // Re-index questions regardless of what IDs the LLM assigned
  return questions.map((q, idx) => ({
    ...q,
    id: existingQuestionsCount + idx + 1,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { count, batch, batchSize, sectionId } = await request.json();

    // Batch mode - generate a single batch
    if (batch !== undefined && batchSize !== undefined) {
      const questions = await generateBatch(count, batch, batchSize, batch * batchSize, sectionId);
      
      if (questions.length === 0) {
        return NextResponse.json(
          { error: 'No se pudieron generar preguntas en este lote', questions: [] },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ questions, batch, totalRequested: count });
    }

    // Single request mode (for small counts <= 5)
    const requestedCount = count || 5;
    if (requestedCount < 1 || requestedCount > 50) {
      return NextResponse.json(
        { error: 'El número de preguntas debe ser entre 1 y 50' },
        { status: 400 }
      );
    }

    const questions = await generateBatch(requestedCount, 0, requestedCount, 0, sectionId);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return NextResponse.json({ questions: shuffled });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Error al generar las preguntas. Intenta de nuevo.', questions: [] },
      { status: 500 }
    );
  }
}
