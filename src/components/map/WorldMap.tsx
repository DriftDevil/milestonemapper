
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
      <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
      <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
      <Geographies geography={geoUrl} className="rsm-geographies">
        {({ geographies }) =>
          geographies.map(geo => {
            const mapCountryCode = geo.properties.iso_a2;
            const appCountry = mapCountryCode ? countryCodeToObjectMap.get(mapCountryCode.trim().toUpperCase()) : undefined;

            const visited = appCountry ? isItemVisited(categorySlug, appCountry) : false;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => appCountry && toggleItemVisited(categorySlug, appCountry)}
                className="rsm-geography"
                style={{
                  default: {
                    fill: visited ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 0.5,
                    outline: "none",
                    transition: "fill 0.2s ease-in-out",
                  },
                  hover: {
                    fill: "#FFD700", // Gold for hover
                    outline: "none",
                    cursor: appCountry ? "pointer" : "default",
                  },
                  pressed: {
                    fill: "#DAA520", // Darker gold for pressed
                    outline: "none",
                  },
                }}
                aria-label={appCountry ? appCountry.name : undefined}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
