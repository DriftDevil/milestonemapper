
"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressDisplayProps {
  currentValue: number;
  maxValue: number;
  className?: string;
}

export function ProgressDisplay({ currentValue, maxValue, className }: ProgressDisplayProps) {
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      <Progress value={percentage} className="h-3 bg-muted" />
      <p className="text-xs text-muted-foreground mt-1 text-right">
        {currentValue} / {maxValue}
      </p>
    </div>
  );
}
