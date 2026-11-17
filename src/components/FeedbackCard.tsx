import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { REAGENTS } from '../game/metals';
import type { QuestionCard } from '../game/engine';
import { MetalArtwork } from './MetalArtwork';

interface FeedbackCardProps {
  card: QuestionCard;
  chosenReacts: boolean;
  isCorrect: boolean;
  pointsEarned: number;
  isLastCard: boolean;
  livesRemaining: number;
  onNext: () => void;
}

export function FeedbackCard({
  card,
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

  const nextLabel =
    livesRemaining <= 0
      ? 'View Summary'
      : isLastCard
        ? 'Finish Run'
        : 'Next Card';

  return (
    <div
      data-testid="feedback-card"
      className="w-full max-w-[420px] mx-auto bg-white rounded-3xl shadow-[0_14px_34px_-10px_rgba(15,23,42,0.16)] border border-slate-200/90 overflow-hidden"
    >
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
              ? 'Correct!'
              : `Incorrect — You chose ${chosenReacts ? 'Reacts' : 'No Reaction'}`}
          </span>
        </div>
        <span className="font-mono-code text-xs sm:text-sm font-bold tabular-nums shrink-0">
          {isCorrect ? `+${pointsEarned} pts` : '-1 Life'}
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
              {metal.name}
            </h3>
            <span className="font-mono-code text-sm font-bold text-slate-600">
              {metal.symbol}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              · {reagentMeta.shortLabel}
            </span>
          </div>
          <p
            className={`mt-1 text-sm font-bold leading-snug ${
              reaction.reacts ? 'text-orange-600' : 'text-sky-600'
            }`}
          >
            {reaction.verdictLabel}
          </p>
        </div>
      </div>

      {/* Chemical Equations & HKDSE Explanation */}
      <div className="px-5 py-4 space-y-3 text-sm">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 space-y-1.5">
          <div>
            <span className="block text-[11px] font-semibold text-slate-500">
              Chemical Equation
            </span>
            <span className="font-mono-code text-xs sm:text-[13px] font-semibold text-slate-900 break-words">
              {reaction.chemicalEquation}
            </span>
          </div>
          {reaction.reacts && reaction.ionicEquation && (
            <div className="pt-1 border-t border-slate-200/70">
              <span className="block text-[11px] font-semibold text-slate-500">
                Ionic Equation
              </span>
              <span className="font-mono-code text-xs sm:text-[13px] font-medium text-slate-700 break-words">
                {reaction.ionicEquation}
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-800 mb-0.5">
            Observation
          </span>
          <p className="text-slate-600 leading-relaxed text-[13px]">
            {reaction.observations}
          </p>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-800 mb-0.5">
            HKDSE Curriculum Explanation
          </span>
          <p className="text-slate-700 leading-relaxed text-[13px]">
            {reaction.hkdseExplanation}
          </p>
        </div>
      </div>

      {/* Primary Thumb-Zone Next CTA */}
      <div className="px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
