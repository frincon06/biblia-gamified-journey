
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPCounterProps {
  amount: number;
  className?: string;
}

export function XPCounter({ amount, className }: XPCounterProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100", className)}>
      <Zap className="w-5 h-5 text-xp" />
      <span className="text-sm font-medium text-green-700">{amount} XP</span>
    </div>
  );
}
