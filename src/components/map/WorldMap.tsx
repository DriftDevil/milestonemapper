"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// The URL to the map shape data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {
    // Create a lookup map for fast access. It maps the 2-letter country code (e.g., "US")
    // to the full Country object from your API. This is the key to making the map interactive.
    const countryCodeToObjectMap = React.useMemo(() => {
        const map = new Map<string, Country>();
        if (!allCountries) return map;
        for (const country of allCountries) {
            // Use uppercase for consistent matching with map data.
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
        {/* The complex ZoomableGroup was removed as it was interfering with click events.
            This simplified structure is more robust for interactivity. */}
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              // The map data provides the 2-letter code in `iso_a2`.
              const mapCountryCode = geo.properties.iso_a2?.toUpperCase();

              // Look up our application's country object using the code.
              const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode) : undefined;
              
              // If the map area doesn't correspond to a country we track (e.g., Antarctica),
              // we still render it, but make it non-interactive and visually distinct.
              if (!appCountry) {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted) / 0.5)"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  />
                );
              }

              // If it's a country we track, make it fully interactive.
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
                      // This onClick now reliably targets the correct country object.
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
                    <p>{countryName} - {visited ? "Visited" : "Click to mark as visited"}</p>
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
