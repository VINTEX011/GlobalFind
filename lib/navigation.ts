import {
  BellDot,
  BriefcaseBusiness,
  Building2,
  Compass,
  LayoutDashboard,
  MapPinned,
  Radar,
  Search,
  ShieldAlert,
} from "lucide-react";

export const dashboardNav = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cases",
    href: "/dashboard/cases",
    icon: BriefcaseBusiness,
  },
  {
    title: "Tips",
    href: "/dashboard/tips",
    icon: ShieldAlert,
  },
  {
    title: "Monitoring",
    href: "/dashboard/monitoring",
    icon: Radar,
  },
  {
    title: "Sightings Map",
    href: "/dashboard/map",
    icon: MapPinned,
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: Building2,
  },
] as const;

export const quickLinks = [
  {
    title: "Search cases",
    href: "/cases",
    icon: Search,
  },
  {
    title: "Public tip line",
    href: "/submit-tip",
    icon: Compass,
  },
  {
    title: "Notifications",
    href: "/dashboard",
    icon: BellDot,
  },
] as const;
