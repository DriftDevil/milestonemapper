"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { NationalPark, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface ParksMapProps {
  parks: NationalPark[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function ParksMap({ parks, isItemVisited, categorySlug, toggleItemVisited }: ParksMapProps) {
  const parksWithCoords = parks.filter(p => 
    p.latitude != null && !isNaN(p.latitude) && 
    p.longitude != null && !isNaN(p.longitude)
  );

  return (
    <TooltipProvider>
      <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(var(--muted))"
                stroke="hsl(var(--background))"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {parksWithCoords.map(park => {
          const visited = isItemVisited(categorySlug, park);
          return (
            <Marker key={park.id} coordinates={[park.longitude!, park.latitude!]}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <circle
                    r={5}
                    fill={visited ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                    stroke={"hsl(var(--background))"}
                    strokeWidth={1}
                    onClick={() => toggleItemVisited(categorySlug, park)}
                    style={{ cursor: 'pointer' }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{park.name} ({park.state})</p>
                  <p className="text-xs text-muted-foreground">{visited ? "Visited" : "Click to mark as visited"}</p>
                </TooltipContent>
              </Tooltip>
            </Marker>
          );
        })}
      </ComposableMap>
    </TooltipProvider>
  );
}
