import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Tag, PenTool, ArrowLeft, Truck, Check } from 'lucide-react';
import { CartItem, OrderCustomerInfo, ThemeMode } from '../types';
import { toPersianDigits, formatCurrency } from '../utils/persian';
import { IRAN_PROVINCES_CITIES } from '../data/bookData';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToPayment: (customerInfo: OrderCustomerInfo, promoDiscountPercent: number) => void;
  theme?: ThemeMode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToPayment,
  theme = 'dark'
}) => {
  const [step, setStep] = useState<'cart' | 'shipping'>('cart');
  const isLight = theme === 'light';

  // Customer Shipping Info
  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    postalCode: '',
    invoiceType: 'real',
    companyName: '',
    nationalId: ''
  });

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const selectedProvinceCities = IRAN_PROVINCES_CITIES.find(p => p.province === customerInfo.province)?.cities || [];

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ORANGUTAN1403' || code === 'HAKIMIAN' || code === 'PLUS3') {
      setPromoDiscountPercent(15);
      setPromoMessage({ text: 'کد تخفیف ۱۵٪ ویژه با موفقیت اعمال گردید!', isError: false });
    } else {
      setPromoDiscountPercent(0);
      setPromoMessage({ text: 'کد تخفیف وارد شده نامعتبر است.', isError: true });
    }
  };

  // Calculations
  const rawTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const promoDiscountAmount = Math.round(rawTotal * (promoDiscountPercent / 100));

  const hasBundle = cartItems.some(item => item.bookId === 'bundle-full');
  const shippingCost = hasBundle || rawTotal > 600000 ? 0 : 35000;

  const finalTotal = Math.max(0, rawTotal - promoDiscountAmount + shippingCost);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPayment(customerInfo, promoDiscountPercent);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`pointer-events-auto w-screen max-w-md border-r shadow-2xl flex flex-col justify-between ${
              isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#1E2022] border-stone-800 text-[#FAF7F2]'
            }`}
          >
            
            {/* Header */}
            <div className="p-6 border-b border-stone-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#B87333]/20 border border-[#B87333]/30">
                  <ShoppingBag className="w-5 h-5 text-[#B87333]" />
                </div>
                <div>
                  <h2 className={`text-base font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                    {step === 'cart' ? 'سبد خرید کتاب' : 'اطلاعات ارسال و خریدار'}
                  </h2>
                  <span className="text-[11px] text-stone-400">
                    {step === 'cart' ? `${toPersianDigits(cartItems.length)} عنوان انتخاب شده` : 'ثبت آدرس جهت ارسال پست پیشتاز'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl ${
                  isLight ? 'bg-stone-100 text-stone-600 hover:text-stone-900' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
                  <p className="text-sm font-semibold text-stone-400">
                    سبد خرید شما در حال حاضر خالی است.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-[#B87333] hover:bg-amber-600 text-white text-xs font-bold"
                  >
                    مشاهده نسخه‌های کتاب
                  </button>
                </div>
              ) : (
                <>
                  {step === 'cart' ? (
                    <div className="space-y-6">
                      
                      {/* Cart Items List */}
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                              isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <h3 className={`text-xs font-bold ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                                {item.title}
                              </h3>

                              {item.authorSignatureRequested && (
                                <span className="text-[10px] text-[#B87333] font-bold block flex items-center gap-1">
                                  <PenTool className="w-3 h-3 text-[#B87333]" />
                                  <span>امضای اختصاصی: {item.recipientName || 'بدون نام'}</span>
                                </span>
                              )}

                              <span className="text-xs font-extrabold text-[#B87333] block">
                                {formatCurrency(item.price)}
                              </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${
                              isLight ? 'bg-white border-stone-200' : 'bg-[#121314] border-stone-800'
                            }`}>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="p-1 rounded text-stone-400 hover:text-stone-900"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <span className={`text-xs font-bold w-5 text-center ${isLight ? 'text-stone-900' : 'text-[#FAF7F2]'}`}>
                                {toPersianDigits(item.quantity)}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="p-1 rounded text-stone-400 hover:text-stone-900"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-2 text-stone-400 hover:text-red-500"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Box */}
                      <div className={`p-4 rounded-2xl border space-y-2 ${
                        isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-800'
                      }`}>
                        <label className={`text-xs font-semibold block ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                          کد تخفیف دارید؟
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="مثلاً: ORANGUTAN1403"
                            className={`flex-1 px-3 py-2 rounded-xl border text-xs uppercase focus:outline-none focus:border-[#B87333] ${
                              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                            }`}
                          />
                          <button
                            onClick={handleApplyPromo}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                              isLight ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-stone-800 text-stone-200 border-stone-700'
                            }`}
                          >
                            اعمال
                          </button>
                        </div>

                        {promoMessage && (
                          <p className={`text-[11px] font-semibold ${promoMessage.isError ? 'text-red-500' : 'text-emerald-500'}`}>
                            {promoMessage.text}
                          </p>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* Step 2: Customer Shipping Form */
                    <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4 text-xs">
                      
                      <div>
                        <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                          نام و نام خانوادگی خریدار:*
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.fullName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                          placeholder="مثلاً: علیرضا حسینی"
                          className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                            isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                          شماره همراه (جهت دریافت پیامک پستی):*
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="۰۹۱۲..."
                          className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                            isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>استان:*</label>
                          <select
                            value={customerInfo.province}
                            onChange={(e) => {
                              const newProv = e.target.value;
                              const firstCity = IRAN_PROVINCES_CITIES.find(p => p.province === newProv)?.cities[0] || '';
                              setCustomerInfo({ ...customerInfo, province: newProv, city: firstCity });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                            }`}
                          >
                            {IRAN_PROVINCES_CITIES.map((p) => (
                              <option key={p.province} value={p.province}>{p.province}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>شهر:*</label>
                          <select
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                            }`}
                          >
                            {selectedProvinceCities.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>آدرس دقیق پستی:*</label>
                        <textarea
                          rows={2}
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          placeholder="خیابان، پلاک، واحد..."
                          className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                            isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>کد پستی ۱۰ رقمی:*</label>
                          <input
                            type="text"
                            required
                            value={customerInfo.postalCode}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                            placeholder="۱۰ رقم بدون فاصله"
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`font-semibold block mb-1 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>نوع فاکتور:</label>
                          <select
                            value={customerInfo.invoiceType}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, invoiceType: e.target.value as any })}
                            className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-[#B87333] ${
                              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#121314] border-stone-700 text-[#FAF7F2]'
                            }`}
                          >
                            <option value="real">فاکتور حقیقی (شخصی)</option>
                            <option value="legal">فاکتور رسمی حقوقی (شرکتی)</option>
                          </select>
                        </div>
                      </div>

                    </form>
                  )}
                </>
              )}

            </div>

            {/* Drawer Footer Summary & Checkout Button */}
            {cartItems.length > 0 && (
              <div className={`p-6 border-t space-y-4 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
              }`}>
                
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex items-center justify-between">
                    <span>جمع کل اقلام:</span>
                    <span className={isLight ? 'text-stone-900 font-bold' : 'text-[#FAF7F2]'}>{formatCurrency(rawTotal)}</span>
                  </div>

                  {promoDiscountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-500 font-semibold">
                      <span>تخفیف ویژه کد پرومو:</span>
                      <span>- {formatCurrency(promoDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>هزینه ارسال (پست پیشتاز):</span>
                    <span className={shippingCost === 0 ? 'text-emerald-500 font-bold' : ''}>
                      {shippingCost === 0 ? 'رایگان' : formatCurrency(shippingCost)}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between pt-2 border-t border-stone-500/20 text-sm font-extrabold ${
                    isLight ? 'text-stone-900' : 'text-[#FAF7F2]'
                  }`}>
                    <span>مبلغ قابل پرداخت:</span>
                    <span className="text-[#B87333] text-base">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('shipping')}
                    className="w-full py-3.5 rounded-2xl bg-[#B87333] hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>تکمیل اطلاعات ارسال</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep('cart')}
                      className={`px-4 py-3.5 rounded-2xl text-xs font-bold border ${
                        isLight ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      بازگشت
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      form="shipping-form"
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>اتصال به درگاه امن آنلاین</span>
                    </motion.button>
                  </div>
                )}

              </div>
            )}

          </motion.div>

        </div>
      </div>
    </div>
  );
};
