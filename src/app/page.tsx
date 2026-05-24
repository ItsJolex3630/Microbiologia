'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { DOCUMENT_SECTIONS } from '@/lib/document-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Microscope,
  BookOpen,
  Brain,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  AlertTriangle,
  ChevronRight,
  Clock,
  GraduationCap,
  Sparkles,
  Eye,
  Lightbulb,
  Link2,
  HelpCircle,
  Loader2,
  Home,
} from 'lucide-react';

// ==================== ANIMATION VARIANTS ====================
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

// ==================== HOME VIEW ====================
function HomeView() {
  const setView = useAppStore((s) => s.setView);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <Microscope className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Microbiología y Virología
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
          Estudia de forma inteligente. Pon a prueba tus conocimientos o domina cada tema con explicaciones detalladas.
        </p>
      </motion.div>

      {/* Mode Cards */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
      >
        {/* Test Mode Card */}
        <motion.div variants={fadeInUp}>
          <Card
            className="group cursor-pointer border-2 border-transparent hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 h-full"
            onClick={() => setView('test-setup')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                  <Brain className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Desafío
                </Badge>
              </div>
              <CardTitle className="text-xl">Modo Test</CardTitle>
              <CardDescription>
                Pon a prueba tus conocimientos con preguntas tramposas que te harán dudar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  Preguntas que te hacen dudar
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500 shrink-0" />
                  Elige entre 10 y 50 preguntas
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                  Explicación detallada al responder
                </li>
              </ul>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                Comenzar Test
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Study Mode Card */}
        <motion.div variants={fadeInUp}>
          <Card
            className="group cursor-pointer border-2 border-transparent hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/50 transition-all duration-300 h-full"
            onClick={() => setView('study')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                  Aprende
                </Badge>
              </div>
              <CardTitle className="text-xl">Modo Estudio</CardTitle>
              <CardDescription>
                Entiende cada tema a la perfección con explicaciones organizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                  Explicaciones claras y detalladas
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  Errores comunes destacados
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
                  Trucos mnemotécnicos
                </li>
              </ul>
              <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                Estudiar Ahora
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Document info */}
      <motion.div variants={fadeInUp} className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          8 secciones del documento · Microbiología y Virología
        </p>
      </motion.div>
    </motion.div>
  );
}

