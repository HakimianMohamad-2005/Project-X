import { Order, LeadForm, B2BForm } from '../types';

export function normalizeDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => (d.charCodeAt(0) - 1776).toString())
    .replace(/[٠-٩]/g, (d) => (d.charCodeAt(0) - 1632).toString())
    .replace(/[\s\-_]/g, '')
    .toLowerCase();
}

const LOCAL_ORDERS_KEY = 'orangutan_local_orders';

function getLocalOrders(): Order[] {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(order: Order) {
  try {
    const orders = getLocalOrders();
    const filtered = orders.filter((o) => o.orderCode !== order.orderCode);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...filtered]));
  } catch (e) {
    console.error('Error saving local order:', e);
  }
}

// Save order to MySQL backend API via PHP endpoint
export async function saveOrderToApi(order: Order): Promise<boolean> {
  saveLocalOrder(order);

  try {
    const res = await fetch('/api/save_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
  } catch (err) {
    console.warn('API save_order call failed, fallback saved in localStorage:', err);
  }
  return true;
}

// Fetch recent orders from MySQL API
export async function fetchRecentOrdersFromApi(): Promise<Order[]> {
  try {
    const res = await fetch('/api/get_orders.php');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        return data.orders;
      }
    }
  } catch (err) {
    console.warn('API get_orders call failed, returning local storage orders:', err);
  }
  return getLocalOrders();
}

// Search order by orderCode or customer phone from MySQL API
export async function searchOrderInApi(searchTerm: string): Promise<Order | null> {
  const term = normalizeDigits(searchTerm);
  if (!term) return null;

  try {
    const res = await fetch(`/api/search_order.php?q=${encodeURIComponent(searchTerm.trim())}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        return data.order as Order;
      }
    }
  } catch (err) {
    console.warn('API search_order call failed, searching local fallback:', err);
  }

  // Fallback search in localStorage
  const localOrders = getLocalOrders();
  const found = localOrders.find((o) => {
    const normCode = normalizeDigits(o.orderCode || '');
    const normPhone = normalizeDigits(o.customerInfo?.phone || '');
    return (
      normCode.includes(term) ||
      normPhone.includes(term) ||
      (term.length >= 4 && normCode.endsWith(term))
    );
  });

  return found || null;
}

// Save B2B inquiry to MySQL API
export async function saveB2BInquiryToApi(b2bData: B2BForm): Promise<boolean> {
  try {
    const res = await fetch('/api/save_b2b.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b2bData),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
  } catch (err) {
    console.warn('API save_b2b call failed:', err);
  }
  return true;
}

// Save Lead Sample request to MySQL API
export async function saveLeadSampleToApi(leadData: LeadForm): Promise<boolean> {
  try {
    const res = await fetch('/api/save_lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
  } catch (err) {
    console.warn('API save_lead call failed:', err);
  }
  return true;
}

export interface DbTestResult {
  success: boolean;
  message: string;
  database?: string;
  user?: string;
  tables?: string[];
  orderCount?: number;
  serverTime?: string;
  rawError?: string;
}

// Test PHP PDO database connection
export async function testDatabaseConnection(): Promise<DbTestResult> {
  try {
    const res = await fetch('/api/test_db.php');
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'عدم دریافت پاسخ از اندپوینت PHP (/api/test_db.php). اگر در محیط لوکال/پیش‌نمایش هستید، این طبیعی است و پس از آپلود در cPanel فعال می‌شود.',
      rawError: err?.message || String(err)
    };
  }
}

