
"use client";

import type { MLBStadium, CategorySlug, TrackableItem } from '@/types';
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

interface MlbStadiumTrackerProps {
  stadiums: MLBStadium[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function MlbStadiumTracker({ stadiums, categorySlug, isItemVisited, toggleItemVisited, clearCategoryVisited }: MlbStadiumTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);

  const filteredStadiums = stadiums
    .filter(stadium =>
      stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(stadium => {
      if (showVisited) {
        return true;
      }
      return !isItemVisited(categorySlug, stadium);
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Input
              type="text"
              placeholder="Search by stadium, team, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-visited-mlb"
                checked={showVisited}
                onCheckedChange={(checked) => setShowVisited(checked as boolean)}
              />
              <Label htmlFor="show-visited-mlb" className="text-sm whitespace-nowrap">
                Show Visited
              </Label>
            </div>
        </div>
        {stadiums.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">Clear Visited Ballparks</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all your visited MLB Ballparks. This cannot be undone.
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
            isChecked={isItemVisited(categorySlug, stadium)}
            onToggle={() => toggleItemVisited(categorySlug, stadium)}
            details={
              <div className="text-right">
                <p>{stadium.team}</p>
                <p>{stadium.city}, {stadium.state}</p>
              </div>
            }
          />
        ))}
      </div>
      {stadiums.length > 0 && filteredStadiums.length === 0 && !showVisited && searchTerm === '' && (
         <p className="text-muted-foreground text-center">All MLB ballparks visited! Check "Show Visited" to see them.</p>
      )}
      {stadiums.length > 0 && filteredStadiums.length === 0 && (searchTerm !== '' || showVisited) && (
         <p className="text-muted-foreground text-center">No MLB ballparks found matching your criteria.</p>
      )}
      {stadiums.length === 0 && (
         <p className="text-muted-foreground text-center">No MLB ballparks to display.</p>
      )}
    </div>
  );
}