// ==================== TEST SETUP VIEW ====================
function TestSetupView() {
  const setView = useAppStore((s) => s.setView);
  const questionCount = useAppStore((s) => s.questionCount);
  const setQuestionCount = useAppStore((s) => s.setQuestionCount);
  const isGeneratingQuestions = useAppStore((s) => s.isGeneratingQuestions);
  const setIsGeneratingQuestions = useAppStore((s) => s.setIsGeneratingQuestions);
  const setQuestions = useAppStore((s) => s.setQuestions);
  const startTest = useAppStore((s) => s.startTest);

  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleStartTest = useCallback(async () => {
    setIsGeneratingQuestions(true);
    setGenerationError(null);
    setGenerationProgress(0);

    try {
      const BATCH_SIZE = 5;
      const totalBatches = Math.ceil(questionCount / BATCH_SIZE);
      const allQuestions: Array<{
        id: number;
        question: string;
        options: { a: string; b: string; c: string; d: string };
        correctAnswer: string;
        explanation: string;
        trickType: string;
        difficulty: string;
      }> = [];

      for (let i = 0; i < totalBatches; i++) {
        const remaining = questionCount - allQuestions.length;
        const currentBatchSize = Math.min(BATCH_SIZE, remaining);

        setGenerationProgress(Math.round(((i) / totalBatches) * 100));

        let retries = 2;
        let batchSuccess = false;

        while (retries >= 0 && !batchSuccess) {
          try {
            const res = await fetch('/api/generate-questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                count: questionCount,
                batch: i,
                batchSize: currentBatchSize,
              }),
            });

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
              // Re-index questions
              const reindexed = data.questions.map((q: { id: number; question: string; options: { a: string; b: string; c: string; d: string }; correctAnswer: string; explanation: string; trickType: string; difficulty: string }, idx: number) => ({
                ...q,
                id: allQuestions.length + idx + 1,
              }));
              allQuestions.push(...reindexed);
              batchSuccess = true;
            } else {
              throw new Error('No questions returned');
            }
          } catch (err) {
            retries--;
            if (retries < 0) {
              throw err;
            }
            // Wait before retry
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        setGenerationProgress(Math.round(((i + 1) / totalBatches) * 100));
      }

      if (allQuestions.length > 0) {
        // Shuffle all questions for randomness
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        startTest();
        setView('test-quiz');
      } else {
        setGenerationError('No se pudieron generar preguntas. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setGenerationError('Error al generar las preguntas. Intenta de nuevo.');
    } finally {
      setIsGeneratingQuestions(false);
      setGenerationProgress(0);
    }
  }, [questionCount, setIsGeneratingQuestions, setQuestions, startTest, setView]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8"
    >
      <Button
        variant="ghost"
        className="self-start mb-6 text-muted-foreground hover:text-foreground"
        onClick={() => {
          setIsGeneratingQuestions(false);
          setGenerationError(null);
          setGenerationProgress(0);
          setView('home');
        }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio
      </Button>

      <motion.div variants={fadeInUp} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Brain className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Configura tu Test</h2>
          <p className="text-muted-foreground">
            Las preguntas serán desafiantes y te harán dudar de lo que crees saber
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            {/* Question count slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Número de preguntas</Label>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                  {questionCount}
                </Badge>
              </div>
              <Slider
                value={[questionCount]}
                onValueChange={(v) => setQuestionCount(v[0])}
                min={10}
                max={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-amber-700">Tramposas</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                <Target className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-red-700">Al azar</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-blue-700">Con feedback</p>
              </div>
            </div>

            {/* Estimated time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Tiempo estimado: ~{Math.round(questionCount * 1.5)} minutos</span>
            </div>

            {/* Generation progress */}
            {isGeneratingQuestions && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Generando preguntas...</span>
                  <span className="text-sm font-medium text-emerald-600">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Generando en lotes para mayor calidad
                </p>
              </div>
            )}

            {/* Error message */}
            {generationError && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {generationError}
              </div>
            )}

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base"
              onClick={handleStartTest}
              disabled={isGeneratingQuestions}
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando {generationProgress}%...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generar {questionCount} Preguntas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ==================== TEST QUIZ VIEW ====================
function TestQuizView() {
  const questions = useAppStore((s) => s.questions);
  const currentQuestionIndex = useAppStore((s) => s.currentQuestionIndex);
  const answers = useAppStore((s) => s.answers);
  const setCurrentQuestionIndex = useAppStore((s) => s.setCurrentQuestionIndex);
  const setAnswer = useAppStore((s) => s.setAnswer);
  const finishTest = useAppStore((s) => s.finishTest);
  const setView = useAppStore((s) => s.setView);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.length;
  const progress = (answeredCount / questions.length) * 100;

  // Derive answer state from the store instead of using local state + effect
  const existingAnswer = answers.find((a) => a.questionId === currentQuestion?.id);
  const selectedAnswer = existingAnswer?.selectedAnswer ?? null;
  const showExplanation = existingAnswer?.selectedAnswer != null;

  if (!currentQuestion) return null;

  const handleSelectAnswer = (answer: string) => {
    if (showExplanation) return; // Already answered
    const isCorrect = answer === currentQuestion.correctAnswer;
    setAnswer(currentQuestion.id, answer, isCorrect);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    finishTest();
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = answers.length === questions.length;

  const difficultyColor: Record<string, string> = {
    'fácil': 'bg-green-100 text-green-700 border-green-200',
    'media': 'bg-amber-100 text-amber-700 border-amber-200',
    'difícil': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[calc(100vh-8rem)] px-4 py-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setView('home')}
          >
            <Home className="w-4 h-4 mr-1" />
            Salir
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={difficultyColor[currentQuestion.difficulty] || ''}>
              {currentQuestion.difficulty}
            </Badge>
            <Badge variant="secondary">
              {answeredCount}/{questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-2 mb-6" />

        {/* Question card */}
        <motion.div
          key={currentQuestionIndex}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 mb-4">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                  {currentQuestionIndex + 1}
                </span>
                <div className="flex-1">
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.trickType && (
                    <Badge variant="outline" className="mt-2 text-xs border-orange-300 text-orange-600 bg-orange-50">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {currentQuestion.trickType}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer || ''} className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isSelected = selectedAnswer === key;
                  const isCorrect = key === currentQuestion.correctAnswer;
                  const isWrong = showExplanation && isSelected && !isCorrect;

                  let optionClass = 'border-2 transition-all duration-200 cursor-pointer rounded-xl p-4 ';
                  if (!showExplanation) {
                    optionClass += isSelected
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50';
                  } else if (isCorrect) {
                    optionClass += 'border-green-500 bg-green-50';
                  } else if (isWrong) {
                    optionClass += 'border-red-400 bg-red-50';
                  } else {
                    optionClass += 'border-transparent opacity-60';
                  }

                  return (
                    <div
                      key={key}
                      className={optionClass}
                      onClick={() => handleSelectAnswer(key)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value={key}
                          id={`option-${key}`}
                          className="mt-0.5"
                          disabled={showExplanation}
                        />
                        <Label
                          htmlFor={`option-${key}`}
                          className="flex-1 cursor-pointer font-normal leading-relaxed"
                        >
                          <span className="font-semibold text-muted-foreground mr-2">{key.toUpperCase()})</span>
                          {value}
                        </Label>
                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        )}
                        {showExplanation && isWrong && (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`border-2 mb-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">¡Correcto!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-600">Incorrecto</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {currentQuestion.explanation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1.5">
            {questions.map((_, i) => {
              const answered = answers.find((a) => a.questionId === questions[i].id);
              let dotClass = 'w-2 h-2 rounded-full transition-colors ';
              if (i === currentQuestionIndex) {
                dotClass += 'bg-emerald-600 ring-2 ring-emerald-200';
              } else if (answered) {
                dotClass += answered.isCorrect ? 'bg-green-500' : 'bg-red-400';
              } else {
                dotClass += 'bg-muted-foreground/30';
              }
              return (
                <button
                  key={i}
                  className={dotClass}
                  onClick={() => setCurrentQuestionIndex(i)}
                />
              );
            })}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleFinish}
              disabled={!allAnswered}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Trophy className="w-4 h-4 mr-1" />
              Ver Resultados
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== TEST RESULTS VIEW ====================
function TestResultsView() {
  const questions = useAppStore((s) => s.questions);
  const answers = useAppStore((s) => s.answers);
  const testStartTime = useAppStore((s) => s.testStartTime);
  const testEndTime = useAppStore((s) => s.testEndTime);
  const resetTest = useAppStore((s) => s.resetTest);
  const setView = useAppStore((s) => s.setView);

  const [showReview, setShowReview] = useState(false);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const timeTaken = testStartTime && testEndTime
    ? Math.round((testEndTime - testStartTime) / 60000)
    : 0;

  const getGrade = () => {
    if (percentage >= 90) return { label: '¡Excelente!', color: 'text-green-600', emoji: '🏆' };
    if (percentage >= 70) return { label: '¡Muy bien!', color: 'text-emerald-600', emoji: '👏' };
    if (percentage >= 50) return { label: 'Buen intento', color: 'text-amber-600', emoji: '💪' };
    return { label: 'Sigue estudiando', color: 'text-red-600', emoji: '📚' };
  };

  const grade = getGrade();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[calc(100vh-8rem)] px-4 py-6"
    >
      <div className="max-w-2xl mx-auto">
        {!showReview ? (
          /* Results Summary */
          <motion.div variants={stagger} className="flex flex-col items-center">
            <motion.div variants={fadeInUp} className="text-center mb-8 mt-8">
              <div className="text-6xl mb-4">{grade.emoji}</div>
              <h2 className={`text-3xl font-bold mb-2 ${grade.color}`}>{grade.label}</h2>
              <p className="text-muted-foreground text-lg">
                Has completado el test de Microbiología y Virología
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="w-full max-w-sm mb-8">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <span className="text-5xl font-bold text-emerald-600">{percentage}%</span>
                    <p className="text-muted-foreground mt-1">
                      {correctCount} de {totalQuestions} correctas
                    </p>
                  </div>
                  <Progress value={percentage} className="h-3 mb-4" />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-green-50">
                      <p className="text-lg font-bold text-green-600">{correctCount}</p>
                      <p className="text-xs text-green-600/70">Correctas</p>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50">
                      <p className="text-lg font-bold text-red-500">{totalQuestions - correctCount}</p>
                      <p className="text-xs text-red-500/70">Incorrectas</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50">
                      <p className="text-lg font-bold text-blue-600">{timeTaken}m</p>
                      <p className="text-xs text-blue-600/70">Tiempo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetTest();
                  setView('test-setup');
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nuevo Test
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowReview(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Revisar Respuestas
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          /* Review Answers */
          <motion.div variants={stagger}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Revisión de Respuestas</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReview(false)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>
            </div>

            <ScrollArea className="max-h-[calc(100vh-14rem)]">
              <div className="space-y-4 pr-4">
                {questions.map((q, i) => {
                  const answer = answers.find((a) => a.questionId === q.id);
                  const isCorrect = answer?.isCorrect ?? false;
                  const selectedOption = answer?.selectedAnswer
                    ? q.options[answer.selectedAnswer as keyof typeof q.options]
                    : 'Sin respuesta';
                  const correctOption = q.options[q.correctAnswer as keyof typeof q.options];

                  return (
                    <motion.div key={q.id} variants={fadeInUp}>
                      <Card className={`border-2 ${isCorrect ? 'border-green-300' : 'border-red-300'}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3 mb-3">
                            <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-muted">
                              {i + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-sm leading-relaxed">{q.question}</p>
                            </div>
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                          </div>

                          {!isCorrect && (
                            <div className="ml-10 space-y-1 mb-2">
                              <p className="text-sm text-red-600">
                                <span className="font-medium">Tu respuesta:</span> {selectedOption}
                              </p>
                              <p className="text-sm text-green-600">
                                <span className="font-medium">Correcta:</span> {correctOption}
                              </p>
                            </div>
                          )}

                          <div className="ml-10">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== STUDY VIEW ====================
function StudyView() {
  const setView = useAppStore((s) => s.setView);
  const setCurrentSectionId = useAppStore((s) => s.setCurrentSectionId);
  const setStudyData = useAppStore((s) => s.setStudyData);
  const setIsGeneratingStudy = useAppStore((s) => s.setIsGeneratingStudy);

  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  const handleSelectSection = useCallback(async (sectionId: string) => {
    setLoadingSection(sectionId);
    setIsGeneratingStudy(true);
    try {
      const res = await fetch('/api/generate-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      });
      const data = await res.json();
      if (data.title) {
        setStudyData(data);
        setCurrentSectionId(sectionId);
        setView('study-section');
      }
    } catch (error) {
      console.error('Error generating study content:', error);
    } finally {
      setIsGeneratingStudy(false);
      setLoadingSection(null);
    }
  }, [setIsGeneratingStudy, setStudyData, setCurrentSectionId, setView]);

  const sectionIcons = [
    <Microscope key="1" className="w-5 h-5" />,
    <Zap key="2" className="w-5 h-5" />,
    <Target key="3" className="w-5 h-5" />,
    <Brain key="4" className="w-5 h-5" />,
    <RotateCcw key="5" className="w-5 h-5" />,
    <AlertTriangle key="6" className="w-5 h-5" />,
    <Eye key="7" className="w-5 h-5" />,
    <Sparkles key="8" className="w-5 h-5" />,
  ];

  const sectionColors = [
    'bg-emerald-100 text-emerald-600',
    'bg-teal-100 text-teal-600',
    'bg-cyan-100 text-cyan-600',
    'bg-amber-100 text-amber-600',
    'bg-orange-100 text-orange-600',
    'bg-rose-100 text-rose-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[calc(100vh-8rem)] px-4 py-6"
    >
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => setView('home')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Modo Estudio</h2>
          <p className="text-muted-foreground">
            Selecciona un tema para entenderlo a la perfección
          </p>
        </div>

        <motion.div variants={stagger} className="space-y-3">
          {DOCUMENT_SECTIONS.map((section, i) => (
            <motion.div key={section.id} variants={fadeInUp}>
              <Card
                className="group cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-teal-300"
                onClick={() => handleSelectSection(section.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${sectionColors[i]} shrink-0 group-hover:scale-110 transition-transform`}>
                      {sectionIcons[i]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{section.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {section.content.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="shrink-0">
                      {loadingSection === section.id ? (
                        <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-teal-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==================== STUDY SECTION VIEW ====================
function StudySectionView() {
  const setView = useAppStore((s) => s.setView);
  const currentSectionId = useAppStore((s) => s.currentSectionId);
  const studyData = useAppStore((s) => s.studyData);
  const isGeneratingStudy = useAppStore((s) => s.isGeneratingStudy);

  const currentSection = DOCUMENT_SECTIONS.find((s) => s.id === currentSectionId);

  if (isGeneratingStudy || !studyData) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Preparando tu estudio</h3>
          <p className="text-muted-foreground text-sm">
            Generando explicación detallada de {currentSection?.title || '...'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[calc(100vh-8rem)] px-4 py-6"
    >
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => setView('study')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Todos los temas
        </Button>

        {/* Title */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{studyData.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{studyData.summary}</p>
        </motion.div>

        <ScrollArea className="max-h-[calc(100vh-16rem)]">
          <div className="space-y-5 pr-4">
            {/* Key Points */}
            <motion.div variants={fadeInUp}>
              <Card className="border-2 border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Puntos Clave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {studyData.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Explanation */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    Explicación Detallada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {studyData.detailedExplanation}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Common Mistakes */}
            {studyData.commonMistakes.length > 0 && (
              <motion.div variants={fadeInUp}>
                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Errores Comunes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {studyData.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mnemonics */}
            {studyData.mnemonics && (
              <motion.div variants={fadeInUp}>
                <Card className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Trucos Mnemotécnicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{studyData.mnemonics}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Connections */}
            {studyData.connectionsToOtherTopics && (
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-blue-500" />
                      Conexiones con Otros Temas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{studyData.connectionsToOtherTopics}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quiz Yourself */}
            {studyData.quizYourself.length > 0 && (
              <motion.div variants={fadeInUp}>
                <Card className="border-2 border-emerald-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-500" />
                      Autoevalúate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {studyData.quizYourself.map((q, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm leading-relaxed">{q}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Navigation to other sections */}
            <motion.div variants={fadeInUp} className="pt-2 pb-4">
              <Separator className="mb-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">¿Listo para el siguiente tema?</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setView('study')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Todos los Temas
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      resetTest();
                      setView('test-setup');
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Hacer un Test
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}

// Helper to reset test from study section
function resetTest() {
  useAppStore.getState().resetTest();
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  const currentView = useAppStore((s) => s.currentView);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Microscope className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-sm">MicroBio Study</span>
          {currentView !== 'home' && (
            <Badge variant="secondary" className="text-xs">
              {currentView === 'test-setup' || currentView === 'test-quiz' || currentView === 'test-results'
                ? 'Modo Test'
                : 'Modo Estudio'}
            </Badge>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && <HomeView key="home" />}
          {currentView === 'test-setup' && <TestSetupView key="test-setup" />}
          {currentView === 'test-quiz' && <TestQuizView key="test-quiz" />}
          {currentView === 'test-results' && <TestResultsView key="test-results" />}
          {currentView === 'study' && <StudyView key="study" />}
          {currentView === 'study-section' && <StudySectionView key="study-section" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            Basado en el documento de Microbiología y Virología · Potenciado con IA
          </p>
        </div>
      </footer>
    </div>
  );
}
