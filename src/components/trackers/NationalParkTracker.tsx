
"use client";

import type { NationalPark, CategorySlug } from '@/types';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface NationalParkTrackerProps {
  parks: NationalPark[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
  setNationalParkVisitDate: (parkId: string, date: string | null) => void;
  getNationalParkVisitDate: (parkId: string) => string | undefined;
}

export function NationalParkTracker({
  parks,
  categorySlug,
  isItemVisited,
  toggleItemVisited,
  setNationalParkVisitDate,
  getNationalParkVisitDate,
}: NationalParkTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (parkId: string) => {
    const currentlyVisited = isItemVisited(categorySlug, parkId);
    toggleItemVisited(categorySlug, parkId);
    if (currentlyVisited) { // If it *was* visited and is now being unchecked
      setNationalParkVisitDate(parkId, null); // Clear the date
    }
  };

  const handleDateChange = (parkId: string, date: string) => {
    setNationalParkVisitDate(parkId, date);
    // If a date is set, ensure the park is marked as visited.
    if (date && !isItemVisited(categorySlug, parkId)) {
      toggleItemVisited(categorySlug, parkId); // This will mark it visited without clearing the date again
    }
  };

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
            categorySlug={categorySlug}
            isChecked={isItemVisited(categorySlug, park.id)}
            onToggle={() => handleToggle(park.id)}
            details={<span className="text-xs">{park.state}</span>}
            visitDate={getNationalParkVisitDate(park.id)}
            onDateChange={handleDateChange}
          />
        ))}
      </div>
      {filteredParks.length === 0 && <p className="text-muted-foreground text-center">No national parks found.</p>}
    </div>
  );
}
