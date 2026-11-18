import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { pickText, UI_COPY, type Language } from '../game/i18n';
import { REAGENTS } from '../game/metals';
import type { QuestionCard } from '../game/engine';
import { MetalArtwork } from './MetalArtwork';

interface SwipeCardProps {
  card: QuestionCard;
  lang: Language;
  onChoose: (reacts: boolean) => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD_PX = 76;

export function SwipeCard({
  card,
  lang,
  onChoose,
  disabled = false,
}: SwipeCardProps) {
  const { metal, reagent } = card;
  const reagentMeta = REAGENTS[reagent];
  const copy = UI_COPY[lang];

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    startXRef.current = e.clientX;
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      startXRef.current === null ||
      pointerIdRef.current !== e.pointerId
    ) {
      return;
    }
    const dx = e.clientX - startXRef.current;
    setDragX(Math.max(-180, Math.min(180, dx)));
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const finalDx = dragX;
    setIsDragging(false);
    startXRef.current = null;
    pointerIdRef.current = null;
    setDragX(0);

    if (finalDx <= -SWIPE_THRESHOLD_PX) {
      onChoose(true);
    } else if (finalDx >= SWIPE_THRESHOLD_PX) {
      onChoose(false);
    }
  };

  const swipeIntent: 'reacts' | 'no-reaction' | null =
    dragX < -24 ? 'reacts' : dragX > 24 ? 'no-reaction' : null;
  const intentStrength = Math.min(1, Math.abs(dragX) / SWIPE_THRESHOLD_PX);
  const rotationDeg = dragX * 0.045;

  return (
    <div
      data-testid="swipe-card"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={{
        transform: `translate3d(${dragX}px, ${Math.abs(dragX) * -0.04}px, 0) rotate(${rotationDeg}deg)`,
        transition: isDragging
          ? 'none'
          : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        touchAction: 'none',
      }}
      className={`relative w-full max-w-[360px] mx-auto bg-white rounded-3xl shadow-[0_14px_34px_-10px_rgba(15,23,42,0.16)] border border-slate-200/80 overflow-hidden select-none ${
        disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Top visual specimen chamber */}
      <div
        className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${metal.palette.backdropTop} 0%, ${metal.palette.backdropBottom} 100%)`,
        }}
      >
        <MetalArtwork metal={metal} reagent={reagent} />

        {/* Directional swipe stamp overlay */}
        {swipeIntent === 'reacts' && (
          <div
            style={{ opacity: Math.max(0.25, intentStrength) }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-orange-500 text-white font-bold text-xs tracking-wide shadow-sm rotate-6"
          >
            {pickText(reagentMeta.positiveActionHint, lang)}
          </div>
        )}
        {swipeIntent === 'no-reaction' && (
          <div
            style={{ opacity: Math.max(0.25, intentStrength) }}
            className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-sky-500 text-white font-bold text-xs tracking-wide shadow-sm -rotate-6"
          >
            {copy.noReactionStamp}
          </div>
        )}
      </div>

      {/* Bottom specimen metadata & prompt */}
      <div className="px-5 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 leading-tight">
            {pickText(metal.name, lang)}{' '}
            <span className="font-mono-code text-slate-700 font-bold">
              {metal.symbol}
            </span>
          </h2>
          <span className="font-mono-code text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap shrink-0">
            {copy.atomicNoPrefix} {metal.atomicNumber}
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-snug min-h-[2.5rem]">
          {pickText(metal.cardHint, lang)}
        </p>

        <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <span className="text-sm font-bold text-slate-900">
            {pickText(reagentMeta.questionPrompt, lang)}
          </span>
          <span className="font-mono-code text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
            {pickText(reagentMeta.formula, lang)}
          </span>
        </div>

        {/* Subtle swipe bar */}
        <div className="pt-0.5 flex flex-col items-center gap-1.5">
          <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden relative">
            <div
              className="absolute top-0 h-full rounded-full transition-colors duration-150"
              style={{
                width: '32%',
                left: '34%',
                transform: `translateX(${(dragX / SWIPE_THRESHOLD_PX) * 106}%)`,
                backgroundColor:
                  swipeIntent === 'reacts'
                    ? '#f97316'
                    : swipeIntent === 'no-reaction'
                      ? '#0ea5e9'
                      : '#94a3b8',
              }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {copy.swipeHintCard}
          </span>
        </div>
      </div>
    </div>
  );
}
