
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from "react-simple-maps";
import type { Country, CategorySlug, TrackableItem } from '@/types';

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
      if (country?.code) {
        map.set(country.code.toUpperCase(), country);
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
      <ZoomableGroup center={[0, 20]} maxZoom={8}>
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const mapCountryCode = geo.properties.iso_a2;
              const appCountry = mapCountryCode ? countryCodeMap.get(mapCountryCode.toUpperCase()) : undefined;

              const visited = appCountry ? isItemVisited(categorySlug, appCountry) : false;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={visited ? "hsl(var(--primary))" : appCountry ? "hsl(var(--muted))" : "hsl(var(--muted) / 0.5)"}
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  onClick={() => {
                    if (appCountry) {
                      toggleItemVisited(categorySlug, appCountry);
                    }
                  }}
                  style={{
                    default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                    hover: {
                      outline: "none",
                      fill: appCountry ? (visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))") : "hsl(var(--muted) / 0.5)",
                      cursor: appCountry ? "pointer" : "default",
                    },
                    pressed: {
                      outline: "none",
                      fill: appCountry ? (visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)") : "hsl(var(--muted) / 0.5)"
                    },
                  }}
                  aria-label={appCountry?.name || geo.properties.name}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
