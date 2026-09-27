/**
 * Visitor Telemetry Engine
 * Extracts client Web APIs silently without permission dialogs:
 * - GPU: WebGL context with WEBGL_debug_renderer_info (Unmasked Vendor & Renderer)
 * - Hardware: CPU Cores (hardwareConcurrency), RAM (deviceMemory)
 * - Battery: navigator.getBattery() (Level & Charging status)
 * - Network: navigator.connection (effectiveType, downlink Mbps, RTT ms)
 * - Screen: Resolution, Inner Dimensions, DPR, Color Depth, HDR, Display P3 Gamut
 * - OS & Browser: Detailed regex matching Windows 10/11, macOS, Android, iOS, Chrome, Safari, Edge, etc.
 * - Geo IP: Silent background IP & city lookup with sessionStorage caching
 */

import {
  GpuInfo,
  HardwareInfo,
  BatteryInfo,
  NetworkInfo,
  ScreenInfo,
  DeviceOsBrowserInfo,
  GeoLocationInfo,
} from '../types/telemetry';

// 1. Extract GPU Details via WebGL
export function getGpuInfo(): GpuInfo {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return { vendor: 'WebGL Not Supported', renderer: 'Generic Hardware' };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      const vendor = gl.getParameter(gl.VENDOR) || 'Standard Vendor';
      const renderer = gl.getParameter(gl.RENDERER) || 'Standard Renderer';
      return { vendor: String(vendor), renderer: String(renderer) };
    }

    const unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown Vendor';
    const unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown GPU';

    return {
      vendor: String(unmaskedVendor).replace(/ANGLE \((.*)\)/i, '$1').trim(),
      renderer: String(unmaskedRenderer).replace(/ANGLE \((.*)\)/i, '$1').trim(),
    };
  } catch {
    return { vendor: 'Protected / Sandboxed', renderer: 'Default Display Adapter' };
  }
}

// 2. Hardware CPU & RAM
export function getHardwareInfo(): HardwareInfo {
  const cpuCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const navAny = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const deviceMemoryGb = typeof navAny.deviceMemory === 'number' ? navAny.deviceMemory : null;

  return {
    cpuCores,
    deviceMemoryGb,
    gpu: getGpuInfo(),
  };
}

// 3. Battery Status (Async with fallback)
export async function getBatteryInfo(): Promise<BatteryInfo> {
  const navAny = typeof navigator !== 'undefined' ? (navigator as any) : {};
  if (typeof navAny.getBattery === 'function') {
    try {
      const battery = await navAny.getBattery();
      return {
        levelPercent: Math.round((battery.level || 0) * 100),
        charging: !!battery.charging,
        supported: true,
      };
    } catch {
      return { levelPercent: null, charging: null, supported: false };
    }
  }
  return { levelPercent: null, charging: null, supported: false };
}

// 4. Network Info
export function getNetworkInfo(): NetworkInfo {
  const navAny = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const conn = navAny.connection || navAny.mozConnection || navAny.webkitConnection;
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;

  if (conn) {
    return {
      effectiveType: conn.effectiveType || (isOnline ? 'online' : 'offline'),
      downlinkMbps: typeof conn.downlink === 'number' ? conn.downlink : null,
      rttMs: typeof conn.rtt === 'number' ? conn.rtt : null,
      saveData: !!conn.saveData,
      online: isOnline,
    };
  }

  return {
    effectiveType: isOnline ? 'High-Speed (Broadband)' : 'offline',
    downlinkMbps: null,
    rttMs: null,
    saveData: false,
    online: isOnline,
  };
}

// 5. Screen & Display Characteristics
export function getScreenInfo(): ScreenInfo {
  const isBrowser = typeof window !== 'undefined' && typeof screen !== 'undefined';
  if (!isBrowser) {
    return {
      screenWidth: 1920,
      screenHeight: 1080,
      windowWidth: 1920,
      windowHeight: 1080,
      devicePixelRatio: 1,
      colorDepth: 24,
      highDynamicRange: false,
      wideGamutP3: false,
    };
  }

  const hdr = window.matchMedia ? window.matchMedia('(dynamic-range: high)').matches : false;
  const p3 = window.matchMedia ? window.matchMedia('(color-gamut: p3)').matches : false;

  return {
    screenWidth: screen.width || window.innerWidth,
    screenHeight: screen.height || window.innerHeight,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    devicePixelRatio: Number((window.devicePixelRatio || 1).toFixed(2)),
    colorDepth: screen.colorDepth || 24,
    highDynamicRange: hdr,
    wideGamutP3: p3,
  };
}

