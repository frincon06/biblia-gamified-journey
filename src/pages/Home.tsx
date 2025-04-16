import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, BookOpen, Award, Zap, Flame, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StreakCounter } from "@/components/StreakCounter";
import { LevelBadge } from "@/components/LevelBadge";
import { XPCounter } from "@/components/XPCounter";
import { apiService } from "@/integrations/supabase/services";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Course, Lesson } from "@/types";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const { xp, level, streak, isLoading: progressLoading } = useProgress();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [latestLesson, setLatestLesson] = useState<Lesson | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Redirigir a la página de autenticación si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Cargar cursos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const coursesData = await apiService.courses.getAllCourses();
        setCourses(coursesData);

        // Si hay cursos, intentamos cargar la primera lección del primer curso activo
        if (coursesData.length > 0) {
          const activeCourse = coursesData.find(c => c.isActive);
          if (activeCourse) {
            const lessons = await apiService.lessons.getLessonsByCourse(activeCourse.id);
            if (lessons.length > 0) {
              setLatestLesson(lessons[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive"
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  // Calcular XP para el siguiente nivel
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min(100, (xp / xpForNextLevel) * 100);

  // Nombre del usuario (extraemos el primer nombre)
  const firstName = user?.email?.split('@')[0] || "Estudiante";

  // Si está cargando, mostrar esqueletos
  if (authLoading || progressLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="mb-6 flex justify-between">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>

        <Skeleton className="h-32 w-full mb-6 rounded-lg" />
        <Skeleton className="h-16 w-full mb-4 rounded-lg" />
        <Skeleton className="h-28 w-full mb-6 rounded-lg" />

        <div className="mb-3 flex justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">¡Hola, {firstName}!</h1>
          <p className="text-gray-600">Continúa tu camino espiritual</p>
        </div>
        <LevelBadge level={level} />
      </header>

      {/* Sección de racha diaria */}
      <section className="mb-6">
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium flex items-center">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                Tu racha espiritual
              </h2>
              <StreakCounter animated days={streak} />
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {streak > 0
                ? `¡Llevas ${streak} ${streak === 1 ? 'día' : 'días'} de estudio consecutivo!`
                : 'Comienza tu estudio diario para crecer espiritualmente'}
            </p>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => latestLesson
                ? navigate(`/cursos/${latestLesson.courseId}/lecciones/${latestLesson.id}`)
                : navigate('/cursos')}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {latestLesson ? 'Comenzar la lección del día' : 'Explorar cursos'}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Sección de progreso del usuario */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-green-500 mr-2" />
            <h2 className="font-medium">Tu progreso</h2>
          </div>
          <XPCounter animated />
        </div>

        <div className="bg-gray-100 rounded-full h-3 mb-1">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>

        <div className="text-xs text-gray-600 flex justify-between">
          <span>Nivel {level}</span>
          <span>{xp}/{xpForNextLevel} XP para nivel {level + 1}</span>
        </div>
      </section>

      {/* Sección de continuar curso */}
      {latestLesson && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Continúa tu curso</h2>
          </div>

          <Link to={`/cursos/${latestLesson.courseId}/lecciones/${latestLesson.id}`} className="block">
            <Card className="overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md">
              <div className="h-24 bg-gradient-to-r from-blue-500/20 to-blue-500/5 relative">
                <div className="absolute inset-0 flex items-center justify-start p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{latestLesson.title}</h3>
                    <p className="text-xs text-gray-700">Continuar aprendiendo</p>
                  </div>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Sección de todos los cursos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Explora todos los cursos</h2>
          <Link to="/cursos" className="text-sm text-blue-600 hover:underline">Ver todos</Link>
        </div>

        {loadingCourses ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {courses.slice(0, 4).map((course) => (
              <Link key={course.id} to={`/cursos/${course.id}`} className="block">
                <Card className="border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-1">{course.lessonsCount} lecciones</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
