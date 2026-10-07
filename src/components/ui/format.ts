import { useTranslation } from 'react-i18next';
import { formatCurrency, toPersianDigits } from '../../utils/persian';

/** Price + digit formatting for the active language. */
export function useLocaleFormat() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'fa';
  const isFa = lang === 'fa';
  const isRtl = isFa || lang === 'ar';

  const price = (amount: number) => (isFa ? formatCurrency(amount) : `${amount.toLocaleString('en-US')} Toman`);
  const num = (value: number | string) => (isFa ? toPersianDigits(value) : String(value));
  const pct = (value: number) => (isFa ? `${toPersianDigits(value)}٪` : `${value}%`);

  return { lang, isFa, isRtl, price, num, pct };
}
