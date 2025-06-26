"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TrackableItem, CategorySlug } from "@/types";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface ItemToggleProps {
  item: TrackableItem;
  isChecked: boolean;
  onToggle: (item: TrackableItem) => void;
  details?: React.ReactNode;
  categorySlug?: CategorySlug;
  visitDate?: string;
  onVisitDateChange?: (item: TrackableItem, date: string) => void;
  notes?: string;
  onNotesChange?: (itemId: string, notes: string) => void;
  imageUrl?: string;
}

export function ItemToggle({
  item,
  isChecked,
  onToggle,
  details,
  categorySlug,
  visitDate,
  onVisitDateChange,
  notes,
  onNotesChange,
  imageUrl,
}: ItemToggleProps) {
  const uniqueId = `item-${item.id}`;
  const [currentNotes, setCurrentNotes] = useState(notes || "");

  useEffect(() => {
    setCurrentNotes(notes || "");
  }, [notes]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onVisitDateChange) {
      onVisitDateChange(item, e.target.value);
    }
  };

  const handleNotesAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNotes(e.target.value);
  };

  const handleNotesAreaBlur = () => {
    if (onNotesChange && currentNotes !== (notes || "")) {
      onNotesChange(item.id, currentNotes);
    }
  };

  const showDateInput = categorySlug === 'countries' && isChecked && onVisitDateChange;
  const showNotesInput = categorySlug === 'countries' && isChecked && onNotesChange;
  const showCalendarIcon = categorySlug === 'countries' && visitDate;

  return (
    <div
      className={cn(
        "flex flex-col p-3 rounded-md border transition-all duration-200 ease-in-out space-y-2",
        isChecked ? "bg-accent/20 border-accent" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Checkbox
            id={uniqueId}
            checked={isChecked}
            onCheckedChange={() => onToggle(item)}
            aria-label={`Mark ${item.name} as visited`}
          />
          <Label htmlFor={uniqueId} className="text-sm font-medium cursor-pointer flex items-center flex-1 min-w-0">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`${item.name} flag`}
                className="w-6 h-4 mr-2 rounded-sm object-cover shrink-0"
              />
            )}
            {showCalendarIcon && <CalendarDaysIcon className="w-4 h-4 mr-2 text-primary shrink-0" />}
            <span className="truncate">{item.name}</span>
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
      {showNotesInput && (
        <div className="pl-8 pt-2">
          <Textarea
            placeholder="Add notes..."
            value={currentNotes}
            onChange={handleNotesAreaChange}
            onBlur={handleNotesAreaBlur}
            className="h-24 text-sm resize-none"
            aria-label={`Notes for ${item.name}`}
          />
        </div>
      )}
    </div>
  );
}
