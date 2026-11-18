import { RotateCcw, Trophy, X } from 'lucide-react';
import { pickText, UI_COPY, type Language } from '../game/i18n';
import { getMetalById, REAGENTS } from '../game/metals';
import {
  computeAccuracyPercent,
  type GameState,
  type ReagentSelection,
} from '../game/engine';
import { ReactivitySeriesPanel } from './ReactivitySeriesPanel';

interface PauseModalProps {
  lang: Language;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
  onOpenReference: () => void;
}

export function PauseModal({
  lang,
  onResume,
  onRestart,
  onReturnTitle,
  onOpenReference,
}: PauseModalProps) {
  const copy = UI_COPY[lang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="pause-title" className="text-xl font-extrabold text-slate-900">
            {copy.pauseTitle}
          </h2>
          <button
            type="button"
            onClick={onResume}
            aria-label={copy.ariaResume}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full min-h-[48px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer"
          >
            {copy.resumeBtn}
          </button>
          <button
            type="button"
            onClick={onOpenReference}
            className="w-full min-h-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
          >
            {copy.reactivityGuideBtn}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full min-h-[44px] rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
          >
            {copy.restartBtn}
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="w-full min-h-[44px] rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm cursor-pointer"
          >
            {copy.changeModeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

interface GameOverModalProps {
  state: GameState;
  lang: Language;
  onPlayAgain: () => void;
  onReturnTitle: () => void;
}

export function GameOverModal({
  state,
  lang,
  onPlayAgain,
  onReturnTitle,
}: GameOverModalProps) {
  const copy = UI_COPY[lang];
  const accuracy = computeAccuracyPercent(state.history);
  const missed = state.history.filter((h) => !h.isCorrect);
  const isVictory = state.outcome === 'victory';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
      className="fixed inset-0 z-50 bg-slate-900/55 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[92dvh] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isVictory
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Trophy className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="summary-title"
              className="text-xl font-extrabold text-slate-900"
            >
              {isVictory ? copy.victoryTitle : copy.defeatTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {isVictory
                ? copy.victorySubtitle
                : `${copy.defeatSubtitlePrefix} ${state.history.length} ${copy.defeatSubtitleMiddle} ${state.deck.length} ${copy.defeatSubtitleSuffix}`}
            </p>
          </div>
        </div>

        {/* Summary KPI Tiles */}
        <div className="px-6 py-4 grid grid-cols-3 gap-2.5 bg-slate-50 border-b border-slate-100">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center">
            <span className="block text-[11px] font-semibold text-slate-500">
              {copy.scoreLabel}
            </span>
            <span className="font-mono-code text-lg font-extrabold text-slate-900 tabular-nums">
              {state.score}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center">
            <span className="block text-[11px] font-semibold text-slate-500">
              {copy.accuracyLabel}
            </span>
            <span className="font-mono-code text-lg font-extrabold text-slate-900 tabular-nums">
              {accuracy}%
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 text-center">
            <span className="block text-[11px] font-semibold text-slate-500">
              {copy.bestStreakLabel}
            </span>
            <span className="font-mono-code text-lg font-extrabold text-slate-900 tabular-nums">
              {state.bestStreak}
            </span>
          </div>
        </div>

        {/* Scrollable Review Section */}
        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-3">
          {missed.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900 font-medium">
              {copy.perfectRunMsg}
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-bold text-slate-700 mb-2">
                {copy.reviewHeading} ({missed.length})
              </h3>
              <ul className="space-y-2.5">
                {missed.map((item) => {
                  const metal = getMetalById(item.metalId);
                  if (!metal) return null;
                  const reaction = metal.reactions[item.reagent];
                  const reagentMeta = REAGENTS[item.reagent];
                  return (
                    <li
                      key={item.cardId}
                      className="rounded-2xl border border-slate-200 p-3 bg-white space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {pickText(metal.name, lang)}{' '}
                          <span className="font-mono-code text-slate-600">
                            {metal.symbol}
                          </span>{' '}
                          <span className="text-xs font-medium text-slate-500">
                            · {pickText(reagentMeta.shortLabel, lang)}
                          </span>
                        </span>
                        <span
                          className={`text-xs font-bold whitespace-nowrap ${
                            reaction.reacts ? 'text-orange-600' : 'text-sky-600'
                          }`}
                        >
                          {reaction.reacts ? copy.reactsBtn : copy.noReactionBtn}
                        </span>
                      </div>
                      <p className="font-mono-code text-xs text-slate-700">
                        {pickText(reaction.chemicalEquation, lang)}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pickText(reaction.hkdseExplanation, lang)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="flex-1 min-h-[48px] px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{copy.playAgainBtn}</span>
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="min-h-[48px] px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
          >
            {copy.substanceMenuBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReferenceSheetModalProps {
  reagentSelection: ReagentSelection;
  history: GameState['history'];
  lang: Language;
  revealAll: boolean;
  onClose: () => void;
}

export function ReferenceSheetModal({
  reagentSelection,
  history,
  lang,
  revealAll,
  onClose,
}: ReferenceSheetModalProps) {
  const copy = UI_COPY[lang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.referenceModalTitle}
      className="fixed inset-0 z-50 bg-slate-900/55 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="w-full max-w-md bg-[#f4f6f9] rounded-t-3xl sm:rounded-3xl max-h-[88dvh] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900">
            {copy.referenceModalTitle}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.ariaCloseRef}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <ReactivitySeriesPanel
            reagentSelection={reagentSelection}
            history={history}
            lang={lang}
            revealAll={revealAll}
          />
        </div>
      </div>
    </div>
  );
}
