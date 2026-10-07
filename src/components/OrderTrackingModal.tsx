import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, MapPin, Package, PackageSearch, Search, Truck, User } from 'lucide-react';
import { Order } from '../types';
import { searchOrderInApi, normalizeDigits } from '../lib/api';
import { Button, Modal, inputClass } from './ui/kit';
import { CoverThumb } from './ui/CoverThumb';
import { useLocaleFormat } from './ui/format';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

const STATUS_PROGRESS: Record<Order['status'], number> = {
  registered: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, recentOrders }) => {
  const { t } = useTranslation();
  const { price, num } = useLocaleFormat();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const activeOrder = searchedOrder || (recentOrders.length > 0 ? recentOrders[0] : null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setNotFound(false);
    setIsSearching(true);

    const term = normalizeDigits(searchCode);
    const foundLocal = recentOrders.find((o) => {
      const code = normalizeDigits(o.orderCode || '');
      const phone = normalizeDigits(o.customerInfo?.phone || '');
      return code.includes(term) || phone.includes(term) || (term.length >= 4 && code.endsWith(term));
    });
    if (foundLocal) {
      setSearchedOrder(foundLocal);
      setIsSearching(false);
      return;
    }

    const remote = await searchOrderInApi(searchCode.trim());
    setIsSearching(false);
    if (remote) setSearchedOrder(remote);
    else setNotFound(true);
  };

  const steps = [
    { label: t('ui.track.stepRegistered'), icon: CheckCircle2 },
    { label: t('ui.track.stepPacked'), icon: Package },
    { label: t('ui.track.stepShipped'), icon: Truck },
    { label: t('ui.track.stepDelivered'), icon: MapPin },
  ];
  const progress = activeOrder ? STATUS_PROGRESS[activeOrder.status] ?? 1 : 0;

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-3 pe-12">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper/15 text-copper-hi border border-copper/25">
            <PackageSearch className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <h3 className="text-lg font-black">{t('ui.track.title')}</h3>
            <p className="text-xs text-ink-3">{t('ui.track.subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-ink-3" />
            <input
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder={t('ui.track.placeholder')}
              className={`${inputClass} ps-10`}
            />
          </div>
          <Button type="submit" disabled={isSearching} className="shrink-0 !h-auto">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSearching ? t('ui.track.searching') : t('ui.track.search')}</span>
          </Button>
        </form>

        {notFound && <p className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-2.5 text-xs font-bold text-red-500">{t('ui.track.notFound')}</p>}

        {activeOrder ? (
          <motion.div key={activeOrder.orderCode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Timeline */}
            <div className="rounded-3xl border border-line bg-surface-2/50 p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-ink-3">
                  {t('ui.track.code')} <strong className="font-mono text-sm text-copper-hi">{activeOrder.orderCode}</strong>
                </span>
                <span className="text-ink-3">
                  {t('ui.track.date')} <strong className="text-ink">{activeOrder.date}</strong>
                </span>
              </div>
              <ol className="relative grid grid-cols-4 gap-1">
                <span className="absolute top-5 inset-x-[12.5%] h-0.5 bg-line" aria-hidden="true" />
                <motion.span
                  aria-hidden="true"
                  className="absolute top-5 start-[12.5%] h-0.5 bg-gradient-to-r from-emerald-500 to-[#D9894A] rtl:bg-gradient-to-l"
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.min(progress, 3) / 3) * 75}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < progress;
                  const active = i === progress;
                  return (
                    <li key={i} className="relative flex flex-col items-center gap-2 text-center">
                      <span
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          done
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : active
                              ? 'border-copper bg-surface text-copper-hi'
                              : 'border-line-strong bg-surface text-ink-3'
                        }`}
                      >
                        {active && <span className="absolute inset-0 rounded-full border-2 border-copper animate-ping opacity-40" />}
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className={`text-[11px] font-bold leading-4 ${done || active ? 'text-ink' : 'text-ink-3'}`}>{s.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-line p-4 space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-ink-3">
                  <User className="w-3.5 h-3.5" />
                  {t('ui.track.recipient')}
                </span>
                <p className="font-black">{activeOrder.customerInfo.fullName}</p>
                <p className="text-xs text-ink-2" dir="ltr">
                  {activeOrder.customerInfo.phone}
                </p>
              </div>
              <div className="rounded-2xl border border-line p-4 space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-ink-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {t('ui.track.address')}
                </span>
                <p className="text-ink leading-6">
                  {activeOrder.customerInfo.province}، {activeOrder.customerInfo.city}، {activeOrder.customerInfo.address}
                </p>
                <p className="text-xs text-ink-3">
                  {t('ui.track.postal')} {activeOrder.customerInfo.postalCode}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line p-4 space-y-3">
              <span className="text-xs font-bold text-ink-3">{t('ui.track.items')}</span>
              <ul className="space-y-3">
                {activeOrder.items.map((it, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CoverThumb bookId={it.bookId} className="!h-14 !w-12 scale-90" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{it.title}</p>
                      <p className="text-xs text-ink-3">{t('ui.track.qty', { n: num(it.quantity) })}</p>
                    </div>
                    <span className="text-sm font-black text-copper-hi">{price(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="font-black">{t('ui.track.total')}</span>
                <span className="text-lg font-black text-copper-hi">{price(activeOrder.finalPrice)}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line-strong py-12 text-center">
            <Truck className="w-10 h-10 text-ink-3" />
            <p className="text-sm text-ink-2 max-w-xs">{t('ui.track.empty')}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
