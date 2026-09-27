/**
 * Data Models & TypeScript Definitions for Visitor Telemetry System
 * Confidentiality Layer: Public (Total count only) vs. Admin Confidential (Full Telemetry)
 */

export interface GpuInfo {
  vendor: string;
  renderer: string;
}

export interface HardwareInfo {
  cpuCores: number;
  deviceMemoryGb: number | null; // navigator.deviceMemory (RAM in GB)
  gpu: GpuInfo;
}

export interface BatteryInfo {
  levelPercent: number | null;
  charging: boolean | null;
  supported: boolean;
}

export interface NetworkInfo {
  effectiveType: string; // 4g, 3g, 2g, slow-2g, wifi, unknown
  downlinkMbps: number | null; // Mbps
  rttMs: number | null; // round trip time in ms
  saveData: boolean;
  online: boolean;
}

export interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  devicePixelRatio: number; // DPR
  colorDepth: number; // 24, 30, etc.
  highDynamicRange: boolean; // HDR support
  wideGamutP3: boolean; // Display P3 support
}

export interface DeviceOsBrowserInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os: string; // Windows 11, Windows 10, macOS, iOS, Android, Linux, ChromeOS, etc.
  browser: string; // Chrome, Safari, Edge, Firefox, Samsung Internet, Opera, etc.
  userAgentRaw: string;
  language: string;
  timeZone: string;
}

export interface GeoLocationInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  latitude?: number;
  longitude?: number;
}

export interface NavigationTrailItem {
  path: string;
  title: string;
  timestamp: string; // ISO String or Localized
  timeSpentSeconds?: number;
}

export interface VisitorTelemetry {
  visitorId: string; // VID-XXXXXX (stored in localStorage)
  sessionId: string; // SID-XXXXXX (stored in sessionStorage)
  isNewVisitor: boolean; // First time ever on this device
  isNewSession: boolean; // New session in this browser lifecycle
  firstSeenAt: string; // ISO String
  lastSeenAt: string; // ISO String
  sessionStartedAt: string; // ISO String
  durationSeconds: number; // Total active session time
  currentPath: string;
  referrer: string;

  hardware: HardwareInfo;
  battery: BatteryInfo;
  network: NetworkInfo;
  screen: ScreenInfo;
  client: DeviceOsBrowserInfo;
  geo: GeoLocationInfo;
  navigationTrail: NavigationTrailItem[];
}

export interface TelemetrySummary {
  totalVisitors: number;
  liveOnlineVisitors: number;
  deviceBreakdown: {
    desktopPercent: number;
    mobilePercent: number;
    tabletPercent: number;
  };
  topOperatingSystems: { name: string; count: number; percent: number }[];
  topBrowsers: { name: string; count: number; percent: number }[];
  topPages: { path: string; views: number }[];
  recentVisitors: VisitorTelemetry[];
}
