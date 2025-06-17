
import type React from 'react';
import { Plane, Star, Mountain, MapPin, Search, CheckCircle, Filter, Check, Globe, Landmark, Trophy, CalendarDays } from 'lucide-react';

// Re-exporting Lucide icons for consistency or if we need to wrap them
export const PlaneIcon = Plane;
export const StarIcon = Star; // For US States (fallback or other uses)
export const MountainIcon = Mountain; // For National Parks
export const MapPinIcon = MapPin;
export const SearchIcon = Search;
export const CheckCircleIcon = CheckCircle;
export const FilterIcon = Filter;
export const CheckIcon = Check;
export const GlobeIcon = Globe; // For Countries
export const LandmarkIcon = Landmark; // Generic, could be used
export const TrophyIcon = Trophy; // For achievements/stadiums
export const CalendarDaysIcon = CalendarDays; // For visit dates

// Custom Baseball Icon
const CustomBaseballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M4.929 4.929c2.929-2.929 7.677-2.929 10.606 0s2.929 7.677 0 10.606c-1.89 1.89-4.4 2.76-6.72 2.58" />
    <path d="M19.071 19.071c-2.929 2.929-7.677 2.929-10.606 0s-2.929-7.677 0-10.606c1.89-1.89 4.4-2.76 6.72-2.58" />
  </svg>
);
export const BaseballIcon = CustomBaseballIcon; // For MLB

// Custom Football Icon (simple representation)
export const FootballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 2L7 7" />
    <path d="M12 2L17 7" />
    <path d="M12 22L7 17" />
    <path d="M12 22L17 17" />
    <path d="M2 12H22" />
    <path d="M7 7C4.65 8.38 3.09 10.58 3.09 13c0 2.03.98 3.82 2.47 4.96" />
    <path d="M17 7c2.35 1.38 3.91 3.58 3.91 6 0 2.03-.98 3.82-2.47 4.96" />
  </svg>
);

// Default App Icon (if needed for branding)
export const MilestoneMapperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

// Custom USA Flag Icon - Updated for RWB
export const UsaFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    /* stroke="currentColor" // Default stroke, overridden by specific paths */
    strokeWidth="1.5" // Default strokeWidth for paths unless overridden
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Canton (Blue Box for Stars) */}
    <path fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="0.5" d="M2 3h10v7H2z" />

    {/* Stripes - using theme colors */}
    {/* Red Stripes */}
    <path d="M2 4.5h20" stroke="hsl(var(--destructive))" />
    <path d="M2 7.5h20" stroke="hsl(var(--destructive))" />
    <path d="M2 10.5h20" stroke="hsl(var(--destructive))" />
    <path d="M2 13.5h20" stroke="hsl(var(--destructive))" />
    <path d="M2 16.5h20" stroke="hsl(var(--destructive))" />
    <path d="M2 19.5h20" stroke="hsl(var(--destructive))" />

    {/* White Stripes (using card color from theme) */}
    <path d="M2 6h20" stroke="hsl(var(--card))" />
    <path d="M12 9h10" stroke="hsl(var(--card))" /> {/* Short stripe part */}
    {/* Full length part of the stripe at y=9, under canton if not covered by blue. If canton is opaque, this is fine. */}
    {/* If the blue canton is drawn last, it covers. If white stripe drawn last, it covers blue. Order matters. Canton drawn first. */}
     <path d="M2 9h10" stroke="hsl(var(--card))" /> {/* Stripe portion that would be under canton, ensure it's there for layering logic */}


    <path d="M2 12h20" stroke="hsl(var(--card))" />
    <path d="M2 15h20" stroke="hsl(var(--card))" />
    <path d="M2 18h20" stroke="hsl(var(--card))" />
    
    {/* Outline of the flag - using theme border color */}
    <rect x="2" y="3" width="20" height="18" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />

    {/* Stars (White) - simplified */}
    <circle cx="4" cy="4.5" r="0.5" fill="white" stroke="none" />
    <circle cx="6" cy="4.5" r="0.5" fill="white" stroke="none" />
    <circle cx="8" cy="4.5" r="0.5" fill="white" stroke="none" />
    <circle cx="10" cy="4.5" r="0.5" fill="white" stroke="none" />

    <circle cx="3" cy="6.5" r="0.5" fill="white" stroke="none" />
    <circle cx="5" cy="6.5" r="0.5" fill="white" stroke="none" />
    <circle cx="7" cy="6.5" r="0.5" fill="white" stroke="none" />
    <circle cx="9" cy="6.5" r="0.5" fill="white" stroke="none" />

    <circle cx="4" cy="8.5" r="0.5" fill="white" stroke="none" />
    <circle cx="6" cy="8.5" r="0.5" fill="white" stroke="none" />
    <circle cx="8" cy="8.5" r="0.5" fill="white" stroke="none" />
    <circle cx="10" cy="8.5" r="0.5" fill="white" stroke="none" />
  </svg>
);


