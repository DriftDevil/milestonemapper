
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { USState, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USStatesMapProps {
  allStates: USState[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function USStatesMap({ allStates, isItemVisited, categorySlug, toggleItemVisited }: USStatesMapProps) {
  // Create a map of FIPS id to the full state object for quick lookup
  const stateIdToObjectMap = React.useMemo(() => {
    return new Map(allStates.map(s => [s.id, s]));
  }, [allStates]);

  return (
    <TooltipProvider>
      <ComposableMap projection="geoAlbersUsa" className="w-full h-full rsm-svg">
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" id={''} />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl} className="rsm-geographies">
          {({ geographies }) =>
            geographies.map(geo => {
              const stateFipsId = geo.id; // This ID from us-atlas is the FIPS code
              const stateObject = stateIdToObjectMap.get(stateFipsId);
              
              if (!stateObject) {
                return null; // Don't render geographies we don't have data for
              }

              const visited = isItemVisited(categorySlug, stateObject);
              const stateName = stateObject.name;

              return (
                <Tooltip key={geo.rsmKey}>
                  <TooltipTrigger asChild>
                    <g>
                      <Geography
                        geography={geo}
                        fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                        stroke="hsl(var(--background))" // Use a contrasting stroke for better definition
                        strokeWidth={0.5}
                        onClick={() => toggleItemVisited(categorySlug, stateObject)}
                        className="rsm-geography"
                        style={{
                          default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                          hover: { outline: "none", fill: "hsl(var(--accent))" , cursor: "pointer"},
                          pressed: { outline: "none", fill: "hsl(var(--accent))" },
                        }}
                        aria-label={stateName}
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stateName} - {visited ? "Visited" : "Not Visited"}</p>
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
