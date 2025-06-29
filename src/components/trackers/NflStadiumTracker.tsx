
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NflStadiumsMap } from '@/components/map/NflStadiumsMap';
import { useState, useMemo } from 'react';
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

  const filteredStadiums = useMemo(() => stadiums
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
    }), [stadiums, searchTerm, showVisited, isItemVisited, categorySlug]);

  const hasCoordinateData = useMemo(() => stadiums.some(s => s.latitude != null && s.longitude != null), [stadiums]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          {stadiums.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">Clear Visited Stadiums</Button>
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
        <TabsContent value="list">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
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
        </TabsContent>
        <TabsContent value="map">
          {stadiums.length > 0 ? (
            <div className="w-full aspect-[16/10] bg-muted/20 rounded-md overflow-hidden border relative">
              <NflStadiumsMap
                stadiums={stadiums}
                isItemVisited={isItemVisited}
                categorySlug={categorySlug}
                toggleItemVisited={toggleItemVisited}
              />
              {!hasCoordinateData && (
                <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground p-4 bg-background/80">
                  <p>Map view requires latitude and longitude data for stadiums.<br/>The map will populate once this data is available.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No stadium data to display on map.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
