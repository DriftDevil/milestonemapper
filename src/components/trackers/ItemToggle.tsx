
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TrackableItem } from "@/types";
import { cn } from "@/lib/utils";

interface ItemToggleProps {
  item: TrackableItem;
  isChecked: boolean;
  onToggle: (itemId: string) => void;
  details?: React.ReactNode; // For additional info like team, city
}

export function ItemToggle({ item, isChecked, onToggle, details }: ItemToggleProps) {
  const uniqueId = `item-${item.id}`;
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-md border transition-all duration-200 ease-in-out",
        isChecked ? "bg-accent/20 border-accent" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center space-x-3">
        <Checkbox
          id={uniqueId}
          checked={isChecked}
          onCheckedChange={() => onToggle(item.id)}
          aria-label={`Mark ${item.name} as visited`}
        />
        <Label htmlFor={uniqueId} className="text-sm font-medium cursor-pointer">
          {item.name}
        </Label>
      </div>
      {details && <div className="text-xs text-muted-foreground text-right">{details}</div>}
    </div>
  );
}
