
import { BookOpen, Check } from "lucide-react";
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
  const isCompleted = completedCount === lessonsCount;

  return (
    <Link to={`/cursos/${id}`}>
      <Card className={cn("overflow-hidden border-2 transition-all duration-200 hover:border-sagr-blue hover:shadow-md", 
        isCompleted ? "border-sagr-gold" : "border-gray-200", className)}>
        
        <div className="relative h-40 bg-gradient-to-r from-sagr-blue/20 to-sagr-blue/10">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-sagr-blue/40" />
            </div>
          )}
          
          {isCompleted && (
            <div className="absolute top-2 right-2 bg-sagr-gold text-white p-1 rounded-full">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sagr-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between text-xs text-sagr-gray-500 mt-2">
            <span>{completedCount} de {lessonsCount} lecciones</span>
            <span>{progress}% completado</span>
          </div>
          <Progress value={progress} className="h-1.5 mt-1.5" />
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-center">
          <span className="text-sm font-medium text-sagr-blue">
            {isCompleted ? "Curso completado" : "Continuar aprendiendo"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
