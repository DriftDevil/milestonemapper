

"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CategorySlug, VisitedItems, UserCountry, TrackableItem, Country, UserNationalPark, NationalPark, USState, UserUSState, MLBStadium, UserMLBStadium, NFLStadium, UserNFLStadium } from '@/types';

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

  const fetchVisitedStates = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/states', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
        } else {
          console.error(`Failed to fetch visited states. Status: ${response.status}`);
        }
        return;
      }
      const userStates: UserUSState[] = await response.json();
      
      const statesSet = new Set(userStates.map(us => us.state.fips_code));
      
      setVisitedItems(prev => ({
        ...prev,
        'us-states': statesSet,
      }));
    } catch (error) {
      console.error("Network error fetching visited states:", error);
    }
  }, []);

  const fetchVisitedBallparks = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/ballparks', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
        } else {
          console.error(`Failed to fetch visited ballparks. Status: ${response.status}`);
        }
        return;
      }
      const userBallparks: UserMLBStadium[] = await response.json();

      const ballparkSet = new Set(userBallparks.map(ub => String(ub.ballpark.id)));
      
      setVisitedItems(prev => ({
        ...prev,
        'mlb-ballparks': ballparkSet,
      }));
    } catch (error) {
      console.error("Network error fetching visited ballparks:", error);
    }
  }, []);
  
  const fetchVisitedNflStadiums = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me/stadiums', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
        } else {
          console.error(`Failed to fetch visited NFL stadiums. Status: ${response.status}`);
        }
        return;
      }
      const userStadiums: UserNFLStadium[] = await response.json();

      const stadiumSet = new Set(userStadiums.map(us => String(us.stadium.id)));
      
      setVisitedItems(prev => ({
        ...prev,
        'nfl-stadiums': stadiumSet,
      }));
    } catch (error) {
      console.error("Network error fetching visited NFL stadiums:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      await Promise.all([
        fetchVisitedCountries(),
        fetchVisitedParks(),
        fetchVisitedStates(),
        fetchVisitedBallparks(),
        fetchVisitedNflStadiums()
      ]);

      if (isMounted) {
        setIsLoaded(true);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [fetchVisitedCountries, fetchVisitedParks, fetchVisitedStates, fetchVisitedBallparks, fetchVisitedNflStadiums]);

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
        setVisitedItems(prev => {
            const newParksSet = new Set(prev['national-parks']);
            isCurrentlyVisited ? newParksSet.delete(parkCode) : newParksSet.add(parkCode);
            return { ...prev, 'national-parks': newParksSet };
        });
        try {
            const response = await fetch(`/api/user/me/parks/${parkCode}`, {
                method: isCurrentlyVisited ? 'DELETE' : 'POST'
            });
            if (!response.ok) {
                await fetchVisitedParks(); // Revert on failure
                if (response.status === 401) await handleUnauthorized();
            }
        } catch (error) {
            console.error(`Network error for ${parkCode}. Reverting UI.`, error);
            await fetchVisitedParks(); // Revert on error
        }
    } else if (category === 'us-states') {
        const state = item as USState;
        const stateId = state.dbId; // Correctly use the database ID for the API call
        const fipsCode = state.id; // Use the FIPS code for the local Set

        setVisitedItems(prev => {
          const newStatesSet = new Set(prev['us-states']);
          isCurrentlyVisited ? newStatesSet.delete(fipsCode) : newStatesSet.add(fipsCode);
          return { ...prev, 'us-states': newStatesSet };
        });

        try {
            const response = await fetch(`/api/user/me/states/${stateId}`, {
                method: isCurrentlyVisited ? 'DELETE' : 'POST'
            });
            if (!response.ok) {
                await fetchVisitedStates(); // Revert on failure
                if (response.status === 401) await handleUnauthorized();
            }
        } catch (error) {
            console.error(`Network error for state ${state.name}. Reverting.`, error);
            await fetchVisitedStates(); // Revert on error
        }
    } else if (category === 'mlb-ballparks') {
      const ballparkId = item.id;
      setVisitedItems(prev => {
        const newSet = new Set(prev['mlb-ballparks']);
        isCurrentlyVisited ? newSet.delete(ballparkId) : newSet.add(ballparkId);
        return {...prev, 'mlb-ballparks': newSet };
      });
      try {
        const response = await fetch(`/api/user/me/ballparks/${ballparkId}`, {
          method: isCurrentlyVisited ? 'DELETE' : 'POST'
        });
        if (!response.ok) {
          await fetchVisitedBallparks();
          if (response.status === 401) await handleUnauthorized();
        }
      } catch (error) {
        console.error(`Network error for ballpark ${item.name}. Reverting.`, error);
        await fetchVisitedBallparks();
      }
    } else if (category === 'nfl-stadiums') {
      const stadiumId = item.id;
      setVisitedItems(prev => {
        const newSet = new Set(prev['nfl-stadiums']);
        isCurrentlyVisited ? newSet.delete(stadiumId) : newSet.add(stadiumId);
        return {...prev, 'nfl-stadiums': newSet };
      });
      try {
        const response = await fetch(`/api/user/me/stadiums/${stadiumId}`, {
          method: isCurrentlyVisited ? 'DELETE' : 'POST'
        });
        if (!response.ok) {
          await fetchVisitedNflStadiums();
          if (response.status === 401) await handleUnauthorized();
        }
      } catch (error) {
        console.error(`Network error for stadium ${item.name}. Reverting.`, error);
        await fetchVisitedNflStadiums();
      }
    }
  }, [isItemVisited, fetchVisitedCountries, fetchVisitedParks, fetchVisitedStates, fetchVisitedBallparks, fetchVisitedNflStadiums]);

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
     } else if (category === 'us-states') {
        try {
            const response = await fetch(`/api/user/me/states`, { method: 'DELETE' });
            if (response.status === 401) {
              await handleUnauthorized();
              return;
            }
            await fetchVisitedStates();
        } catch (error) {
            console.error('Failed to clear visited states:', error);
        }
     } else if (category === 'mlb-ballparks') {
        try {
            const response = await fetch(`/api/user/me/ballparks`, { method: 'DELETE' });
            if (response.status === 401) {
              await handleUnauthorized();
              return;
            }
            await fetchVisitedBallparks();
        } catch (error) {
            console.error('Failed to clear visited ballparks:', error);
        }
     } else if (category === 'nfl-stadiums') {
        try {
            const response = await fetch(`/api/user/me/stadiums`, { method: 'DELETE' });
            if (response.status === 401) {
              await handleUnauthorized();
              return;
            }
            await fetchVisitedNflStadiums();
        } catch (error) {
            console.error('Failed to clear visited NFL stadiums:', error);
        }
     }
  }, [fetchVisitedCountries, fetchVisitedParks, fetchVisitedStates, fetchVisitedBallparks, fetchVisitedNflStadiums]);

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
