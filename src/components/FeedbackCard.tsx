import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { pickText, UI_COPY, type Language } from '../game/i18n';
import { REAGENTS } from '../game/metals';
import type { QuestionCard } from '../game/engine';
import { MetalArtwork } from './MetalArtwork';

interface FeedbackCardProps {
  card: QuestionCard;
  lang: Language;
  chosenReacts: boolean;
  isCorrect: boolean;
  pointsEarned: number;
  isLastCard: boolean;
  livesRemaining: number;
  onNext: () => void;
}

const SWIPE_THRESHOLD_PX = 72;
const AXIS_LOCK_PX = 10;

export function FeedbackCard({
  card,
  lang,
  chosenReacts,
  isCorrect,
  pointsEarned,
  isLastCard,
  livesRemaining,
  onNext,
}: FeedbackCardProps) {
  const { metal, reagent } = card;
  const reagentMeta = REAGENTS[reagent];
  const reaction = metal.reactions[reagent];
  const copy = UI_COPY[lang];

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const axisLockedRef = useRef<'horizontal' | 'vertical' | null>(null);

  const nextLabel =
    livesRemaining <= 0
      ? copy.viewSummaryBtn
      : isLastCard
        ? copy.finishRunBtn
        : copy.nextCardBtn;

  const swipeBadgeText =
    livesRemaining <= 0 || isLastCard
      ? copy.swipeSummaryBadge
      : copy.swipeNextBadge;

  const resetGesture = () => {
    setIsDragging(false);
    setDragX(0);
    startXRef.current = null;
    startYRef.current = null;
    pointerIdRef.current = null;
    axisLockedRef.current = null;
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    pointerIdRef.current = e.pointerId;
    axisLockedRef.current = null;
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (
      startXRef.current === null ||
      startYRef.current === null ||
      pointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (axisLockedRef.current === null) {
      if (Math.abs(dy) > AXIS_LOCK_PX && Math.abs(dy) >= Math.abs(dx)) {
        axisLockedRef.current = 'vertical';
        return;
      }
      if (Math.abs(dx) > AXIS_LOCK_PX && Math.abs(dx) > Math.abs(dy)) {
        axisLockedRef.current = 'horizontal';
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      } else {
        return;
      }
    }

    if (axisLockedRef.current === 'horizontal') {
      setDragX(Math.max(-200, Math.min(200, dx)));
    }
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const finalDx = axisLockedRef.current === 'horizontal' ? dragX : 0;
    resetGesture();

    if (Math.abs(finalDx) >= SWIPE_THRESHOLD_PX) {
      onNext();
    }
  };

  const swipeDirection: 'left' | 'right' | null =
    dragX < -20 ? 'left' : dragX > 20 ? 'right' : null;
  const intentStrength = Math.min(1, Math.abs(dragX) / SWIPE_THRESHOLD_PX);
  const rotationDeg = dragX * 0.035;

  const chosenLabel = chosenReacts ? copy.reactsBtn : copy.noReactionBtn;

  return (
    <div
      data-testid="feedback-card"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={{
        transform: `translate3d(${dragX}px, ${Math.abs(dragX) * -0.03}px, 0) rotate(${rotationDeg}deg)`,
        transition: isDragging
          ? 'none'
          : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        touchAction: 'pan-y',
      }}
      className="relative w-full max-w-[420px] mx-auto bg-white rounded-3xl shadow-[0_14px_34px_-10px_rgba(15,23,42,0.16)] border border-slate-200/90 overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Directional swipe-to-advance overlay badge */}
      {swipeDirection && (
        <div
          style={{ opacity: Math.max(0.3, intentStrength) }}
          className={`pointer-events-none absolute top-14 z-20 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs tracking-wide shadow-md ${
            swipeDirection === 'left'
              ? 'right-4 rotate-6'
              : 'left-4 -rotate-6'
          }`}
        >
          {swipeDirection === 'left'
            ? `← ${swipeBadgeText}`
            : `${swipeBadgeText} →`}
        </div>
      )}

      {/* Result status banner */}
      <div
        className={`px-5 py-3.5 flex items-center justify-between gap-3 ${
          isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          )}
          <span className="font-bold text-sm sm:text-base truncate">
            {isCorrect
              ? copy.correctBanner
              : `${copy.incorrectBannerPrefix} ${chosenLabel}`}
          </span>
        </div>
        <span className="font-mono-code text-xs sm:text-sm font-bold tabular-nums shrink-0">
          {isCorrect ? `+${pointsEarned} ${copy.ptsUnit}` : copy.minusLife}
        </span>
      </div>

      {/* Compact metal preview + reagent verdict */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-4 border-b border-slate-100">
        <div
          className="w-24 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${metal.palette.backdropTop} 0%, ${metal.palette.backdropBottom} 100%)`,
          }}
        >
          <MetalArtwork
            metal={metal}
            reagent={reagent}
            showReactionBubbles
            size="sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-xl font-extrabold text-slate-900">
              {pickText(metal.name, lang)}
            </h3>
            <span className="font-mono-code text-sm font-bold text-slate-600">
              {metal.symbol}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              · {pickText(reagentMeta.shortLabel, lang)}
            </span>
          </div>
          <p
            className={`mt-1 text-sm font-bold leading-snug ${
              reaction.reacts ? 'text-orange-600' : 'text-sky-600'
            }`}
          >
            {pickText(reaction.verdictLabel, lang)}
          </p>
        </div>
      </div>

      {/* Chemical & Ionic Equations + HKDSE Explanation */}
      <div className="px-5 py-4 space-y-3 text-sm">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 space-y-1.5">
          <div>
            <span className="block text-[11px] font-semibold text-slate-500">
              {copy.chemicalEquationLabel}
            </span>
            <span className="font-mono-code text-xs sm:text-[13px] font-semibold text-slate-900 break-words">
              {pickText(reaction.chemicalEquation, lang)}
            </span>
          </div>
          {reaction.reacts && reaction.ionicEquation && (
            <div className="pt-1 border-t border-slate-200/70">
              <span className="block text-[11px] font-semibold text-slate-500">
                {copy.ionicEquationLabel}
              </span>
              <span className="font-mono-code text-xs sm:text-[13px] font-medium text-slate-700 break-words">
                {pickText(reaction.ionicEquation, lang)}
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-800 mb-0.5">
            {copy.observationLabel}
          </span>
          <p className="text-slate-600 leading-relaxed text-[13px]">
            {pickText(reaction.observations, lang)}
          </p>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-800 mb-0.5">
            {copy.explanationLabel}
          </span>
          <p className="text-slate-700 leading-relaxed text-[13px]">
            {pickText(reaction.hkdseExplanation, lang)}
          </p>
        </div>
      </div>

      {/* Primary Thumb-Zone Next CTA + Swipe Hint */}
      <div className="px-5 pb-4 pt-1 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="text-[11px] font-medium text-slate-400">
          {copy.swipeHintFeedback}
        </span>
      </div>
    </div>
  );
}
