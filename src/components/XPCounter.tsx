import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { useEffect, useState } from "react";

interface XPCounterProps {
  amount?: number; // Opcional para permitir usar directamente el contexto
  animated?: boolean;
  className?: string;
}

export function XPCounter({ amount, animated = false, className }: XPCounterProps) {
  const { xp } = useProgress();
  const [displayAmount, setDisplayAmount] = useState<number>(amount || xp);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Si se proporciona amount, úsalo, si no, usa el XP del contexto
  const actualXP = amount !== undefined ? amount : xp;

  // Animar cuando cambia el XP
  useEffect(() => {
    if (animated && displayAmount !== actualXP) {
      // Si hay un cambio en XP, animamos
      setIsAnimating(true);

      // Animación gradual de incremento/decremento
      const diff = actualXP - displayAmount;
      const increment = Math.sign(diff) * Math.max(1, Math.abs(Math.floor(diff / 10)));

      const interval = setInterval(() => {
        setDisplayAmount(prev => {
          const next = prev + increment;
          // Determinar si hemos alcanzado o sobrepasado el valor final
          if ((increment > 0 && next >= actualXP) ||
              (increment < 0 && next <= actualXP)) {
            clearInterval(interval);
            setIsAnimating(false);
            return actualXP;
          }
          return next;
        });
      }, 30);

      return () => clearInterval(interval);
    } else {
      // Sin animación, actualizar directamente
      setDisplayAmount(actualXP);
    }
  }, [actualXP, animated]);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 transition-all duration-300",
        isAnimating && "scale-110 bg-green-100",
        className
      )}
    >
      <Zap className={cn(
        "w-5 h-5 text-green-500 transition-all",
        isAnimating && "text-yellow-500 animate-pulse"
      )} />
      <span className="text-sm font-medium text-green-700">
        {displayAmount} XP
      </span>
    </div>
  );
}
