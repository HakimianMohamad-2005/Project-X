import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { Order, OrderCustomerInfo, CartItem, ThemeMode } from '../types';
import { toPersianDigits, formatCurrency, generateOrderCode, getTodayPersianDate } from '../utils/persian';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerInfo: OrderCustomerInfo;
  cartItems: CartItem[];
  onPaymentSuccess: (order: Order) => void;
  theme?: ThemeMode;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerInfo,
  cartItems,
  onPaymentSuccess,
  theme = 'dark'
}) => {
  const [cardNumber, setCardNumber] = useState('6037-9978-4512-8802');
  const [cvv2, setCvv2] = useState('429');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('05');
  const [otp, setOtp] = useState('782910');
  const [otpSent, setOtpSent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paidOrder, setPaidOrder] = useState<Order | null>(null);
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleRequestOtp = () => {
    setOtpSent(true);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      const orderCode = generateOrderCode();
      const newOrder: Order = {
        orderCode,
        date: getTodayPersianDate(),
        items: [...cartItems],
        totalPrice: amount,
        discountPrice: 0,
        finalPrice: amount,
        customerInfo,
        status: 'registered',
        paymentMethod: 'درگاه آنلاین زرین‌پال'
      };

      setProcessing(false);
      setPaidOrder(newOrder);
      onPaymentSuccess(newOrder);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border ${
          isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
        }`}
      >
        
        {/* Top Header of Gateway */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold">
              شاپرک
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                درگاه پرداخت الکترونیک
              </h3>
              <p className="text-[11px] text-stone-400">
                پذیرنده: انتشارات کتاب اورانگوتان +۳
              </p>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-stone-400 block">مبلغ فاکتور:</span>
            <span className="text-sm font-black text-[#B87333]">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {!paidOrder ? (
          <form onSubmit={handlePay} className="space-y-4 text-xs">
            
            {/* Card Number */}
            <div>
              <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                شماره کارت ۱۶ رقمی:*
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border font-mono tracking-wider focus:outline-none focus:border-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                  }`}
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute top-3 left-3" />
              </div>
            </div>

            {/* CVV2 & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>کد CVV2:*</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvv2}
                  onChange={(e) => setCvv2(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border font-mono tracking-widest focus:outline-none focus:border-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                  }`}
                />
              </div>

              <div>
                <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>تاریخ انقضا (ماه / سال):*</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="ماه"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className={`w-1/2 px-2 py-2.5 rounded-xl border text-center font-mono focus:outline-none focus:border-[#B87333] ${
                      isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                    }`}
                  />
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="سال"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    className={`w-1/2 px-2 py-2.5 rounded-xl border text-center font-mono focus:outline-none focus:border-[#B87333] ${
                      isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* OTP Code */}
            <div>
              <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>رمز پویا (پیامکی):*</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border font-mono tracking-widest focus:outline-none focus:border-[#B87333] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs border ${
                    isLight ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-stone-800 text-stone-200 border-stone-700'
                  }`}
                >
                  {otpSent ? 'ارسال مجدد' : 'دریافت رمز پویا'}
                </button>
              </div>
              {otpSent && (
                <p className="text-[10px] text-emerald-500 mt-1">
                  رمز پویا به شماره همراه صاحب کارت ارسال گردید.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال پردازش و دریافت تاییدیه بانکی...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>پرداخت نهایی {formatCurrency(amount)}</span>
                  </>
                )}
              </motion.button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-stone-400 text-[11px] hover:text-stone-300 text-center block"
            >
              انصراف و بازگشت به سایت
            </button>
          </form>
        ) : (
          /* Success Receipt View */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className={`text-xl font-black ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                پرداخت شما با موفقیت انجام شد
              </h3>
              <p className="text-xs text-stone-400">
                سفارش شما در سیستم ثبت گردید و جهت بسته‌بندی به انبار ارسال شد.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className={`p-4 rounded-2xl border space-y-2 text-xs text-right ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1E2022] border-stone-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">کد رهگیری اختصاصی:</span>
                <span className="font-black text-[#B87333] text-sm">{paidOrder.orderCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">تحویل گیرنده:</span>
                <span className={`font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>{paidOrder.customerInfo.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">مبلغ کل پرداخت‌شده:</span>
                <span className="font-bold text-emerald-500">{formatCurrency(paidOrder.finalPrice)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-lg"
            >
              مشاهده پیگیری سفارش
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
