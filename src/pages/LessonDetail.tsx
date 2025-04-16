import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { TrueFalse } from "@/components/exercises/TrueFalse";
import { FillInTheBlank } from "@/components/exercises/FillInTheBlank";
import { ReflectionActivity } from "@/components/exercises/ReflectionActivity";
import { PersonalDecision } from "@/components/exercises/PersonalDecision";
import { Exercise } from "@/types";
import { apiService } from "@/integrations/supabase/services";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const LessonDetail = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<any>(null);
  const [decision, setDecision] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    async function fetchLessonData() {
      if (!lessonId) return;

      try {
        setLoading(true);

        // Cargar la lección
        const lessonData = await apiService.lessons.getLessonById(lessonId);
        if (!lessonData) {
          toast({
            title: "Error",
            description: "No se encontró la lección",
            variant: "destructive"
          });
          navigate(`/cursos/${courseId}`);
          return;
        }

        // Cargar los ejercicios de la lección
        const exercisesData = await apiService.exercises.getExercisesByLesson(lessonId);

        // Cargar la decisión personal de la lección
        const decisionData = await apiService.decisions.getLessonDecision(lessonId);

        setLesson(lessonData);
        setExercises(exercisesData);
        setDecision(decisionData);
      } catch (error) {
        console.error("Error fetching lesson data:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al cargar la lección",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [lessonId, courseId, navigate]);

  const handleExerciseComplete = async (isCorrect: boolean, xpReward: number = 0) => {
    if (isCorrect) {
      setEarnedXP(prev => prev + xpReward);
    }

    // Avanzar al siguiente paso
    if (currentStep < exercises.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleDecisionMade = async (selectedOptionId: string) => {
    if (!user || !lessonId || !decision) return;

    try {
      // Guardar la decisión en la base de datos
      await apiService.users.saveUserDecision(
        user.id,
        lessonId,
        decision.id,
        selectedOptionId
      );

      setCompleted(true);
    } catch (error) {
      console.error("Error saving decision:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu decisión",
        variant: "destructive"
      });
    }
  };

  const handleFinishLesson = async () => {
    if (!user || !lessonId) return;

    try {
      // Marcar la lección como completada y actualizar XP
      await apiService.users.completeLesson(user.id, lessonId, earnedXP);

      toast({
        title: "¡Lección completada!",
        description: `Has ganado ${earnedXP} XP`
      });

      // Redirigir al detalle del curso
      navigate(`/cursos/${courseId}`);
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar tu progreso",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Lección no encontrada</h2>
          <p className="mb-4">No pudimos encontrar la lección solicitada</p>
          <Button onClick={() => navigate(`/cursos/${courseId}`)}>
            Volver al curso
          </Button>
        </div>
      </div>
    );
  }

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

  if (currentExerciseIndex < exercises.length) {
    const exercise = exercises[currentExerciseIndex];

    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 flex items-center justify-between">
          <Link to={`/cursos/${courseId}`} className="inline-flex items-center text-sagr-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Salir</span>
          </Link>

          <div className="text-sm text-sagr-gray-600">
            {currentExerciseIndex + 1} de {exercises.length + (decision ? 1 : 0)}
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
  if (decision) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <header className="mb-6 flex items-center justify-between">
          <Link to={`/cursos/${courseId}`} className="inline-flex items-center text-sagr-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Salir</span>
          </Link>

          <div className="text-sm text-sagr-gray-600">
            {exercises.length + 1} de {exercises.length + 1}
          </div>
        </header>

        <PersonalDecision
          title={decision.title}
          description={decision.description}
          options={decision.options}
          onComplete={handleDecisionMade}
        />
      </div>
    );
  }

  return null;
};

export default LessonDetail;
