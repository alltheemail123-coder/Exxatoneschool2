import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  MapPin,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { mapLocations } from "../../data/dashboard-data";

// Import Leaflet CSS
const LEAFLET_CSS =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Use centralized location data
const locations = mapLocations;

// Get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// Get user name from localStorage or default
const getUserName = (): string => {
  return localStorage.getItem("userName") || "Dr. Smith";
};

// Calculate totals from locations
const calculateTotals = () => {
  const totalPlacements = locations.reduce(
    (sum, loc) => sum + loc.count,
    0,
  );
  const totalSites = locations.length;
  const activePlacements = Math.floor(totalPlacements * 0.72); // 72% active
  const pendingRequests = Math.floor(totalPlacements * 0.15); // 15% pending

  return {
    totalPlacements,
    totalSites,
    activePlacements,
    pendingRequests,
  };
};

export const HomeMapSection: React.FC = () => {
  const [selectedLocation, setSelectedLocation] =
    React.useState<(typeof locations)[0] | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const totals = calculateTotals();

  // Search state
  const [searchWhere, setSearchWhere] = React.useState("");
  const [searchSite, setSearchSite] = React.useState("");
  const [searchWhen, setSearchWhen] = React.useState("");
  const [searchSpecialization, setSearchSpecialization] =
    React.useState("");

  // Marketing alerts - cycling through them
  const marketingAlerts = [
    {
      icon: Building2,
      color: "chart-1",
      message: "University of Michigan just requested 15 PT placements",
      subtext: "Internal Medicine • Spring 2024",
    },
    {
      icon: Calendar,
      color: "chart-2",
      message: "Mayo Clinic just posted 8 new internship slots",
      subtext: "Cardiology rotation • Available now",
    },
    {
      icon: TrendingUp,
      color: "chart-3",
      message: "127 new internships posted in the last 20 days",
      subtext: "35% increase from last month",
    },
    {
      icon: Users,
      color: "chart-4",
      message: "Stanford Medical posted urgent need for 12 nursing students",
      subtext: "Emergency Medicine • Starts March 15",
    },
    {
      icon: CheckCircle2,
      color: "chart-2",
      message: "Cleveland Clinic confirmed 6 PT placement requests",
      subtext: "Orthopedics • Summer semester",
    },
  ];

  const [currentAlertIndex, setCurrentAlertIndex] = React.useState(0);

  // Cycle through alerts every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % marketingAlerts.length);
    }, 8000); // Increased to 8 seconds

    return () => clearInterval(interval);
  }, [marketingAlerts.length]);

  const currentAlert = marketingAlerts[currentAlertIndex];

  const handleSearch = () => {
    console.log("Search:", {
      searchWhere,
      searchSite,
      searchWhen,
      searchSpecialization,
    });
    // Add search logic here
  };

  // Load Leaflet
  React.useEffect(() => {
    // Add Leaflet CSS
    if (
      !document.querySelector(`link[href="${LEAFLET_CSS}"]`)
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    // Add Leaflet JS
    if (!window.L) {
      const script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize map
  React.useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current)
      return;

    const L = window.L;

    // Create map centered on US
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false, // Hide attribution to save space
    }).setView([39.8283, -98.5795], 4);

    // Add OpenStreetMap tiles
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      },
    ).addTo(map);

    mapInstanceRef.current = map;

    // Force map to invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    // Add markers
    locations.forEach((location) => {
      const size = Math.min(location.count / 5 + 20, 50);
      const isPulse = location.count > 30;
      const totalSize = location.isNew ? size + 24 : size + (isPulse ? 20 : 0);

      // Create custom icon with HTML
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="marker-wrapper" style="position: relative; width: ${size}px; height: ${size}px;">
            ${
              isPulse
                ? `
              <div class="marker-pulse" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${size + 20}px;
                height: ${size + 20}px;
                background: oklch(0.65 0.24 255.5);
                border-radius: 50%;
                opacity: 0.3;
                animation: pulse 2s infinite;
              "></div>
            `
                : ""
            }
            <div class="marker-pin" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: ${size}px;
              height: ${size}px;
              background: oklch(0.27 0.03 264.4);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
            ">
              <span style="
                color: white;
                font-weight: 600;
                font-size: ${Math.max(10, size / 3)}px;
              ">${location.count}</span>
            </div>
            ${
              location.isNew
                ? `
              <div class="new-badge" style="
                position: absolute;
                top: -10px;
                right: -16px;
                background: var(--brand-color);
                color: white;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.5px;
                padding: 2px 6px;
                border-radius: 6px;
                line-height: 1.2;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(227, 28, 121, 0.4);
                z-index: 10;
                animation: newBadgeBounce 2s ease-in-out 1;
                animation-fill-mode: forwards;
                border: 1.5px solid white;
              ">NEW</div>
            `
                : ""
            }
          </div>
        `,
        iconSize: [totalSize, totalSize],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([location.lat, location.lng], {
        icon,
      })
        .addTo(map)
        .on("click", () => {
          setSelectedLocation(location);
        });

      markersRef.current.push(marker);
    });

    // Add CSS for pulse animation
    if (!document.querySelector("#marker-pulse-animation")) {
      const style = document.createElement("style");
      style.id = "marker-pulse-animation";
      style.textContent = `
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
        }
        .marker-pin:hover {
          transform: translate(-50%, -50%) scale(1.15) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
        }
        .custom-marker {
          overflow: visible !important;
          background: transparent !important;
          border: none !important;
        }
        @keyframes newBadgeBounce {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-10px);
          }
          40% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(-5px);
          }
          80% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="px-4 lg:px-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-display">
            {getGreeting()}, {getUserName()}
          </h1>
        </div>
      </div>

      {/* Map Section with Count Cards Overlay */}
      <div className="px-4 lg:px-6">
        <Card className="overflow-hidden gap-0 relative z-0">
          <CardContent className="!p-0 !pb-0 h-[240px]">
            <div className="relative h-full">
              {/* Leaflet Map Container */}
              <div
                ref={mapRef}
                className="absolute inset-0 w-full h-full z-0"
                style={{ borderRadius: "0" }}
              />

              {/* Loading State */}
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Loading map...
                    </p>
                  </div>
                </div>
              )}

              {/* Airbnb-style Search Bar */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] max-w-6xl">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 bg-card backdrop-blur-sm rounded-xl shadow-xl border border-border overflow-visible">
                  {/* Where */}
                  <div className="flex flex-col px-4 md:px-6 py-3 hover:bg-sidebar/50 transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-border flex-1">
                    <label className="text-xs font-semibold mb-1">Where</label>
                    <input
                      type="text"
                      placeholder="Search locations"
                      value={searchWhere}
                      onChange={(e) => setSearchWhere(e.target.value)}
                      className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground w-full"
                    />
                  </div>

                  {/* Site */}
                  <div className="flex flex-col px-4 md:px-6 py-3 hover:bg-sidebar/50 transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-border flex-1">
                    <label className="text-xs font-semibold mb-1">Site</label>
                    <input
                      type="text"
                      placeholder="Add site"
                      value={searchSite}
                      onChange={(e) => setSearchSite(e.target.value)}
                      className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground w-full"
                    />
                  </div>

                  {/* When */}
                  <div className="flex flex-col px-4 md:px-6 py-3 hover:bg-sidebar/50 transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-border flex-1">
                    <label className="text-xs font-semibold mb-1">When</label>
                    <input
                      type="text"
                      placeholder="Add dates"
                      value={searchWhen}
                      onChange={(e) => setSearchWhen(e.target.value)}
                      className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground w-full"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="flex flex-col px-4 md:px-6 py-3 hover:bg-sidebar/50 transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-border flex-1">
                    <label className="text-xs font-semibold mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="Add specialty"
                      value={searchSpecialization}
                      onChange={(e) => setSearchSpecialization(e.target.value)}
                      className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground w-full"
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 px-4 md:px-6 h-auto self-stretch m-2 rounded-lg font-semibold whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>

              {/* Count Cards Overlay - Hidden */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[5] hidden">
                <div className="flex items-center justify-center gap-6 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-border">
                  {/* Total Schools */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-chart-1" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold font-display">
                        1000+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Schools
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-12 w-px bg-border" />

                  {/* Students */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center">
                      <Users className="w-5 h-5 text-chart-2" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold font-display">
                        5000+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Students
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-12 w-px bg-border" />

                  {/* Recently Scheduled */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-chart-3" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold font-display">
                        450+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Recently Scheduled
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-border z-[1000] hidden">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-chart-1" />
                    <span className="text-xs font-medium">
                      Healthcare Facilities
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground font-semibold">
                        25
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Active placements
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 rounded-full bg-chart-1 opacity-20 animate-pulse" />
                      <div className="absolute inset-1 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center">
                        <span className="text-[8px] text-primary-foreground font-semibold">
                          52
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      High demand (30+)
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Alerts - Single Alert with Rotation - Centered at Bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                <div 
                  key={currentAlertIndex}
                  className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border border-border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 w-fit max-w-[90vw]"
                >
                  <div className={`flex items-center justify-center flex-shrink-0`}>
                    <currentAlert.icon className={`h-5 w-5 text-${currentAlert.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentAlert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{currentAlert.subtext}</p>
                  </div>
                </div>
              </div>

              {/* Selected Location Info */}
              {selectedLocation && (
                <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-border max-w-xs z-[1000]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">
                          {selectedLocation.name}
                        </h3>
                        {selectedLocation.isNew && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-white bg-brand">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedLocation.city}
                      </p>
                      {selectedLocation.isNew && (
                        <p className="text-xs text-chart-2 font-medium mt-1.5">
                          New placements just posted
                        </p>
                      )}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-chart-2" />
                          <span className="text-xs">
                            <span className="font-semibold">
                              {selectedLocation.count}
                            </span>{" "}
                            active placements
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-chart-3" />
                          <span className="text-xs capitalize">
                            {selectedLocation.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeMapSection;