
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockLessons } from "@/data/mock-data";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { TrueFalse } from "@/components/exercises/TrueFalse";
import { FillInTheBlank } from "@/components/exercises/FillInTheBlank";
import { ReflectionActivity } from "@/components/exercises/ReflectionActivity";
import { PersonalDecision } from "@/components/exercises/PersonalDecision";
import { Exercise } from "@/types";

const LessonDetail = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(mockLessons[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  
  useEffect(() => {
    // En una aplicación real, cargaríamos la lección desde la base de datos
    if (lessonId) {
      // Para esta demo, usamos la lección mock
      setLesson(mockLessons[0]);
    }
  }, [lessonId]);
  
  const handleExerciseComplete = (isCorrect: boolean, xpReward: number = 0) => {
    if (isCorrect) {
      setEarnedXP(prev => prev + xpReward);
    }
    
    // Avanzar al siguiente paso
    if (currentStep < lesson.exercises.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handleDecisionMade = (selectedOptionId: string) => {
    // En una aplicación real, guardaríamos esta decisión en la base de datos
    setCompleted(true);
  };
  
  const handleFinishLesson = () => {
    // En una aplicación real, marcaríamos la lección como completada
    // y actualizaríamos el progreso del usuario
    
    // Redirigir al detalle del curso
    navigate(`/cursos/${courseId}`);
  };
  
  // Renderizar el contenido inicial de la lección
  if (currentStep === 0) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <header className="mb-6">
          <Link to={`/cursos/${courseId}`} className="inline-flex items-center text-sagr-gray-600 mb-3">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Volver al curso</span>
          </Link>
          
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
        </header>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            {lesson.content.scripture && (
              <div className="bg-sagr-gray-100 p-4 rounded-md mb-4 italic text-sagr-gray-700 border-l-4 border-sagr-gold">
                <p>{lesson.content.scripture}</p>
                {lesson.content.scriptureReference && (
                  <p className="text-right text-sm mt-2">— {lesson.content.scriptureReference}</p>
                )}
              </div>
            )}
            
            <div className="prose max-w-none mb-6">
              <p>{lesson.content.mainText}</p>
            </div>
            
            <Button className="w-full" onClick={() => setCurrentStep(1)}>
              Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Si ya completamos todos los ejercicios y la decisión (si existe)
  if (completed) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20 flex flex-col items-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">¡Lección completada!</h1>
        <p className="text-sagr-gray-600 text-center mb-4">Has ganado {earnedXP} XP</p>
        
        {lesson.content.keyVerse && (
          <Card className="mb-6 w-full">
            <CardContent className="p-4">
              <div className="bg-sagr-gray-100 p-4 rounded-md italic text-sagr-gray-700 border-l-4 border-sagr-gold">
                <p>"{lesson.content.keyVerse}"</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Button className="w-full max-w-sm" onClick={handleFinishLesson}>
          Finalizar
        </Button>
      </div>
    );
  }
  
  // Si estamos en un ejercicio
  const currentExerciseIndex = currentStep - 1;
  
  if (currentExerciseIndex < lesson.exercises.length) {
    const exercise = lesson.exercises[currentExerciseIndex];
    
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 flex items-center justify-between">
          <Link to={`/cursos/${courseId}`} className="inline-flex items-center text-sagr-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Salir</span>
          </Link>
          
          <div className="text-sm text-sagr-gray-600">
            {currentExerciseIndex + 1} de {lesson.exercises.length + (lesson.decision ? 1 : 0)}
          </div>
        </header>
        
        {exercise.type === "multipleChoice" && (
          <MultipleChoice
            question={exercise.question}
            choices={exercise.choices}
            onComplete={(isCorrect) => handleExerciseComplete(isCorrect, exercise.xpReward)}
          />
        )}
        
        {exercise.type === "trueFalse" && (
          <TrueFalse
            statement={exercise.statement}
            isCorrectAnswer={exercise.isCorrectAnswer}
            onComplete={(isCorrect) => handleExerciseComplete(isCorrect, exercise.xpReward)}
          />
        )}
        
        {exercise.type === "fillBlank" && (
          <FillInTheBlank
            beforeText={exercise.beforeText}
            afterText={exercise.afterText}
            correctAnswer={exercise.correctAnswer}
            caseSensitive={exercise.caseSensitive}
            onComplete={(isCorrect) => handleExerciseComplete(isCorrect, exercise.xpReward)}
          />
        )}
        
        {exercise.type === "reflection" && (
          <ReflectionActivity
            scripture={exercise.scripture || ""}
            question={exercise.question}
            onComplete={(reflection) => handleExerciseComplete(true, exercise.xpReward)}
          />
        )}
      </div>
    );
  }
  
  // Si llegamos a la decisión personal
  if (lesson.decision) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 flex items-center justify-between">
          <Link to={`/cursos/${courseId}`} className="inline-flex items-center text-sagr-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Salir</span>
          </Link>
          
          <div className="text-sm text-sagr-gray-600">
            {lesson.exercises.length + 1} de {lesson.exercises.length + 1}
          </div>
        </header>
        
        <PersonalDecision
          title={lesson.decision.title}
          description={lesson.decision.description}
          options={lesson.decision.options}
          onComplete={handleDecisionMade}
        />
      </div>
    );
  }
  
  return null;
};

export default LessonDetail;
