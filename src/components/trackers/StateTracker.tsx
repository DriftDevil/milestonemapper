
"use client";

import type { USState, CategorySlug } from '@/types';
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
import { USStatesMap } from '@/components/map/USStatesMap';
import { useState } from 'react';

interface StateTrackerProps {
  states: USState[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function StateTracker({ states, categorySlug, isItemVisited, toggleItemVisited, clearCategoryVisited }: StateTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);

  const filteredStates = states
    .filter(state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(state => {
      if (showVisited) {
        return true; 
      }
      return !isItemVisited(categorySlug, state.id); 
    });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          {states.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">Clear Visited States</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will clear all your visited U.S. States. This cannot be undone.
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
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-visited-states"
                  checked={showVisited}
                  onCheckedChange={(checked) => setShowVisited(checked as boolean)}
                />
                <Label htmlFor="show-visited-states" className="text-sm whitespace-nowrap">
                  Show Visited
                </Label>
              </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStates.map((state) => (
              <ItemToggle
                key={state.id}
                item={state}
                isChecked={isItemVisited(categorySlug, state.id)}
                onToggle={() => toggleItemVisited(categorySlug, state.id)}
              />
            ))}
          </div>
          {states.length > 0 && filteredStates.length === 0 && !showVisited && searchTerm === '' && (
             <p className="text-muted-foreground text-center">All states visited! Check "Show Visited" to see them.</p>
          )}
          {states.length > 0 && filteredStates.length === 0 && (searchTerm !== '' || showVisited) && (
             <p className="text-muted-foreground text-center">No states found matching your criteria.</p>
          )}
          {states.length === 0 && (
             <p className="text-muted-foreground text-center">No states to display.</p>
          )}
        </TabsContent>
        <TabsContent value="map">
          {states.length > 0 ? (
            <div className="aspect-[16/10] w-full">
              <USStatesMap 
                allStates={states} 
                isItemVisited={isItemVisited} 
                categorySlug={categorySlug} 
                toggleItemVisited={toggleItemVisited}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No states data to display on map.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
