
"use client";

import type { NationalPark, CategorySlug } from '@/types';
// Removed: import { useTravelData } from '@/hooks/useTravelData';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface NationalParkTrackerProps {
  parks: NationalPark[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
}

export function NationalParkTracker({ parks, categorySlug, isItemVisited, toggleItemVisited }: NationalParkTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by park name or state(s)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="space-y-2">
        {filteredParks.map((park) => (
          <ItemToggle
            key={park.id}
            item={park}
            isChecked={isItemVisited(categorySlug, park.id)}
            onToggle={() => toggleItemVisited(categorySlug, park.id)}
            details={<span className="text-xs">{park.state}</span>}
          />
        ))}
      </div>
      {filteredParks.length === 0 && <p className="text-muted-foreground text-center">No national parks found.</p>}
    </div>
  );
}
