"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';

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
      if (country.code) {
        map.set(country.code.trim().toUpperCase(), country);
      }
    }
    return map;
  }, [allCountries]);

  return (
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
            const mapCountryCode = geo.properties.iso_a2?.trim().toUpperCase();
            const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode) : undefined;
            
            if (!appCountry) {
              // This is a territory we don't track, so it's not interactive.
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

            // This is a country we track, so make it interactive.
            const visited = isItemVisited(categorySlug, appCountry);
            const countryName = appCountry.name;

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
                  pressed: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)" },
                }}
                aria-label={countryName}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
