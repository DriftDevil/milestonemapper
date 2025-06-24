
"use client";

import type { NationalPark, CategorySlug, TrackableItem } from '@/types';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface NationalParkTrackerProps {
  parks: NationalPark[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
  setNationalParkVisitDate: (parkId: string, date: string | null) => void;
  getNationalParkVisitDate: (parkId: string) => string | undefined;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function NationalParkTracker({
  parks,
  categorySlug,
  isItemVisited,
  toggleItemVisited,
  setNationalParkVisitDate,
  getNationalParkVisitDate,
  clearCategoryVisited,
}: NationalParkTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);

  const filteredParks = parks
    .filter(park =>
      park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(park => {
      if (showVisited) {
        return true;
      }
      return !isItemVisited(categorySlug, park);
    });

  const handleToggle = (park: NationalPark) => {
    const currentlyVisited = isItemVisited(categorySlug, park);
    toggleItemVisited(categorySlug, park);
    if (currentlyVisited) { 
      setNationalParkVisitDate(park.id, null); 
    }
  };

  const handleDateChange = (park: NationalPark, date: string) => {
    setNationalParkVisitDate(park.id, date);
    if (date && !isItemVisited(categorySlug, park)) {
      toggleItemVisited(categorySlug, park); 
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Input
              type="text"
              placeholder="Search by park name or state(s)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-visited-parks"
                checked={showVisited}
                onCheckedChange={(checked) => setShowVisited(checked as boolean)}
              />
              <Label htmlFor="show-visited-parks" className="text-sm whitespace-nowrap">
                Show Visited
              </Label>
            </div>
        </div>
        {parks.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">Clear Visited Parks</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all your visited National Parks and their visit dates. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => clearCategoryVisited(categorySlug)}>
                  Yes, clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="space-y-2">
        {filteredParks.map((park) => (
          <ItemToggle
            key={park.id}
            item={park}
            categorySlug={categorySlug}
            isChecked={isItemVisited(categorySlug, park)}
            onToggle={() => handleToggle(park)}
            details={<span className="text-xs">{park.state}</span>}
            visitDate={getNationalParkVisitDate(park.id)}
            onDateChange={(itemId, date) => handleDateChange(park, date)}
          />
        ))}
      </div>
      {parks.length > 0 && filteredParks.length === 0 && !showVisited && searchTerm === '' && (
         <p className="text-muted-foreground text-center">All national parks visited! Check "Show Visited" to see them.</p>
      )}
      {parks.length > 0 && filteredParks.length === 0 && (searchTerm !== '' || showVisited) && (
         <p className="text-muted-foreground text-center">No national parks found matching your criteria.</p>
      )}
       {parks.length === 0 && (
         <p className="text-muted-foreground text-center">No national parks to display.</p>
      )}
    </div>
  );
}
