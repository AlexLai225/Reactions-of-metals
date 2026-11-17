import { BookOpen, Play } from 'lucide-react';
import type { GameMode, ReagentSelection } from '../game/engine';

interface TitleScreenProps {
  reagentSelection: ReagentSelection;
  mode: GameMode;
  onSelectReagent: (selection: ReagentSelection) => void;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
  onOpenReference: () => void;
}

const REAGENT_OPTIONS: {
  id: ReagentSelection;
  label: string;
  formula: string;
}[] = [
  { id: 'hcl', label: 'Dilute HCl', formula: 'HCl(aq)' },
  { id: 'water', label: 'Cold Water', formula: 'H₂O(l)' },
  { id: 'steam', label: 'Steam', formula: 'H₂O(g)' },
  { id: 'oxygen', label: 'Oxygen', formula: 'O₂(g)' },
  { id: 'mixed', label: 'Mixed Revision', formula: 'All 4 Substances' },
];

const MODES: { id: GameMode; label: string; detail: string }[] = [
  { id: 'all13', label: 'All 13 Metals', detail: 'Full HKDSE set (K to Pt)' },
  { id: 'traps', label: 'Exam Traps', detail: 'High-frequency DSE traps' },
  { id: 'blitz7', label: 'Quick Blitz', detail: '7 random cards' },
];

export function TitleScreen({
  reagentSelection,
  mode,
  onSelectReagent,
  onSelectMode,
  onStart,
  onOpenReference,
}: TitleScreenProps) {
  return (
    <main className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-5 bg-[#f4f6f9]">
      <div className="w-full max-w-[460px] flex flex-col items-center text-center">
        {/* Bespoke SVG Title Lockup & Specimen Beaker Emblem */}
        <div className="mb-4 flex flex-col items-center">
          <svg
            viewBox="0 0 180 104"
            className="w-36 h-20 mb-1.5"
            aria-hidden="true"
          >
            <g transform="translate(12, 12)">
              <polygon
                points="14,34 44,44 74,34 80,54 64,74 24,74 8,54"
                fill="#94a3b8"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <polygon
                points="14,34 44,22 74,34 44,44"
                fill="#e2e8f0"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <line
                x1="23"
                y1="32"
                x2="39"
                y2="27"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            <text
              x="92"
              y="62"
              textAnchor="middle"
              fontSize="22"
              fontWeight="800"
              fill="#64748b"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              ×
            </text>

            <g transform="translate(106, 8)">
              <rect x="14" y="34" width="38" height="36" rx="2" fill="#bae6fd" />
              <line x1="14" y1="34" x2="52" y2="34" stroke="#0284c7" strokeWidth="2" />
              <circle cx="28" cy="48" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="38" cy="42" r="2.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="33" cy="24" r="3.2" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.8" />
              <circle cx="42" cy="14" r="2.4" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.8" />
              <path
                d="M11 16 H14 V68 C14 69.7 15.3 71 17 71 H49 C50.7 71 52 69.7 52 68 V16 H55"
                fill="none"
                stroke="#1e293b"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 text-balance">
            HKDSE Metal Reactions
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-sm leading-snug">
            Test all 13 metals with dilute HCl, cold water, steam, and oxygen with instant HKDSE explanations.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_12px_30px_-10px_rgba(15,23,42,0.12)] border border-slate-200/80 p-4 sm:p-5 space-y-4">
          {/* Substance / Reagent Selector */}
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-500 mb-2">
              1. Choose Substance
            </span>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Substance to test"
            >
              {REAGENT_OPTIONS.map((opt) => {
                const active = reagentSelection === opt.id;
                const isMixed = opt.id === 'mixed';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectReagent(opt.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-2xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isMixed ? 'col-span-2' : ''
                    } ${
                      active
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                      {opt.label}
                    </span>
                    <span
                      className={`font-mono-code text-[11px] truncate ${
                        active ? 'text-orange-100' : 'text-slate-500'
                      }`}
                    >
                      {opt.formula}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deck Mode Selector */}
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-500 mb-2">
              2. Choose Deck Mode
            </span>
            <div
              className="grid grid-cols-1 gap-1.5"
              role="radiogroup"
              aria-label="Deck Mode"
            >
              {MODES.map((item) => {
                const active = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectMode(item.id)}
                    className={`w-full min-h-[44px] px-3.5 py-2 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs truncate ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {item.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <button
              type="button"
              data-start="true"
              onClick={onStart}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Start Swipe Practice</span>
            </button>

            <button
              type="button"
              onClick={onOpenReference}
              className="w-full min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>HKDSE Reactivity Reference Table</span>
            </button>
          </div>
        </div>

        <p className="mt-3.5 text-xs font-medium text-slate-500">
          Swipe Left or ← Reacts · Swipe Right or → No Reaction · Enter/Space Start
        </p>
      </div>
    </main>
  );
}
