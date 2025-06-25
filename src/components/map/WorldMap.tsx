"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Use the new, more reliable GeoJSON file provided by the user
const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = React.useState<string | null>(null);

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
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              // Match using the ISO_A2 property from the new GeoJSON file, as requested
              const mapCountryCode = geo.properties.ISO_A2;
              const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;

              if (!appCountry) {
                // Render non-interactive landmasses for shapes without a matching code
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  />
                );
              }

              const visited = isItemVisited(categorySlug, appCountry);
              const isHovered = hoveredCountry === appCountry.code;

              let fill;
              if (isHovered) {
                fill = "#FFD700"; // Gold for hover
              } else if (visited) {
                fill = "hsl(var(--primary))";
              } else {
                fill = "hsl(var(--muted))";
              }

              return (
                <Tooltip key={geo.rsmKey} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Geography
                      geography={geo}
                      onClick={() => toggleItemVisited(categorySlug, appCountry)}
                      onMouseEnter={() => setHoveredCountry(appCountry.code)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      fill={fill}
                      stroke="hsl(var(--background))"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none", transition: "fill 0.2s ease-in-out", cursor: "pointer" },
                        pressed: { outline: "none", fill: "#DAA520" },
                        hover: { outline: "none" } // We handle hover via onMouseEnter, so this can be empty
                      }}
                      aria-label={appCountry.name}
                    />
                  </TooltipTrigger>
                   <TooltipContent>
                    <p>{appCountry.name} - {visited ? "Visited" : "Not Visited"}</p>
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
