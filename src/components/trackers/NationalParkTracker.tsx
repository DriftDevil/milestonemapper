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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParksMap } from '@/components/map/ParksMap';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NationalParkTrackerProps {
  parks: NationalPark[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function NationalParkTracker({
  parks,
  categorySlug,
  isItemVisited,
  toggleItemVisited,
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
    toggleItemVisited(categorySlug, park);
  };

  return (
    <div className="space-y-4">
       <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
           {parks.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">Clear Visited Parks</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will clear all your visited National Parks. This cannot be undone.
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
                placeholder="Search by park name or state..."
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
          <ScrollArea className="h-[450px] w-full rounded-md border">
            <div className="p-4">
              {filteredParks.length > 0 ? (
                <div className="space-y-2">
                  {filteredParks.map((park) => (
                    <ItemToggle
                      key={park.id}
                      item={park}
                      categorySlug={categorySlug}
                      isChecked={isItemVisited(categorySlug, park)}
                      onToggle={() => handleToggle(park)}
                      details={<span className="text-xs">{park.state}</span>}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-center text-muted-foreground h-full min-h-[200px]">
                  {parks.length > 0 ? (
                    <p>
                      {!showVisited && searchTerm === ''
                        ? 'All national parks visited! Check "Show Visited" to see them.'
                        : 'No national parks found matching your criteria.'}
                    </p>
                  ) : (
                    <p>No national parks to display.</p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="map">
          {parks.length > 0 ? (
            <div>
              <div className="aspect-[16/10] w-full border rounded-md overflow-hidden bg-muted/20">
                <ParksMap
                  parks={parks}
                  isItemVisited={isItemVisited}
                  categorySlug={categorySlug}
                  toggleItemVisited={toggleItemVisited}
                />
              </div>
              <div className="flex justify-center items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted border" />
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFD700' }} />
                  <span>Hover</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No parks data to display on map.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
