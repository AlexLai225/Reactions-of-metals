import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { pickText, UI_COPY, type Language } from '../game/i18n';
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
  lang: Language;
  revealAll?: boolean;
}

export function ReactivitySeriesPanel({
  reagentSelection,
  history,
  lang,
  revealAll = false,
}: ReactivitySeriesPanelProps) {
  const [viewFilter, setViewFilter] = useState<ReagentSelection>(
    reagentSelection
  );
  const copy = UI_COPY[lang];

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
            {copy.matrixTitle}
          </h3>
          <span className="text-xs text-slate-500 tabular-nums">
            {revealAll
              ? copy.all4SubstancesLabel
              : `${history.length} ${copy.checkedSuffix}`}
          </span>
        </div>

        {revealAll && (
          <ReagentTabs
            value={activeView}
            onChange={setViewFilter}
            lang={lang}
          />
        )}

        <div className="mt-3">
          <div className="grid grid-cols-[1fr_42px_42px_42px_42px] gap-1 px-2 pb-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-100">
            <span>{copy.metalCol}</span>
            <span className="text-center">{copy.waterCol}</span>
            <span className="text-center">{copy.steamCol}</span>
            <span className="text-center">{copy.hclCol}</span>
            <span className="text-center">{copy.oxygenCol}</span>
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
                    {pickText(metal.name, lang)}
                  </span>
                </div>
                {(['water', 'steam', 'hcl', 'oxygen'] as ReagentId[]).map(
                  (r) => {
                    const record = answerByCombo.get(`${metal.id}-${r}`);
                    const unlocked = revealAll || Boolean(record);
                    const reacts = metal.reactions[r].reacts;
                    const metalName = pickText(metal.name, lang);
                    const reagentName = pickText(REAGENTS[r].shortLabel, lang);
                    return (
                      <div key={r} className="flex justify-center">
                        {unlocked ? (
                          <span
                            aria-label={`${metalName} — ${
                              reacts
                                ? copy.ariaReactsWith(reagentName)
                                : copy.ariaNoReactionWith(reagentName)
                            }`}
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
            <span className="font-bold text-orange-600">
              {copy.matrixLegendReacts}
            </span>
            <span aria-hidden="true"> · </span>
            <span className="font-bold text-sky-600">
              {copy.matrixLegendNone}
            </span>
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
            {pickText(metal.name, lang)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unlocked ? (
            <span
              className={`font-semibold ${
                reaction.reacts ? 'text-orange-600' : 'text-sky-600'
              }`}
            >
              {pickText(reaction.shortStatus, lang)}
            </span>
          ) : (
            <span className="text-slate-400 font-mono-code">—</span>
          )}

          {record && (
            <span
              aria-label={
                record.isCorrect
                  ? copy.ariaAnsweredCorrect
                  : copy.ariaAnsweredWrong
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
          HKDSE · {pickText(reagentMeta.shortLabel, lang)}
        </h3>
        <span className="text-xs text-slate-500 tabular-nums">
          {revealAll
            ? copy.metalsCountLabel
            : `${recordMap.size} / ${METALS.length} ${copy.loggedSuffix}`}
        </span>
      </div>

      {revealAll && (
        <ReagentTabs
          value={activeView}
          onChange={setViewFilter}
          lang={lang}
        />
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between px-2.5 pb-1 text-[11px] font-semibold text-orange-700">
          <span>{pickText(reagentMeta.boundaryTitleAbove, lang)}</span>
          <span>{copy.mostReactive}</span>
        </div>
        <ul className="space-y-0.5">{above.map(renderRow)}</ul>

        <div className="my-2 px-2.5 py-1.5 rounded-lg bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="font-mono-code">
            {reagentId === 'hcl' ? 'H' : '—'}
          </span>
          <span>{pickText(reagentMeta.boundaryLineLabel, lang)}</span>
        </div>

        <ul className="space-y-0.5">{below.map(renderRow)}</ul>
        <div className="flex items-center justify-between px-2.5 pt-1 text-[11px] font-semibold text-sky-700">
          <span>{pickText(reagentMeta.boundaryTitleBelow, lang)}</span>
          <span>{copy.leastReactive}</span>
        </div>
      </div>
    </div>
  );
}

function ReagentTabs({
  value,
  onChange,
  lang,
}: {
  value: ReagentSelection;
  onChange: (next: ReagentSelection) => void;
  lang: Language;
}) {
  const copy = UI_COPY[lang];
  const options: { id: ReagentSelection; label: string }[] = [
    { id: 'mixed', label: copy.all4Tab },
    ...REAGENT_ORDER.map((id) => ({
      id,
      label:
        id === 'hcl'
          ? copy.hclCol
          : id === 'water'
            ? copy.waterCol
            : id === 'steam'
              ? copy.steamCol
              : copy.oxygenCol,
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label={copy.matrixTitle}
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
