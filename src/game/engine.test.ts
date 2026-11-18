import test from 'node:test';
import assert from 'node:assert/strict';
import { METALS } from './metals';
import {
  advanceRound,
  buildDeck,
  computeAccuracyPercent,
  createInitialState,
  submitChoice,
} from './engine';

test('includes all 14 HKDSE metals including Mercury with accurate reactivity across HCl, water, steam, and oxygen', () => {
  const expectedSymbols = [
    'K',
    'Na',
    'Ca',
    'Mg',
    'Al',
    'Zn',
    'Fe',
    'Sn',
    'Pb',
    'Cu',
    'Hg',
    'Ag',
    'Pt',
    'Au',
  ];

  assert.equal(METALS.length, 14);
  assert.deepEqual(
    METALS.map((m) => m.symbol),
    expectedSymbols
  );

  // Every metal has bilingual EN + TC names and reactions
  for (const metal of METALS) {
    assert.ok(metal.name.en.length > 0);
    assert.ok(metal.name.zh.length > 0);
  }

  // Dilute HCl: K..Pb react (9), Cu..Au no reaction (5)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.hcl.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Sn', 'Pb']
  );

  // Cold water: K, Na, Ca react (3), Mg..Au no reaction (11)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.water.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca']
  );

  // Steam: K..Fe react (7), Sn..Au no reaction (7)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.steam.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe']
  );

  // Oxygen on heating: K..Hg react (11), Ag, Pt, Au no reaction (3)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.oxygen.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Sn', 'Pb', 'Cu', 'Hg']
  );
});

test('buildDeck supports all reagents, mixed mode, and 14-metal / blitz / trap counts', () => {
  const fixedRng = () => 0.42;
  assert.equal(buildDeck('hcl', 'all14', fixedRng).length, 14);
  assert.equal(buildDeck('water', 'all14', fixedRng).length, 14);
  assert.equal(buildDeck('steam', 'all14', fixedRng).length, 14);
  assert.equal(buildDeck('oxygen', 'all14', fixedRng).length, 14);
  assert.equal(buildDeck('oxygen', 'blitz7', fixedRng).length, 7);

  const mixedAll = buildDeck('mixed', 'all14', fixedRng);
  assert.equal(mixedAll.length, 14);
  assert.ok(new Set(mixedAll.map((c) => c.reagent)).size === 4);

  const mixedTraps = buildDeck('mixed', 'traps', fixedRng);
  assert.ok(mixedTraps.length >= 7);
  assert.ok(
    mixedTraps.every((c) => c.metal.reactions[c.reagent].isExamTrap)
  );
});

test('correct answers increment score, streak, and trigger victory', () => {
  let state = createInitialState('water', 'blitz7', true, () => 0.25);
  assert.equal(state.status, 'playing');

  for (let i = 0; i < state.deck.length; i++) {
    const card = state.deck[state.currentIndex];
    const expected = card.metal.reactions[card.reagent].reacts;
    state = submitChoice(state, expected);
    assert.equal(state.lastFeedback?.isCorrect, true);
    assert.equal(state.streak, i + 1);
    state = advanceRound(state);
  }

  assert.equal(state.status, 'gameover');
  assert.equal(state.outcome, 'victory');
  assert.equal(computeAccuracyPercent(state.history), 100);
});

test('three wrong answers exhaust lives and trigger defeat', () => {
  let state = createInitialState('oxygen', 'all14', true, () => 0.1);

  for (let i = 0; i < 3; i++) {
    const card = state.deck[state.currentIndex];
    const expected = card.metal.reactions[card.reagent].reacts;
    state = submitChoice(state, !expected);
    assert.equal(state.lastFeedback?.isCorrect, false);
    assert.equal(state.lives, 2 - i);
    state = advanceRound(state);
  }

  assert.equal(state.lives, 0);
  assert.equal(state.status, 'gameover');
  assert.equal(state.outcome, 'defeat');
});

test('cannot double-submit while feedback panel is open', () => {
  let state = createInitialState('steam', 'all14', true, () => 0.5);
  const card = state.deck[0];
  state = submitChoice(state, card.metal.reactions[card.reagent].reacts);
  const scoreAfterFirst = state.score;
  state = submitChoice(state, !card.metal.reactions[card.reagent].reacts);
  assert.equal(state.score, scoreAfterFirst);
  assert.equal(state.history.length, 1);
});
