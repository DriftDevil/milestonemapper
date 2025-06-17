
"use client";

import type { USState, CategorySlug } from '@/types';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface StateTrackerProps {
  states: USState[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
}

export function StateTracker({ states, categorySlug, isItemVisited, toggleItemVisited }: StateTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);

  const filteredStates = states
    .filter(state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(state => {
      if (showVisited) {
        return true; // Show all if showVisited is true
      }
      return !isItemVisited(categorySlug, state.id); // Otherwise, only show non-visited
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Input
          type="text"
          placeholder="Search states..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-visited-states"
            checked={showVisited}
            onCheckedChange={(checked) => setShowVisited(checked as boolean)}
          />
          <Label htmlFor="show-visited-states" className="text-sm">
            Show Visited States
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStates.map((state) => (
          <ItemToggle
            key={state.id}
            item={state}
            isChecked={isItemVisited(categorySlug, state.id)}
            onToggle={() => toggleItemVisited(categorySlug, state.id)}
          />
        ))}
      </div>
      {states.length > 0 && filteredStates.length === 0 && !showVisited && searchTerm === '' && (
         <p className="text-muted-foreground text-center">All states visited! Check "Show Visited States" to see them.</p>
      )}
      {states.length > 0 && filteredStates.length === 0 && (searchTerm !== '' || showVisited) && (
         <p className="text-muted-foreground text-center">No states found matching your criteria.</p>
      )}
      {states.length === 0 && (
         <p className="text-muted-foreground text-center">No states to display.</p>
      )}
    </div>
  );
}
