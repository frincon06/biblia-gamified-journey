
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100", className)}>
      <Crown className="w-5 h-5 text-sagr-blue" />
      <span className="text-sm font-medium text-blue-700">Nivel {level}</span>
    </div>
  );
}
