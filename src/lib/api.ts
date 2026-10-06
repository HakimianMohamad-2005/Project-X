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

const LOCAL_EXPERIENCES_KEY = 'orangutan_local_experiences';

export function getLocalExperiences(): any[] {
  try {
    const saved = localStorage.getItem(LOCAL_EXPERIENCES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLocalExperience(exp: any) {
  try {
    const exps = getLocalExperiences();
    const filtered = exps.filter((e) => e.id !== exp.id);
    localStorage.setItem(LOCAL_EXPERIENCES_KEY, JSON.stringify([exp, ...filtered]));
  } catch (e) {
    console.error('Error saving local experience:', e);
  }
}

// Fetch approved user experiences from MySQL backend API (/api/experiences.php)
export async function fetchUserExperiencesFromApi(): Promise<{ success: boolean; experiences: any[] }> {
  try {
    const res = await fetch('/api/experiences.php');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.experiences)) {
        return { success: true, experiences: data.experiences };
      }
    }
  } catch (err) {
    console.warn('API experiences GET call failed, using local/default fallback:', err);
  }
  return { success: false, experiences: [] };
}

// Save user experience to MySQL backend API (/api/experiences.php)
export async function saveUserExperienceToApi(expData: {
  fullName: string;
  role?: string;
  company: string;
  industry?: string;
  category?: string;
  phoneOrEmail?: string;
  rating?: number;
  volumeRead?: string;
  achievementBadge: string;
  keyMetric?: string;
  feedback: string;
}): Promise<{ success: boolean; id?: string; message?: string }> {
  try {
    const res = await fetch('/api/experiences.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expData),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.warn('API experiences POST call failed:', err);
    return {
      success: false,
      message: err?.message || 'خطا در ارتباط با سرور'
    };
  }
  return {
    success: false,
    message: 'خطا در ارسال اطلاعات به سرور'
  };
}

export interface DbTestResult {
  success: boolean;
  message: string;
  database?: string;
  user?: string;
  tables?: string[];
  orderCount?: number;
  experienceCount?: number;
  assessmentCount?: number;
  serverTime?: string;
  rawError?: string;
}

// Save Advanced Assessment submission to MySQL backend API (/api/save_assessment.php)
export async function saveAssessmentToApi(payload: {
  profile?: any;
  result?: any;
  assessmentId?: number | null;
  status?: 'started' | 'completed';
}): Promise<{ success: boolean; id?: number; message?: string }> {
  try {
    const res = await fetch('/api/save_assessment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.warn('API save_assessment call failed:', err);
  }
  return { success: false };
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

