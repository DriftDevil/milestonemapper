
"use client";

import type { Country, CategorySlug } from '@/types';
import { useTravelData } from '@/hooks/useTravelData';
import { ItemToggle } from './ItemToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CountryTrackerProps {
  countries: Country[];
}

export function CountryTracker({ countries }: CountryTrackerProps) {
  const { toggleItemVisited, isItemVisited } = useTravelData();
  const categorySlug: CategorySlug = 'countries';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search countries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
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
      {filteredCountries.length === 0 && <p className="text-muted-foreground text-center">No countries found.</p>}
    </div>
  );
}
