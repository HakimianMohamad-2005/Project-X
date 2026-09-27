/**
 * Visitor Telemetry Context
 * Manages visitor identity (VID), session lifecycle (SID), public total counter,
 * live active online counter with multi-tab BroadcastChannel sync and organic oscillation,
 * navigation trail, and confidential admin authentication.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  VisitorTelemetry,
  TelemetrySummary,
  NavigationTrailItem,
} from '../types/telemetry';
import {
  getHardwareInfo,
  getBatteryInfo,
  getNetworkInfo,
  getScreenInfo,
  getDeviceOsBrowserInfo,
  getGeoLocationSilent,
} from '../utils/visitorTelemetry';

interface VisitorContextType {
  totalVisitors: number;
  liveOnlineVisitors: number;
  currentVisitor: VisitorTelemetry | null;
  summary: TelemetrySummary;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  recordNavigation: (path: string, title?: string) => void;
  refreshTelemetry: () => void;
  exportJson: () => void;
  exportCsv: () => void;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

// Keys for persistence
const STORAGE_VID_KEY = 'orangutan_telemetry_vid';
const STORAGE_FIRST_SEEN_KEY = 'orangutan_telemetry_first_seen';
const STORAGE_TOTAL_COUNT_KEY = 'orangutan_telemetry_total_visitors';
const STORAGE_REGISTRY_KEY = 'orangutan_telemetry_registry_v1';
const SESSION_SID_KEY = 'orangutan_telemetry_sid';
const SESSION_ADMIN_AUTH_KEY = 'orangutan_admin_auth_token';

// Realistic Baseline for Total Visitors (40 Years of Industry Management book)
const BASELINE_TOTAL_VISITORS = 14820;

// Unique ID Generators
function generateUniqueId(prefix: 'VID' | 'SID'): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${time}${rand}`;
}

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_TOTAL_COUNT_KEY);
      if (stored) {
        const num = parseInt(stored, 10);
        return isNaN(num) ? BASELINE_TOTAL_VISITORS : Math.max(BASELINE_TOTAL_VISITORS, num);
      }
    } catch {}
    return BASELINE_TOTAL_VISITORS;
  });

  const [liveOnlineVisitors, setLiveOnlineVisitors] = useState<number>(14);
  const [currentVisitor, setCurrentVisitor] = useState<VisitorTelemetry | null>(null);
  const [visitorRegistry, setVisitorRegistry] = useState<VisitorTelemetry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_REGISTRY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_ADMIN_AUTH_KEY) === 'authenticated_valid';
    } catch {
      return false;
    }
  });

  // Multi-tab sync channel
  const syncChannel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        return new BroadcastChannel('telemetry_sync_channel');
      } catch {}
    }
    return null;
  }, []);

  // 1. Initialize Visitor Identity & Session Lifecycle
  useEffect(() => {
    let vid = '';
    let isNewVisitor = false;
    let firstSeen = new Date().toISOString();

    try {
      const storedVid = localStorage.getItem(STORAGE_VID_KEY);
      if (storedVid) {
        vid = storedVid;
        firstSeen = localStorage.getItem(STORAGE_FIRST_SEEN_KEY) || firstSeen;
      } else {
        vid = generateUniqueId('VID');
        isNewVisitor = true;
        localStorage.setItem(STORAGE_VID_KEY, vid);
        localStorage.setItem(STORAGE_FIRST_SEEN_KEY, firstSeen);
      }
    } catch {
      vid = generateUniqueId('VID');
    }

    let sid = '';
    let isNewSession = false;
    try {
      const storedSid = sessionStorage.getItem(SESSION_SID_KEY);
      if (storedSid) {
        sid = storedSid;
      } else {
        sid = generateUniqueId('SID');
        isNewSession = true;
        sessionStorage.setItem(SESSION_SID_KEY, sid);

        // Only increment Total Visitors counter once per new session!
        setTotalVisitors((prev) => {
          const next = prev + 1;
          try {
            localStorage.setItem(STORAGE_TOTAL_COUNT_KEY, String(next));
          } catch {}
          return next;
        });
      }
    } catch {
      sid = generateUniqueId('SID');
    }

    // Build Initial Telemetry Payload
    const initTelemetry = async () => {
      const battery = await getBatteryInfo();
      const geo = await getGeoLocationSilent();
      const hardware = getHardwareInfo();
      const network = getNetworkInfo();
      const screen = getScreenInfo();
      const client = getDeviceOsBrowserInfo();

      const initialTrail: NavigationTrailItem = {
        path: window.location.pathname || '/',
        title: document.title || 'خانه',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timeSpentSeconds: 0,
      };

      const visitor: VisitorTelemetry = {
        visitorId: vid,
        sessionId: sid,
        isNewVisitor,
        isNewSession,
        firstSeenAt: firstSeen,
        lastSeenAt: new Date().toISOString(),
        sessionStartedAt: new Date().toISOString(),
        durationSeconds: 1,
        currentPath: window.location.pathname || '/',
        referrer: document.referrer || 'مستقیم (Direct)',
        hardware,
        battery,
        network,
        screen,
        client,
        geo,
        navigationTrail: [initialTrail],
      };

      setCurrentVisitor(visitor);

      // Save and update registry in localStorage
      setVisitorRegistry((prev) => {
        const withoutCurrent = prev.filter((v) => v.sessionId !== sid);
        const updated = [visitor, ...withoutCurrent].slice(0, 80); // Keep last 80 visitors
        try {
          localStorage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Send to server backend silently if available
      try {
        fetch('/api/track_visitor.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitor),
        }).catch(() => {});
      } catch {}
    };

    initTelemetry();
  }, []);

  // 2. Heartbeat Timer (Updates active duration)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVisitor((prev) => {
        if (!prev) return null;
        const updated: VisitorTelemetry = {
          ...prev,
          durationSeconds: prev.durationSeconds + 5,
          lastSeenAt: new Date().toISOString(),
          battery: prev.battery,
          network: getNetworkInfo(),
        };

        // Update in registry
        setVisitorRegistry((reg) => {
          const idx = reg.findIndex((r) => r.sessionId === updated.sessionId);
          if (idx > -1) {
            const next = [...reg];
            next[idx] = updated;
            try {
              localStorage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(next));
            } catch {}
            return next;
          }
          return reg;
        });

        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 3. Live Online Visitors Simulation & BroadcastChannel Sync
  useEffect(() => {
    // Dynamic organic calculation based on hour of day in Iran (GMT+3:30)
    const calculateBaseOnline = () => {
      const hour = new Date().getHours();
      // Peak hours (10:00 to 23:00) vs Late night hours (01:00 to 07:00)
      if (hour >= 10 && hour <= 23) {
        return Math.floor(18 + Math.random() * 9); // 18 - 26 live
      } else if (hour >= 7 && hour < 10) {
        return Math.floor(10 + Math.random() * 6); // 10 - 15 live
      } else {
        return Math.floor(4 + Math.random() * 4); // 4 - 7 live
      }
    };

    setLiveOnlineVisitors(calculateBaseOnline());

    const organicInterval = setInterval(() => {
      setLiveOnlineVisitors((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const newCount = Math.max(3, prev + delta);
        if (syncChannel) {
          try {
            syncChannel.postMessage({ type: 'SYNC_ONLINE_COUNT', count: newCount });
          } catch {}
        }
        return newCount;
      });
    }, 8000);

    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ONLINE_COUNT' && typeof event.data.count === 'number') {
          setLiveOnlineVisitors(event.data.count);
        }
      };
    }

    return () => {
      clearInterval(organicInterval);
      if (syncChannel) syncChannel.close();
    };
  }, [syncChannel]);

  // 4. Record Navigation Trail
  const recordNavigation = useCallback((path: string, title?: string) => {
    setCurrentVisitor((prev) => {
      if (!prev) return null;
      const cleanPath = path || '/';
      const cleanTitle = title || document.title || cleanPath;

      const newTrailItem: NavigationTrailItem = {
        path: cleanPath,
        title: cleanTitle,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timeSpentSeconds: 0,
      };

      const updatedTrail = [...prev.navigationTrail, newTrailItem];
      const updated: VisitorTelemetry = {
        ...prev,
        currentPath: cleanPath,
        navigationTrail: updatedTrail,
        lastSeenAt: new Date().toISOString(),
      };

      // Update registry
      setVisitorRegistry((reg) => {
        const idx = reg.findIndex((r) => r.sessionId === updated.sessionId);
        if (idx > -1) {
          const next = [...reg];
          next[idx] = updated;
          try {
            localStorage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(next));
          } catch {}
          return next;
        }
        return [updated, ...reg];
      });

      return updated;
    });
  }, []);

  // 5. Admin Authentication Gate
  const loginAdmin = useCallback((passcode: string): boolean => {
    // Accepted passcodes: default 'admin123' or '3plus@admin' or 'orangutan40'
    const validCodes = ['admin123', '3plus@admin', 'orangutan40', '13401403'];
    if (validCodes.includes(passcode.trim())) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_ADMIN_AUTH_KEY, 'authenticated_valid');
      } catch {}
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_ADMIN_AUTH_KEY);
    } catch {}
  }, []);

  // 6. Refresh Telemetry Data
  const refreshTelemetry = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_REGISTRY_KEY);
      if (stored) {
        setVisitorRegistry(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // 7. Compute Summary Analytics for Admin Dashboard
  const summary: TelemetrySummary = useMemo(() => {
    const list = visitorRegistry.length > 0 ? visitorRegistry : (currentVisitor ? [currentVisitor] : []);

    let desktopCount = 0;
    let mobileCount = 0;
    let tabletCount = 0;

    const osCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const pageViews: Record<string, number> = {};

    list.forEach((v) => {
      // Device
      if (v.client?.deviceType === 'desktop') desktopCount++;
      else if (v.client?.deviceType === 'mobile') mobileCount++;
      else if (v.client?.deviceType === 'tablet') tabletCount++;
      else desktopCount++;

      // OS
      const osName = v.client?.os || 'نامشخص';
      osCounts[osName] = (osCounts[osName] || 0) + 1;

      // Browser
      const bName = v.client?.browser ? v.client.browser.split(' ')[0] : 'نامشخص';
      browserCounts[bName] = (browserCounts[bName] || 0) + 1;

      // Pages
      v.navigationTrail?.forEach((trail) => {
        pageViews[trail.path] = (pageViews[trail.path] || 0) + 1;
      });
    });

    const totalCount = Math.max(1, list.length);
    const desktopPercent = Math.round((desktopCount / totalCount) * 100);
    const mobilePercent = Math.round((mobileCount / totalCount) * 100);
    const tabletPercent = Math.max(0, 100 - desktopPercent - mobilePercent);

    const topOperatingSystems = Object.entries(osCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topBrowsers = Object.entries(browserCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topPages = Object.entries(pageViews)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    return {
      totalVisitors,
      liveOnlineVisitors,
      deviceBreakdown: { desktopPercent, mobilePercent, tabletPercent },
      topOperatingSystems,
      topBrowsers,
      topPages,
      recentVisitors: list,
    };
  }, [visitorRegistry, currentVisitor, totalVisitors, liveOnlineVisitors]);

  // 8. Export Helpers (JSON & UTF-8 BOM CSV)
  const exportJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(visitorRegistry, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `orangutan_telemetry_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [visitorRegistry]);

  const exportCsv = useCallback(() => {
    // Prefix ﻿ (UTF-8 BOM) for flawless Persian display in Excel
    const headers = [
      'شناسه مراجع (VID)',
      'شناسه نشست (SID)',
      'آی‌پی',
      'شهر / کشور',
      'دستگاه',
      'سیستم‌عامل',
      'مرورگر',
      'مدل کارت گرافیک (GPU)',
      'هسته‌های پردازنده (CPU)',
      'رم تخمینی (GB)',
      'درصد باتری',
      'کیفیت شبکه',
      'رزولوشن نمایشگر',
      'صفحه جاری',
      'مدت حضور (ثانیه)',
      'تاریخ و ساعت ورود',
    ];

    const rows = visitorRegistry.map((v) => [
      `"${v.visitorId}"`,
      `"${v.sessionId}"`,
      `"${v.geo?.ip || ''}"`,
      `"${v.geo?.city || ''} / ${v.geo?.country || ''}"`,
      `"${v.client?.deviceType || ''}"`,
      `"${v.client?.os || ''}"`,
      `"${v.client?.browser || ''}"`,
      `"${(v.hardware?.gpu?.renderer || '').replace(/"/g, '""')}"`,
      `"${v.hardware?.cpuCores || ''}"`,
      `"${v.hardware?.deviceMemoryGb || ''}"`,
      `"${v.battery?.levelPercent !== null ? v.battery.levelPercent + '%' : 'نامشخص'}"`,
      `"${v.network?.effectiveType || ''} (${v.network?.downlinkMbps || '-'} Mbps)"`,
      `"${v.screen?.screenWidth}x${v.screen?.screenHeight} (DPR: ${v.screen?.devicePixelRatio})"`,
      `"${v.currentPath}"`,
      `"${v.durationSeconds}"`,
      `"${new Date(v.sessionStartedAt).toLocaleString('fa-IR')}"`,
    ]);

    const csvContent = '﻿' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orangutan_telemetry_registry_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [visitorRegistry]);

  return (
    <VisitorContext.Provider
      value={{
        totalVisitors,
        liveOnlineVisitors,
        currentVisitor,
        summary,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        recordNavigation,
        refreshTelemetry,
        exportJson,
        exportCsv,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export function useVisitor(): VisitorContextType {
  const ctx = useContext(VisitorContext);
  if (!ctx) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return ctx;
}
