import { create } from 'zustand';

export type AppView = 'home' | 'test-setup' | 'test-quiz' | 'test-results' | 'study' | 'study-section';

export interface Question {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
  explanation: string;
  trickType: string;
  difficulty: string;
}

export interface StudySectionData {
  title: string;
  summary: string;
  keyPoints: string[];
  detailedExplanation: string;
  commonMistakes: string[];
  mnemonics: string;
  connectionsToOtherTopics: string;
  quizYourself: string[];
}

export interface TestAnswer {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

interface AppState {
  // Navigation
  currentView: AppView;
  previousView: AppView | null;
  
  // Test state
  questionCount: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: TestAnswer[];
  isGeneratingQuestions: boolean;
  testStartTime: number | null;
  testEndTime: number | null;
  testSectionId: string | null;
  
  // Study state
  currentSectionId: string | null;
  studyData: StudySectionData | null;
  isGeneratingStudy: boolean;
  isStudyEnhanced: boolean;
  expandedSections: Set<string>;
  
  // Actions
  setView: (view: AppView) => void;
  goBack: () => void;
  setQuestionCount: (count: number) => void;
  setQuestions: (questions: Question[]) => void;
  setIsGeneratingQuestions: (loading: boolean) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  startTest: () => void;
  finishTest: () => void;
  resetTest: () => void;
  setCurrentSectionId: (id: string | null) => void;
  setStudyData: (data: StudySectionData | null) => void;
  setIsGeneratingStudy: (loading: boolean) => void;
  setIsStudyEnhanced: (val: boolean) => void;
  setTestSectionId: (id: string | null) => void;
  toggleSection: (sectionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: 'home',
  previousView: null,
  
  // Test state
  questionCount: 15,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isGeneratingQuestions: false,
  testStartTime: null,
  testEndTime: null,
  testSectionId: null,
  
  // Study state
  currentSectionId: null,
  studyData: null,
  isGeneratingStudy: false,
  isStudyEnhanced: false,
  expandedSections: new Set<string>(),
  
  // Actions
  setView: (view) => set((state) => ({ 
    currentView: view, 
    previousView: state.currentView 
  })),
  
  goBack: () => set((state) => ({ 
    currentView: state.previousView || 'home',
    previousView: null
  })),
  
  setQuestionCount: (count) => set({ questionCount: count }),
  setQuestions: (questions) => set({ questions }),
  setIsGeneratingQuestions: (loading) => set({ isGeneratingQuestions: loading }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  
  setAnswer: (questionId, selectedAnswer, isCorrect) => 
    set((state) => {
      const existing = state.answers.findIndex(a => a.questionId === questionId);
      const newAnswer: TestAnswer = { questionId, selectedAnswer, isCorrect };
      if (existing >= 0) {
        const newAnswers = [...state.answers];
        newAnswers[existing] = newAnswer;
        return { answers: newAnswers };
      }
      return { answers: [...state.answers, newAnswer] };
    }),
  
  startTest: () => set({ 
    testStartTime: Date.now(), 
    testEndTime: null,
    currentQuestionIndex: 0,
    answers: []
  }),
  
  finishTest: () => set({ 
    testEndTime: Date.now(),
    currentView: 'test-results',
    previousView: 'test-quiz'
  }),
  
  resetTest: () => set({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isGeneratingQuestions: false,
    testStartTime: null,
    testEndTime: null,
    testSectionId: null,
  }),
  
  setCurrentSectionId: (id) => set({ currentSectionId: id }),
  setStudyData: (data) => set({ studyData: data }),
  setIsGeneratingStudy: (loading) => set({ isGeneratingStudy: loading }),
  setIsStudyEnhanced: (val) => set({ isStudyEnhanced: val }),
  setTestSectionId: (id) => set({ testSectionId: id }),
  
  toggleSection: (sectionId) => 
    set((state) => {
      const newSet = new Set(state.expandedSections);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return { expandedSections: newSet };
    }),
  
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
  })),
  
  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),
}));
