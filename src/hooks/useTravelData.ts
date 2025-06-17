
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, VisitedItems } from '@/types';

const LOCAL_STORAGE_KEY = 'milestoneMapperData';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const loadedVisitedItems: VisitedItems = {
            countries: new Set(parsedData.countries || []),
            'us-states': new Set(parsedData['us-states'] || []),
            'national-parks': new Set(parsedData['national-parks'] || []),
            'national-parks-dates': new Map(parsedData['national-parks-dates'] || []),
            'mlb-ballparks': new Set(parsedData['mlb-ballparks'] || []),
            'nfl-stadiums': new Set(parsedData['nfl-stadiums'] || []),
          };
          setVisitedItems(loadedVisitedItems);
        }
      } catch (error) {
        console.error("Failed to load travel data from local storage:", error);
        setVisitedItems(initialVisitedItems);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        const dataToStore = {
          countries: Array.from(visitedItems.countries),
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

  const toggleItemVisited = useCallback((category: CategorySlug, itemId: string) => {
    setVisitedItems(prev => {
      const newCategorySet = new Set(prev[category]);
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
  }, []);

  const getVisitedCount = useCallback((category: CategorySlug) => {
    const items = visitedItems[category];
    if (items instanceof Set) {
      return items.size;
    }
    return 0;
  }, [visitedItems]);

  const isItemVisited = useCallback((category: CategorySlug, itemId: string) => {
    const items = visitedItems[category];
     if (items instanceof Set) {
      return items.has(itemId);
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

  const clearCategoryVisited = useCallback((category: CategorySlug) => {
    setVisitedItems(prev => {
      const newState = { ...prev, [category]: new Set<string>() };
      if (category === 'national-parks') {
        newState['national-parks-dates'] = new Map<string, string>();
      }
      return newState;
    });
  }, []);

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
