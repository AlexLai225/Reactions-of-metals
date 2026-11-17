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

test('includes all 13 required HKDSE metals with accurate reactivity across HCl, water, steam, and oxygen', () => {
  const expectedNames = [
    'Potassium',
    'Sodium',
    'Calcium',
    'Magnesium',
    'Aluminium',
    'Zinc',
    'Iron',
    'Tin',
    'Lead',
    'Copper',
    'Silver',
    'Gold',
    'Platinum',
  ];

  assert.equal(METALS.length, 13);
  for (const name of expectedNames) {
    assert.ok(
      METALS.some((m) => m.name === name),
      `Missing required metal: ${name}`
    );
  }

  // Dilute HCl: K..Pb react (9), Cu..Pt no reaction (4)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.hcl.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Sn', 'Pb']
  );

  // Cold water: K, Na, Ca react (3), Mg..Pt no reaction (10)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.water.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca']
  );

  // Steam: K..Fe react (7), Sn..Pt no reaction (6)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.steam.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe']
  );

  // Oxygen on heating: K..Cu react (10), Ag, Au, Pt no reaction (3)
  assert.deepEqual(
    METALS.filter((m) => m.reactions.oxygen.reacts).map((m) => m.symbol),
    ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Sn', 'Pb', 'Cu']
  );
});

test('buildDeck supports all reagents, mixed mode, and blitz/trap counts', () => {
  const fixedRng = () => 0.42;
  assert.equal(buildDeck('hcl', 'all13', fixedRng).length, 13);
  assert.equal(buildDeck('water', 'all13', fixedRng).length, 13);
  assert.equal(buildDeck('steam', 'all13', fixedRng).length, 13);
  assert.equal(buildDeck('oxygen', 'all13', fixedRng).length, 13);
  assert.equal(buildDeck('oxygen', 'blitz7', fixedRng).length, 7);

  const mixedAll = buildDeck('mixed', 'all13', fixedRng);
  assert.equal(mixedAll.length, 13);
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
  let state = createInitialState('oxygen', 'all13', true, () => 0.1);

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
  let state = createInitialState('steam', 'all13', true, () => 0.5);
  const card = state.deck[0];
  state = submitChoice(state, card.metal.reactions[card.reagent].reacts);
  const scoreAfterFirst = state.score;
  state = submitChoice(state, !card.metal.reactions[card.reagent].reacts);
  assert.equal(state.score, scoreAfterFirst);
  assert.equal(state.history.length, 1);
});
