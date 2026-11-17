export type ReagentId = 'hcl' | 'water' | 'steam' | 'oxygen';

export interface ReagentMeta {
  id: ReagentId;
  label: string;
  shortLabel: string;
  formula: string;
  questionPrompt: string;
  positiveActionHint: string;
  boundaryTitleAbove: string;
  boundaryTitleBelow: string;
  boundaryLineLabel: string;
}

export const REAGENTS: Record<ReagentId, ReagentMeta> = {
  hcl: {
    id: 'hcl',
    label: 'Dilute Hydrochloric Acid',
    shortLabel: 'Dilute HCl',
    formula: 'dil. HCl(aq)',
    questionPrompt: 'With dilute HCl(aq) ?',
    positiveActionHint: 'REACTS · H₂(g)',
    boundaryTitleAbove: 'Above Hydrogen — Displaces H₂(g)',
    boundaryTitleBelow: 'Below Hydrogen — No Reaction',
    boundaryLineLabel: 'Hydrogen Reference (H)',
  },
  water: {
    id: 'water',
    label: 'Cold Water',
    shortLabel: 'Cold Water',
    formula: 'cold H₂O(l)',
    questionPrompt: 'With cold water H₂O(l) ?',
    positiveActionHint: 'REACTS · H₂(g)',
    boundaryTitleAbove: 'Reacts with Cold Water',
    boundaryTitleBelow: 'No Reaction with Cold Water',
    boundaryLineLabel: 'Cold Water Threshold',
  },
  steam: {
    id: 'steam',
    label: 'Steam',
    shortLabel: 'Steam',
    formula: 'steam H₂O(g)',
    questionPrompt: 'With steam H₂O(g) ?',
    positiveActionHint: 'REACTS · H₂(g)',
    boundaryTitleAbove: 'Reacts with Steam on Heating',
    boundaryTitleBelow: 'No Reaction with Steam',
    boundaryLineLabel: 'Steam Threshold',
  },
  oxygen: {
    id: 'oxygen',
    label: 'Oxygen (Heated in Air)',
    shortLabel: 'Oxygen',
    formula: 'heat + O₂(g)',
    questionPrompt: 'Heated in oxygen O₂(g) ?',
    positiveActionHint: 'OXIDISES · MO',
    boundaryTitleAbove: 'Reacts with Oxygen on Heating',
    boundaryTitleBelow: 'Unreactive in Air / Oxygen',
    boundaryLineLabel: 'Oxygen Threshold',
  },
};

export const REAGENT_ORDER: readonly ReagentId[] = [
  'hcl',
  'water',
  'steam',
  'oxygen',
];

export type ReactivityTier =
  | 'explosive'
  | 'vigorous'
  | 'moderate'
  | 'slow'
  | 'passivated'
  | 'unreactive';

export interface MetalReactionInfo {
  reacts: boolean;
  tier: ReactivityTier;
  verdictLabel: string;
  shortStatus: string;
  chemicalEquation: string;
  ionicEquation?: string;
  observations: string;
  hkdseExplanation: string;
  isExamTrap?: boolean;
}

export interface MetalItem {
  id: string;
  name: string;
  symbol: string;
  atomicNumber: number;
  reactivityRank: number; // 1 = K, 13 = Pt
  cardHint: string;
  palette: {
    backdropTop: string;
    backdropBottom: string;
    faceMain: string;
    faceTop: string;
    faceShade: string;
    highlight: string;
    stroke: string;
  };
  reactions: Record<ReagentId, MetalReactionInfo>;
}

