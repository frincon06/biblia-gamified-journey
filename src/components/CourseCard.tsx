import { BookOpen, Check, ChevronRight, Award, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  completedCount: number;
  image?: string;
  className?: string;
}

export function CourseCard({ id, title, description, lessonsCount, completedCount, image, className }: CourseCardProps) {
  const progress = lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0;
  const isCompleted = lessonsCount > 0 && completedCount === lessonsCount;
  const isStarted = completedCount > 0 && !isCompleted;

  // Determinar el color del borde y la insignia según el estado
  const getBorderColorClass = () => {
    if (isCompleted) return "border-yellow-300";
    if (isStarted) return "border-blue-300";
    return "border-gray-200";
  };

  // Determinar colores de la barra de progreso
  const getProgressColors = () => {
    if (isCompleted) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    if (progress > 0) return "bg-gradient-to-r from-blue-400 to-blue-500";
    return "bg-gradient-to-r from-gray-300 to-gray-400";
  };

  return (
    <Link to={`/cursos/${id}`}>
      <Card
        className={cn(
          "overflow-hidden border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
          getBorderColorClass(),
          className
        )}
      >
        <div className="relative h-36 bg-gradient-to-r from-blue-50 to-blue-100">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-300" />
            </div>
          )}

          {/* Insignia de estado */}
          {isCompleted ? (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-md animate-pulse">
              <Award className="w-5 h-5" />
            </div>
          ) : isStarted ? (
            <div className="absolute top-3 right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
              <Play className="w-5 h-5" />
            </div>
          ) : null}

          {/* Cinta de completado */}
          {isCompleted && (
            <div className="absolute -top-1 -right-8 bg-yellow-500 text-white text-xs font-bold px-8 py-1 transform rotate-45 shadow-md">
              COMPLETADO
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{completedCount} de {lessonsCount} lecciones</span>
            <span className={cn(
              "font-medium",
              isCompleted ? "text-yellow-600" : isStarted ? "text-blue-600" : ""
            )}>
              {progress}% completado
            </span>
          </div>

          <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                getProgressColors()
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className={cn(
            "text-sm font-medium",
            isCompleted ? "text-yellow-600" : "text-blue-600"
          )}>
            {isCompleted
              ? "Curso completado"
              : isStarted
                ? "Continuar curso"
                : "Comenzar curso"}
          </span>
          <ChevronRight className={cn(
            "w-5 h-5 transition-all",
            isCompleted ? "text-yellow-500" : "text-blue-500"
          )} />
        </CardFooter>
      </Card>
    </Link>
  );
}
