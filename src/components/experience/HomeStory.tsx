import React from 'react';
import { ActiveTab, ThemeMode } from '../../types';
import { DnaHelix } from './DnaHelix';
import { MirrorTest } from './MirrorTest';
import { ProofBand } from './ProofBand';
import { AuthorSpotlight } from './AuthorSpotlight';
import { InstinctGauge } from './InstinctGauge';

/**
 * The homepage narrative between the hero and the pricing cards:
 * 97% / 3% → the three genes → the mirror test → proof → the author → the quiz.
 */
export const HomeStory: React.FC<{ onTabChange: (tab: ActiveTab) => void; theme: ThemeMode }> = ({
  onTabChange,
  theme,
}) => (
  <div className="relative bg-[#0A0A0B]">
    <DnaHelix />
    <MirrorTest />
    <ProofBand onTabChange={onTabChange} />
    <AuthorSpotlight onTabChange={onTabChange} />
    <InstinctGauge onTabChange={onTabChange} />
    {/* Blend into the themed page below */}
    <div
      aria-hidden="true"
      className={`h-24 bg-gradient-to-b from-[#0A0A0B] ${theme === 'light' ? 'to-[#FAF8F5]' : 'to-[#121314]'}`}
    />
  </div>
);
