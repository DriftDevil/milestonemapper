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
                const mapCountryNumericId = geo.id; // This should be the ISO 3166-1 numeric code from world-atlas
                
                // Find the corresponding country in our application data using the numeric code
                const appCountry = allCountries.find(c => c.numericCode === mapCountryNumericId);
                
                const visited = appCountry ? isItemVisited(categorySlug, appCountry.id) : false;
                const displayName = appCountry ? appCountry.name : geo.properties.name;

                return (
                  <Tooltip key={geo.rsmKey} delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        fill={appCountry ? (visited ? "hsl(var(--primary))" : "hsl(var(--muted))") : "hsl(var(--muted) / 0.5)"}
                        stroke="hsl(var(--background))"
                        strokeWidth={0.5}
                        onClick={() => {
                          if (appCountry) {
                            toggleItemVisited(categorySlug, appCountry.id); // Use the app's ID (cca2) for toggling
                          }
                        }}
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
