import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, Lock, Check, Star, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { Lesson as LessonType } from "@/types";

export interface LessonNode {
  id: string;
  courseId: string;
  title: string;
  type: "normal" | "challenge" | "decision"; // Tipo de lección
  icon?: "book" | "star" | "trophy"; // Icono visual
  isUnlocked?: boolean;
  order: number;
}

interface LessonPathProps {
  lessons: LessonNode[];
  currentLessonId?: string;
  className?: string;
  vertical?: boolean;
}

export function LessonPath({
  lessons,
  currentLessonId,
  className,
  vertical = true
}: LessonPathProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(currentLessonId || null);
  const [animatedNodes, setAnimatedNodes] = useState<string[]>([]);
  const { isLessonCompleted } = useProgress();

  // Preparar los datos de lecciones con información adicional
  const processedLessons = lessons.map((lesson, index) => {
    // Determinar si está completada usando el hook
    const isCompleted = isLessonCompleted(lesson.id);

    // Determinar si está desbloqueada:
    // - La primera lección siempre está desbloqueada
    // - Las demás están desbloqueadas si la anterior está completada o si ya tienen isUnlocked=true
    const isUnlocked =
      lesson.isUnlocked !== undefined ? lesson.isUnlocked :
      index === 0 ? true :
      isLessonCompleted(lessons[index - 1].id);

    // Determinar el icono a mostrar según el tipo de lección
    const icon = lesson.icon ||
      (lesson.type === "challenge" ? "star" :
       lesson.type === "decision" ? "trophy" : "book");

    return {
      ...lesson,
      isCompleted,
      isUnlocked,
      icon
    };
  });

  // Animar los nodos secuencialmente al montar el componente
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    processedLessons.forEach((lesson, index) => {
      const timeout = setTimeout(() => {
        setAnimatedNodes(prev => [...prev, lesson.id]);
      }, index * 200); // Animar cada 200ms

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const getIconComponent = (lesson: typeof processedLessons[0]) => {
    if (!lesson.isUnlocked) return <Lock className="w-5 h-5" />;
    if (lesson.isCompleted) return <Check className="w-5 h-5" />;

    switch (lesson.icon) {
      case "star":
        return <Star className="w-5 h-5" />;
      case "trophy":
        return <Trophy className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  return (
    <div className={cn(
      vertical
        ? "flex flex-col items-center py-4"
        : "flex flex-row items-center justify-between py-4 overflow-x-auto",
      className
    )}>
      {processedLessons.map((lesson, index) => {
        // Determinar el estado del nodo
        const isActive = lesson.id === currentLessonId;
        const isExpanded = lesson.id === expandedLesson;
        const isAnimated = animatedNodes.includes(lesson.id);

        // Determinar las clases de estilo según el estado
        const nodeClasses = cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white relative z-10 transition-all duration-300",
          {
            "bg-yellow-500": lesson.icon === "star" && lesson.isUnlocked && !lesson.isCompleted,
            "bg-purple-500": lesson.icon === "trophy" && lesson.isUnlocked && !lesson.isCompleted,
            "bg-blue-500": lesson.icon === "book" && lesson.isUnlocked && !lesson.isCompleted,
            "bg-green-500": lesson.isCompleted,
            "bg-gray-300": !lesson.isUnlocked,
            "scale-110 shadow-md": isActive,
            "ring-4 ring-blue-200": isActive || isExpanded,
            "opacity-0 scale-50": !isAnimated,
            "opacity-100 scale-100": isAnimated,
          }
        );

        // Determinar los estilos de la línea conectora según orientación
        const lineElement = index < processedLessons.length - 1 ? (
          vertical ? (
            <div className={cn(
              "w-1 h-14 my-1 transition-all duration-500 delay-100",
              lesson.isCompleted ? "bg-green-500" : "bg-gray-300",
              animatedNodes.includes(lesson.id) ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
              "origin-top"
            )} />
          ) : (
            <div className={cn(
              "h-1 flex-grow mx-2 transition-all duration-500 delay-100",
              lesson.isCompleted ? "bg-green-500" : "bg-gray-300",
              animatedNodes.includes(lesson.id) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
              "origin-left"
            )} />
          )
        ) : null;

        return (
          <div
            key={lesson.id}
            className={cn(
              "relative",
              vertical ? "flex flex-col items-center" : "flex items-center",
              !vertical && index < processedLessons.length - 1 && "flex-1"
            )}
          >
            <Link
              to={lesson.isUnlocked ? `/cursos/${lesson.courseId}/lecciones/${lesson.id}` : "#"}
              className={cn(
                "relative",
                lesson.isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
              )}
              onClick={(e) => {
                if (!lesson.isUnlocked) {
                  e.preventDefault();
                } else {
                  setExpandedLesson(prev => prev === lesson.id ? null : lesson.id);
                }
              }}
            >
              <div className={nodeClasses}>
                {getIconComponent(lesson)}
                {lesson.isCompleted && (
                  <Sparkles className="absolute w-5 h-5 text-yellow-300 animate-pulse -top-1 -right-1" />
                )}
                <div className="absolute -right-1 -top-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-300">
                  <span className="text-xs font-bold text-gray-700">{lesson.order + 1}</span>
                </div>
              </div>

              {/* Tooltip con información de la lección */}
              {(isActive || isExpanded) && (
                <div className={cn(
                  "absolute bg-white rounded-lg p-2 shadow-md text-sm whitespace-nowrap z-20 border border-gray-100",
                  vertical ? "left-full ml-4" : "top-full mt-2 left-1/2 -translate-x-1/2",
                  "animate-fadeIn"
                )}>
                  <p className={cn("font-medium", {
                    "text-gray-400": !lesson.isUnlocked,
                    "text-blue-600": lesson.isUnlocked && !lesson.isCompleted,
                    "text-green-600": lesson.isCompleted
                  })}>
                    {lesson.title}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    {lesson.isCompleted ? (
                      "✓ Completada"
                    ) : lesson.isUnlocked ? (
                      "Disponible"
                    ) : (
                      "Bloqueada"
                    )}
                  </div>
                </div>
              )}
            </Link>

            {/* Línea conectora */}
            {vertical ? (
              <div className="flex flex-col items-center">
                {lineElement}
              </div>
            ) : (
              lineElement
            )}
          </div>
        );
      })}
    </div>
  );
}
