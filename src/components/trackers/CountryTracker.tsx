
"use client";

import type { Country, CategorySlug } from '@/types';
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

interface CountryTrackerProps {
  countries: Country[];
  categorySlug: CategorySlug;
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
  clearCategoryVisited: (category: CategorySlug) => void;
}

export function CountryTracker({ countries, categorySlug, isItemVisited, toggleItemVisited, clearCategoryVisited }: CountryTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisited, setShowVisited] = useState(false);

  const filteredCountries = countries
    .filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(country => {
      if (showVisited) {
        return true;
      }
      return !isItemVisited(categorySlug, country.id);
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
        {countries.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">Clear Visited Countries</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all your visited countries. This cannot be undone.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCountries.map((country) => (
          <ItemToggle
            key={country.id}
            item={country}
            isChecked={isItemVisited(categorySlug, country.id)}
            onToggle={() => toggleItemVisited(categorySlug, country.id)}
            details={<span className="font-mono text-xs">{country.code}</span>}
          />
        ))}
      </div>
      {countries.length > 0 && filteredCountries.length === 0 && !showVisited && searchTerm === '' && (
         <p className="text-muted-foreground text-center">All countries visited! Check "Show Visited" to see them.</p>
      )}
      {countries.length > 0 && filteredCountries.length === 0 && (searchTerm !== '' || showVisited) && (
         <p className="text-muted-foreground text-center">No countries found matching your criteria.</p>
      )}
      {countries.length === 0 && (
         <p className="text-muted-foreground text-center">No countries to display.</p>
      )}
    </div>
  );
}
