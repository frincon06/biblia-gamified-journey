
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LessonPath, Lesson as LessonPathItem } from "@/components/LessonPath";
import { mockCourses, getMockLessonsByCourse } from "@/data/mock-data";
import { Lesson } from "@/types";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<(typeof mockCourses)[0] | undefined>();
  const [courseLessons, setCourseLessons] = useState<{
    completed: Lesson[];
    unlocked: Lesson[];
    locked: Lesson[];
  }>({ completed: [], unlocked: [], locked: [] });
  
  useEffect(() => {
    if (courseId) {
      // En una aplicación real, esto sería una consulta a la API o base de datos
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Obtener las lecciones del curso
        const lessons = getMockLessonsByCourse(courseId);
        setCourseLessons(lessons);
      }
    }
  }, [courseId]);
  
  if (!course) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="text-center py-12">
          <p>Curso no encontrado</p>
          <Link to="/cursos" className="text-sagr-blue mt-4 block">
            Volver a la lista de cursos
          </Link>
        </div>
      </div>
    );
  }
  
  // Calcular el progreso del curso
  const totalLessons = course.lessonsCount;
  const completedLessons = courseLessons.completed.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);
  
  // Convertir lecciones al formato necesario para LessonPath
  const pathLessons: LessonPathItem[] = [
    ...courseLessons.completed.map(lesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      icon: lesson.type === "challenge" ? "star" as const : "book" as const,
      isCompleted: true,
      isUnlocked: true
    })),
    ...courseLessons.unlocked.map(lesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      icon: lesson.type === "challenge" ? "star" as const : "book" as const,
      isCompleted: false,
      isUnlocked: true
    })),
    ...courseLessons.locked.map(lesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      icon: "book" as const,
      isCompleted: false,
      isUnlocked: false
    }))
  ];
  
  // Determinar la siguiente lección disponible
  const nextLesson = courseLessons.unlocked[0];
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="mb-6">
        <Link to="/cursos" className="inline-flex items-center text-sagr-gray-600 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Volver a cursos</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-sagr-gray-600 mb-3">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-sagr-gray-600 mb-1">
          <span>{completedLessons} de {totalLessons} lecciones</span>
          <span>{progress}% completado</span>
        </div>
        <Progress value={progress} className="h-2" />
      </header>
      
      {nextLesson && (
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-3">Continuar aprendiendo</h2>
          <Link to={`/cursos/${courseId}/lecciones/${nextLesson.id}`}>
            <div className="bg-white rounded-lg border-2 border-sagr-blue p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-sagr-blue/10 flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-sagr-blue" />
                </div>
                <div>
                  <h3 className="font-medium">{nextLesson.title}</h3>
                  <p className="text-sm text-sagr-gray-600">
                    Continúa donde lo dejaste
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
      
      <section className="mb-6">
        <h2 className="text-lg font-medium mb-3">Ruta de aprendizaje</h2>
        <div className="bg-white rounded-lg border border-sagr-gray-200 p-4">
          <div className="relative">
            <LessonPath lessons={pathLessons} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
