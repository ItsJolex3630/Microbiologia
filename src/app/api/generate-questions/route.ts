import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { FULL_DOCUMENT_TEXT } from '@/lib/document-content';

export async function POST(request: NextRequest) {
  try {
    const { count } = await request.json();

    if (!count || count < 5 || count > 50) {
      return NextResponse.json(
        { error: 'El número de preguntas debe ser entre 5 y 50' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `Eres un profesor experto en Microbiología y Virología que crea preguntas de examen extremadamente desafiantes y tramposas. Tu objetivo es hacer que el estudiante DUBE de sus conocimientos. 

REGLAS ESTRICTAS:
- Crea preguntas de opción múltiple con 4 opciones (a, b, c, d)
- Las preguntas deben ser TRAMPOSAS: usa distractores muy creíbles que hagan dudar
- Incluye preguntas que parezcan tener respuestas obvias pero que en realidad sean incorrectas
- Mezcla conceptos similares para confundir (ej: bacterias vs virus, Gram+ vs Gram-, etc.)
- Usa terminología técnica precisa pero en contexto engañoso
- Algunas preguntas deben tener "casi correctas" como distractores
- Varía la dificultad: algunas muy tramposas, otras moderadas
- Todas las preguntas deben basarse EXCLUSIVAMENTE en el contenido del documento proporcionado

FORMATO DE RESPUESTA - Debes responder ÚNICAMENTE con un JSON válido, sin texto adicional:
{
  "questions": [
    {
      "id": 1,
      "question": "texto de la pregunta",
      "options": {
        "a": "opción a",
        "b": "opción b",
        "c": "opción c",
        "d": "opción d"
      },
      "correctAnswer": "a|b|c|d",
      "explanation": "Explicación detallada de por qué la respuesta es correcta y por qué las otras son incorrectas, desmintiendo los posibles errores de razonamiento",
      "trickType": "tipo de trampa usada (ej: confusión de términos, distractor creíble, excepción oculta, etc.)",
      "difficulty": "fácil|media|difícil"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Basándote en el siguiente documento de Microbiología y Virología, genera exactamente ${count} preguntas de opción múltiple que sean desafiantes y hagan dudar al estudiante. Las preguntas deben cubrir TODOS los temas del documento de manera equilibrada.

DOCUMENTO:
${FULL_DOCUMENT_TEXT}

Genera ${count} preguntas tramposas y desafiantes.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response (handle potential markdown wrapping)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);
    
    // Shuffle questions for randomness
    const shuffled = [...parsed.questions].sort(() => Math.random() - 0.5);
    
    return NextResponse.json({ questions: shuffled });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Error al generar las preguntas. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
