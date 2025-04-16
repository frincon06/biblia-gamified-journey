import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, PlayCircle, Medal, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LessonPath, LessonNode } from "@/components/LessonPath";
import { Course, Lesson } from "@/types";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { apiService } from "@/integrations/supabase/services";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { XPCounter } from "@/components/XPCounter";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completedLessons, isLessonCompleted } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirigir a la página de autenticación si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Cargar el curso y sus lecciones
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        // Cargar el curso
        const courseData = await apiService.courses.getCourseById(courseId);
        if (!courseData) {
          toast({
            title: "Curso no encontrado",
            description: "El curso que intentas ver no existe",
            variant: "destructive"
          });
          navigate("/cursos");
          return;
        }

        setCourse(courseData);

        // Cargar las lecciones
        const lessonsData = await apiService.lessons.getLessonsByCourse(courseId);

        // Ordenar lecciones por su orden
        const sortedLessons = lessonsData.sort((a, b) => a.order - b.order);
        setLessons(sortedLessons);
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el detalle del curso",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  // Si está cargando, mostrar esqueleto de la interfaz
  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full mb-6" />

        <div className="flex justify-between mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full mb-6" />

        <Skeleton className="h-6 w-48 mb-3" />
        <Skeleton className="h-24 w-full mb-6 rounded-lg" />

        <Skeleton className="h-6 w-48 mb-3" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  // Si no se encuentra el curso, mostrar mensaje
  if (!course) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="text-center py-12">
          <p className="text-gray-500">Curso no encontrado</p>
          <Link to="/cursos" className="text-blue-600 mt-4 block hover:underline">
            Volver a la lista de cursos
          </Link>
        </div>
      </div>
    );
  }

  // Calcular el progreso del curso
  const totalLessons = lessons.length;
  const completedCount = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Determinar lecciones completadas, desbloqueadas y bloqueadas
  const processedLessons = lessons.map((lesson, index) => {
    // Una lección está completada si está en la lista de completedLessons
    const isCompleted = isLessonCompleted(lesson.id);

    // Una lección está desbloqueada si:
    // - Es la primera lección del curso (índice 0)
    // - La lección anterior está completada
    const isUnlocked = index === 0 || (index > 0 && isLessonCompleted(lessons[index - 1].id));

    return {
      ...lesson,
      isCompleted,
      isUnlocked
    };
  });

  // Convertir lecciones al formato necesario para LessonPath
  const pathLessons: LessonNode[] = processedLessons.map(lesson => ({
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    type: lesson.type || "normal",
    order: lesson.order,
    isUnlocked: lesson.isUnlocked
  }));

  // Determinar la siguiente lección disponible (primera que está desbloqueada pero no completada)
  const nextLesson = processedLessons.find(lesson => lesson.isUnlocked && !lesson.isCompleted);

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="mb-6">
        <Link to="/cursos" className="inline-flex items-center text-gray-600 mb-3 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Volver a cursos</span>
        </Link>

        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-gray-600">{completedCount} de {totalLessons} lecciones</span>
          </div>

          <div className="flex items-center">
            <span className="text-gray-600 mr-2">{progress}% completado</span>
            {progress === 100 && (
              <Medal className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>

        <div className="bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                : "bg-gradient-to-r from-blue-400 to-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {progress === 100 && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <div>
              <h3 className="font-medium text-yellow-700">¡Curso completado!</h3>
              <p className="text-sm text-yellow-600">Has completado todas las lecciones de este curso</p>
            </div>
          </div>
        )}
      </header>

      {nextLesson && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3">Continuar aprendiendo</h2>
          <Link to={`/cursos/${courseId}/lecciones/${nextLesson.id}`}>
            <div className="bg-white rounded-lg border-2 border-blue-100 p-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{nextLesson.title}</h3>
                  <p className="text-sm text-gray-600">
                    Continúa tu aprendizaje
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Ruta de aprendizaje</h2>
          {completedCount > 0 && (
            <XPCounter amount={completedCount * 10} />
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-center">
            <LessonPath lessons={pathLessons} vertical={true} />
          </div>
        </div>
      </section>

      {progress === 100 && (
        <section className="mb-8">
          <Button
            onClick={() => navigate("/cursos")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Explorar más cursos
          </Button>
        </section>
      )}
    </div>
  );
};

export default CourseDetail;
