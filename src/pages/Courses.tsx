import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Info, BookOpen, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/integrations/supabase/services";
import { Course } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { LevelBadge } from "@/components/LevelBadge";
import { StreakCounter } from "@/components/StreakCounter";
import { XPCounter } from "@/components/XPCounter";

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { level, streak, xp, completedLessons, isLoading: progressLoading } = useProgress();

  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirigir a la página de autenticación si no está autenticado
  useEffect(() => {
    if (!user && !progressLoading) {
      navigate("/auth");
    }
  }, [user, progressLoading, navigate]);

  // Cargar los cursos desde Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Usar el servicio para obtener los cursos
        const coursesData = await apiService.courses.getAllCourses();

        // Filtrar solo los cursos activos
        const activeCourses = coursesData.filter(course => course.isActive);
        setCourses(activeCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Filtrar cursos según el término de búsqueda
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Para cada curso, calcular cuántas lecciones ha completado el usuario
  const coursesWithProgress = filteredCourses.map(course => {
    // Función para calcular lecciones completadas por curso
    const getCompletedLessonsCount = async (courseId: string) => {
      try {
        // En una implementación real, haríamos una consulta para obtener las lecciones del curso
        const lessons = await apiService.lessons.getLessonsByCourse(courseId);

        // Filtrar las lecciones que el usuario ha completado
        const completed = lessons.filter(lesson =>
          completedLessons.includes(lesson.id)
        ).length;

        return completed;
      } catch (error) {
        console.error(`Error getting completed lessons for course ${courseId}:`, error);
        return 0;
      }
    };

    return {
      ...course,
      completedCount: 0, // Inicialmente 0, se actualizará cuando tengamos los datos
      getCompletedCount: () => getCompletedLessonsCount(course.id)
    };
  });

  // Efecto para cargar las lecciones completadas para cada curso
  useEffect(() => {
    const updateCoursesProgress = async () => {
      if (coursesWithProgress.length === 0) return;

      const updatedCourses = [...coursesWithProgress];

      // Actualizar el progreso de cada curso
      for (let i = 0; i < updatedCourses.length; i++) {
        const course = updatedCourses[i];
        const completedCount = await course.getCompletedCount();
        updatedCourses[i] = { ...course, completedCount };
      }

      // Solo actualizar el estado si hay cambios
      const hasChanges = updatedCourses.some((course, index) =>
        course.completedCount !== coursesWithProgress[index].completedCount
      );

      if (hasChanges) {
        setCourses(updatedCourses.map(({ getCompletedCount, ...rest }) => rest));
      }
    };

    updateCoursesProgress();
  }, [coursesWithProgress]);

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-6 pb-20 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Cursos Bíblicos</h1>
        <p className="text-gray-500">Explora y aprende con nuestros cursos</p>

        {/* Mostrar progreso del usuario */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <LevelBadge showAnimation size="sm" />
          <XPCounter animated />
          <StreakCounter animated />
        </div>
      </header>

      {/* Búsqueda */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar cursos..."
          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de cursos */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton loader
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <Skeleton className="h-32 w-full rounded-lg mb-4" />
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          <>
            {/* Cursos en progreso */}
            {coursesWithProgress.some(course => course.completedCount > 0 && course.completedCount < course.lessonsCount) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  En progreso
                </h2>
                <div className="space-y-4">
                  {coursesWithProgress
                    .filter(course => course.completedCount > 0 && course.completedCount < course.lessonsCount)
                    .map((course, index) => (
                      <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CourseCard
                          id={course.id}
                          title={course.title}
                          description={course.description}
                          lessonsCount={course.lessonsCount}
                          completedCount={course.completedCount}
                          image={course.coverImage}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Cursos disponibles */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Cursos disponibles
              </h2>
              <div className="space-y-4">
                {coursesWithProgress
                  .filter(course => course.completedCount === 0)
                  .map((course, index) => (
                    <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CourseCard
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        lessonsCount={course.lessonsCount}
                        completedCount={course.completedCount}
                        image={course.coverImage}
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Cursos completados */}
            {coursesWithProgress.some(course => course.completedCount === course.lessonsCount && course.lessonsCount > 0) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-green-500" />
                  Completados
                </h2>
                <div className="space-y-4">
                  {coursesWithProgress
                    .filter(course => course.completedCount === course.lessonsCount && course.lessonsCount > 0)
                    .map((course, index) => (
                      <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CourseCard
                          id={course.id}
                          title={course.title}
                          description={course.description}
                          lessonsCount={course.lessonsCount}
                          completedCount={course.completedCount}
                          image={course.coverImage}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Info className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold">No se encontraron cursos</p>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? "No hay cursos que coincidan con tu búsqueda."
                : "Actualmente no hay cursos disponibles."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
