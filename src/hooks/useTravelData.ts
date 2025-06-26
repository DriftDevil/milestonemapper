
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, VisitedItems, UserCountry, TrackableItem, Country, UserNationalPark, NationalPark } from '@/types';

const LOCAL_STORAGE_KEY = 'milestoneMapperData';

// Helper function to handle automatic sign-out
const handleUnauthorized = async () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login')) {
    return;
  }
  
  console.log('Session expired or unauthorized. Signing out.');
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error("Automatic logout call failed:", error);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

const initialVisitedItems: VisitedItems = {
  countries: new Set<string>(),
  'countries-dates': new Map<string, string>(),
  'countries-notes': new Map<string, string>(),
  'us-states': new Set<string>(),
  'national-parks': new Set<string>(),
  'mlb-ballparks': new Set<string>(),
  'nfl-stadiums': new Set<string>(),
};

export function useTravelData() {
  const [visitedItems, setVisitedItems] = useState<VisitedItems>(initialVisitedItems);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchVisitedCountries = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/countries', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
        } else {
          console.error(`Failed to fetch visited countries. Status: ${response.status}`);
        }
        return;
      }
      const userCountries: UserCountry[] = await response.json();
      
      const countriesSet = new Set(userCountries.map(uc => uc.country.code));
      const countryDatesMap = new Map<string, string>();
      const countryNotesMap = new Map<string, string>();

      userCountries.forEach(uc => {
        if (uc.visitedAt) {
          countryDatesMap.set(uc.country.id, uc.visitedAt.split('T')[0]);
        }
        if (uc.notes) {
          countryNotesMap.set(uc.country.id, uc.notes);
        }
      });
      
      setVisitedItems(prev => ({
        ...prev,
        countries: countriesSet,
        'countries-dates': countryDatesMap,
        'countries-notes': countryNotesMap,
      }));
    } catch (error) {
      console.error("Network error fetching visited countries:", error);
    }
  }, []);

  const fetchVisitedParks = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/parks', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
        } else {
          console.error(`Failed to fetch visited parks. Status: ${response.status}`);
        }
        return;
      }
      const userParks: UserNationalPark[] = await response.json();

      const parksSet = new Set(userParks.map(up => up.park_code));
      
      setVisitedItems(prev => ({
        ...prev,
        'national-parks': parksSet,
      }));
    } catch (error) {
      console.error("Network error fetching visited parks:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (typeof window !== 'undefined') {
        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (isMounted) {
               setVisitedItems(prev => ({
                ...prev,
                'us-states': new Set(parsedData['us-states'] || []),
                'mlb-ballparks': new Set(parsedData['mlb-ballparks'] || []),
                'nfl-stadiums': new Set(parsedData['nfl-stadiums'] || []),
              }));
            }
          }
        } catch (error) {
          console.error("Failed to load travel data from local storage:", error);
        }
      }
      
      await fetchVisitedCountries();
      await fetchVisitedParks();

      if (isMounted) {
        setIsLoaded(true);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [fetchVisitedCountries, fetchVisitedParks]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        const dataToStore = {
          'us-states': Array.from(visitedItems['us-states']),
          'mlb-ballparks': Array.from(visitedItems['mlb-ballparks']),
          'nfl-stadiums': Array.from(visitedItems['nfl-stadiums']),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save travel data to local storage:", error);
      }
    }
  }, [visitedItems, isLoaded]);

  const isItemVisited = useCallback((category: CategorySlug, item: TrackableItem) => {
    const items = visitedItems[category as 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums' | 'countries'];
    if (items instanceof Set) {
      if (category === 'countries') {
        const country = item as Country;
        return items.has(country.code);
      }
      return items.has(item.id);
    }
    return false;
  }, [visitedItems]);

  const toggleItemVisited = useCallback(async (category: CategorySlug, item: TrackableItem) => {
    const isCurrentlyVisited = isItemVisited(category, item);

    if (category === 'countries') {
      try {
        const countryId = item.id;
        let response;
        if (isCurrentlyVisited) {
          response = await fetch(`/api/user/me/countries/${countryId}`, { method: 'DELETE' });
        } else {
          response = await fetch(`/api/user/me/countries/${countryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
        }
        if (response.status === 401) {
          await handleUnauthorized();
          return;
        }
        await fetchVisitedCountries();
      } catch (error) {
        console.error(`Failed to toggle visited status for country ${item.name}:`, error);
      }
    } else if (category === 'national-parks') {
        const parkCode = item.id;

        // Optimistic UI update
        setVisitedItems(prev => {
            const newParksSet = new Set(prev['national-parks']);
            if (isCurrentlyVisited) {
                newParksSet.delete(parkCode);
            } else {
                newParksSet.add(parkCode);
            }
            return { ...prev, 'national-parks': newParksSet };
        });

        // API call
        try {
            const response = await fetch(`/api/user/me/parks/${parkCode}`, {
                method: isCurrentlyVisited ? 'DELETE' : 'POST'
            });

            if (!response.ok) {
                console.error(`API call failed for ${parkCode}. Reverting UI.`);
                // Revert state on failure
                setVisitedItems(prev => {
                    const revertedParksSet = new Set(prev['national-parks']);
                    if (isCurrentlyVisited) {
                        revertedParksSet.add(parkCode);
                    } else {
                        revertedParksSet.delete(parkCode);
                    }
                    return { ...prev, 'national-parks': revertedParksSet };
                });

                if (response.status === 401) {
                    await handleUnauthorized();
                }
            }
            // On success, the optimistic update was correct.
            // We can optionally re-fetch from the server to ensure consistency.
            await fetchVisitedParks();

        } catch (error) {
            console.error(`Network error for ${parkCode}. Reverting UI.`, error);
            // Revert state on network error
            setVisitedItems(prev => {
                const revertedParksSet = new Set(prev['national-parks']);
                if (isCurrentlyVisited) {
                    revertedParksSet.add(parkCode);
                } else {
                    revertedParksSet.delete(parkCode);
                }
                return { ...prev, 'national-parks': revertedParksSet };
            });
        }
    } else {
        const itemId = item.id;
        setVisitedItems(prev => {
          const newCategorySet = new Set(prev[category as 'us-states' | 'mlb-ballparks' | 'nfl-stadiums']);

          if (newCategorySet.has(itemId)) {
            newCategorySet.delete(itemId);
          } else {
            newCategorySet.add(itemId);
          }
          return { ...prev, [category]: newCategorySet };
        });
    }
  }, [isItemVisited, fetchVisitedCountries, fetchVisitedParks]);

  const getVisitedCount = useCallback((category: CategorySlug) => {
    const items = visitedItems[category];
    if (items instanceof Set) {
      return items.size;
    }
    return 0;
  }, [visitedItems]);

  const updateCountryVisit = useCallback(async (countryId: string, data: { visitedAt?: string | null, notes?: string | null }) => {
    try {
      const response = await fetch(`/api/user/me/countries/${countryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }
      await fetchVisitedCountries();
    } catch (error) {
      console.error("Failed to update country visit data:", error);
    }
  }, [fetchVisitedCountries]);

  const getCountryVisitDate = useCallback((countryId: string): string | undefined => {
    return visitedItems['countries-dates']?.get(countryId);
  }, [visitedItems]);
  
  const getCountryNotes = useCallback((countryId: string): string | undefined => {
    return visitedItems['countries-notes']?.get(countryId);
  }, [visitedItems]);

  const clearCategoryVisited = useCallback(async (category: CategorySlug) => {
     if (category === 'countries') {
        try {
            const response = await fetch(`/api/user/me/countries`, { method: 'DELETE' });
            if (response.status === 401) {
              await handleUnauthorized();
              return;
            }
            await fetchVisitedCountries();
        } catch (error) {
            console.error('Failed to clear visited countries:', error);
        }
     } else if (category === 'national-parks') {
        try {
            const response = await fetch(`/api/user/me/parks`, { method: 'DELETE' });
            if (response.status === 401) {
              await handleUnauthorized();
              return;
            }
            await fetchVisitedParks();
        } catch (error) {
            console.error('Failed to clear visited parks:', error);
        }
     } else {
        setVisitedItems(prev => {
            const newState = { ...prev, [category]: new Set<string>() };
            return newState;
        });
     }
  }, [fetchVisitedCountries, fetchVisitedParks]);

  const setNationalParkVisitDate = (parkCode: string, date: string) => {
    // This function is deprecated as visit dates for parks are not supported.
    // It remains here to prevent breaking changes if other components still reference it,
    // but it no longer performs any action.
  };

  const getNationalParkVisitDate = (parkCode: string): string | undefined => {
    // This function is deprecated and will always return undefined.
    return undefined;
  };

  return {
    visitedItems,
    isLoaded,
    toggleItemVisited,
    getVisitedCount,
    isItemVisited,
    updateCountryVisit,
    getCountryVisitDate,
    getCountryNotes,
    clearCategoryVisited,
    setNationalParkVisitDate,
    getNationalParkVisitDate,
  };
}