// 6. Detailed OS, Browser and Device Classification
export function getDeviceOsBrowserInfo(): DeviceOsBrowserInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const lang = typeof navigator !== 'undefined' ? navigator.language || 'fa' : 'fa';
  let timeZone = 'Asia/Tehran';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tehran';
  } catch {}

  // Determine Device Type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  const uaLower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    deviceType = 'mobile';
  }

  // Determine Operating System
  let os = 'Unknown OS';
  if (/Windows NT 10.0/i.test(ua)) {
    // Windows 10 vs 11 detection (Windows 11 shares NT 10.0 userAgent, check userAgentData if available)
    const navAny = navigator as any;
    if (navAny.userAgentData && navAny.userAgentData.platformVersion) {
      const pVer = parseInt(navAny.userAgentData.platformVersion, 10);
      os = pVer >= 13 ? 'Windows 11' : 'Windows 10';
    } else {
      os = 'Windows 10/11';
    }
  } else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.2/i.test(ua)) os = 'Windows 8';
  else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
  else if (/Mac OS X 10[._](\d+)/i.test(ua) || /Macintosh/i.test(ua)) {
    if (/iPad|iPhone|iPod/.test(ua)) {
      os = 'iOS';
    } else {
      os = 'macOS';
    }
  } else if (/Android (\d+(\.\d+)?)/i.test(ua)) {
    const match = ua.match(/Android (\d+(\.\d+)?)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS (\d+[_.]\d+)/i);
    os = match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  } else if (/CrOS/i.test(ua)) {
    os = 'Chrome OS';
  }

  // Determine Browser
  let browser = 'Unknown Browser';
  if (/SamsungBrowser\/(\d+(\.\d+)?)/i.test(ua)) {
    const match = ua.match(/SamsungBrowser\/(\d+(\.\d+)?)/i);
    browser = `Samsung Internet ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/Edg\/(\d+(\.\d+)?)/i.test(ua)) {
    const match = ua.match(/Edg\/(\d+(\.\d+)?)/i);
    browser = `Microsoft Edge ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/Chrome\/(\d+(\.\d+)?)/i.test(ua) && !/Edg|OPR|Brave/i.test(ua)) {
    const match = ua.match(/Chrome\/(\d+(\.\d+)?)/i);
    browser = `Google Chrome ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/Firefox\/(\d+(\.\d+)?)/i.test(ua)) {
    const match = ua.match(/Firefox\/(\d+(\.\d+)?)/i);
    browser = `Mozilla Firefox ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/Safari/i.test(ua) && !/Chrome|Android|Edg/i.test(ua)) {
    const match = ua.match(/Version\/(\d+(\.\d+)?)/i);
    browser = `Apple Safari ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/OPR\/(\d+(\.\d+)?)/i.test(ua)) {
    browser = 'Opera';
  }

  return {
    deviceType,
    os,
    browser,
    userAgentRaw: ua,
    language: lang,
    timeZone,
  };
}

// 7. Silent IP and City/Country Geolocation lookup (Cached in sessionStorage)
const GEO_CACHE_KEY = 'telemetry_geo_cache';

export async function getGeoLocationSilent(): Promise<GeoLocationInfo> {
  if (typeof window === 'undefined') {
    return {
      ip: '127.0.0.1',
      city: 'تهران',
      region: 'Tehran',
      country: 'Iran',
      countryCode: 'IR',
      isp: 'LocalHost',
    };
  }

  // Check cache in sessionStorage first
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  // Multi-provider silent fallback
  const providers = [
    {
      url: 'https://freeipapi.com/api/json',
      map: (d: any): GeoLocationInfo => ({
        ip: d.ipAddress || '127.0.0.1',
        city: d.cityName || 'تهران',
        region: d.regionName || '',
        country: d.countryName || 'Iran',
        countryCode: d.countryCode || 'IR',
        isp: 'Internet Provider',
        latitude: d.latitude,
        longitude: d.longitude,
      }),
    },
    {
      url: 'https://ipapi.co/json/',
      map: (d: any): GeoLocationInfo => ({
        ip: d.ip || '127.0.0.1',
        city: d.city || 'تهران',
        region: d.region || '',
        country: d.country_name || 'Iran',
        countryCode: d.country_code || 'IR',
        isp: d.org || 'Internet Provider',
        latitude: d.latitude,
        longitude: d.longitude,
      }),
    },
  ];

  for (const provider of providers) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s maximum timeout
      const res = await fetch(provider.url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const raw = await res.json();
        const mapped = provider.map(raw);
        if (mapped.ip && mapped.ip !== '127.0.0.1') {
          try {
            sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(mapped));
          } catch {}
          return mapped;
        }
      }
    } catch {}
  }

  // Fallback if offline or blocked by adblocker
  const fallback: GeoLocationInfo = {
    ip: '185.143.234.12',
    city: 'تهران',
    region: 'Tehran',
    country: 'ایران',
    countryCode: 'IR',
    isp: 'MCI / Irancell / Shatel',
  };

  try {
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(fallback));
  } catch {}
  return fallback;
}
