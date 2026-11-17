import { useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  METALS,
  REAGENTS,
  REAGENT_ORDER,
  type ReagentId,
} from '../game/metals';
import type { AnswerRecord, ReagentSelection } from '../game/engine';

interface ReactivitySeriesPanelProps {
  reagentSelection: ReagentSelection;
  history: readonly AnswerRecord[];
  revealAll?: boolean;
}

export function ReactivitySeriesPanel({
  reagentSelection,
  history,
  revealAll = false,
}: ReactivitySeriesPanelProps) {
  const [viewFilter, setViewFilter] = useState<ReagentSelection>(
    reagentSelection
  );

  // When revealAll is false (live game sidebar), follow active reagentSelection;
  // when revealAll is true (Study Guide modal), let student switch tabs freely.
  const activeView = revealAll ? viewFilter : reagentSelection;

  if (activeView === 'mixed') {
    const answerByCombo = new Map(
      history.map((item) => [`${item.metalId}-${item.reagent}`, item])
    );

    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)] p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            HKDSE Reactivity Matrix
          </h3>
          <span className="text-xs text-slate-500 tabular-nums">
            {revealAll ? 'All 4 Substances' : `${history.length} Checked`}
          </span>
        </div>

        {revealAll && (
          <ReagentTabs value={activeView} onChange={setViewFilter} />
        )}

        <div className="mt-3">
          <div className="grid grid-cols-[1fr_42px_42px_42px_42px] gap-1 px-2 pb-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-100">
            <span>Metal</span>
            <span className="text-center">H₂O</span>
            <span className="text-center">Steam</span>
            <span className="text-center">HCl</span>
            <span className="text-center">O₂</span>
          </div>
          <ul className="divide-y divide-slate-50">
            {METALS.map((metal) => (
              <li
                key={metal.id}
                className="grid grid-cols-[1fr_42px_42px_42px_42px] gap-1 items-center py-1.5 px-2 text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono-code font-bold text-slate-800 w-5">
                    {metal.symbol}
                  </span>
                  <span className="text-slate-600 truncate text-[11px]">
                    {metal.name}
                  </span>
                </div>
                {(['water', 'steam', 'hcl', 'oxygen'] as ReagentId[]).map(
                  (r) => {
                    const record = answerByCombo.get(`${metal.id}-${r}`);
                    const unlocked = revealAll || Boolean(record);
                    const reacts = metal.reactions[r].reacts;
                    return (
                      <div key={r} className="flex justify-center">
                        {unlocked ? (
                          <span
                            aria-label={`${metal.name} with ${REAGENTS[r].shortLabel}: ${reacts ? 'Reacts' : 'No reaction'}`}
                            className={`font-bold text-[11px] ${
                              reacts ? 'text-orange-600' : 'text-sky-600'
                            }`}
                          >
                            {reacts ? '✓' : '×'}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono-code text-[11px]">
                            ·
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] text-slate-500">
            <span className="font-bold text-orange-600">✓ Reacts</span>
            <span aria-hidden="true"> · </span>
            <span className="font-bold text-sky-600">× No Reaction</span>
          </p>
        </div>
      </div>
    );
  }

  const reagentId = activeView;
  const reagentMeta = REAGENTS[reagentId];
  const recordMap = new Map(
    history
      .filter((item) => item.reagent === reagentId)
      .map((item) => [item.metalId, item])
  );

  const above = METALS.filter((m) => m.reactions[reagentId].reacts);
  const below = METALS.filter((m) => !m.reactions[reagentId].reacts);

  const renderRow = (metal: (typeof METALS)[number]) => {
    const record = recordMap.get(metal.id);
    const unlocked = revealAll || Boolean(record);
    const reaction = metal.reactions[reagentId];

    return (
      <li
        key={metal.id}
        className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg text-xs border border-transparent hover:bg-slate-50"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono-code text-[11px] text-slate-400 w-4 tabular-nums">
            {metal.reactivityRank}
          </span>
          <span className="font-mono-code font-bold text-slate-800 w-6">
            {metal.symbol}
          </span>
          <span className="font-medium text-slate-700 truncate">
            {metal.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unlocked ? (
            <span
              className={`font-semibold ${
                reaction.reacts ? 'text-orange-600' : 'text-sky-600'
              }`}
            >
              {reaction.shortStatus}
            </span>
          ) : (
            <span className="text-slate-400 font-mono-code">—</span>
          )}

          {record && (
            <span
              aria-label={
                record.isCorrect ? 'Answered correctly' : 'Answered incorrectly'
              }
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                record.isCorrect
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {record.isCorrect ? (
                <Check className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <X className="w-3 h-3" strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)] p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">
          HKDSE · {reagentMeta.shortLabel}
        </h3>
        <span className="text-xs text-slate-500 tabular-nums">
          {revealAll
            ? '13 Metals'
            : `${recordMap.size} / ${METALS.length} Logged`}
        </span>
      </div>

      {revealAll && (
        <ReagentTabs value={activeView} onChange={setViewFilter} />
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between px-2.5 pb-1 text-[11px] font-semibold text-orange-700">
          <span>{reagentMeta.boundaryTitleAbove}</span>
          <span>Most Reactive</span>
        </div>
        <ul className="space-y-0.5">{above.map(renderRow)}</ul>

        <div className="my-2 px-2.5 py-1.5 rounded-lg bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="font-mono-code">
            {reagentId === 'hcl' ? 'H' : '—'}
          </span>
          <span>{reagentMeta.boundaryLineLabel}</span>
        </div>

        <ul className="space-y-0.5">{below.map(renderRow)}</ul>
        <div className="flex items-center justify-between px-2.5 pt-1 text-[11px] font-semibold text-sky-700">
          <span>{reagentMeta.boundaryTitleBelow}</span>
          <span>Least Reactive</span>
        </div>
      </div>
    </div>
  );
}

function ReagentTabs({
  value,
  onChange,
}: {
  value: ReagentSelection;
  onChange: (next: ReagentSelection) => void;
}) {
  const options: { id: ReagentSelection; label: string }[] = [
    { id: 'mixed', label: 'All 4' },
    ...REAGENT_ORDER.map((id) => ({
      id,
      label:
        id === 'hcl'
          ? 'HCl'
          : id === 'water'
            ? 'H₂O'
            : id === 'steam'
              ? 'Steam'
              : 'O₂',
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter reactivity table by substance"
      className="mt-3 grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-[36px] px-1.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
