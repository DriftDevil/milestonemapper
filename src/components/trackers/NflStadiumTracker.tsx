
"use client";

import type { NFLStadium, CategorySlug, TrackableItem } from '@/types';
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface NflStadiumTrackerProps {
  stadiums: NFLStadium[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function NflStadiumTracker({ stadiums, categorySlug, isItemVisited, toggleItemVisited, clearCategoryVisited }: NflStadiumTrackerProps) {
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
                id="show-visited-nfl"
                checked={showVisited}
                onCheckedChange={(checked) => setShowVisited(checked as boolean)}
              />
              <Label htmlFor="show-visited-nfl" className="text-sm whitespace-nowrap">
                Show Visited
              </Label>
            </div>
        </div>
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
      <ScrollArea className="h-[450px] w-full rounded-md border">
        <div className="p-4">
          {filteredStadiums.length > 0 ? (
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
          ) : (
             <div className="flex items-center justify-center text-center text-muted-foreground h-full min-h-[200px]">
              {stadiums.length > 0 ? (
                <p>
                  {!showVisited && searchTerm === ''
                    ? 'All NFL stadiums visited! Check "Show Visited" to see them.'
                    : 'No NFL stadiums found matching your criteria.'}
                </p>
              ) : (
                <p>No NFL stadiums to display.</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
