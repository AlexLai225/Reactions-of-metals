import { useCallback, useEffect, useState } from 'react';
import { BookOpen, Pause, Volume2, VolumeX } from 'lucide-react';
import {
  getInitialLanguage,
  pickText,
  saveLanguage,
  UI_COPY,
  type Language,
} from './game/i18n';
import { REAGENTS } from './game/metals';
import {
  advanceRound,
  createInitialState,
  submitChoice,
  type GameMode,
  type GameState,
  type ReagentSelection,
} from './game/engine';
import { playSoundEffect } from './game/audio';
import { BeakerActionIcon, HeartIcon } from './components/MetalArtwork';
import { SwipeCard } from './components/SwipeCard';
import { FeedbackCard } from './components/FeedbackCard';
import { ReactivitySeriesPanel } from './components/ReactivitySeriesPanel';
import { TitleScreen } from './components/TitleScreen';
import {
  GameOverModal,
  PauseModal,
  ReferenceSheetModal,
} from './components/GameModals';

function getInitialAutoStart(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('autostart') === '1';
}

function getHeaderTitle(selection: ReagentSelection, lang: Language): string {
  const copy = UI_COPY[lang];
  switch (selection) {
    case 'hcl':
      return copy.headerHcl;
    case 'water':
      return copy.headerWater;
    case 'steam':
      return copy.headerSteam;
    case 'oxygen':
      return copy.headerOxygen;
    case 'mixed':
      return copy.headerMixedTitle;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => getInitialLanguage());
  const [state, setState] = useState<GameState>(() =>
    createInitialState('hcl', 'all14', getInitialAutoStart())
  );
  const [muted, setMuted] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const copy = UI_COPY[lang];

  useEffect(() => {
    document.body.dataset.state = state.status;
  }, [state.status]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh-HK' ? 'zh-Hant-HK' : 'en';
  }, [lang]);

  const blurFocusedElement = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleToggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next: Language = prev === 'en' ? 'zh-HK' : 'en';
      saveLanguage(next);
      return next;
    });
  }, []);

  const handleSelectReagent = useCallback((reagentSelection: ReagentSelection) => {
    setState((prev) => ({
      ...prev,
      reagentSelection,
    }));
  }, []);

  const handleSelectMode = useCallback((mode: GameMode) => {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  const handleStart = useCallback(() => {
    blurFocusedElement();
    setShowReference(false);
    setState((prev) =>
      createInitialState(prev.reagentSelection, prev.mode, true)
    );
    playSoundEffect('swipe', muted);
  }, [muted]);

  const handleChoose = useCallback(
    (reacts: boolean) => {
      setState((prev) => {
        if (prev.status !== 'playing' || prev.lastFeedback !== null) {
          return prev;
        }
        const next = submitChoice(prev, reacts);
        if (next.lastFeedback) {
          playSoundEffect(
            next.lastFeedback.isCorrect ? 'correct' : 'wrong',
            muted
          );
        }
        return next;
      });
    },
    [muted]
  );

  const handleNext = useCallback(() => {
    blurFocusedElement();
    setState((prev) => {
      const next = advanceRound(prev);
      if (next.status === 'gameover') {
        playSoundEffect(
          next.outcome === 'victory' ? 'victory' : 'defeat',
          muted
        );
      } else {
        playSoundEffect('swipe', muted);
      }
      return next;
    });
  }, [muted]);

  const handlePause = useCallback(() => {
    setState((prev) =>
      prev.status === 'playing' ? { ...prev, status: 'paused' } : prev
    );
  }, []);

  const handleResume = useCallback(() => {
    setState((prev) =>
      prev.status === 'paused' ? { ...prev, status: 'playing' } : prev
    );
  }, []);

  const handleRestart = useCallback(() => {
    blurFocusedElement();
    setShowReference(false);
    setState((prev) =>
      createInitialState(prev.reagentSelection, prev.mode, true)
    );
  }, []);

  const handleReturnTitle = useCallback(() => {
    blurFocusedElement();
    setShowReference(false);
    setState((prev) =>
      createInitialState(prev.reagentSelection, prev.mode, false)
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        setMuted((prev) => !prev);
        return;
      }

      if (showReference) {
        if (e.key === 'Escape') {
          setShowReference(false);
        }
        return;
      }

      if (state.status === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStart();
        }
        return;
      }

      if (state.status === 'paused') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          handleResume();
        }
        return;
      }

      if (state.status === 'playing') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          handlePause();
          return;
        }

        if (state.lastFeedback === null) {
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            handleChoose(true);
          } else if (
            e.key === 'ArrowRight' ||
            e.key === 'd' ||
            e.key === 'D'
          ) {
            e.preventDefault();
            handleChoose(false);
          }
        } else if (
          e.key === 'Enter' ||
          e.key === ' ' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'a' ||
          e.key === 'A' ||
          e.key === 'd' ||
          e.key === 'D'
        ) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    state.status,
    state.lastFeedback,
    showReference,
    handleStart,
    handleResume,
    handlePause,
    handleChoose,
    handleNext,
  ]);

  if (state.status === 'title') {
    return (
      <>
        <TitleScreen
          reagentSelection={state.reagentSelection}
          mode={state.mode}
          lang={lang}
          onToggleLanguage={handleToggleLanguage}
          onSelectReagent={handleSelectReagent}
          onSelectMode={handleSelectMode}
          onStart={handleStart}
          onOpenReference={() => setShowReference(true)}
        />
        {showReference && (
          <ReferenceSheetModal
            reagentSelection={state.reagentSelection}
            history={state.history}
            lang={lang}
            revealAll
            onClose={() => setShowReference(false)}
          />
        )}
      </>
    );
  }

  const currentCard = state.deck[state.currentIndex];
  const isLastCard = state.currentIndex >= state.deck.length - 1;
  const activeReagentLabel =
    state.reagentSelection === 'mixed'
      ? currentCard
        ? pickText(REAGENTS[currentCard.reagent].shortLabel, lang)
        : copy.substanceMixed
      : pickText(REAGENTS[state.reagentSelection].shortLabel, lang);

  return (
    <div className="min-h-[100dvh] w-full overflow-x-clip flex flex-col bg-[#f4f6f9] text-slate-900">
      {/* Compact Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-2.5 sm:px-6 h-13 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span
            aria-hidden="true"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-[11px] sm:text-xs font-extrabold text-amber-900 shrink-0"
          >
            M
          </span>
          <span className="font-extrabold text-xs sm:text-base tracking-tight text-slate-900 truncate">
            {getHeaderTitle(state.reagentSelection, lang)}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wide whitespace-nowrap shrink-0">
            HKDSE
          </span>
        </div>

        <div className="flex items-center gap-0 sm:gap-1 shrink-0">
          <div
            className="flex items-center gap-0.5 sm:gap-1 mr-0.5 sm:mr-2"
            aria-label={copy.ariaLivesRemaining(state.lives, state.maxLives)}
          >
            {Array.from({ length: state.maxLives }).map((_, idx) => (
              <HeartIcon key={idx} filled={idx < state.lives} />
            ))}
          </div>

          <button
            type="button"
            data-testid="lang-toggle-topbar"
            onClick={(e) => {
              e.currentTarget.blur();
              handleToggleLanguage();
            }}
            aria-label={copy.toggleLangAria}
            className="min-w-[44px] min-h-[44px] px-2 rounded-xl flex items-center justify-center text-xs font-extrabold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {copy.toggleLangLabel}
          </button>

          <button
            type="button"
            onClick={() => setShowReference(true)}
            aria-label={copy.ariaOpenLog}
            className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              setMuted((prev) => !prev);
            }}
            aria-label={muted ? copy.ariaUnmute : copy.ariaMute}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              handlePause();
            }}
            aria-label={copy.ariaPause}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Segmented Progress Strip + Status Counters */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-1">
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-valuenow={state.history.length}
          aria-valuemin={0}
          aria-valuemax={state.deck.length}
          aria-label={copy.appTitle}
        >
          {state.deck.map((item, idx) => {
            const record = state.history[idx];
            let colorClass = 'bg-slate-200';
            if (record) {
              colorClass = record.isCorrect
                ? 'bg-emerald-500'
                : 'bg-rose-500';
            } else if (idx === state.currentIndex) {
              colorClass = 'bg-slate-800';
            }
            return (
              <div
                key={item.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${colorClass}`}
              />
            );
          })}
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-slate-500 tabular-nums">
          <span>
            {activeReagentLabel} · {Math.min(state.currentIndex + 1, state.deck.length)} /{' '}
            {state.deck.length}
          </span>
          <div className="flex items-center gap-2">
            <span>
              {copy.scoreLabel} {state.score}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {copy.streakLabel} {state.streak}
            </span>
          </div>
        </div>
      </div>

      {/* Main Play Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-5 sm:py-6 flex flex-col lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-center justify-evenly lg:justify-center">
        <section className="flex flex-col items-center justify-center w-full">
          {state.lastFeedback ? (
            <FeedbackCard
              card={state.lastFeedback.card}
              lang={lang}
              chosenReacts={state.lastFeedback.chosenReacts}
              isCorrect={state.lastFeedback.isCorrect}
              pointsEarned={state.lastFeedback.pointsEarned}
              isLastCard={isLastCard}
              livesRemaining={state.lives}
              onNext={handleNext}
            />
          ) : (
            currentCard && (
              <>
                <SwipeCard
                  card={currentCard}
                  lang={lang}
                  onChoose={handleChoose}
                />

                <div className="mt-5 sm:mt-6 flex items-center justify-center gap-12 sm:gap-16">
                  <button
                    type="button"
                    onClick={() => handleChoose(true)}
                    aria-label={copy.ariaReactsWith(
                      pickText(REAGENTS[currentCard.reagent].shortLabel, lang)
                    )}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer focus-visible:outline-none"
                  >
                    <span className="w-[74px] h-[74px] sm:w-20 sm:h-20 rounded-full bg-white border-[3px] border-orange-500 shadow-[0_8px_20px_-6px_rgba(249,115,22,0.35)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-orange-300 transition-transform">
                      <BeakerActionIcon
                        variant="reacts"
                        reagent={currentCard.reagent}
                      />
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-orange-600">
                      {copy.reactsBtn}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChoose(false)}
                    aria-label={copy.ariaNoReactionWith(
                      pickText(REAGENTS[currentCard.reagent].shortLabel, lang)
                    )}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer focus-visible:outline-none"
                  >
                    <span className="w-[74px] h-[74px] sm:w-20 sm:h-20 rounded-full bg-white border-[3px] border-sky-500 shadow-[0_8px_20px_-6px_rgba(14,165,233,0.35)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-sky-300 transition-transform">
                      <BeakerActionIcon
                        variant="no-reaction"
                        reagent={currentCard.reagent}
                      />
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-sky-600">
                      {copy.noReactionBtn}
                    </span>
                  </button>
                </div>

                <p className="hidden lg:block mt-4 text-xs font-medium text-slate-400">
                  {copy.keyboardHint}
                </p>
              </>
            )
          )}
        </section>

        <aside className="hidden lg:block">
          <ReactivitySeriesPanel
            reagentSelection={state.reagentSelection}
            history={state.history}
            lang={lang}
          />
        </aside>
      </main>

      {state.status === 'paused' && (
        <PauseModal
          lang={lang}
          onResume={handleResume}
          onRestart={handleRestart}
          onReturnTitle={handleReturnTitle}
          onOpenReference={() => setShowReference(true)}
        />
      )}

      {state.status === 'gameover' && (
        <GameOverModal
          state={state}
          lang={lang}
          onPlayAgain={handleRestart}
          onReturnTitle={handleReturnTitle}
        />
      )}

      {showReference && (
        <ReferenceSheetModal
          reagentSelection={state.reagentSelection}
          history={state.history}
          lang={lang}
          revealAll={false}
          onClose={() => setShowReference(false)}
        />
      )}
    </div>
  );
}
