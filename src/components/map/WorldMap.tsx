"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// A sub-component for each country is created to correctly use React.useMemo.
// Hooks cannot be called inside a loop, so this refactor is necessary to implement the fix.
const CountryGeography = ({
  geo,
  appCountry,
  isItemVisited,
  toggleItemVisited,
  categorySlug,
}: {
  geo: any;
  appCountry: Country | undefined;
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
  categorySlug: CategorySlug;
}) => {
  // Memoizing `visited` ensures it's only re-calculated when its dependencies change.
  const visited = React.useMemo(
    () => (appCountry ? isItemVisited(categorySlug, appCountry) : false),
    [appCountry, isItemVisited, categorySlug]
  );

  const countryName = appCountry ? appCountry.name : geo.properties.NAME_EN || "Unknown";

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Geography
          geography={geo}
          onClick={() => appCountry && toggleItemVisited(categorySlug, appCountry)}
          className="rsm-geography"
          style={{
            default: {
              fill: visited ? "hsl(var(--primary))" : "hsl(var(--muted))",
              stroke: "hsl(var(--background))",
              strokeWidth: 0.5,
              outline: "none",
              transition: "fill 0.2s ease-in-out",
            },
            hover: {
              fill: "#FFD700", // Gold for hover
              outline: "none",
              cursor: appCountry ? "pointer" : "default",
            },
            pressed: {
              fill: "#DAA520", // Darker gold for pressed
              outline: "none",
            },
          }}
          aria-label={countryName}
        />
      </TooltipTrigger>
      {appCountry && (
        <TooltipContent>
          <p>
            {countryName} - {visited ? "Visited" : "Not Visited"}
          </p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};


interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {

  const countryCodeToObjectMap = React.useMemo(() => {
    const map = new Map<string, Country>();
    if (!allCountries) return map;
    for (const country of allCountries) {
      if (country.code && typeof country.code === 'string') {
        map.set(country.code.trim().toUpperCase(), country);
      }
    }
    return map;
  }, [allCountries]);

  return (
    <TooltipProvider>
      <ComposableMap
        projection="geoMercator"
        className="w-full h-full rsm-svg"
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 120
        }}
      >
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" id={''} />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl} className="rsm-geographies">
          {({ geographies }) =>
            geographies.map(geo => {
              const mapCountryCode = geo.properties.ISO_A2;
              const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;
              
              return (
                <CountryGeography
                  key={geo.rsmKey}
                  geo={geo}
                  appCountry={appCountry}
                  isItemVisited={isItemVisited}
                  toggleItemVisited={toggleItemVisited}
                  categorySlug={categorySlug}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </TooltipProvider>
  );
}
