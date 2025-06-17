
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps";
import type { Country, CategorySlug } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {
  const countryCodeToNameMap = React.useMemo(() => {
    return new Map(allCountries.map(c => [c.code, c.name]));
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
                const countryIsoA2 = geo.properties.ISO_A2; // ISO 3166-1 alpha-2 code from map data
                const countryNameFromMap = geo.properties.NAME;
                
                // Find our app's country data using the ISO_A2 code
                const appCountry = allCountries.find(c => c.code === countryIsoA2);
                const itemId = appCountry ? appCountry.id : countryIsoA2; // Use appCountry.id if found, otherwise fallback

                const visited = isItemVisited(categorySlug, itemId);
                const displayName = appCountry ? appCountry.name : countryNameFromMap;

                return (
                  <Tooltip key={geo.rsmKey} delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                        stroke="hsl(var(--card-background))"
                        strokeWidth={0.5}
                        onClick={() => {
                          // Only allow toggling if we have a matching country ID from our app's data
                          if (appCountry) {
                            toggleItemVisited(categorySlug, itemId);
                          }
                        }}
                        style={{
                          default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                          hover: { outline: "none", fill: appCountry ? (visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))") : "hsl(var(--muted))", cursor: appCountry ? "pointer" : "default" },
                          pressed: { outline: "none", fill: appCountry ? (visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)") : "hsl(var(--muted))" },
                        }}
                        aria-label={displayName}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{displayName} - {appCountry ? (visited ? "Visited" : "Not Visited") : "Data not tracked"}</p>
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
