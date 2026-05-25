import { NextRequest, NextResponse } from 'next/server';
import { DOCUMENT_SECTIONS, FULL_DOCUMENT_TEXT } from '@/lib/document-content';
import preGeneratedQuestions from '@/lib/pre-generated-questions.json';

// NOTE: Removed `export const maxDuration = 60` — Vercel Hobby only supports up to 10s.
// The LLM path has a built-in timeout shorter than that.

interface GeneratedQuestion {
  id: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
  explanation: string;
  trickType: string;
  difficulty: string;
  sectionId?: string;
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

IMPORTANTE: Responde SOLO con JSON puro. Sin markdown, sin \`\`\`, sin texto antes o después del JSON.

DISTRIBUCIÓN DE RESPUESTAS: La respuesta correcta debe estar distribuida uniformemente entre las opciones a, b, c, d (aproximadamente la misma cantidad de cada una). NO pongas la mayoría de respuestas correctas en una sola opción.`;

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
      fixed = fixed.replace(/,\s*([}\]])/g, '$1');
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

/**
 * Get questions from pre-generated pool (works on Vercel without LLM)
 */
function getPreGeneratedQuestions(count: number, sectionId?: string | null): GeneratedQuestion[] {
  const pool = sectionId
    ? (preGeneratedQuestions as Record<string, GeneratedQuestion[]>)[sectionId] || []
    : Object.values(preGeneratedQuestions).flat();

  // Fisher-Yates shuffle for true randomness (sort(() => Math.random()) is biased)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Re-index
  return selected.map((q, idx) => ({
    ...q,
    id: idx + 1,
  }));
}

/**
 * Try to generate questions using the LLM with dynamic import.
 * Returns empty array if LLM is not available (Vercel, no config, etc.)
 */
async function tryGenerateWithLLM(
  count: number,
  batchNumber: number,
  batchSize: number,
  existingQuestionsCount: number,
  sectionId?: string | null
): Promise<GeneratedQuestion[]> {
  const LLM_TIMEOUT_MS = 8000; // 8 seconds max — must fit within Vercel's 10s limit

  try {
    // Dynamic import — if z-ai-web-dev-sdk is not available, this will throw
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    const zai = await Promise.race([
      ZAI.create(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM init timeout')), 3000)
      ),
    ]);

    let topicHint: string;
    if (sectionId) {
      const sectionHint = getSectionHint(sectionId);
      topicHint = sectionHint || topicHints[batchNumber % topicHints.length];
    } else {
      topicHint = topicHints[batchNumber % topicHints.length];
    }

    // Only send the relevant section content instead of the full document
    let documentContent = FULL_DOCUMENT_TEXT;
    if (sectionId) {
      const section = DOCUMENT_SECTIONS.find(s => s.id === sectionId);
      if (section) {
        documentContent = `${section.title}\n\n${section.content}`;
      }
    }

    const completion = await Promise.race([
      zai.chat.completions.create({
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
${documentContent}

Genera ${batchSize} preguntas tramposas y desafiantes. Los IDs deben empezar desde ${existingQuestionsCount + 1}. Responde SOLO con JSON.`,
          },
        ],
        thinking: { type: 'disabled' },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM completion timeout')), LLM_TIMEOUT_MS)
      ),
    ]);

    const responseText = completion.choices[0]?.message?.content || '';
    const questions = tryParseJSON(responseText);

    return questions.map((q, idx) => ({
      ...q,
      id: existingQuestionsCount + idx + 1,
    }));
  } catch {
    // LLM not available (Vercel deployment, no config file, timeout, etc.)
    return [];
  }
}

export async function POST(request: NextRequest) {
  // Parse body ONCE before any try-catch so we can use it in fallbacks
  let body: { count?: number; batch?: number; batchSize?: number; sectionId?: string | null } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', questions: [] },
      { status: 400 }
    );
  }

  const { count, batch, batchSize, sectionId } = body;

  try {
    // Batch mode - generate a single batch
    if (batch !== undefined && batchSize !== undefined) {
      const batchNum = batch as number;
      const batchSz = batchSize as number;

      // Try LLM first (will gracefully fail if not available)
      const llmQuestions = await tryGenerateWithLLM(count || batchSz, batchNum, batchSz, batchNum * batchSz, sectionId);

      if (llmQuestions.length > 0) {
        return NextResponse.json({
          questions: llmQuestions,
          batch: batchNum,
          totalRequested: count,
          source: 'llm'
        });
      }

      // Fallback to pre-generated questions
      const preGenQuestions = getPreGeneratedQuestions(batchSz, sectionId);
      return NextResponse.json({
        questions: preGenQuestions,
        batch: batchNum,
        totalRequested: count,
        source: 'pre-generated'
      });
    }

    // Single request mode (for small counts <= 5)
    const requestedCount = count || 5;
    if (requestedCount < 1 || requestedCount > 50) {
      return NextResponse.json(
        { error: 'El número de preguntas debe ser entre 1 y 50' },
        { status: 400 }
      );
    }

    // Try LLM first
    const llmQuestions = await tryGenerateWithLLM(requestedCount, 0, requestedCount, 0, sectionId);
    if (llmQuestions.length > 0) {
      const shuffled = [...llmQuestions].sort(() => Math.random() - 0.5);
      return NextResponse.json({ questions: shuffled, source: 'llm' });
    }

    // Fallback to pre-generated questions
    const preGenQuestions = getPreGeneratedQuestions(requestedCount, sectionId);
    return NextResponse.json({ questions: preGenQuestions, source: 'pre-generated' });
  } catch (error) {
    console.error('Error generating questions:', error);

    // Use already-parsed body for fallback (NOT request.json() again!)
    try {
      const fallbackCount = count || 5;
      const preGenQuestions = getPreGeneratedQuestions(fallbackCount, sectionId);
      if (preGenQuestions.length > 0) {
        return NextResponse.json({ questions: preGenQuestions, source: 'pre-generated-fallback' });
      }
    } catch {
      // Ignore
    }

    return NextResponse.json(
      { error: 'Error al generar las preguntas. Intenta de nuevo.', questions: [] },
      { status: 500 }
    );
  }
}
