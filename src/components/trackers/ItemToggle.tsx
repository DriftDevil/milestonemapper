
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TrackableItem, CategorySlug } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "@/components/icons";

interface ItemToggleProps {
  item: TrackableItem;
  isChecked: boolean;
  onToggle: (item: TrackableItem) => void;
  details?: React.ReactNode;
  categorySlug?: CategorySlug;
  visitDate?: string;
  onDateChange?: (itemId: string, date: string) => void;
}

export function ItemToggle({
  item,
  isChecked,
  onToggle,
  details,
  categorySlug,
  visitDate,
  onDateChange,
}: ItemToggleProps) {
  const uniqueId = `item-${item.id}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateChange) {
      onDateChange(item.id, e.target.value);
    }
  };

  const showDateInput = (categorySlug === 'national-parks' || categorySlug === 'countries') && isChecked && onDateChange;
  const showCalendarIcon = (categorySlug === 'national-parks' || categorySlug === 'countries') && visitDate;

  return (
    <div
      className={cn(
        "flex flex-col p-3 rounded-md border transition-all duration-200 ease-in-out space-y-2",
        isChecked ? "bg-accent/20 border-accent" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={uniqueId}
            checked={isChecked}
            onCheckedChange={() => onToggle(item)}
            aria-label={`Mark ${item.name} as visited`}
          />
          <Label htmlFor={uniqueId} className="text-sm font-medium cursor-pointer flex items-center">
            {showCalendarIcon && <CalendarDaysIcon className="w-4 h-4 mr-2 text-primary" />}
            {item.name}
          </Label>
        </div>
        {details && <div className="text-xs text-muted-foreground text-right flex-shrink-0 ml-2">{details}</div>}
      </div>
      {showDateInput && (
        <div className="pl-8"> 
          <Input
            type="date"
            value={visitDate || ""}
            onChange={handleDateChange}
            className="h-8 text-sm"
            aria-label={`Visit date for ${item.name}`}
          />
        </div>
      )}
    </div>
  );
}
