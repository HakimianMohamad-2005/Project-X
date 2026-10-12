/**
 * Visitor tracking + admin authentication.
 *
 * Every page load reports a visit to /api/track_visitor.php. A visit (session) is shared
 * by all tabs of a browser and ends after 30 minutes without activity, the same rule
 * analytics tools use. While a tab is visible it sends a heartbeat every 30 seconds,
 * which is what makes the admin's "online now" count real. Hiding or closing the tab
 * sends a "leave" beacon so the visitor drops out immediately.
 *
 * Publicly, only the all-time total is exposed (footer counter).
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BatteryInfo, VisitorTelemetry } from '../types/telemetry';
import {
  getBatteryInfo,
  getDeviceOsBrowserInfo,
  getGeoLocationSilent,
  getHardwareInfo,
  getNetworkInfo,
  getScreenInfo,
} from '../utils/visitorTelemetry';

interface VisitorContextType {
  /** All-time visits from the server; null until the first response arrives. */
  totalVisitors: number | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  /** Report that the visitor opened another section (`section` is the tab id). */
  recordNavigation: (path: string, section?: string) => void;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

const TRACK_URL = '/api/track_visitor.php';
const STORAGE_VID_KEY = 'orangutan_telemetry_vid';
const STORAGE_FIRST_SEEN_KEY = 'orangutan_telemetry_first_seen';
const STORAGE_VISIT_KEY = 'og3-visit';
const STORAGE_TOTAL_KEY = 'og3-total-visits';
const SESSION_ADMIN_AUTH_KEY = 'orangutan_admin_auth_token';
// The validated passcode is kept for this tab so admin-only APIs can be called with it.
export const SESSION_ADMIN_PASSCODE_KEY = 'orangutan_admin_passcode';

const VISIT_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 30 * 1000;

