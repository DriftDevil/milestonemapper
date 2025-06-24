
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
  // Create a lookup map for efficient access. Key is the uppercase country code (cca2).
  const countryCodeMap = React.useMemo(() => {
    const map = new Map<string, Country>();
    for (const country of allCountries) {
      if (country.code) {
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
                
                // Find the country using the pre-built map.
                const appCountry = mapCountryCode ? countryCodeMap.get(mapCountryCode.toUpperCase()) : undefined;

                const visited = appCountry ? isItemVisited(categorySlug, appCountry) : false;
                const displayName = appCountry ? appCountry.name : geo.properties.name;

                return (
                  <Tooltip key={geo.rsmKey} delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        fill={appCountry ? (visited ? "hsl(var(--primary))" : "hsl(var(--muted))") : "hsl(var(--muted) / 0.5)"}
                        stroke="hsl(var(--background))"
                        strokeWidth={0.5}
                        onClick={() => appCountry && toggleItemVisited(categorySlug, appCountry)}
                        style={{
                          default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                          hover: {
                            outline: "none",
                            fill: appCountry ? (visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))") : "hsl(var(--muted) / 0.6)",
                            cursor: appCountry ? "pointer" : "default"
                          },
                          pressed: {
                            outline: "none",
                            fill: appCountry ? (visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)") : "hsl(var(--muted) / 0.6)"
                          },
                        }}
                        aria-label={displayName || "Unknown territory"}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{displayName || "Unknown territory"} - {appCountry ? (visited ? "Visited" : "Not Visited") : "Data not tracked"}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </TooltipProvider>
  );
}
