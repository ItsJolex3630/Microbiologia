import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, explanation } = await request.json();

    if (!question || !userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const isCorrect = userAnswer === correctAnswer;

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      explanation: explanation || 'Sin explicación disponible'
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Error al evaluar la respuesta' },
      { status: 500 }
    );
  }
}
