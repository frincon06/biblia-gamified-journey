
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  days: number;
  className?: string;
}

export function StreakCounter({ days, className }: StreakCounterProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100", className)}>
      <Flame className="w-5 h-5 text-streak" />
      <span className="text-sm font-medium text-orange-700">{days} días</span>
    </div>
  );
}
