import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, Package, MapPin, Printer } from 'lucide-react';
import { Order, ThemeMode } from '../types';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { motion } from 'motion/react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
  theme?: ThemeMode;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  theme = 'light'
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    recentOrders.length > 0 ? recentOrders[recentOrders.length - 1] : null
  );
  const [errorMsg, setErrorMsg] = useState('');
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = recentOrders.find(
      (o) => o.orderCode.toLowerCase() === searchCode.trim().toLowerCase()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg('سفارشی با این کد رهگیری یافت نشد. لطفاً کد را بررسی نمایید.');
    }
  };

  const activeOrder = searchedOrder || (recentOrders.length > 0 ? recentOrders[recentOrders.length - 1] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border ${
          isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#1E2022] border-stone-700 text-[#FAF7F2]'
        }`}
      >
        
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 p-2 rounded-xl ${
            isLight ? 'bg-stone-100 text-stone-600 hover:text-stone-900' : 'bg-stone-800 text-stone-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#B87333]/20 border border-[#B87333]/30">
            <Truck className="w-6 h-6 text-[#B87333]" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
              سامانه آنلاین پیگیری سفارش‌های پستی
            </h3>
            <p className="text-xs text-stone-400">
              مشاهده آخرین وضعیت بسته‌بندی و کد رهگیری مرسوله پیشتاز
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="ورود کد رهگیری (مثلاً: OG3-982410)..."
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#B87333] ${
              isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>جستجو</span>
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
        )}

        {/* Order Details Display */}
        {activeOrder ? (
          <div className="space-y-6 pt-2">
            
            {/* Status Timeline */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">کد رهگیری: <strong className="text-[#B87333] font-mono text-sm">{activeOrder.orderCode}</strong></span>
                <span className="text-stone-400">تاریخ ثبت: <strong className={isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}>{activeOrder.date}</strong></span>
              </div>

              {/* Steps Visual Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-bold">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <span>ثبت سفارش</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                  <Package className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <span>تکمیل و امضا</span>
                </div>
                <div className="p-2 rounded-xl bg-[#B87333]/20 border border-[#B87333] text-[#B87333]">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-[#B87333] animate-pulse" />
                  <span>تحویل به پست</span>
                </div>
                <div className={`p-2 rounded-xl border ${
                  isLight ? 'bg-stone-200 border-stone-300 text-stone-500' : 'bg-stone-800 border-stone-700 text-stone-500'
                }`}>
                  <MapPin className="w-4 h-4 mx-auto mb-1 text-stone-500" />
                  <span>تحویل خریدار</span>
                </div>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-1 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/80 border-stone-800'
              }`}>
                <span className="text-stone-400 font-semibold block">تحویل گیرنده:</span>
                <span className={`font-bold text-sm block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  {activeOrder.customerInfo.fullName}
                </span>
                <span className="text-stone-400 block">تلفن: {activeOrder.customerInfo.phone}</span>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/80 border-stone-800'
              }`}>
                <span className="text-stone-400 font-semibold block">آدرس ارسال:</span>
                <span className={`block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                  استان {activeOrder.customerInfo.province}، {activeOrder.customerInfo.city}، {activeOrder.customerInfo.address}
                </span>
                <span className="text-stone-400 block">کد پستی: {activeOrder.customerInfo.postalCode}</span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/80 border-stone-800'
            }`}>
              <span className={`text-xs font-bold block ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>اقلام سفارش:</span>
              <ul className={`space-y-2 text-xs ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                {activeOrder.items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between pb-2 border-b border-stone-500/20">
                    <span>{it.title} (تعداد: {toPersianDigits(it.quantity)})</span>
                    <span className="font-bold text-[#B87333]">{formatCurrency(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className={`flex items-center justify-between text-xs font-extrabold pt-1 ${
                isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
              }`}>
                <span>مبلغ کل:</span>
                <span className="text-[#B87333] text-sm">{formatCurrency(activeOrder.finalPrice)}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-stone-400 text-xs">
            برای مشاهده وضعیت، کد رهگیری سفارش خود را در کادر بالا وارد نمایید.
          </div>
        )}

      </motion.div>
    </div>
  );
};