export const METALS: readonly MetalItem[] = [
  {
    id: 'potassium',
    name: 'Potassium',
    symbol: 'K',
    atomicNumber: 19,
    reactivityRank: 1,
    cardHint: 'Soft Group I alkali metal; stored under paraffin oil.',
    palette: {
      backdropTop: '#64748b',
      backdropBottom: '#7c8ba1',
      faceMain: '#c4cad4',
      faceTop: '#e5e9f0',
      faceShade: '#9aa4b5',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts explosively with dilute HCl',
        shortStatus: 'Explosive',
        chemicalEquation: '2K(s) + 2HCl(aq) → 2KCl(aq) + H₂(g)',
        ionicEquation: '2K(s) + 2H⁺(aq) → 2K⁺(aq) + H₂(g)',
        observations:
          'Reacts explosively with a lilac flame, intense heat, and rapid evolution of colourless H₂(g).',
        hkdseExplanation:
          'Potassium sits at the top of the HKDSE Metal Reactivity Series. Never add K directly to dilute HCl in a school lab because the reaction is violently explosive.',
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts violently on cold water',
        shortStatus: 'Lilac flame',
        chemicalEquation: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)',
        ionicEquation: '2K(s) + 2H₂O(l) → 2K⁺(aq) + 2OH⁻(aq) + H₂(g)',
        observations:
          'Floats, melts into a silvery ball, darts rapidly on the water surface, and ignites with a lilac flame; resulting solution turns universal indicator purple.',
        hkdseExplanation:
          'Potassium is more reactive than sodium: the heat released immediately ignites the evolved H₂(g), giving potassium’s characteristic lilac flame and an alkaline KOH(aq) solution.',
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts explosively with steam',
        shortStatus: 'Explosive',
        chemicalEquation: '2K(s) + 2H₂O(g) → 2KOH(s) + H₂(g)',
        observations:
          'Reacts violently and explosively with steam, liberating H₂(g) and intense heat (too hazardous for school demonstrations).',
        hkdseExplanation:
          'Any metal reactive enough to react with cold water reacts even more violently with steam. In HKDSE, K, Na, and Ca are not tested with steam in the lab for safety reasons.',
      },
      oxygen: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Burns vigorously with a lilac flame',
        shortStatus: 'Lilac flame',
        chemicalEquation: '4K(s) + O₂(g) → 2K₂O(s)',
        observations:
          'Melts and burns vigorously with a lilac flame, producing white solid potassium oxide (and yellowish peroxide/superoxide in excess O₂).',
        hkdseExplanation:
          'Potassium oxidises rapidly even in cold air and burns fiercely when heated in oxygen. At HKDSE level, its primary oxide formula is written as K₂O.',
      },
    },
  },
  {
    id: 'sodium',
    name: 'Sodium',
    symbol: 'Na',
    atomicNumber: 11,
    reactivityRank: 2,
    cardHint: 'Silvery Group I metal easily cut with a knife.',
    palette: {
      backdropTop: '#5b6b82',
      backdropBottom: '#74849c',
      faceMain: '#cdd3dc',
      faceTop: '#eef1f6',
      faceShade: '#9ea8b8',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts explosively with dilute HCl',
        shortStatus: 'Explosive',
        chemicalEquation: '2Na(s) + 2HCl(aq) → 2NaCl(aq) + H₂(g)',
        ionicEquation: '2Na(s) + 2H⁺(aq) → 2Na⁺(aq) + H₂(g)',
        observations:
          'Reacts explosively, melts into a silvery ball, and may ignite with a golden-yellow flame while releasing H₂(g).',
        hkdseExplanation:
          'Sodium is just below potassium in the reactivity series and displaces hydrogen violently from dilute acids — too hazardous for routine school experiments.',
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Reacts vigorously on cold water',
        shortStatus: 'Yellow flame',
        chemicalEquation: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)',
        ionicEquation: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)',
        observations:
          'Floats, melts into a silvery ball, hisses across the water surface, and may burn with a golden-yellow flame; colourless alkaline solution forms.',
        hkdseExplanation:
          'Sodium has lower density than water (floats) and a low melting point (melts due to exothermic reaction), forming alkaline NaOH(aq) and H₂(g).',
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts explosively with steam',
        shortStatus: 'Explosive',
        chemicalEquation: '2Na(s) + 2H₂O(g) → 2NaOH(s) + H₂(g)',
        observations:
          'Reacts violently with steam, releasing H₂(g) and intense heat (too dangerous to carry out in a school lab).',
        hkdseExplanation:
          'Because sodium reacts vigorously with cold water, it reacts explosively with steam.',
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Burns vigorously with golden-yellow flame',
        shortStatus: 'Yellow flame',
        chemicalEquation: '4Na(s) + O₂(g) → 2Na₂O(s)',
        observations:
          'Burns vigorously with a bright golden-yellow flame to form a white solid (mainly Na₂O, with pale yellow Na₂O₂ in excess O₂).',
        hkdseExplanation:
          'Freshly cut sodium tarnishes quickly in air to form an oxide layer and burns readily with a golden-yellow flame when heated.',
      },
    },
  },
  {
    id: 'calcium',
    name: 'Calcium',
    symbol: 'Ca',
    atomicNumber: 20,
    reactivityRank: 3,
    cardHint: 'Silvery-grey Group II alkaline earth metal.',
    palette: {
      backdropTop: '#566376',
      backdropBottom: '#707e94',
      faceMain: '#b8c0cc',
      faceTop: '#dde2ea',
      faceShade: '#8d97a6',
      highlight: '#f8fafc',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Reacts vigorously with dilute HCl',
        shortStatus: 'Vigorous',
        chemicalEquation: 'Ca(s) + 2HCl(aq) → CaCl₂(aq) + H₂(g)',
        ionicEquation: 'Ca(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂(g)',
        observations:
          'Reacts vigorously with rapid effervescence of colourless H₂(g); calcium dissolves to give a colourless solution and heat is released.',
        hkdseExplanation:
          'Calcium reacts steadily and vigorously with dilute HCl because CaCl₂ is soluble (unlike CaSO₄ formed with dilute H₂SO₄, which coats calcium and stops the reaction).',
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Reacts steadily with cold water',
        shortStatus: 'Milky Ca(OH)₂',
        chemicalEquation: 'Ca(s) + 2H₂O(l) → Ca(OH)₂(s) + H₂(g)',
        observations:
          'Sinks in water and gives a steady stream of colourless H₂(g) bubbles; the water turns milky/cloudy due to sparingly soluble white Ca(OH)₂.',
        hkdseExplanation:
          'Classic HKDSE comparison: unlike K and Na, calcium sinks in water and does not melt or catch fire; the milky suspension is white calcium hydroxide.',
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: 'Reacts vigorously with steam',
        shortStatus: 'Vigorous',
        chemicalEquation: 'Ca(s) + H₂O(g) → CaO(s) + H₂(g)',
        observations:
          'Reacts vigorously when heated in steam, producing white calcium oxide and hydrogen gas.',
        hkdseExplanation:
          'Calcium already reacts steadily with cold water, so its reaction with hot steam is rapid and strongly exothermic.',
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Burns with a brick-red flame',
        shortStatus: 'Brick-red flame',
        chemicalEquation: '2Ca(s) + O₂(g) → 2CaO(s)',
        observations:
          'Burns vigorously with a brick-red flame to produce a white powdery solid (calcium oxide).',
        hkdseExplanation:
          'Flame colour is a frequent HKDSE MCQ detail: Potassium = lilac, Sodium = golden-yellow, Calcium = brick-red.',
        isExamTrap: true,
      },
    },
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    symbol: 'Mg',
    atomicNumber: 12,
    reactivityRank: 4,
    cardHint: 'Lightweight silvery metal often used as a ribbon.',
    palette: {
      backdropTop: '#5c697a',
      backdropBottom: '#78869a',
      faceMain: '#c8cfd9',
      faceTop: '#ebeff5',
      faceShade: '#9aa3b2',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Reacts rapidly with dilute HCl',
        shortStatus: 'Rapid',
        chemicalEquation: 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)',
        ionicEquation: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)',
        observations:
          'Reacts rapidly with vigorous effervescence of colourless H₂(g); ribbon dissolves completely to form a colourless solution; tube feels warm.',
        hkdseExplanation:
          'Magnesium is well above hydrogen in the reactivity series. The evolved H₂(g) gives a "pop" sound with a burning splint.',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No appreciable reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No appreciable reaction in cold water',
        observations:
          'Magnesium ribbon remains intact in cold water with practically no visible gas bubbles.',
        hkdseExplanation:
          'High-frequency HKDSE boundary! Only K, Na, and Ca react noticeably with cold water. Magnesium shows practically no reaction with cold water, but reacts vigorously with steam.',
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Burns brightly in steam',
        shortStatus: 'White glow',
        chemicalEquation: 'Mg(s) + H₂O(g) → MgO(s) + H₂(g)',
        observations:
          'Reacts vigorously, burning with an intense bright white light to leave white solid magnesium oxide and releasing H₂(g).',
        hkdseExplanation:
          'Notice the product with steam is the oxide MgO(s), NOT the hydroxide Mg(OH)₂. In the HKDSE lab setup, wet glass wool supplies steam to heated Mg ribbon.',
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Burns with a dazzling white flame',
        shortStatus: 'White flame',
        chemicalEquation: '2Mg(s) + O₂(g) → 2MgO(s)',
        observations:
          'Burns rapidly with a dazzling bright white flame, forming white powdery magnesium oxide.',
        hkdseExplanation:
          'Classic HKDSE reaction used in empirical formula experiments (heating Mg in a crucible with periodic lid lifting).',
      },
    },
  },
  {
    id: 'aluminium',
    name: 'Aluminium',
    symbol: 'Al',
    atomicNumber: 13,
    reactivityRank: 5,
    cardHint: 'Light silvery metal covered by a thin surface oxide film.',
    palette: {
      backdropTop: '#5d6d82',
      backdropBottom: '#7c8ca3',
      faceMain: '#d0d7e2',
      faceTop: '#f1f5f9',
      faceShade: '#a3aebf',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Reacts vigorously (after oxide dissolves)',
        shortStatus: 'Delay → fast',
        chemicalEquation: '2Al(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂(g)',
        ionicEquation: '2Al(s) + 6H⁺(aq) → 2Al³⁺(aq) + 3H₂(g)',
        observations:
          'Slow at first, then reacts vigorously with rapid streams of colourless H₂(g) bubbles to produce a colourless solution.',
        hkdseExplanation:
          'Classic HKDSE exam point: Aluminium initially appears slow because of its protective Al₂O₃ coating. Once dilute HCl dissolves the oxide layer, Al reacts vigorously.',
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'No gas bubbles or visible change when aluminium is placed in cold water.',
        hkdseExplanation:
          'Aluminium does not react with cold water—both because it sits below calcium and because its impervious Al₂O₃ surface film protects the metal.',
      },
      steam: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: 'Reacts with steam when strongly heated',
        shortStatus: 'Forms Al₂O₃',
        chemicalEquation: '2Al(s) + 3H₂O(g) → Al₂O₃(s) + 3H₂(g)',
        observations:
          'When strongly heated (especially if oxide layer is removed), aluminium reacts vigorously with steam to produce white Al₂O₃ and H₂(g).',
        hkdseExplanation:
          'In the HKDSE reactivity series, Mg, Al, Zn, and Fe all react with steam to form their metal oxides plus hydrogen gas.',
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Burns when powdered; forms Al₂O₃',
        shortStatus: 'White sparks',
        chemicalEquation: '4Al(s) + 3O₂(g) → 2Al₂O₃(s)',
        observations:
          'Aluminium powder burns brightly with white sparks to give white aluminium oxide; solid foil only thickens its protective oxide coat.',
        hkdseExplanation:
          'Aluminium is actually quite reactive, but its tough, impervious Al₂O₃ layer prevents corrosion of aluminium cans and window frames in air.',
      },
    },
  },
  {
    id: 'zinc',
    name: 'Zinc',
    symbol: 'Zn',
    atomicNumber: 30,
    reactivityRank: 6,
    cardHint: 'Bluish-silver metal used to galvanize steel.',
    palette: {
      backdropTop: '#526074',
      backdropBottom: '#6c7c93',
      faceMain: '#a6b3c6',
      faceTop: '#cdd6e3',
      faceShade: '#7d8ba0',
      highlight: '#f1f5f9',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Reacts moderately with dilute HCl',
        shortStatus: 'Moderate',
        chemicalEquation: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)',
        ionicEquation: 'Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)',
        observations:
          'Reacts moderately with steady effervescence of colourless H₂(g); zinc granules dissolve to give a colourless solution.',
        hkdseExplanation:
          'Zinc reacts at a safe, moderate pace with dilute HCl, making it a common laboratory source of hydrogen gas.',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Zinc granules sink in cold water with no gas bubbles or visible change.',
        hkdseExplanation:
          'Zinc is not reactive enough to react with cold water; it requires steam (hot water vapour) to displace hydrogen.',
      },
      steam: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Reacts with steam on heating',
        shortStatus: 'ZnO (Y→W)',
        chemicalEquation: 'Zn(s) + H₂O(g) → ZnO(s) + H₂(g)',
        observations:
          'Heated zinc glows and reacts steadily with steam to form zinc oxide (yellow when hot, turning white on cooling) and H₂(g).',
        hkdseExplanation:
          'Must-know HKDSE colour detail: Zinc oxide (ZnO) is yellow when hot and white when cold!',
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Burns / oxidises to ZnO (yellow hot, white cold)',
        shortStatus: 'ZnO (Y→W)',
        chemicalEquation: '2Zn(s) + O₂(g) → 2ZnO(s)',
        observations:
          'Burns with a bluish-green flame when strongly heated in oxygen, forming zinc oxide which is yellow while hot and white when cold.',
        hkdseExplanation:
          'Remember the thermochromic appearance of ZnO: yellow when hot, white upon cooling.',
      },
    },
  },
  {
    id: 'iron',
    name: 'Iron',
    symbol: 'Fe',
    atomicNumber: 26,
    reactivityRank: 7,
    cardHint: 'Most widely produced metal; rusts to reddish-brown.',
    palette: {
      backdropTop: '#4e5a6b',
      backdropBottom: '#6a778a',
      faceMain: '#8e96a3',
      faceTop: '#b4bcc7',
      faceShade: '#67707d',
      highlight: '#e2e8f0',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Reacts slowly; pale green FeCl₂(aq)',
        shortStatus: 'Pale green',
        chemicalEquation: 'Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)',
        ionicEquation: 'Fe(s) + 2H⁺(aq) → Fe²⁺(aq) + H₂(g)',
        observations:
          'Reacts slowly with gentle bubbling of colourless H₂(g); the solution gradually turns pale green due to Fe²⁺(aq).',
        hkdseExplanation:
          'Crucial HKDSE rule: Dilute HCl oxidises iron only to pale green iron(II) chloride (FeCl₂), NOT yellow-brown iron(III) chloride (FeCl₃).',
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No direct reaction with air-free cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction (without O₂)',
        observations:
          'Clean iron shows no bubbling or hydrogen evolution in cold water.',
        hkdseExplanation:
          'Iron does not displace hydrogen from cold water. (Note: Rusting requires BOTH water and dissolved oxygen over time; pure cold water alone does not react with iron.)',
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'slow',
        verdictLabel: 'Reacts slowly with steam to form Fe₃O₄',
        shortStatus: 'Black Fe₃O₄',
        chemicalEquation: '3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g)',
        observations:
          'Red-hot iron reacts slowly with steam, turning into a black solid (triiron tetraoxide, Fe₃O₄) and evolving colourless H₂(g).',
        hkdseExplanation:
          'High-frequency HKDSE trap! Heating iron in steam produces black triiron tetraoxide (Fe₃O₄), NOT rust (Fe₂O₃·xH₂O) or FeO.',
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: 'Burns with yellow sparks to form Fe₃O₄',
        shortStatus: 'Sparks → Fe₃O₄',
        chemicalEquation: '3Fe(s) + 2O₂(g) → Fe₃O₄(s)',
        observations:
          'Iron wool or powder burns with bright yellow-orange sparks (no flame) in oxygen, forming black solid Fe₃O₄.',
        hkdseExplanation:
          'Iron does not burn with a flame, but iron wool/filings glow and emit yellow sparks to form black triiron tetraoxide (Fe₃O₄).',
        isExamTrap: true,
      },
    },
  },
  {
    id: 'tin',
    name: 'Tin',
    symbol: 'Sn',
    atomicNumber: 50,
    reactivityRank: 8,
    cardHint: 'Silvery malleable metal used in solder alloys.',
    palette: {
      backdropTop: '#566171',
      backdropBottom: '#717d8f',
      faceMain: '#b3bac4',
      faceTop: '#d7dce3',
      faceShade: '#88909c',
      highlight: '#f8fafc',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'slow',
        verdictLabel: 'Reacts very slowly with dilute HCl',
        shortStatus: 'Very slow',
        chemicalEquation: 'Sn(s) + 2HCl(aq) → SnCl₂(aq) + H₂(g)',
        ionicEquation: 'Sn(s) + 2H⁺(aq) → Sn²⁺(aq) + H₂(g)',
        observations:
          'Reacts very slowly at room temperature (faster when warmed) with sparse colourless bubbles of H₂(g).',
        hkdseExplanation:
          'Tin sits just above lead and hydrogen in the HKDSE reactivity series, so it displaces hydrogen from dilute HCl, though much more slowly than iron or zinc.',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Tin remains shiny and unreactive in cold water with no gas bubbles.',
        hkdseExplanation:
          'Tin is too low in the reactivity series to react with cold water — that is why tin-plating protects steel food cans.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Under HKDSE school conditions, tin shows no reaction with steam.',
        hkdseExplanation:
          'In the HKDSE curriculum, steam reacts with metals from K down to Fe; metals below iron (Sn, Pb, Cu, Ag, Au, Pt) do not react with steam.',
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: 'Oxidises slowly on strong heating',
        shortStatus: 'Forms SnO₂',
        chemicalEquation: 'Sn(s) + O₂(g) → SnO₂(s)',
        observations:
          'Melts without burning and slowly forms a white/pale yellow surface layer of tin(IV) oxide when heated in air.',
        hkdseExplanation:
          'Tin does not burn in air, but like lead and copper it reacts slowly with oxygen when heated strongly.',
      },
    },
  },
  {
    id: 'lead',
    name: 'Lead',
    symbol: 'Pb',
    atomicNumber: 82,
    reactivityRank: 9,
    cardHint: 'Dense bluish-grey metal used in radiation shielding.',
    palette: {
      backdropTop: '#475161',
      backdropBottom: '#626d7f',
      faceMain: '#7b8494',
      faceTop: '#a2abb9',
      faceShade: '#596170',
      highlight: '#cbd5e1',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: true,
        tier: 'passivated',
        verdictLabel: 'Reacts initially, then stops (PbCl₂)',
        shortStatus: 'Stops (PbCl₂)',
        chemicalEquation: 'Pb(s) + 2HCl(aq) → PbCl₂(s) + H₂(g)',
        ionicEquation: 'Pb(s) + 2H⁺(aq) + 2Cl⁻(aq) → PbCl₂(s) + H₂(g)',
        observations:
          'A few tiny bubbles of H₂(g) appear initially, then the reaction quickly stops as white insoluble PbCl₂ coats the surface.',
        hkdseExplanation:
          'High-frequency HKDSE trap! Lead is above H in the reactivity series so it DOES react initially, but insoluble lead(II) chloride (PbCl₂) forms a protective layer that halts further reaction.',
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'No effervescence or visible change when lead is placed in cold water.',
        hkdseExplanation:
          'Lead sits far below calcium in the reactivity series and does not react with cold water.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'No hydrogen gas is produced when lead is heated in steam.',
        hkdseExplanation:
          'Lead lies below iron in the HKDSE Metal Reactivity Series and cannot react with steam.',
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: 'Oxidises on heating to PbO (orange hot, yellow cold)',
        shortStatus: 'PbO (O→Y)',
        chemicalEquation: '2Pb(s) + O₂(g) → 2PbO(s)',
        observations:
          'Melts and oxidises slowly without burning to form lead(II) oxide: orange-brown when hot, yellow when cold.',
        hkdseExplanation:
          'Key HKDSE observation: PbO is orange/reddish-brown when hot and yellow when cold (compare with ZnO: yellow when hot, white when cold).',
        isExamTrap: true,
      },
    },
  },
  {
    id: 'copper',
    name: 'Copper',
    symbol: 'Cu',
    atomicNumber: 29,
    reactivityRank: 10,
    cardHint: 'Reddish-brown metal prized for electrical wiring.',
    palette: {
      backdropTop: '#5e4c49',
      backdropBottom: '#7c645f',
      faceMain: '#d47c55',
      faceTop: '#e99e7d',
      faceShade: '#a85a39',
      highlight: '#ffe4d6',
      stroke: '#2b1914',
    },
    reactions: {
      hcl: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with dilute HCl',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        ionicEquation: 'Cu(s) + H⁺(aq) → No reaction',
        observations:
          'No observable change; reddish-brown copper metal stays intact with zero gas bubbles.',
        hkdseExplanation:
          'Copper sits below hydrogen in the HKDSE Metal Reactivity Series, so it cannot displace hydrogen from dilute HCl(aq). (Note: Cu only reacts with oxidising acids like HNO₃.)',
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Reddish-brown copper shows zero change in cold water.',
        hkdseExplanation:
          'Copper is unreactive towards water, which is why copper pipes are widely used for cold and hot water plumbing.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Even when heated strongly in steam, copper produces no hydrogen gas.',
        hkdseExplanation:
          'Copper is below hydrogen and iron in the reactivity series, so it does not react with steam.',
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: 'Forms black CuO when heated in air',
        shortStatus: 'Black CuO',
        chemicalEquation: '2Cu(s) + O₂(g) → 2CuO(s)',
        observations:
          'Does not burn with a flame, but the shiny reddish-brown surface turns black as black copper(II) oxide forms.',
        hkdseExplanation:
          'Important HKDSE distinction! Copper does NOT react with water, steam, or dilute HCl, yet it DOES react with oxygen on heating to form black CuO.',
        isExamTrap: true,
      },
    },
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'Ag',
    atomicNumber: 47,
    reactivityRank: 11,
    cardHint: 'Lustrous precious metal with the highest conductivity.',
    palette: {
      backdropTop: '#596575',
      backdropBottom: '#768496',
      faceMain: '#d9dfe8',
      faceTop: '#f8fafc',
      faceShade: '#aeb8c7',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with dilute HCl',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        ionicEquation: 'Ag(s) + H⁺(aq) → No reaction',
        observations:
          'No observable change; bright silvery metal shows no effervescence or dissolution.',
        hkdseExplanation:
          'Silver is well below hydrogen in the Metal Reactivity Series and cannot reduce H⁺(aq) ions to H₂(g) in dilute hydrochloric acid.',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'Silver stays bright and unchanged in cold water.',
        hkdseExplanation:
          'Silver is near the bottom of the reactivity series and does not react with cold water.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'No visible change when silver is exposed to steam.',
        hkdseExplanation:
          'Silver is far too unreactive to displace hydrogen from steam.',
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with oxygen on heating',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Silver does not burn or form an oxide layer when heated in oxygen/air.',
        hkdseExplanation:
          'Key HKDSE boundary: Copper reacts slowly with oxygen on heating, whereas Ag, Au, and Pt do not react with oxygen even when strongly heated. (Tarnishing in air is due to trace H₂S, not O₂.)',
        isExamTrap: true,
      },
    },
  },
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'Au',
    atomicNumber: 79,
    reactivityRank: 12,
    cardHint: 'Malleable yellow precious metal found native in nature.',
    palette: {
      backdropTop: '#5e5642',
      backdropBottom: '#7d7257',
      faceMain: '#eab308',
      faceTop: '#fde047',
      faceShade: '#ca8a04',
      highlight: '#fef9c3',
      stroke: '#292007',
    },
    reactions: {
      hcl: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with dilute HCl',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        ionicEquation: 'Au(s) + H⁺(aq) → No reaction',
        observations:
          'No observable change; the yellow gold remains completely unaffected in dilute HCl.',
        hkdseExplanation:
          'Gold lies near the very bottom of the reactivity series (below H), so it has no reaction with dilute hydrochloric acid.',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'No observable change; gold stays completely inert.',
        hkdseExplanation:
          'Gold is unreactive towards water, which is why gold artefacts remain intact underwater for centuries.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'No observable change when gold is heated in steam.',
        hkdseExplanation:
          'Gold lies near the bottom of the reactivity series and never reacts with steam.',
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with oxygen on heating',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Gold stays shiny yellow and does not oxidise even when heated strongly in air.',
        hkdseExplanation:
          'Gold is found native (uncombined) in Earth’s crust because it does not react with oxygen, water, or acids.',
      },
    },
  },
  {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'Pt',
    atomicNumber: 78,
    reactivityRank: 13,
    cardHint: 'Dense silvery-white noble metal used in catalytic converters.',
    palette: {
      backdropTop: '#525b68',
      backdropBottom: '#6f7a8b',
      faceMain: '#cbd5e1',
      faceTop: '#f1f5f9',
      faceShade: '#94a3b8',
      highlight: '#ffffff',
      stroke: '#1e293b',
    },
    reactions: {
      hcl: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with dilute HCl',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        ionicEquation: 'Pt(s) + H⁺(aq) → No reaction',
        observations:
          'No observable change; platinum remains completely inert in dilute hydrochloric acid.',
        hkdseExplanation:
          'Platinum is at the bottom of the HKDSE Metal Reactivity Series (below H). It is too unreactive to react with dilute HCl(aq).',
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with cold water',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'No observable change in cold water.',
        hkdseExplanation:
          'Platinum is the least reactive metal in the HKDSE series and does not react with cold water.',
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with steam',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations: 'No observable change in steam.',
        hkdseExplanation:
          'Platinum does not react with steam at any temperature.',
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: 'No reaction with oxygen on heating',
        shortStatus: 'No reaction',
        chemicalEquation: 'No reaction',
        observations:
          'Remains bright silvery-white even after heating in a Bunsen flame (used for flame test wires).',
        hkdseExplanation:
          'Because platinum does not react with oxygen when heated in a Bunsen burner, platinum wire is ideal for flame tests in the HKDSE lab.',
      },
    },
  },
] as const;

export function getMetalById(id: string): MetalItem | undefined {
  return METALS.find((m) => m.id === id);
}
