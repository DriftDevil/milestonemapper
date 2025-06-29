
"use client";

import * as React from 'react';
import { ComposableMap, Geographies, Geography, Marker, Sphere, Graticule } from "react-simple-maps";
import type { NFLStadium, CategorySlug, TrackableItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface NflStadiumsMapProps {
  stadiums: NFLStadium[];
  isItemVisited: (category: CategorySlug, item: TrackableItem) => boolean;
  categorySlug: CategorySlug;
  toggleItemVisited: (category: CategorySlug, item: TrackableItem) => void;
}

export function NflStadiumsMap({ stadiums, isItemVisited, categorySlug, toggleItemVisited }: NflStadiumsMapProps) {
  const stadiumsWithCoords = stadiums.filter(p => {
    return (
      typeof p.latitude === 'number' &&
      typeof p.longitude === 'number' &&
      !isNaN(p.latitude) &&
      !isNaN(p.longitude)
    );
  });

  return (
    <div className="relative w-full h-full">
      <TooltipProvider>
        <ComposableMap
          projection="geoAlbersUsa"
          className="w-full h-full rsm-svg"
        >
          <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} fill="transparent" id={''} />
          <Graticule stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.5} />
          <Geographies geography={geoUrl} className="rsm-geographies">
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
          {stadiumsWithCoords.map(stadium => {
            const visited = isItemVisited(categorySlug, stadium);
            
            return (
              <Marker key={stadium.id} coordinates={[stadium.longitude!, stadium.latitude!]} className="rsm-marker">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g>
                      <circle
                        r={5}
                        fill={visited ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                        stroke={"hsl(var(--background))"}
                        strokeWidth={1}
                        onClick={() => toggleItemVisited(categorySlug, stadium)}
                        style={{ cursor: 'pointer', transition: 'fill 0.2s ease-in-out' }}
                        className="hover:fill-accent"
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stadium.name} ({stadium.city}, {stadium.state})</p>
                    <p className="text-muted-foreground text-xs">{stadium.team}</p>
                  </TooltipContent>
                </Tooltip>
              </Marker>
            );
          })}
        </ComposableMap>
      </TooltipProvider>
       <div className="absolute bottom-2 right-2 bg-card/80 backdrop-blur-sm p-2 rounded-md border text-xs text-card-foreground shadow-lg">
        <div className="font-bold mb-1">Legend</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted border" />
            <span>Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>Hover</span>
          </div>
        </div>
      </div>
    </div>
  );
}
