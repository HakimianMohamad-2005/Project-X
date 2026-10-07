import { CartItem } from '../types';

const PROMO_CODES = ['ORANGUTAN1403', 'HAKIMIAN', 'PLUS3'];
export const PROMO_PERCENT = 15;
const FREE_SHIPPING_THRESHOLD = 600000;
const SHIPPING_COST = 35000;

/** Returns the discount percent for a promo code, or 0 when it is not valid. */
export function promoPercentFor(code: string): number {
  return PROMO_CODES.includes(code.trim().toUpperCase()) ? PROMO_PERCENT : 0;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

/** Single source of truth for cart pricing (drawer summary and payment amount). */
export function computeCartTotals(items: CartItem[], promoPercent: number): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * (promoPercent / 100));
  const hasBundle = items.some((item) => item.bookId === 'bundle-full');
  const shipping = hasBundle || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
}
