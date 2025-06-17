
"use client";

import type React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import type { USState, CategorySlug } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USStatesMapProps {
  allStates: USState[];
  isItemVisited: (category: CategorySlug, itemId: string) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, itemId: string) => void;
}

export function USStatesMap({ allStates, isItemVisited, categorySlug, toggleItemVisited }: USStatesMapProps) {
  // Create a map of FIPS id to state name for quick lookup for tooltips
  const stateIdToNameMap = React.useMemo(() => {
    return new Map(allStates.map(s => [s.id, s.name]));
  }, [allStates]);

  return (
    <TooltipProvider>
      <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
        <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" />
        <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateFipsId = geo.id; // This ID from us-atlas is the FIPS code
              const visited = isItemVisited(categorySlug, stateFipsId);
              const stateName = stateIdToNameMap.get(stateFipsId) || "Unknown State";

              return (
                <Tooltip key={geo.rsmKey} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Geography
                      geography={geo}
                      fill={visited ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                      stroke="hsl(var(--card-background))" // Use a contrasting stroke for better definition
                      strokeWidth={0.5}
                      onClick={() => toggleItemVisited(categorySlug, stateFipsId)}
                      style={{
                        default: { outline: "none", transition: "fill 0.2s ease-in-out" },
                        hover: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.8)" : "hsl(var(--accent))" , cursor: "pointer"},
                        pressed: { outline: "none", fill: visited ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.8)" },
                      }}
                      aria-label={stateName}
                    />
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
