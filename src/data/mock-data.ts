
import { Course, Lesson, User } from "@/types";

// Mock de datos para desarrollo

export const mockUser: User = {
  id: "user1",
  name: "Usuario de Prueba",
  email: "usuario@ejemplo.com",
  level: 3,
  xp: 450,
  streak: 5,
  lastActivity: new Date(),
  joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 días atrás
  completedLessons: ["lesson1", "lesson2", "lesson3", "lesson4"],
  completedCourses: [],
  decisions: [
    {
      lessonId: "lesson1",
      decisionId: "decision1",
      optionId: "option1",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ]
};

export const mockCourses: Course[] = [
  {
    id: "course1",
    title: "La Fe de Jesús",
    description: "Descubre los fundamentos de la fe cristiana a través de las enseñanzas de Jesús.",
    coverImage: "/placeholder.svg",
    lessonsCount: 20,
    order: 1,
    isActive: true
  },
  {
    id: "course2",
    title: "Conociendo la Biblia",
    description: "Curso introductorio para entender la estructura y el mensaje de la Biblia.",
    coverImage: "/placeholder.svg",
    lessonsCount: 15,
    order: 2,
    isActive: true
  },
  {
    id: "course3",
    title: "Profecías y Promesas",
    description: "Explora las profecías bíblicas y las promesas de Dios para tu vida.",
    lessonsCount: 18,
    order: 3,
    isActive: true
  },
  {
    id: "course4",
    title: "Jesús en los Evangelios",
    description: "Recorre la vida de Jesús a través de los cuatro evangelios.",
    lessonsCount: 25,
    order: 4,
    isActive: true
  }
];

export const mockLessons: Lesson[] = [
  {
    id: "lesson1",
    courseId: "course1",
    title: "Dios te habla hoy",
    description: "Descubre cómo Dios se comunica con nosotros a través de su Palabra.",
    order: 1,
    type: "normal",
    xpReward: 20,
    content: {
      scripture: "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.",
      scriptureReference: "Juan 1:1",
      mainText: "La Biblia es la forma en que Dios nos habla hoy. A través de ella, podemos conocer su voluntad y entender su amor por nosotros. La palabra 'verbo' en este contexto se refiere a Jesús, quien es la manifestación viva de la Palabra de Dios.",
      summary: "Dios nos habla a través de su Palabra, y Jesús es la Palabra viva.",
      keyVerse: "Juan 1:1"
    },
    exercises: [
      {
        id: "ex1",
        type: "multipleChoice",
        order: 1,
        xpReward: 10,
        question: "¿Qué significa que 'el Verbo era con Dios'?",
        choices: [
          { id: "c1", text: "Que Jesús existía desde el principio con Dios", isCorrect: true },
          { id: "c2", text: "Que la Biblia estaba con Dios", isCorrect: false },
          { id: "c3", text: "Que Dios hablaba mucho", isCorrect: false },
          { id: "c4", text: "Que Dios escribió la Biblia directamente", isCorrect: false }
        ]
      },
      {
        id: "ex2",
        type: "trueFalse",
        order: 2,
        xpReward: 5,
        statement: "Según Juan 1:1, Jesús es llamado 'el Verbo'.",
        isCorrectAnswer: true
      },
      {
        id: "ex3",
        type: "reflection",
        order: 3,
        xpReward: 15,
        scripture: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
        question: "¿De qué manera la Palabra de Dios ha iluminado tu vida o alguna decisión importante?"
      }
    ],
    decision: {
      id: "decision1",
      title: "Mi compromiso con la Palabra",
      description: "¿Qué decisión tomarás hoy respecto a la Palabra de Dios?",
      options: [
        { id: "option1", text: "Me comprometo a leer la Biblia diariamente" },
        { id: "option2", text: "Quiero aprender más sobre cómo estudiar la Biblia" },
        { id: "option3", text: "Compartiré lo aprendido con alguien más" }
      ]
    }
  }
];

// Función para obtener lecciones de un curso específico
export function getMockLessonsByCourse(courseId: string): {
  completed: Lesson[];
  unlocked: Lesson[];
  locked: Lesson[];
} {
  // Para simulación, creamos algunas lecciones para el curso seleccionado
  const completedLessonIds = mockUser.completedLessons;
  
  // Generamos lecciones de ejemplo
  const allLessons = Array(15).fill(0).map((_, index) => ({
    id: `${courseId}-lesson${index + 1}`,
    courseId,
    title: `Lección ${index + 1}`,
    description: `Descripción de la lección ${index + 1}`,
    order: index + 1,
    type: index % 5 === 0 ? "challenge" : "normal",
    xpReward: 20,
    content: {
      mainText: `Contenido principal de la lección ${index + 1}`,
      summary: `Resumen de la lección ${index + 1}`
    },
    exercises: []
  })) as Lesson[];
  
  // Distribuimos en las categorías
  return {
    completed: allLessons.filter((_, index) => index < 4), // Primeras 4 completadas
    unlocked: allLessons.filter((_, index) => index >= 4 && index < 6), // 2 desbloqueadas
    locked: allLessons.filter((_, index) => index >= 6) // Resto bloqueadas
  };
}
