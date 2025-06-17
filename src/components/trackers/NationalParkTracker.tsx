
"use client";

import type { NationalPark, CategorySlug } from '@/types';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
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

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (parkId: string) => {
    const currentlyVisited = isItemVisited(categorySlug, parkId);
    toggleItemVisited(categorySlug, parkId);
    if (currentlyVisited) { 
      setNationalParkVisitDate(parkId, null); 
    }
  };

  const handleDateChange = (parkId: string, date: string) => {
    setNationalParkVisitDate(parkId, date);
    if (date && !isItemVisited(categorySlug, parkId)) {
      toggleItemVisited(categorySlug, parkId); 
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Search by park name or state(s)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
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
            isChecked={isItemVisited(categorySlug, park.id)}
            onToggle={() => handleToggle(park.id)}
            details={<span className="text-xs">{park.state}</span>}
            visitDate={getNationalParkVisitDate(park.id)}
            onDateChange={handleDateChange}
          />
        ))}
      </div>
      {parks.length > 0 && filteredParks.length === 0 && searchTerm !== '' && (
        <p className="text-muted-foreground text-center">No national parks found matching your search.</p>
      )}
       {parks.length === 0 && (
         <p className="text-muted-foreground text-center">No national parks to display.</p>
      )}
    </div>
  );
}
