import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { useEffect, useState } from "react";

interface StreakCounterProps {
  days?: number; // Opcional para permitir usar directamente el contexto
  animated?: boolean;
  className?: string;
}

export function StreakCounter({ days, animated = false, className }: StreakCounterProps) {
  const { streak } = useProgress();
  const [displayDays, setDisplayDays] = useState<number>(days || streak);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Si se proporciona days, úsalo, si no, usa el streak del contexto
  const actualDays = days !== undefined ? days : streak;

  // Animar cuando cambia la racha
  useEffect(() => {
    if (animated && displayDays !== actualDays) {
      // Si hay un cambio en la racha, animamos
      setIsAnimating(true);

      // Para la racha, incrementamos de uno en uno para enfatizar cada día
      const timer = setTimeout(() => {
        setDisplayDays(prev => {
          if (prev < actualDays) {
            return prev + 1;
          } else if (prev > actualDays) {
            return prev - 1;
          }
          return prev;
        });
      }, 300); // Más lento que el XP para que sea más notable

      // Si ya hemos llegado al valor final, terminamos la animación
      if (displayDays === actualDays) {
        setIsAnimating(false);
      }

      return () => clearTimeout(timer);
    } else {
      // Sin animación, actualizar directamente
      setDisplayDays(actualDays);
    }
  }, [displayDays, actualDays, animated]);

  // Calcular el número de llamas basado en la racha
  const flameCount = Math.min(3, Math.ceil(actualDays / 7)); // Máximo 3 llamas

  // Renderizar las llamas según la racha
  const renderFlames = () => {
    const flames = [];
    for (let i = 0; i < flameCount; i++) {
      flames.push(
        <Flame
          key={i}
          className={cn(
            "w-5 h-5 transition-all",
            isAnimating ? "text-red-500 animate-bounce" : "text-orange-500",
            i === 1 && "text-orange-600",
            i === 2 && "text-red-600"
          )}
        />
      );
    }
    return flames;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 transition-all duration-300",
        isAnimating && "scale-110 bg-orange-100",
        className
      )}
    >
      <div className="flex -space-x-1">
        {renderFlames()}
      </div>
      <span className="text-sm font-medium text-orange-700 ml-1">
        {displayDays} {displayDays === 1 ? 'día' : 'días'}
      </span>
    </div>
  );
}
