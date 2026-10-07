import React, { useState } from 'react';
import { Calculator, Check, Droplets, Layers, RotateCcw, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';
import { Container, PageHeader, inputClass } from './ui/kit';
import { useLocaleFormat } from './ui/format';

interface DecisionCardsProps {
  theme?: ThemeMode;
}

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  frontSummary: string;
  backProtocol: string;
  actionableSteps: string[];
}

type Tool = 'cost_calc' | 'bleed_audit' | 'timeline' | 'steps';

const CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; tool: Tool; tone: string }> = {
  'card-cost-calc': { icon: Calculator, tool: 'cost_calc', tone: 'from-[#D9894A] to-[#7A3E14]' },
  'card-bleed-audit': { icon: Droplets, tool: 'bleed_audit', tone: 'from-red-500 to-red-800' },
  'card-crisis-72h': { icon: ShieldAlert, tool: 'timeline', tone: 'from-amber-500 to-orange-700' },
  'card-key-person': { icon: Users, tool: 'steps', tone: 'from-emerald-500 to-teal-700' },
};

// Hidden-cost multipliers: direct + opportunity + learning + side effects = 2.2×
const COST_PARTS = [
  { key: 'direct', factor: 1, color: 'bg-[#D9894A]' },
  { key: 'opportunity', factor: 0.5, color: 'bg-amber-400' },
  { key: 'learning', factor: 0.4, color: 'bg-red-400' },
  { key: 'side', factor: 0.3, color: 'bg-stone-400' },
];

