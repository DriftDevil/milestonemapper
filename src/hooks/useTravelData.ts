
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, VisitedItems, UserCountry, TrackableItem, Country } from '@/types';

const LOCAL_STORAGE_KEY = 'milestoneMapperData';

// Initialize with an empty set for countries, which will be populated from the API.
const initialVisitedItems: VisitedItems = {
  countries: new Set<string>(),
  'us-states': new Set<string>(),
  'national-parks': new Set<string>(),
  'national-parks-dates': new Map<string, string>(),
  'mlb-ballparks': new Set<string>(),
  'nfl-stadiums': new Set<string>(),
};

export function useTravelData() {
  const [visitedItems, setVisitedItems] = useState<VisitedItems>(initialVisitedItems);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to fetch visited countries from our backend
  const fetchVisitedCountries = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/countries', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, no need to log an error.
          return;
        }
        throw new Error('Failed to fetch visited countries');
      }
      const userCountries: UserCountry[] = await response.json();
      
      // The key is the country's UUID.
      const countriesSet = new Set(userCountries.map(uc => uc.countryId));
      
      setVisitedItems(prev => ({
        ...prev,
        countries: countriesSet,
      }));
    } catch (error) {
      console.error("Failed to fetch visited countries:", error);
      // Handle error appropriately, maybe set an error state
    }
  }, []);

  // Effect for initial data loading
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Load non-country data from local storage
      if (typeof window !== 'undefined') {
        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (isMounted) {
               setVisitedItems(prev => ({
                ...prev,
                'us-states': new Set(parsedData['us-states'] || []),
                'national-parks': new Set(parsedData['national-parks'] || []),
                'national-parks-dates': new Map(parsedData['national-parks-dates'] || []),
                'mlb-ballparks': new Set(parsedData['mlb-ballparks'] || []),
                'nfl-stadiums': new Set(parsedData['nfl-stadiums'] || []),
              }));
            }
          }
        } catch (error) {
          console.error("Failed to load travel data from local storage:", error);
        }
      }
      
      // 2. Fetch country data from the API
      await fetchVisitedCountries();

      if (isMounted) {
        setIsLoaded(true);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [fetchVisitedCountries]);

  // Effect for persisting non-country data to local storage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        const dataToStore = {
          // Exclude country data, as it's managed by the backend
          'us-states': Array.from(visitedItems['us-states']),
          'national-parks': Array.from(visitedItems['national-parks']),
          'national-parks-dates': Array.from(visitedItems['national-parks-dates'].entries()),
          'mlb-ballparks': Array.from(visitedItems['mlb-ballparks']),
          'nfl-stadiums': Array.from(visitedItems['nfl-stadiums']),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save travel data to local storage:", error);
      }
    }
  }, [visitedItems, isLoaded]);

  const toggleItemVisited = useCallback(async (category: CategorySlug, item: TrackableItem) => {
    if (category === 'countries') {
      const isVisited = visitedItems.countries.has(item.id);
      try {
        if (isVisited) {
          // UN-VISIT: Use the country's UUID for the DELETE request.
          await fetch(`/api/user/me/countries/${item.id}`, { method: 'DELETE' });
        } else {
          // VISIT: Use the country's own UUID for the POST request.
          await fetch(`/api/user/me/countries/${item.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}), // Sending empty body for now.
          });
        }
        // Refresh state from the backend after any change.
        await fetchVisitedCountries();
      } catch (error) {
        console.error(`Failed to toggle visited status for country ${item.name}:`, error);
      }
    } else {
        // This is the existing, synchronous logic for non-country categories.
        const itemId = item.id;
        setVisitedItems(prev => {
        const newCategorySet = new Set(prev[category as 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums']);
        let newDatesMap = prev['national-parks-dates'];

        if (newCategorySet.has(itemId)) {
          newCategorySet.delete(itemId);
          if (category === 'national-parks') {
            newDatesMap = new Map(prev['national-parks-dates']);
            newDatesMap.delete(itemId);
          }
        } else {
          newCategorySet.add(itemId);
        }
        return { ...prev, [category]: newCategorySet, 'national-parks-dates': newDatesMap };
      });
    }
  }, [visitedItems, fetchVisitedCountries]);

  const getVisitedCount = useCallback((category: CategorySlug) => {
    const items = visitedItems[category];
    if (items instanceof Set || items instanceof Map) {
      return items.size;
    }
    return 0;
  }, [visitedItems]);

  const isItemVisited = useCallback((category: CategorySlug, item: TrackableItem) => {
    const items = visitedItems[category as 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums' | 'countries'];
    if (items instanceof Set || items instanceof Map) {
      return items.has(item.id);
    }
    return false;
  }, [visitedItems]);

  const setNationalParkVisitDate = useCallback((parkId: string, date: string | null) => {
    setVisitedItems(prev => {
      const newDatesMap = new Map(prev['national-parks-dates']);
      const newVisitedParksSet = new Set(prev['national-parks']);

      if (date && date.trim() !== "") {
        newDatesMap.set(parkId, date);
        if (!newVisitedParksSet.has(parkId)) {
           newVisitedParksSet.add(parkId);
        }
      } else {
        newDatesMap.delete(parkId);
      }
      return { ...prev, 'national-parks-dates': newDatesMap, 'national-parks': newVisitedParksSet };
    });
  }, []);

  const getNationalParkVisitDate = useCallback((parkId: string): string | undefined => {
    return visitedItems['national-parks-dates']?.get(parkId);
  }, [visitedItems]);

  const clearCategoryVisited = useCallback(async (category: CategorySlug) => {
     if (category === 'countries') {
        try {
            const deletePromises = Array.from(visitedItems.countries).map(countryId =>
                fetch(`/api/user/me/countries/${countryId}`, { method: 'DELETE' })
            );
            await Promise.all(deletePromises);
            await fetchVisitedCountries();
        } catch (error) {
            console.error('Failed to clear visited countries:', error);
        }
     } else {
        setVisitedItems(prev => {
            const newState = { ...prev, [category]: new Set<string>() };
            if (category === 'national-parks') {
                newState['national-parks-dates'] = new Map<string, string>();
            }
            return newState;
        });
     }
  }, [visitedItems.countries, fetchVisitedCountries]);

  return {
    visitedItems,
    isLoaded,
    toggleItemVisited,
    getVisitedCount,
    isItemVisited,
    setNationalParkVisitDate,
    getNationalParkVisitDate,
    clearCategoryVisited,
  };
}
