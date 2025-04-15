
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Lock, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  icon: "book" | "star"; // Tipo de lección: normal o destacada
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface LessonPathProps {
  lessons: Lesson[];
  currentLessonId?: string;
  className?: string;
}

export function LessonPath({ lessons, currentLessonId, className }: LessonPathProps) {
  // El estado del componente sólo sería necesario para animaciones y efectos visuales
  const [expandedLesson, setExpandedLesson] = useState<string | null>(currentLessonId || null);
  
  const getIconComponent = (lesson: Lesson) => {
    if (!lesson.isUnlocked) return <Lock className="w-5 h-5" />;
    if (lesson.isCompleted) return <Check className="w-5 h-5" />;
    return lesson.icon === "star" ? <Star className="w-5 h-5" /> : <Book className="w-5 h-5" />;
  };
  
  return (
    <div className={cn("flex flex-col items-center py-4", className)}>
      {lessons.map((lesson, index) => {
        // Determinar el estado del nodo
        const isActive = lesson.id === currentLessonId;
        const isExpanded = lesson.id === expandedLesson;
        
        // Determinar las clases de estilo según el estado
        const nodeClasses = cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white relative z-10 transition-all",
          {
            "bg-sagr-gold": lesson.icon === "star" && lesson.isUnlocked,
            "bg-sagr-blue": lesson.icon === "book" && lesson.isUnlocked && !lesson.isCompleted,
            "bg-xp": lesson.isCompleted,
            "bg-sagr-gray-300": !lesson.isUnlocked,
            "scale-110 shadow-md": isActive,
            "ring-4 ring-sagr-blue/20": isActive || isExpanded,
          }
        );
        
        // Determinar el tamaño y color de la línea conectora
        const lineClasses = index < lessons.length - 1 
          ? "w-1 h-12 bg-sagr-gray-300 my-1" 
          : "";
        
        return (
          <div key={lesson.id} className="flex flex-col items-center">
            <Link
              to={lesson.isUnlocked ? `/cursos/${lesson.courseId}/lecciones/${lesson.id}` : "#"}
              className={lesson.isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}
              onClick={(e) => {
                if (!lesson.isUnlocked) {
                  e.preventDefault();
                } else {
                  setExpandedLesson(lesson.id);
                }
              }}
            >
              <div className={nodeClasses}>
                {getIconComponent(lesson)}
                {isActive && (
                  <div className="absolute -right-1 -top-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-sagr-blue">
                    <span className="text-xs font-bold text-sagr-blue">{index + 1}</span>
                  </div>
                )}
              </div>
              <div className={cn(
                "absolute left-full ml-4 bg-white rounded-lg p-2 shadow-md text-sm whitespace-nowrap", 
                { "block": isActive || isExpanded, "hidden": !isActive && !isExpanded }
              )}>
                <p className={cn("font-medium", {
                  "text-sagr-gray-400": !lesson.isUnlocked
                })}>
                  {lesson.title}
                </p>
              </div>
            </Link>
            
            {lineClasses && <div className={lineClasses} />}
          </div>
        );
      })}
    </div>
  );
}
