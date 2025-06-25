"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  allCountries: Country[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function WorldMap({ allCountries, isItemVisited, categorySlug, toggleItemVisited }: WorldMapProps) {
  // A map from the two-letter country code (ISO a2) to our full Country object.
  // This is used for quick lookups to connect map shapes to our application data.
  const countryCodeToObjectMap = React.useMemo(() => {
    const map = new Map<string, Country>();
    if (!allCountries) return map;
    for (const country of allCountries) {
      // Use the 'code' (cca2) property, ensuring it's a string and trimming whitespace.
      if (country.code && typeof country.code === 'string') {
        map.set(country.code.trim().toUpperCase(), country);
      }
    }
    return map;
  }, [allCountries]);

  return (
    <ComposableMap
      projection="geoMercator"
      className="w-full h-full rsm-svg"
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 120
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const mapCountryCode = geo.properties.iso_a2;

            // Find the corresponding country object from our application data.
            const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;

            if (appCountry) {
              // This is a country we track. Make it interactive.
              const visited = isItemVisited(categorySlug, appCountry);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  onClick={() => toggleItemVisited(categorySlug, appCountry)}
                  style={{
                    default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                    hover: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  aria-label={appCountry.name}
                />
              );
            } else {
              // This is a territory not in our data (e.g., Antarctica). Render it non-interactively.
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
                />
              );
            }
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
