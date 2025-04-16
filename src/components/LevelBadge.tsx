import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { useEffect, useState } from "react";

interface LevelBadgeProps {
  level?: number; // Opcional para permitir usar directamente el contexto
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LevelBadge({
  level: propLevel,
  showAnimation = false,
  size = "md",
  className
}: LevelBadgeProps) {
  const { level: contextLevel } = useProgress();
  const [displayLevel, setDisplayLevel] = useState(propLevel || contextLevel);
  const [isAnimating, setIsAnimating] = useState(false);

  // Si se proporciona level, úsalo, si no, usa el nivel del contexto
  const actualLevel = propLevel !== undefined ? propLevel : contextLevel;

  // Animar cuando cambia el nivel
  useEffect(() => {
    if (showAnimation && displayLevel !== actualLevel) {
      setIsAnimating(true);

      // Programar el cambio de nivel para que sea visible
      const timer = setTimeout(() => {
        setDisplayLevel(actualLevel);

        // Mantener la animación un poco más
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setDisplayLevel(actualLevel);
    }
  }, [actualLevel, showAnimation]);

  // Obtener el tamaño adecuado según la propiedad size
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default: // "md"
        return "px-3 py-1.5 text-sm";
    }
  };

  // Obtener el color según el nivel
  const getBadgeColor = () => {
    if (displayLevel < 5) return "bg-blue-50 border-blue-100 text-blue-700";
    if (displayLevel < 10) return "bg-green-50 border-green-100 text-green-700";
    if (displayLevel < 15) return "bg-purple-50 border-purple-100 text-purple-700";
    return "bg-yellow-50 border-yellow-100 text-yellow-700";
  };

  // Obtener el color de la corona según el nivel
  const getCrownColor = () => {
    if (displayLevel < 5) return "text-blue-500";
    if (displayLevel < 10) return "text-green-500";
    if (displayLevel < 15) return "text-purple-500";
    return "text-yellow-500";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border transition-all duration-300",
        getBadgeColor(),
        getSizeClasses(),
        isAnimating && "scale-110 animate-pulse",
        className
      )}
    >
      <Crown
        className={cn(
          "w-5 h-5 transition-all",
          getCrownColor(),
          isAnimating && "animate-spin"
        )}
      />
      <span className="font-medium">Nivel {displayLevel}</span>
    </div>
  );
}
