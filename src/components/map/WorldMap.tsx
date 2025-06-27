
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// -------------------
// WorldMap Component
// -------------------
interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {
  const countryCodeToObjectMap = React.useMemo(() => {
    const map = new Map<string, Country>();
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
          scale: 140
        }}
      >
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" id={''} />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl} className="rsm-geographies">
          {({ geographies }) =>
            geographies.map(geo => {
              const mapCountryCode = geo.properties["ISO3166-1-Alpha-2"];
              const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;

              if (!appCountry) {
                // Render non-interactive geography for parts of the map we don't track (e.g., Antarctica)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                  />
                );
              }

              const visited = isItemVisited(categorySlug, appCountry);
              const countryName = appCountry.name;

              return (
                <Tooltip key={geo.rsmKey}>
                  <TooltipTrigger asChild>
                    <g>
                      <Geography
                        geography={geo}
                        onClick={() => toggleItemVisited(categorySlug, appCountry)}
                        fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                        stroke="hsl(var(--background))"
                        strokeWidth={0.5}
                        className="rsm-geography"
                        style={{
                          default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                          hover: { outline: "none", fill: "hsl(var(--accent))" , cursor: "pointer"},
                          pressed: { outline: "none", fill: "hsl(var(--accent))" },
                        }}
                        aria-label={countryName}
                      />
                    </g>
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
