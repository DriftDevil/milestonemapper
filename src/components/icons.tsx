
import type React from 'react';
import { Plane, Star, Mountain, MapPin, Search, CheckCircle, Filter, Check, Globe, Landmark, Trophy, CalendarDays, Sun, Moon, Laptop } from 'lucide-react';

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
export const SunIcon = Sun;
export const MoonIcon = Moon;
export const LaptopIcon = Laptop;


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

// Custom USA Flag Icon - Updated to be more visually accurate
export const UsaFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Background/White Stripes */}
      <rect x="2" y="5.5" width="20" height="13" fill="#FFFFFF" />
  
      {/* Red Stripes */}
      <rect x="2" y="5.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="7.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="9.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="11.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="13.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="15.5" width="20" height="1" fill="#BF0A30" />
      <rect x="2" y="17.5" width="20" height="1" fill="#BF0A30" />
  
      {/* Canton */}
      <rect x="2" y="5.5" width="10" height="7" fill="#002868" />
      
      {/* Stars (15 simplified stars) */}
      <g fill="#FFFFFF">
        {/* Row 1 */}
        <circle cx="3.25" cy="6.5" r="0.35" />
        <circle cx="5.25" cy="6.5" r="0.35" />
        <circle cx="7.25" cy="6.5" r="0.35" />
        <circle cx="9.25" cy="6.5" r="0.35" />
        {/* Row 2 */}
        <circle cx="4.25" cy="8" r="0.35" />
        <circle cx="6.25" cy="8" r="0.35" />
        <circle cx="8.25" cy="8" r="0.35" />
        {/* Row 3 */}
        <circle cx="3.25" cy="9.5" r="0.35" />
        <circle cx="5.25" cy="9.5" r="0.35" />
        <circle cx="7.25" cy="9.5" r="0.35" />
        <circle cx="9.25" cy="9.5" r="0.35" />
        {/* Row 4 */}
        <circle cx="4.25" cy="11" r="0.35" />
        <circle cx="6.25" cy="11" r="0.35" />
        <circle cx="8.25" cy="11" r="0.35" />
      </g>
  
      {/* Outline */}
      <rect x="2" y="5.5" width="20" height="13" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
    </svg>
  );

    