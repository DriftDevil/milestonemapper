
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps";
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
  const countryCodeMap = React.useMemo(() => {
    const map = new Map<string, Country>();
    for (const country of allCountries) {
      if (country.code && typeof country.code === 'string' && country.code.trim() !== '') {
        map.set(country.code.toUpperCase(), country);
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
        <ZoomableGroup center={[0, 20]} maxZoom={8}>
          <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
          <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const mapCountryCode = geo.properties.iso_a2;
                const appCountry = mapCountryCode ? countryCodeMap.get(mapCountryCode.toUpperCase()) : undefined;

                if (appCountry) {
                  // This is a country we are tracking. Make it interactive.
                  const visited = isItemVisited(categorySlug, appCountry);
                  const displayName = appCountry.name;

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
                            hover: {
                              outline: "none",
                              fill: visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))",
                              cursor: "pointer"
                            },
                            pressed: {
                              outline: "none",
                              fill: visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)"
                            },
                          }}
                          aria-label={displayName}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{displayName} - {visited ? "Visited" : "Not Visited"}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                } else {
                  // This is a territory we are not tracking (e.g., Antarctica). Make it non-interactive.
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(var(--muted) / 0.5)"
                      stroke="hsl(var(--background))"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", cursor: "default" },
                        pressed: { outline: "none" },
                      }}
                      aria-label={geo.properties.name || "Unknown territory"}
                    />
                  );
                }
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </TooltipProvider>
  );
}
