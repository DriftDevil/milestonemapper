
"use client";

import type { USState, CategorySlug } from '@/types';
import { useTravelData } from '@/hooks/useTravelData';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface StateTrackerProps {
  states: USState[];
}

export function StateTracker({ states }: StateTrackerProps) {
  const { toggleItemVisited, isItemVisited } = useTravelData();
  const categorySlug: CategorySlug = 'us-states';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search states..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStates.map((state) => (
          <ItemToggle
            key={state.id}
            item={state}
            isChecked={isItemVisited(categorySlug, state.id)}
            onToggle={() => toggleItemVisited(categorySlug, state.id)}
            details={<span className="font-mono text-xs">{state.code}</span>}
          />
        ))}
      </div>
      {filteredStates.length === 0 && <p className="text-muted-foreground text-center">No states found.</p>}
    </div>
  );
}
