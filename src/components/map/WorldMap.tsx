"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
        className="w-full h-full"
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 120
        }}
      >
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" id={''} />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const mapCountryCode = geo.properties.iso_a2;
              
              // Ensure we have a valid, non-placeholder code before proceeding
              if (!mapCountryCode || mapCountryCode === '-99') {
                 return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted) / 0.5)"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    style={{ default: { outline: "none" } }}
                  />
                );
              }
              
              const appCountry = countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase());

              if (!appCountry) {
                // This is a territory on the map that we don't track. Render it as non-interactive.
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted) / 0.5)"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    style={{ default: { outline: "none" } }}
                  />
                );
              }

              // This is a country we track, so make it interactive.
              const visited = isItemVisited(categorySlug, appCountry);
              const countryName = appCountry.name;

              return (
                <Tooltip key={geo.rsmKey} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Geography
                      geography={geo}
                      fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                      stroke="hsl(var(--background))"
                      strokeWidth={0.5}
                      onClick={() => toggleItemVisited(categorySlug, appCountry)}
                      style={{
                        default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                        hover: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))", cursor: "pointer" },
                        pressed: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)" },
                      }}
                      aria-label={countryName}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{countryName} - {visited ? "Visited" : "Not Visited"}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </TooltipProvider>
  );
}