export const DecisionCards: React.FC<DecisionCardsProps> = () => {
  const { t } = useTranslation();
  const { price, num, pct } = useLocaleFormat();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [directCost, setDirectCost] = useState(100000000);
  const [bleedChecks, setBleedChecks] = useState<boolean[]>(Array(6).fill(false));

  const raw = t('decisionCards.cards', { returnObjects: true });
  const cards = (Array.isArray(raw) ? raw : []) as CardData[];

  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));
  const bleedCount = bleedChecks.filter(Boolean).length;
  const bleedRatio = bleedCount / 6;
  const totalCost = COST_PARTS.reduce((acc, p) => acc + directCost * p.factor, 0);

  const renderTool = (card: CardData, tool: Tool) => {
    if (tool === 'cost_calc') {
      return (
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
          <span className="text-xs font-black text-copper-hi">{t('decisionCards.costCalc.title')}</span>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold text-ink-3">{t('decisionCards.costCalc.directCostLabel')}</span>
            <input
              type="number"
              min={0}
              dir="ltr"
              value={directCost}
              onChange={(e) => setDirectCost(Math.max(0, Number(e.target.value) || 0))}
              className={`${inputClass} text-start font-bold`}
            />
            <input
              type="range"
              min={10000000}
              max={5000000000}
              step={10000000}
              value={Math.min(directCost, 5000000000)}
              onChange={(e) => setDirectCost(Number(e.target.value))}
              className="w-full accent-[#B87333]"
              aria-label={t('decisionCards.costCalc.directCostLabel')}
            />
          </label>
          <div className="flex h-3 overflow-hidden rounded-full bg-surface-2" dir="ltr">
            {COST_PARTS.map((p) => (
              <motion.span
                key={p.key}
                className={p.color}
                animate={{ width: `${(p.factor / 2.2) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-2 text-[11px]">
            {COST_PARTS.map((p) => (
              <li key={p.key} className="flex items-center justify-between gap-2 rounded-lg bg-surface-2/70 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 text-ink-2">
                  <span className={`h-2 w-2 rounded-full ${p.color}`} />
                  {t(`ui.cards.${p.key}`)}
                </span>
                <span className="font-bold text-ink">×{num(p.factor)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-3">
            <span className="text-xs text-ink-2">{t('decisionCards.costCalc.totalEstimatedLabel')}</span>
            <motion.span key={totalCost} initial={{ scale: 1.08 }} animate={{ scale: 1 }} className="text-lg font-black text-copper-hi">
              {price(Math.round(totalCost))}
            </motion.span>
          </div>
          <p className="text-[10px] leading-5 text-ink-3">{t('decisionCards.costCalc.disclaimer')}</p>
        </div>
      );
    }

    if (tool === 'bleed_audit') {
      const tone = bleedRatio > 0.5 ? 'bg-red-500' : bleedRatio > 0.2 ? 'bg-amber-500' : 'bg-emerald-500';
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-red-500">{t('decisionCards.bleedAudit.title')}</span>
            <span className="font-bold text-ink-2">{t('decisionCards.bleedAudit.countIdentified', { count: num(bleedCount) as unknown as number })}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.div className={`h-full ${tone}`} animate={{ width: `${Math.max(4, bleedRatio * 100)}%` }} />
          </div>
          <ul className="space-y-2">
            {card.actionableSteps.map((step, idx) => {
              const on = bleedChecks[idx];
              return (
                <li key={idx}>
                  <button
                    onClick={() => setBleedChecks((c) => c.map((v, i) => (i === idx ? !v : v)))}
                    aria-pressed={on}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-start text-xs leading-6 transition-colors ${
                      on ? 'border-red-500/50 bg-red-500/10 text-ink' : 'border-line bg-surface text-ink-2 hover:border-red-500/30'
                    }`}
                  >
                    <span
                      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        on ? 'border-red-500 bg-red-500 text-white' : 'border-line-strong'
                      }`}
                    >
                      {on && <Check className="w-3 h-3" />}
                    </span>
                    {step}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    if (tool === 'timeline') {
      return (
        <ol className="relative space-y-4 ps-7">
          <span className="absolute top-1 bottom-1 start-[7px] w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500" aria-hidden="true" />
          {card.actionableSteps.map((step, idx) => (
            <li key={idx} className="relative text-xs leading-6 text-ink-2">
              <span className="absolute -start-7 top-1.5 h-4 w-4 rounded-full border-2 border-amber-500 bg-surface-2" />
              {step}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <ol className="space-y-2.5">
        {card.actionableSteps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 text-xs leading-6 text-ink-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-black text-emerald-500">
              {num(idx + 1)}
            </span>
            {step.replace(/^[\d۰-۹]+\.\s*/, '')}
          </li>
        ))}
      </ol>
    );
  };

  return (
    <>
      <PageHeader icon={Layers} kicker={t('decisionCards.badge')} title={t('decisionCards.title')} subtitle={t('decisionCards.subtitle')} />

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((card, i) => {
            const cfg = CONFIG[card.id] || CONFIG['card-key-person'];
            const Icon = cfg.icon;
            const isFlipped = !!flipped[card.id];
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
                className="[perspective:1600px]"
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid [transform-style:preserve-3d]"
                >
                  {/* Front */}
                  <div
                    className={`[grid-area:1/1] [backface-visibility:hidden] relative flex flex-col overflow-hidden rounded-[2rem] border border-line bg-surface p-7 sm:p-8 ${
                      isFlipped ? 'pointer-events-none' : ''
                    }`}
                    aria-hidden={isFlipped}
                  >
                    <Icon className="absolute -bottom-8 -end-8 w-56 h-56 text-copper/[0.06]" />
                    <div className="relative flex items-center gap-3">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.tone} text-white shadow-lg`}>
                        <Icon className="w-7 h-7" />
                      </span>
                      <span className="rounded-full border border-line px-3 py-1 text-[11px] font-bold text-ink-3">{card.categoryLabel}</span>
                    </div>
                    <h3 className="relative mt-7 text-2xl font-black leading-9 text-ink">{card.title}</h3>
                    <p className="relative mt-2 text-sm font-bold text-copper-hi">{card.subtitle}</p>
                    <p className="relative mt-5 text-sm sm:text-base leading-8 text-ink-2">{card.frontSummary}</p>
                    <ul className="relative mt-6 mb-auto space-y-2 border-t border-line pt-5" aria-hidden="true">
                      {card.actionableSteps.slice(0, 4).map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-ink-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-[10px] font-black">
                            {num(idx + 1)}
                          </span>
                          <span className="line-clamp-1 blur-[2.5px] select-none">{s.replace(/^[\d۰-۹]+\.\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => toggle(card.id)}
                      className="relative mt-7 inline-flex w-fit items-center gap-2 rounded-2xl border border-copper/40 bg-copper/10 px-5 py-3 text-sm font-bold text-copper-hi transition-colors hover:bg-copper/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('decisionCards.viewChecklistBtn')}
                    </button>
                  </div>

                  {/* Back */}
                  <div
                    className={`[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] relative flex flex-col rounded-[2rem] border border-copper/40 bg-surface-2 p-6 sm:p-7 ${
                      isFlipped ? '' : 'pointer-events-none'
                    }`}
                    aria-hidden={!isFlipped}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="flex items-start gap-2 text-sm font-black leading-6 text-ink">
                        <Sparkles className="mt-1 w-4 h-4 shrink-0 text-copper-hi" />
                        {card.backProtocol}
                      </h4>
                      <button
                        onClick={() => toggle(card.id)}
                        aria-label={t('decisionCards.closeProtocolBtn')}
                        title={t('decisionCards.closeProtocolBtn')}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 hover:text-copper-hi hover:border-copper/50"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-5 flex-1">{renderTool(card, cfg.tool)}</div>
                    {cfg.tool === 'cost_calc' && (
                      <ul className="mt-4 space-y-1.5">
                        {card.actionableSteps.map((s, idx) => (
                          <li key={idx} className="text-[11px] leading-5 text-ink-3">
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs text-ink-3">{t('ui.cards.hint', { pct: pct(220) })}</p>
      </Container>
    </>
  );
};
