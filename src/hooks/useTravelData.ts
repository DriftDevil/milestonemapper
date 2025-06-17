
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, VisitedItems } from '@/types';

const LOCAL_STORAGE_KEY = 'milestoneMapperData';

const initialVisitedItems: VisitedItems = {
  countries: new Set<string>(),
  'us-states': new Set<string>(),
  'national-parks': new Set<string>(),
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
            'mlb-ballparks': new Set(parsedData['mlb-ballparks'] || []),
            'nfl-stadiums': new Set(parsedData['nfl-stadiums'] || []),
          };
          setVisitedItems(loadedVisitedItems);
        }
      } catch (error) {
        console.error("Failed to load travel data from local storage:", error);
        // Fallback to initial state if parsing fails
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
      const newSet = new Set(prev[category]);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return { ...prev, [category]: newSet };
    });
  }, []);

  const getVisitedCount = useCallback((category: CategorySlug) => {
    return visitedItems[category]?.size || 0;
  }, [visitedItems]);

  const isItemVisited = useCallback((category: CategorySlug, itemId: string) => {
    return visitedItems[category]?.has(itemId) || false;
  }, [visitedItems]);

  return {
    visitedItems,
    isLoaded,
    toggleItemVisited,
    getVisitedCount,
    isItemVisited,
  };
}