function generateUniqueId(prefix: 'VID' | 'SID'): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${time}${rand}`;
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode: tracking still works for this page view.
  }
}

/** Stable per-browser visitor id. */
function getVisitorId(): string {
  const stored = readStorage(STORAGE_VID_KEY);
  if (stored && /^VID-[A-Z0-9]{4,24}$/.test(stored)) return stored;
  const id = generateUniqueId('VID');
  writeStorage(STORAGE_VID_KEY, id);
  writeStorage(STORAGE_FIRST_SEEN_KEY, new Date().toISOString());
  return id;
}

/** Current visit id, shared across tabs; a new one after 30 minutes of inactivity. */
function getVisitId(): string {
  try {
    const raw = readStorage(STORAGE_VISIT_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { id: string; last: number };
      if (v && /^SID-[A-Z0-9]{4,24}$/.test(v.id) && Date.now() - v.last < VISIT_TIMEOUT_MS) return v.id;
    }
  } catch {
    // Corrupt value: start a fresh visit.
  }
  const id = generateUniqueId('SID');
  touchVisit(id);
  return id;
}

function touchVisit(id: string) {
  writeStorage(STORAGE_VISIT_KEY, JSON.stringify({ id, last: Date.now() }));
}

/** Section (tab id) for a URL, mirroring the routes in App. */
function sectionFromPath(pathname: string): string {
  if (pathname.includes('/admin')) return 'admin';
  if (pathname.includes('/manager-assessment') || pathname.includes('/quiz')) return 'quiz';
  if (pathname.includes('/user-experiences') || pathname.includes('/reviews')) return 'user-experiences';
  return 'books';
}

async function post(body: Record<string, unknown>): Promise<any | null> {
  try {
    const res = await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Offline, blocked, or the dev server (which serves PHP as plain text).
    return null;
  }
}

function beacon(body: Record<string, unknown>) {
  try {
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    if (navigator.sendBeacon && navigator.sendBeacon(TRACK_URL, blob)) return;
  } catch {
    // Fall through to fetch.
  }
  void post(body);
}

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(() => {
    const cached = Number(readStorage(STORAGE_TOTAL_KEY));
    return Number.isFinite(cached) && cached > 0 ? cached : null;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_ADMIN_AUTH_KEY) === 'authenticated_valid';
    } catch {
      return false;
    }
  });

  // Mutable tracking state shared by the effects and callbacks below.
  const track = useRef({
    vid: '',
    sid: '',
    started: false,
    section: 'books',
    path: '/',
    geo: { city: '', country: '' },
    disabled: false,
  });

  const applyTotal = useCallback((resp: any) => {
    const n = resp && typeof resp.totalVisits === 'number' ? resp.totalVisits : null;
    if (n !== null && n >= 0) {
      setTotalVisitors(n);
      writeStorage(STORAGE_TOTAL_KEY, String(n));
    }
  }, []);

  /** Full payload for the first report of a visit. */
  const sendStart = useCallback(async (force = false) => {
    const t = track.current;
    if (t.disabled || t.section === 'admin') return;
    // Once per visit per page load (StrictMode re-runs effects in development).
    if (t.started && !force) return;
    t.started = true;
    touchVisit(t.sid);

    const battery = await Promise.race<BatteryInfo>([
      getBatteryInfo(),
      new Promise<BatteryInfo>((resolve) =>
        setTimeout(() => resolve({ levelPercent: null, charging: null, supported: false }), 400)
      ),
    ]);

    const now = new Date().toISOString();
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '';
    const payload: VisitorTelemetry & { action: string; section: string } = {
      action: 'start',
      section: t.section,
      visitorId: t.vid,
      sessionId: t.sid,
      isNewVisitor: false,
      isNewSession: true,
      firstSeenAt: readStorage(STORAGE_FIRST_SEEN_KEY) || now,
      lastSeenAt: now,
      sessionStartedAt: now,
      durationSeconds: 0,
      currentPath: t.path,
      referrer,
      hardware: getHardwareInfo(),
      battery,
      network: getNetworkInfo(),
      screen: getScreenInfo(),
      client: getDeviceOsBrowserInfo(),
      geo: { ip: '', city: t.geo.city, region: '', country: t.geo.country, countryCode: '', isp: '' },
      navigationTrail: [{ path: t.path, title: t.section, timestamp: now }],
    };

    applyTotal(await post(payload as unknown as Record<string, unknown>));
  }, [applyTotal]);

  const sendLight = useCallback(
    async (action: 'heartbeat' | 'pageview') => {
      const t = track.current;
      if (t.disabled || t.section === 'admin') return;
      if (!t.started) {
        await sendStart();
        return;
      }
      touchVisit(t.sid);
      const resp = await post({
        action,
        visitorId: t.vid,
        sessionId: t.sid,
        currentPath: t.path,
        section: t.section,
        geo: t.geo,
      });
      // The server never saw (or lost) this visit: report it again in full.
      if (resp && resp.success && resp.known === false) await sendStart(true);
    },
    [sendStart]
  );

  const sendLeave = useCallback(() => {
    const t = track.current;
    if (t.disabled || !t.started) return;
    beacon({ action: 'leave', visitorId: t.vid, sessionId: t.sid });
  }, []);

  // Boot: identify, report the visit, then keep it alive while the tab is visible.
  useEffect(() => {
    const t = track.current;
    try {
      // Left over from the old browser-only counter (it also kept a device fingerprint).
      localStorage.removeItem('orangutan_telemetry_registry_v1');
      localStorage.removeItem('orangutan_telemetry_total_visitors');
    } catch {}
    // Automated browsers (crawlers, test runners) are not visitors.
    t.disabled = (navigator as Navigator & { webdriver?: boolean }).webdriver === true;
    t.vid = getVisitorId();
    t.sid = getVisitId();
    t.path = window.location.pathname || '/';
    t.section = sectionFromPath(t.path);

    if (document.visibilityState === 'visible') void sendStart();

    // Location arrives later; the next heartbeat carries it.
    getGeoLocationSilent()
      .then((geo) => {
        t.geo = { city: geo.city || '', country: geo.country || '' };
        if (t.started && document.visibilityState === 'visible') void sendLight('heartbeat');
      })
      .catch(() => {});

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') void sendLight('heartbeat');
    }, HEARTBEAT_MS);

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendLeave();
        return;
      }
      // Back after a long break: that counts as a new visit.
      const sid = getVisitId();
      if (sid !== t.sid) {
        t.sid = sid;
        t.started = false;
      }
      void sendLight('heartbeat');
    };
    const onPageHide = () => sendLeave();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [sendStart, sendLight, sendLeave]);

  const recordNavigation = useCallback(
    (path: string, section?: string) => {
      const t = track.current;
      const nextPath = path || '/';
      const nextSection = section || sectionFromPath(nextPath);
      if (nextSection === t.section && nextPath === t.path) return;
      const wasAdmin = t.section === 'admin';
      t.path = nextPath;
      t.section = nextSection;

      if (nextSection === 'admin') {
        // The admin watching the dashboard is not a site visitor.
        sendLeave();
        return;
      }
      void sendLight(wasAdmin ? 'heartbeat' : 'pageview');
    },
    [sendLight, sendLeave]
  );

  const loginAdmin = useCallback((passcode: string): boolean => {
    const validCodes = ['3plus@admin', 'orangutan40', '4430929292'];
    if (validCodes.includes(passcode.trim())) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_ADMIN_AUTH_KEY, 'authenticated_valid');
        sessionStorage.setItem(SESSION_ADMIN_PASSCODE_KEY, passcode.trim());
      } catch {}
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_ADMIN_AUTH_KEY);
      sessionStorage.removeItem(SESSION_ADMIN_PASSCODE_KEY);
    } catch {}
  }, []);

  return (
    <VisitorContext.Provider value={{ totalVisitors, isAdminAuthenticated, loginAdmin, logoutAdmin, recordNavigation }}>
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
