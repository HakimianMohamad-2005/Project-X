/**
  * Persian utility functions for Orangutan +3 Web Application
  * Author: Ali Asghar Hakimian (علی‌اصغر حکیمیان)
  */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  return str.replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit, 10)]);
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} تومان`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

export function generateOrderCode(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `OG3-${toPersianDigits(random)}`;
}

export function getTodayPersianDate(): string {
  const today = new Date();
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(today);
  } catch {
    return '۱۴۰۳/۰۵/۰۱';
  }
}
