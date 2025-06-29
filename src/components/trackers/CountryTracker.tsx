
"use client";

import type { Country, CategorySlug, TrackableItem } from '@/types';
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
import { WorldMap } from '@/components/map/WorldMap';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTravelData } from '@/hooks/useTravelData';

interface CountryTrackerProps {
  countries: Country[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem, initialData?: any) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
  visitedCount: number;
}

export function CountryTracker({
  countries,
  categorySlug,
  isItemVisited,
  toggleItemVisited,
  clearCategoryVisited,
  visitedCount,
}: CountryTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);
  
  const { updateCountryVisit, getCountryVisitDate, getCountryNotes } = useTravelData();

  const filteredCountries = countries
    .filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(country => {
      if (showVisited) {
        return true;
      }
      return !isItemVisited(categorySlug, country);
    });

  const handleDateChange = (country: Country, date: string) => {
    if (date && !isItemVisited(categorySlug, country)) {
      // This will create the relationship and set the date in one go
      toggleItemVisited(categorySlug, country, { visitedAt: date });
    } else {
      // This will update the existing relationship
      updateCountryVisit(country.id, { visitedAt: date || null });
    }
  };

  const handleNotesChange = (country: Country, notes: string) => {
    if (notes && !isItemVisited(categorySlug, country)) {
      // This will create the relationship and set the notes in one go
      toggleItemVisited(categorySlug, country, { notes: notes });
    } else {
      // This will update the existing relationship
      updateCountryVisit(country.id, { notes: notes || null });
    }
  };

  const handleToggle = (country: Country) => {
    toggleItemVisited(categorySlug, country);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          {countries.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">Clear Visited Countries</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will clear all your visited countries and their visit dates. This cannot be undone.
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
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-visited-countries"
                  checked={showVisited}
                  onCheckedChange={(checked) => setShowVisited(checked as boolean)}
                />
                <Label htmlFor="show-visited-countries" className="text-sm whitespace-nowrap">
                  Show Visited
                </Label>
              </div>
          </div>
          <ScrollArea className="h-[450px] w-full rounded-md border">
            <div className="p-4">
              {filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCountries.map((country) => (
                    <ItemToggle
                      key={country.id}
                      item={country}
                      imageUrl={country.flagUrl}
                      categorySlug={categorySlug}
                      isChecked={isItemVisited(categorySlug, country)}
                      onToggle={() => handleToggle(country)}
                      details={<span className="font-mono text-xs">{country.code}</span>}
                      visitDate={getCountryVisitDate(country.id)}
                      onVisitDateChange={(item, date) => handleDateChange(item as Country, date)}
                      notes={getCountryNotes(country.id)}
                      onNotesChange={(itemId, notes) => handleNotesChange(country, notes)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-center text-muted-foreground h-full min-h-[200px]">
                  {countries.length > 0 ? (
                    <p>
                      {!showVisited && searchTerm === ''
                        ? 'All countries visited! Check "Show Visited" to see them.'
                        : 'No countries found matching your criteria.'}
                    </p>
                  ) : (
                    <p>No countries to display.</p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="map">
          {countries.length > 0 ? (
            <div className="w-full aspect-[16/10] bg-muted/20 rounded-md overflow-hidden border">
              <WorldMap
                allCountries={countries}
                isItemVisited={isItemVisited}
                categorySlug={categorySlug}
                toggleItemVisited={toggleItemVisited}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No countries data to display on map.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
