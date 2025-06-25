
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
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
        className="w-full h-full rsm-svg"
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 120
        }}
      >
        <Geographies geography={geoUrl} className="rsm-geographies">
          {({ geographies }) =>
            geographies.map(geo => {
              const mapCountryCode = geo.properties.iso_a2;
              const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;

              if (appCountry) {
                const visited = isItemVisited(categorySlug, appCountry);
                return (
                  <Tooltip key={geo.rsmKey} delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        onClick={() => toggleItemVisited(categorySlug, appCountry)}
                        className="rsm-geography"
                        style={{
                          default: {
                            fill: visited ? "hsl(var(--primary))" : "hsl(var(--muted))",
                            outline: "none",
                            transition: "fill 0.2s ease-in-out",
                          },
                          hover: {
                            fill: visited ? "hsl(var(--primary) / 0.8)" : "#FFD700",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: visited ? "hsl(var(--primary) / 0.7)" : "#DAA520",
                            outline: "none",
                          },
                        }}
                        aria-label={appCountry.name}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{appCountry.name} - {visited ? "Visited" : "Not Visited"}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              } else {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="rsm-geography"
                    style={{
                      default: {
                        fill: "hsl(var(--muted) / 0.5)",
                        outline: "none",
                      },
                      hover: {
                        fill: "hsl(var(--muted) / 0.5)",
                        outline: "none",
                        cursor: "default",
                      },
                      pressed: {
                        fill: "hsl(var(--muted) / 0.5)",
                        outline: "none",
                      },
                    }}
                  />
                );
              }
            })
          }
        </Geographies>
      </ComposableMap>
    </TooltipProvider>
  );
}
