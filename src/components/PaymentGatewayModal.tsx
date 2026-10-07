import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CreditCard, KeyRound, Lock, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, OrderCustomerInfo } from '../types';
import { generateOrderCode, getTodayPersianDate } from '../utils/persian';
import { Button, Field, Modal, SuccessState, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerInfo: OrderCustomerInfo;
  cartItems: CartItem[];
  onPaymentSuccess: (order: Order) => void;
  onViewTracking: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerInfo,
  cartItems,
  onPaymentSuccess,
  onViewTracking,
}) => {
  const { t } = useTranslation();
  const { price } = useLocaleFormat();
  const [cardNumber, setCardNumber] = useState('6037-9978-4512-8802');
  const [cvv2, setCvv2] = useState('429');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('05');
  const [otp, setOtp] = useState('782910');
  const [otpSent, setOtpSent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paidOrder, setPaidOrder] = useState<Order | null>(null);

  // A fresh window for every new checkout.
  useEffect(() => {
    if (isOpen) {
      setPaidOrder(null);
      setProcessing(false);
      setOtpSent(false);
    }
  }, [isOpen]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    window.setTimeout(() => {
      const newOrder: Order = {
        orderCode: generateOrderCode(),
        date: getTodayPersianDate(),
        items: [...cartItems],
        totalPrice: amount,
        discountPrice: 0,
        finalPrice: amount,
        customerInfo,
        status: 'registered',
        paymentMethod: 'درگاه آنلاین زرین‌پال',
      };
      setProcessing(false);
      setPaidOrder(newOrder);
      onPaymentSuccess(newOrder);
      confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 }, colors: ['#D9894A', '#FFD3A1', '#B87333', '#10B981'] });
    }, 2000);
  };

  const groups = (cardNumber.replace(/\D/g, '') + '················').slice(0, 16).match(/.{1,4}/g) || [];

  return (
    <Modal open={isOpen} onClose={processing ? () => undefined : onClose} size="md" hideClose={processing}>
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 pe-12">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-500 border border-emerald-500/25">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <h3 className="text-lg font-black">{t('ui.pay.title')}</h3>
            <p className="text-xs text-ink-3">{t('ui.pay.merchant')}</p>
          </div>
        </div>

        {!paidOrder ? (
          <>
            {/* Live card preview */}
            <div className="relative aspect-[1.7/1] w-full max-w-sm mx-auto rounded-3xl p-5 sm:p-6 text-white overflow-hidden bg-gradient-to-br from-[#2a1d14] via-[#7A3E14] to-[#D9894A] shadow-[0_24px_50px_-20px_rgba(184,115,51,0.8)]" dir="ltr">
              <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_22px,rgba(255,255,255,0.04)_22px_23px)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="h-8 w-11 rounded-md bg-gradient-to-br from-[#FFE2B8] to-[#C99A5B] shadow-inner" />
                  <span className="text-xs font-black tracking-widest opacity-80">+3</span>
                </div>
                <div className="font-mono text-lg sm:text-xl tracking-[0.18em] tabular-nums">{groups.join(' ')}</div>
                <div className="flex items-end justify-between text-[11px]">
                  <span className="truncate max-w-[60%] font-bold opacity-90">{customerInfo.fullName || '—'}</span>
                  <span className="font-mono opacity-90">
                    {expMonth || 'MM'}/{expYear || 'YY'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
              <span className="text-xs font-bold text-ink-2">{t('ui.pay.amount')}</span>
              <span className="text-lg font-black text-copper-hi">{price(amount)}</span>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <Field label={t('ui.pay.card')} icon={CreditCard} required>
                <input
                  required
                  dir="ltr"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={`${inputClass} font-mono tracking-wider text-start`}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('ui.pay.cvv')} required>
                  <input
                    required
                    type="password"
                    dir="ltr"
                    maxLength={4}
                    inputMode="numeric"
                    value={cvv2}
                    onChange={(e) => setCvv2(e.target.value)}
                    className={`${inputClass} font-mono tracking-widest text-start`}
                  />
                </Field>
                <Field label={t('ui.pay.expiry')} required>
                  <div className="flex gap-2" dir="ltr">
                    <input
                      required
                      maxLength={2}
                      inputMode="numeric"
                      placeholder={t('ui.pay.month')}
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className={`${inputClass} text-center font-mono`}
                    />
                    <input
                      required
                      maxLength={2}
                      inputMode="numeric"
                      placeholder={t('ui.pay.year')}
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className={`${inputClass} text-center font-mono`}
                    />
                  </div>
                </Field>
              </div>
              <Field label={t('ui.pay.otp')} icon={KeyRound} required>
                <div className="flex gap-2">
                  <input
                    required
                    dir="ltr"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${inputClass} font-mono tracking-widest text-start`}
                  />
                  <Button variant="secondary" onClick={() => setOtpSent(true)} className="shrink-0 !h-auto !text-xs">
                    {otpSent ? t('ui.pay.resendOtp') : t('ui.pay.getOtp')}
                  </Button>
                </div>
              </Field>
              {otpSent && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-emerald-500">
                  {t('ui.pay.otpSent')}
                </motion.p>
              )}

              <Button type="submit" variant="success" size="lg" className="w-full" disabled={processing}>
                {processing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {t('ui.pay.processing')}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {t('ui.pay.pay', { amount: price(amount) })}
                  </>
                )}
              </Button>
              {!processing && (
                <button type="button" onClick={onClose} className="block w-full text-center text-xs font-semibold text-ink-3 hover:text-ink">
                  {t('ui.pay.cancel')}
                </button>
              )}
            </form>
          </>
        ) : (
          <SuccessState title={t('ui.pay.successTitle')} text={t('ui.pay.successText')}>
            <dl className="w-full space-y-2.5 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">{t('ui.pay.code')}</dt>
                <dd className="font-mono font-black text-copper-hi">{paidOrder.orderCode}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">{t('ui.pay.recipient')}</dt>
                <dd className="font-bold">{paidOrder.customerInfo.fullName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">{t('ui.pay.paid')}</dt>
                <dd className="font-black text-emerald-500">{price(paidOrder.finalPrice)}</dd>
              </div>
            </dl>
            <Button size="lg" className="w-full" onClick={onViewTracking}>
              <Truck className="w-5 h-5" />
              {t('ui.pay.track')}
            </Button>
          </SuccessState>
        )}
      </div>
    </Modal>
  );
};
