
// Definiciones de tipos para toda la aplicación

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  lastActivity?: Date;
  joinedAt: Date;
  completedLessons: string[]; // IDs de lecciones completadas
  completedCourses: string[]; // IDs de cursos completados
  decisions: UserDecision[];
}

export interface UserDecision {
  lessonId: string;
  decisionId: string;
  optionId: string;
  timestamp: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  lessonsCount: number;
  order: number;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: "normal" | "challenge";
  xpReward: number;
  content: LessonContent;
  exercises: Exercise[];
  decision?: Decision;
}

export interface LessonContent {
  scripture?: string;
  scriptureReference?: string;
  mainText: string;
  summary: string;
  keyVerse?: string;
}

export type Exercise = 
  | MultipleChoiceExercise
  | TrueFalseExercise
  | FillBlankExercise
  | ReflectionExercise;

export interface BaseExercise {
  id: string;
  type: string;
  order: number;
  xpReward: number;
  orderIndex?: number; // Add orderIndex for compatibility with existing code
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multipleChoice";
  question: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TrueFalseExercise extends BaseExercise {
  type: "trueFalse";
  statement: string;
  isCorrectAnswer: boolean;
}

export interface FillBlankExercise extends BaseExercise {
  type: "fillBlank";
  beforeText?: string;
  afterText?: string;
  correctAnswer: string;
  caseSensitive?: boolean;
}

export interface ReflectionExercise extends BaseExercise {
  type: "reflection";
  scripture?: string;
  question: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
}

export interface DecisionOption {
  id: string;
  text: string;
}
