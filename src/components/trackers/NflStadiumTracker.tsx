
"use client";

import type { NFLStadium, CategorySlug } from '@/types';
// Removed: import { useTravelData } from '@/hooks/useTravelData';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface NflStadiumTrackerProps {
  stadiums: NFLStadium[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
}

export function NflStadiumTracker({ stadiums, categorySlug, isItemVisited, toggleItemVisited }: NflStadiumTrackerProps) {
  // Removed: const { toggleItemVisited, isItemVisited } = useTravelData();
  // Removed: const categorySlug: CategorySlug = 'nfl-stadiums'; // Now passed as prop
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStadiums = stadiums.filter(stadium =>
    stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stadium.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stadium.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by stadium, team, or city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="space-y-2">
        {filteredStadiums.map((stadium) => (
          <ItemToggle
            key={stadium.id}
            item={stadium}
            isChecked={isItemVisited(categorySlug, stadium.id)}
            onToggle={() => toggleItemVisited(categorySlug, stadium.id)}
            details={
              <div className="text-right">
                <p>{stadium.team}</p>
                <p>{stadium.city}, {stadium.state}</p>
              </div>
            }
          />
        ))}
      </div>
      {filteredStadiums.length === 0 && <p className="text-muted-foreground text-center">No NFL stadiums found.</p>}
    </div>
  );
}
