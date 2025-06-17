
"use client";

import type { NFLStadium, CategorySlug } from '@/types';
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

interface NflStadiumTrackerProps {
  stadiums: NFLStadium[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function NflStadiumTracker({ stadiums, categorySlug, isItemVisited, toggleItemVisited, clearCategoryVisited }: NflStadiumTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStadiums = stadiums.filter(stadium =>
    stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stadium.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stadium.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Search by stadium, team, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {stadiums.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">Clear Visited Stadiums</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all your visited NFL Stadiums. This cannot be undone.
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
      {stadiums.length > 0 && filteredStadiums.length === 0 && searchTerm !== '' && (
        <p className="text-muted-foreground text-center">No NFL stadiums found matching your search.</p>
      )}
      {stadiums.length === 0 && (
         <p className="text-muted-foreground text-center">No NFL stadiums to display.</p>
      )}
    </div>
  );
}
