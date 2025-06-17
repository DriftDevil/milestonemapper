
"use client";

import type { MLBStadium, CategorySlug } from '@/types';
import { useTravelData } from '@/hooks/useTravelData';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface MlbStadiumTrackerProps {
  stadiums: MLBStadium[];
}

export function MlbStadiumTracker({ stadiums }: MlbStadiumTrackerProps) {
  const { toggleItemVisited, isItemVisited } = useTravelData();
  const categorySlug: CategorySlug = 'mlb-ballparks';
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
      {filteredStadiums.length === 0 && <p className="text-muted-foreground text-center">No MLB stadiums found.</p>}
    </div>
  );
}
