import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Hash,
  Mail,
  MapPin,
  Minus,
  PenTool,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import { CartItem, OrderCustomerInfo } from '../types';
import { IRAN_PROVINCES_CITIES } from '../data/bookData';
import { computeCartTotals, promoPercentFor } from '../lib/cart';
import { Button, Drawer, Field, inputClass } from './ui/kit';
import { CoverThumb } from './ui/CoverThumb';
import { useLocaleFormat } from './ui/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (customerInfo: OrderCustomerInfo, promoPercent: number) => void;
  onBrowseBooks: () => void;
}

type Step = 'cart' | 'shipping';

const EMPTY_INFO: OrderCustomerInfo = {
  fullName: '',
  phone: '',
  province: 'تهران',
  city: 'تهران',
  address: '',
  postalCode: '',
  invoiceType: 'real',
  companyName: '',
  nationalId: '',
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBrowseBooks,
}) => {
  const { t } = useTranslation();
  const { price, num, pct, isRtl } = useLocaleFormat();
  const [step, setStep] = useState<Step>('cart');
  const [info, setInfo] = useState<OrderCustomerInfo>(EMPTY_INFO);
  const [promoCode, setPromoCode] = useState('');
  const [promoPercent, setPromoPercent] = useState(0);
  const [promoState, setPromoState] = useState<'idle' | 'ok' | 'bad'>('idle');

  // Always reopen on the cart step.
  useEffect(() => {
    if (isOpen) setStep('cart');
  }, [isOpen]);

  const totals = computeCartTotals(items, promoPercent);
  const cities = IRAN_PROVINCES_CITIES.find((p) => p.province === info.province)?.cities || [];
  const itemCount = items.reduce((a, b) => a + b.quantity, 0);
  const ForwardIcon = ArrowLeft;

  const applyPromo = () => {
    const percent = promoPercentFor(promoCode);
    setPromoPercent(percent);
    setPromoState(percent > 0 ? 'ok' : 'bad');
  };

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(info, promoPercent);
  };

  const steps: { key: Step | 'payment'; label: string }[] = [
    { key: 'cart', label: t('ui.cart.stepCart') },
    { key: 'shipping', label: t('ui.cart.stepShipping') },
    { key: 'payment', label: t('ui.cart.stepPayment') },
  ];
  const stepIndex = step === 'cart' ? 0 : 1;

  return (
    <Drawer open={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="relative px-6 pt-6 pb-5 border-b border-line">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(184,115,51,0.18),transparent_70%)]" />
        <div className="relative flex items-center gap-3 pe-12">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper/15 text-copper-hi border border-copper/25">
            {step === 'cart' ? <ShoppingBag className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
          </span>
          <div>
            <h2 className="text-lg font-black">{step === 'cart' ? t('ui.cart.title') : t('ui.cart.shippingTitle')}</h2>
            <p className="text-xs text-ink-3">
              {step === 'cart' ? t('ui.cart.itemsCount', { n: num(itemCount) }) : t('ui.cart.shippingSubtitle')}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <ol className="relative mt-5 grid grid-cols-3 gap-2">
            {steps.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <li key={s.key} className="space-y-1.5">
                  <span className="block h-1 rounded-full bg-line overflow-hidden">
                    <motion.span
                      className="block h-full bg-gradient-to-r from-[#D9894A] to-[#FFD3A1]"
                      initial={false}
                      animate={{ width: done || active ? '100%' : '0%' }}
                      style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                      transition={{ duration: 0.5 }}
                    />
                  </span>
                  <span className={`block text-[11px] font-bold ${active ? 'text-copper-hi' : done ? 'text-ink-2' : 'text-ink-3'}`}>
                    {num(i + 1)}. {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center gap-5 py-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-copper/20 blur-2xl" />
              <span className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-line bg-surface-2">
                <ShoppingBag className="w-10 h-10 text-copper-hi" />
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black">{t('ui.cart.emptyTitle')}</h3>
              <p className="text-sm text-ink-2 max-w-xs">{t('ui.cart.emptyText')}</p>
            </div>
            <Button onClick={onBrowseBooks}>
              <BookOpen className="w-4 h-4" />
              {t('ui.cart.browse')}
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {step === 'cart' ? (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: isRtl ? -40 : 40, height: 0, marginTop: 0 }}
                        className="flex gap-4 rounded-2xl border border-line bg-surface-2/60 p-3"
                      >
                        <CoverThumb bookId={item.bookId} />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <h3 className="text-sm font-bold leading-6">{item.title}</h3>
                          {item.authorSignatureRequested && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-copper-hi">
                              <PenTool className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {t('ui.cart.signatureFor', { name: item.recipientName || t('ui.cart.noName') })}
                              </span>
                            </span>
                          )}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-sm font-black text-copper-hi">{price(item.price * item.quantity)}</span>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center rounded-xl border border-line bg-field">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  aria-label={t('ui.cart.increase')}
                                  className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-copper-hi"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-black tabular-nums">{num(item.quantity)}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  aria-label={t('ui.cart.decrease')}
                                  className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-copper-hi"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                aria-label={t('ui.cart.remove')}
                                className="flex h-8 w-8 items-center justify-center rounded-xl text-ink-3 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Promo */}
                <div className="rounded-2xl border border-dashed border-line-strong p-4 space-y-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-ink-2">
                    <Tag className="w-3.5 h-3.5 text-copper-hi" />
                    {t('ui.cart.promoLabel')}
                  </span>
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoState('idle');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                      placeholder={t('ui.cart.promoPlaceholder')}
                      dir="ltr"
                      className={`${inputClass} uppercase tracking-wider`}
                    />
                    <Button variant="secondary" size="md" onClick={applyPromo} className="shrink-0 !h-auto">
                      {t('ui.cart.apply')}
                    </Button>
                  </div>
                  {promoState !== 'idle' && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs font-bold ${promoState === 'ok' ? 'text-emerald-500' : 'text-red-500'}`}
                    >
                      {promoState === 'ok' ? t('ui.cart.promoOk', { percent: pct(promoPercent) }) : t('ui.cart.promoBad')}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="shipping"
                id="shipping-form"
                onSubmit={submitShipping}
                initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <Field label={t('ui.cart.fullName')} icon={User} required>
                  <input
                    required
                    value={info.fullName}
                    onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
                    placeholder={t('ui.cart.fullNamePlaceholder')}
                    autoComplete="name"
                    className={inputClass}
                  />
                </Field>
                <Field label={t('ui.cart.phone')} icon={Phone} required hint={t('ui.cart.phoneHint')}>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="09xx xxx xxxx"
                    autoComplete="tel"
                    className={`${inputClass} text-start`}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('ui.cart.province')} icon={MapPin} required>
                    <select
                      value={info.province}
                      onChange={(e) => {
                        const province = e.target.value;
                        const city = IRAN_PROVINCES_CITIES.find((p) => p.province === province)?.cities[0] || '';
                        setInfo({ ...info, province, city });
                      }}
                      className={inputClass}
                    >
                      {IRAN_PROVINCES_CITIES.map((p) => (
                        <option key={p.province} value={p.province}>
                          {p.province}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t('ui.cart.city')} required>
                    <select value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })} className={inputClass}>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label={t('ui.cart.address')} required>
                  <textarea
                    required
                    rows={2}
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    placeholder={t('ui.cart.addressPlaceholder')}
                    autoComplete="street-address"
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('ui.cart.postal')} icon={Mail} required>
                    <input
                      required
                      dir="ltr"
                      inputMode="numeric"
                      value={info.postalCode}
                      onChange={(e) => setInfo({ ...info, postalCode: e.target.value })}
                      placeholder={t('ui.cart.postalPlaceholder')}
                      autoComplete="postal-code"
                      className={`${inputClass} text-start`}
                    />
                  </Field>
                  <Field label={t('ui.cart.invoice')}>
                    <select
                      value={info.invoiceType}
                      onChange={(e) => setInfo({ ...info, invoiceType: e.target.value as OrderCustomerInfo['invoiceType'] })}
                      className={inputClass}
                    >
                      <option value="real">{t('ui.cart.invoiceReal')}</option>
                      <option value="legal">{t('ui.cart.invoiceLegal')}</option>
                    </select>
                  </Field>
                </div>
                <AnimatePresence initial={false}>
                  {info.invoiceType === 'legal' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-3 overflow-hidden"
                    >
                      <Field label={t('ui.cart.company')} icon={Building2} required>
                        <input
                          required
                          value={info.companyName || ''}
                          onChange={(e) => setInfo({ ...info, companyName: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={t('ui.cart.nationalId')} icon={Hash} required>
                        <input
                          required
                          dir="ltr"
                          inputMode="numeric"
                          value={info.nationalId || ''}
                          onChange={(e) => setInfo({ ...info, nationalId: e.target.value })}
                          className={`${inputClass} text-start`}
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="border-t border-line bg-surface-2/50 px-6 py-5 space-y-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-2">
              <dt>{t('ui.cart.subtotal')}</dt>
              <dd className="font-bold text-ink">{price(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-500 font-bold">
                <dt>{t('ui.cart.discount')}</dt>
                <dd>− {price(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-ink-2">
              <dt>{t('ui.cart.shipping')}</dt>
              <dd className={totals.shipping === 0 ? 'font-bold text-emerald-500' : 'font-bold text-ink'}>
                {totals.shipping === 0 ? t('ui.cart.free') : price(totals.shipping)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-black">{t('ui.cart.total')}</dt>
              <dd className="text-xl font-black text-copper-hi">{price(totals.total)}</dd>
            </div>
          </dl>

          {step === 'cart' ? (
            <Button size="lg" className="w-full" onClick={() => setStep('shipping')}>
              {t('ui.cart.toShipping')}
              <ForwardIcon className="w-5 h-5 ltr:rotate-180" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="lg" onClick={() => setStep('cart')} className="!px-5">
                {t('ui.cart.back')}
              </Button>
              <Button variant="success" size="lg" type="submit" form="shipping-form" className="flex-1">
                <ShieldCheck className="w-5 h-5" />
                {t('ui.cart.toPayment')}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-ink-3">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t('ui.cart.secure')}
            </span>
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-copper-hi" />
              {t('ui.cart.fastShipping')}
            </span>
          </div>
        </div>
      )}
    </Drawer>
  );
};
