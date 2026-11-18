import type { LocalizedText } from './i18n';

export type ReagentId = 'hcl' | 'water' | 'steam' | 'oxygen';

export interface ReagentMeta {
  id: ReagentId;
  label: LocalizedText;
  shortLabel: LocalizedText;
  formula: LocalizedText;
  questionPrompt: LocalizedText;
  positiveActionHint: LocalizedText;
  boundaryTitleAbove: LocalizedText;
  boundaryTitleBelow: LocalizedText;
  boundaryLineLabel: LocalizedText;
}

export const REAGENTS: Record<ReagentId, ReagentMeta> = {
  hcl: {
    id: 'hcl',
    label: { en: 'Dilute Hydrochloric Acid', zh: '稀氫氯酸' },
    shortLabel: { en: 'Dilute HCl', zh: '稀氫氯酸' },
    formula: { en: 'dil. HCl(aq)', zh: '稀 HCl(aq)' },
    questionPrompt: { en: 'With dilute HCl(aq) ?', zh: '與稀氫氯酸反應嗎？' },
    positiveActionHint: { en: 'REACTS · H₂(g)', zh: '會反應 · H₂(g)' },
    boundaryTitleAbove: {
      en: 'Above Hydrogen — Displaces H₂(g)',
      zh: '位於氫之上 — 可置換出氫氣',
    },
    boundaryTitleBelow: {
      en: 'Below Hydrogen — No Reaction',
      zh: '位於氫之下 — 不與稀酸反應',
    },
    boundaryLineLabel: {
      en: 'Hydrogen Reference (H)',
      zh: '氫基準線 (H)',
    },
  },
  water: {
    id: 'water',
    label: { en: 'Cold Water', zh: '冷水' },
    shortLabel: { en: 'Cold Water', zh: '冷水' },
    formula: { en: 'cold H₂O(l)', zh: '冷水 H₂O(l)' },
    questionPrompt: { en: 'With cold water H₂O(l) ?', zh: '與冷水反應嗎？' },
    positiveActionHint: { en: 'REACTS · H₂(g)', zh: '會反應 · H₂(g)' },
    boundaryTitleAbove: {
      en: 'Reacts with Cold Water',
      zh: '能與冷水反應',
    },
    boundaryTitleBelow: {
      en: 'No Reaction with Cold Water',
      zh: '不與冷水反應',
    },
    boundaryLineLabel: {
      en: 'Cold Water Threshold',
      zh: '冷水反應界線',
    },
  },
  steam: {
    id: 'steam',
    label: { en: 'Steam', zh: '蒸汽' },
    shortLabel: { en: 'Steam', zh: '蒸汽' },
    formula: { en: 'steam H₂O(g)', zh: '蒸汽 H₂O(g)' },
    questionPrompt: { en: 'With steam H₂O(g) ?', zh: '與蒸汽反應嗎？' },
    positiveActionHint: { en: 'REACTS · H₂(g)', zh: '會反應 · H₂(g)' },
    boundaryTitleAbove: {
      en: 'Reacts with Steam on Heating',
      zh: '加熱下能與蒸汽反應',
    },
    boundaryTitleBelow: {
      en: 'No Reaction with Steam',
      zh: '不與蒸汽反應',
    },
    boundaryLineLabel: {
      en: 'Steam Threshold',
      zh: '蒸汽反應界線',
    },
  },
  oxygen: {
    id: 'oxygen',
    label: { en: 'Oxygen (Heated in Air)', zh: '氧（空氣中加熱）' },
    shortLabel: { en: 'Oxygen', zh: '氧' },
    formula: { en: 'heat + O₂(g)', zh: '加熱 + O₂(g)' },
    questionPrompt: {
      en: 'Heated in oxygen O₂(g) ?',
      zh: '加熱下與氧反應嗎？',
    },
    positiveActionHint: { en: 'OXIDISES · MO', zh: '會反應 · 生成氧化物' },
    boundaryTitleAbove: {
      en: 'Reacts with Oxygen on Heating',
      zh: '加熱下能與氧反應',
    },
    boundaryTitleBelow: {
      en: 'No Reaction Even on Strong Heating',
      zh: '非常強熱下亦不與氧反應',
    },
    boundaryLineLabel: {
      en: 'Oxygen Threshold',
      zh: '氧反應界線',
    },
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
  verdictLabel: LocalizedText;
  shortStatus: LocalizedText;
  chemicalEquation: LocalizedText;
  ionicEquation?: LocalizedText;
  observations: LocalizedText;
  hkdseExplanation: LocalizedText;
  isExamTrap?: boolean;
}

export interface MetalItem {
  id: string;
  name: LocalizedText;
  symbol: string;
  atomicNumber: number;
  reactivityRank: number; // 1 = K, 14 = Au (per HKDSE Table 11.3)
  cardHint: LocalizedText;
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

const NO_REACTION_EQ: LocalizedText = { en: 'No reaction', zh: '沒有反應' };

export const METALS: readonly MetalItem[] = [
  {
    id: 'potassium',
    name: { en: 'Potassium', zh: '鉀' },
    symbol: 'K',
    atomicNumber: 19,
    reactivityRank: 1,
    cardHint: {
      en: 'Soft Group I alkali metal; stored under paraffin oil.',
      zh: '質軟的第 I 族鹼金屬；必須貯存於石蠟油中。',
    },
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
        verdictLabel: {
          en: 'Reacts explosively with dilute HCl',
          zh: '與稀氫氯酸產生爆炸性反應',
        },
        shortStatus: { en: 'Explosive', zh: '爆炸性' },
        chemicalEquation: {
          en: '2K(s) + 2HCl(aq) → 2KCl(aq) + H₂(g)',
          zh: '2K(s) + 2HCl(aq) → 2KCl(aq) + H₂(g)',
        },
        ionicEquation: {
          en: '2K(s) + 2H⁺(aq) → 2K⁺(aq) + H₂(g)',
          zh: '2K(s) + 2H⁺(aq) → 2K⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts explosively with a lilac flame, intense heat, and rapid evolution of colourless H₂(g).',
          zh: '產生爆炸性反應，發出淡紫色火焰並釋出大量熱，急速產生無色氫氣氣泡。',
        },
        hkdseExplanation: {
          en: 'Potassium sits at the top of the HKDSE Metal Reactivity Series. Never add K directly to dilute HCl in a school lab because the reaction is violently explosive.',
          zh: '鉀位於金屬活性序的最頂端，與稀酸會產生極度危險的爆炸性反應，絕不可在學校實驗室把鉀加入酸中。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: {
          en: 'Reacts violently on cold water',
          zh: '與冷水劇烈反應',
        },
        shortStatus: { en: 'Lilac flame', zh: '淡紫色火焰' },
        chemicalEquation: {
          en: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)',
          zh: '2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g)',
        },
        ionicEquation: {
          en: '2K(s) + 2H₂O(l) → 2K⁺(aq) + 2OH⁻(aq) + H₂(g)',
          zh: '2K(s) + 2H₂O(l) → 2K⁺(aq) + 2OH⁻(aq) + H₂(g)',
        },
        observations: {
          en: 'Melts into a silvery ball, darts rapidly on the water surface with hissing, and burns with a lilac flame.',
          zh: '熔化成銀色小球，在水面急速移動並發出「嘶嘶聲」，燃燒並產生淡紫色火焰；所得溶液呈鹼性。',
        },
        hkdseExplanation: {
          en: 'Potassium is more reactive than sodium: the heat released immediately ignites the evolved H₂(g), producing potassium’s characteristic lilac flame and alkaline KOH(aq).',
          zh: '鉀與冷水反應劇烈，釋出的熱足以即時點燃產生的氫氣，形成鉀特有的淡紫色火焰，並生成鹼性的氫氧化鉀溶液。',
        },
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: {
          en: 'Reacts explosively with steam',
          zh: '與蒸汽產生爆炸性反應',
        },
        shortStatus: { en: 'Explosive', zh: '爆炸性' },
        chemicalEquation: {
          en: '2K(s) + 2H₂O(g) → 2KOH(s) + H₂(g)',
          zh: '2K(s) + 2H₂O(g) → 2KOH(s) + H₂(g)',
        },
        observations: {
          en: 'Reacts violently and explosively with steam, liberating H₂(g) and intense heat.',
          zh: '與蒸汽產生極劇烈的爆炸性反應並釋出大量熱和氫氣（實驗室中過於危險而不作進行）。',
        },
        hkdseExplanation: {
          en: 'Any metal reactive enough to react with cold water reacts even more violently with steam. K, Na, and Ca are not tested with steam in school labs for safety.',
          zh: '凡能與冷水反應的活潑金屬，與蒸汽的反應會更劇烈；基於安全理由，學校實驗不會用鉀、鈉或鈣與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: {
          en: 'Burns vigorously with a lilac flame',
          zh: '猛烈燃燒並產生淡紫色火焰',
        },
        shortStatus: { en: 'Lilac flame', zh: '淡紫色火焰' },
        chemicalEquation: {
          en: '4K(s) + O₂(g) → 2K₂O(s)',
          zh: '4K(s) + O₂(g) → 2K₂O(s)',
        },
        observations: {
          en: 'Burns vigorously on gentle heating with a lilac flame, forming white powder (potassium oxide).',
          zh: '只需微熱便猛烈地燃燒，產生淡紫色火焰，並生成白色粉末（氧化鉀）。',
        },
        hkdseExplanation: {
          en: 'Potassium oxidises rapidly in air and must be stored under paraffin oil. When heated, it burns with a lilac flame to form K₂O.',
          zh: '鉀暴露於空氣後會迅速生成氧化物層而變得晦暗，故須浸於石蠟油中貯存；微熱下燃燒呈淡紫色火焰。',
        },
      },
    },
  },
  {
    id: 'sodium',
    name: { en: 'Sodium', zh: '鈉' },
    symbol: 'Na',
    atomicNumber: 11,
    reactivityRank: 2,
    cardHint: {
      en: 'Silvery Group I metal easily cut with a knife.',
      zh: '可用小刀輕易切開的銀白色第 I 族金屬，浸於石蠟油中貯存。',
    },
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
        verdictLabel: {
          en: 'Reacts explosively with dilute HCl',
          zh: '與稀氫氯酸產生爆炸性反應',
        },
        shortStatus: { en: 'Explosive', zh: '爆炸性' },
        chemicalEquation: {
          en: '2Na(s) + 2HCl(aq) → 2NaCl(aq) + H₂(g)',
          zh: '2Na(s) + 2HCl(aq) → 2NaCl(aq) + H₂(g)',
        },
        ionicEquation: {
          en: '2Na(s) + 2H⁺(aq) → 2Na⁺(aq) + H₂(g)',
          zh: '2Na(s) + 2H⁺(aq) → 2Na⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts explosively, melts into a silvery ball, and may ignite with a golden-yellow flame while releasing H₂(g).',
          zh: '產生爆炸性反應，熔成銀色小球並可能燃燒產生金黃色火焰，同時急速釋出氫氣。',
        },
        hkdseExplanation: {
          en: 'Sodium sits just below potassium in the reactivity series and reacts explosively with dilute acids — too hazardous for school lab demonstrations.',
          zh: '鈉的活性僅次於鉀，與稀酸會產生危險的爆炸性反應，不可在課堂實驗把鈉直接加入稀酸。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Reacts vigorously on cold water',
          zh: '與冷水劇烈反應',
        },
        shortStatus: { en: 'Yellow flame', zh: '金黃色火焰' },
        chemicalEquation: {
          en: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)',
          zh: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)',
        },
        ionicEquation: {
          en: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)',
          zh: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)',
        },
        observations: {
          en: 'Floats, melts into a silvery ball, darts across the surface, and burns with a golden-yellow flame; solution becomes alkaline.',
          zh: '浮於水面並熔化成銀色小球，在水面快速移動，燃燒並產生金黃色火焰；生成鹼性無色溶液。',
        },
        hkdseExplanation: {
          en: 'Sodium is less dense than water and has a low melting point; when enough heat and H₂(g) build up, the sodium burns with a golden-yellow flame.',
          zh: '鈉的密度比水低且熔點較低，當反應產生足夠的熱和氫氣時，鈉便會燃燒並呈現特有的金黃色火焰。',
        },
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: {
          en: 'Reacts explosively with steam',
          zh: '與蒸汽劇烈反應',
        },
        shortStatus: { en: 'Explosive', zh: '劇烈爆炸' },
        chemicalEquation: {
          en: '2Na(s) + 2H₂O(g) → 2NaOH(s) + H₂(g)',
          zh: '2Na(s) + 2H₂O(g) → 2NaOH(s) + H₂(g)',
        },
        observations: {
          en: 'Reacts violently with steam, releasing H₂(g) and intense heat.',
          zh: '與蒸汽發生極劇烈反應並釋出大量熱和氫氣（危險性過高）。',
        },
        hkdseExplanation: {
          en: 'Because sodium already reacts vigorously with cold water, its reaction with hot steam is violently explosive.',
          zh: '由於鈉已能與冷水劇烈反應，遇上高溫蒸汽時反應會更加猛烈危險。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Burns with a golden-yellow flame',
          zh: '猛烈燃燒並產生金黃色火焰',
        },
        shortStatus: { en: 'Yellow flame', zh: '金黃色火焰' },
        chemicalEquation: {
          en: '4Na(s) + O₂(g) → 2Na₂O(s)',
          zh: '4Na(s) + O₂(g) → 2Na₂O(s)',
        },
        observations: {
          en: 'Burns vigorously on gentle heating with a golden-yellow flame to form a white powder (sodium oxide).',
          zh: '微熱下猛烈地燃燒，產生金黃色火焰，並生成白色粉末（氧化鈉）。',
        },
        hkdseExplanation: {
          en: 'Sodium must be kept under paraffin oil to prevent reaction with oxygen in air. Heating sodium produces a bright golden-yellow flame and white Na₂O.',
          zh: '鈉須貯存於石蠟油中以隔絕空氣中的氧；微熱時劇烈燃燒並發出金黃色火焰，生成白色氧化鈉。',
        },
      },
    },
  },
  {
    id: 'calcium',
    name: { en: 'Calcium', zh: '鈣' },
    symbol: 'Ca',
    atomicNumber: 20,
    reactivityRank: 3,
    cardHint: {
      en: 'Silvery-grey Group II metal stored in a sealed container.',
      zh: '頗活潑的銀灰色第 II 族金屬，需貯存在密封的容器內。',
    },
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
        verdictLabel: {
          en: 'Reacts vigorously with dilute HCl',
          zh: '與稀氫氯酸劇烈反應',
        },
        shortStatus: { en: 'Vigorous', zh: '劇烈反應' },
        chemicalEquation: {
          en: 'Ca(s) + 2HCl(aq) → CaCl₂(aq) + H₂(g)',
          zh: 'Ca(s) + 2HCl(aq) → CaCl₂(aq) + H₂(g)',
        },
        ionicEquation: {
          en: 'Ca(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂(g)',
          zh: 'Ca(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts vigorously with rapid effervescence of colourless H₂(g); calcium dissolves to give a colourless solution and the tube warms up.',
          zh: '劇烈反應並迅速釋出無色氣泡（H₂），鈣粒溶解生成無色溶液，試管變暖。',
        },
        hkdseExplanation: {
          en: 'Calcium reacts continuously with dilute HCl because CaCl₂ is soluble (unlike CaSO₄ formed with dilute H₂SO₄, which coats calcium and stops the reaction).',
          zh: '鈣與稀氫氯酸反應生成的氯化鈣（CaCl₂）可溶於水，故反應能持續進行（相反，與稀硫酸反應會生成微溶的硫酸鈣覆蓋表面而停止）。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: {
          en: 'Reacts steadily with cold water',
          zh: '慢慢地與冷水反應',
        },
        shortStatus: { en: 'Milky Ca(OH)₂', zh: '乳濁懸浮物' },
        chemicalEquation: {
          en: 'Ca(s) + 2H₂O(l) → Ca(OH)₂(s) + H₂(g)',
          zh: 'Ca(s) + 2H₂O(l) → Ca(OH)₂(s) + H₂(g)',
        },
        observations: {
          en: 'Does not burn; sinks to the bottom and slowly releases colourless H₂(g) bubbles; forms a milky suspension of slightly soluble white Ca(OH)₂.',
          zh: '不燃燒，沉於水底並慢慢釋出無色氣泡（H₂）；燒杯變暖，生成的白色氫氧化鈣只微溶於水，形成乳濁的懸浮物。',
        },
        hkdseExplanation: {
          en: 'Classic HKDSE comparison: unlike K and Na, calcium sinks in water, does not melt or burn, and produces a milky suspension of sparingly soluble Ca(OH)₂.',
          zh: 'HKDSE 常考對比：鈣比鈉和鉀不活潑，沉於水底且不燃燒；所得乳濁液是由於生成的氫氧化鈣微溶於水所致。',
        },
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'explosive',
        verdictLabel: {
          en: 'Reacts vigorously with steam',
          zh: '與蒸汽劇烈反應',
        },
        shortStatus: { en: 'Vigorous', zh: '劇烈反應' },
        chemicalEquation: {
          en: 'Ca(s) + H₂O(g) → CaO(s) + H₂(g)',
          zh: 'Ca(s) + H₂O(g) → CaO(s) + H₂(g)',
        },
        observations: {
          en: 'Reacts vigorously when heated in steam, forming white solid calcium oxide and hydrogen gas.',
          zh: '加熱下與蒸汽劇烈反應，生成白色固態氧化鈣並釋出氫氣。',
        },
        hkdseExplanation: {
          en: 'Calcium already reacts with cold water, so its reaction with hot steam is rapid and strongly exothermic.',
          zh: '鈣已能與冷水反應，因此遇上高溫蒸汽時反應十分劇烈。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Burns with a brick-red flame',
          zh: '頗猛烈燃燒並產生磚紅色火焰',
        },
        shortStatus: { en: 'Brick-red flame', zh: '磚紅色火焰' },
        chemicalEquation: {
          en: '2Ca(s) + O₂(g) → 2CaO(s)',
          zh: '2Ca(s) + O₂(g) → 2CaO(s)',
        },
        observations: {
          en: 'On strong heating, burns fairly vigorously with a brick-red flame to produce a white powder (calcium oxide).',
          zh: '強熱下頗猛烈地燃燒，產生磚紅色火焰，並生成白色粉末（氧化鈣）。',
        },
        hkdseExplanation: {
          en: 'Key HKDSE flame colours: Potassium = lilac, Sodium = golden-yellow, Calcium = brick-red.',
          zh: '緊記 HKDSE 焰色：鉀為淡紫色、鈉為金黃色、鈣為磚紅色。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'magnesium',
    name: { en: 'Magnesium', zh: '鎂' },
    symbol: 'Mg',
    atomicNumber: 12,
    reactivityRank: 4,
    cardHint: {
      en: 'Lightweight silvery metal often used as a ribbon.',
      zh: '輕質銀白色金屬，實驗室常以鎂帶形式使用。',
    },
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
        verdictLabel: {
          en: 'Reacts rapidly with dilute HCl',
          zh: '與稀氫氯酸劇烈反應',
        },
        shortStatus: { en: 'Vigorous', zh: '劇烈反應' },
        chemicalEquation: {
          en: 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)',
          zh: 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)',
        },
        ionicEquation: {
          en: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)',
          zh: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts vigorously with rapid effervescence of colourless H₂(g); magnesium dissolves completely and the test tube becomes warm.',
          zh: '劇烈反應，金屬溶解並急速釋出無色氣泡（H₂）；由於反應釋出熱，試管變暖。',
        },
        hkdseExplanation: {
          en: 'Magnesium is well above hydrogen in the reactivity series. The evolved H₂(g) gives a "pop" sound with a burning splint.',
          zh: '鎂位於活性序較高位置，能迅速與稀氫氯酸反應，所產生的氫氣能使燃燒中的木條發出爆鳴聲（「卜」的聲響）。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No appreciable reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Magnesium ribbon remains intact in cold water with practically no visible gas bubbles.',
          zh: '鎂帶在冷水中沒有可觀察變化（幾乎不與冷水反應）。',
        },
        hkdseExplanation: {
          en: 'High-frequency HKDSE boundary! Only K, Na, and Ca react noticeably with cold water. Magnesium does not react with cold water, but reacts vigorously with steam.',
          zh: 'HKDSE 關鍵分界線：只有鉀、鈉和鈣能與冷水反應；鎂、鋁、鋅和鐵不與冷水反應，但能與蒸汽反應。',
        },
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Burns brightly in steam',
          zh: '與蒸汽劇烈反應並發出強白光',
        },
        shortStatus: { en: 'White glow', zh: '強烈白光' },
        chemicalEquation: {
          en: 'Mg(s) + H₂O(g) → MgO(s) + H₂(g)',
          zh: 'Mg(s) + H₂O(g) → MgO(s) + H₂(g)',
        },
        observations: {
          en: 'Reacts vigorously with steam, emitting an intense bright white light and forming white solid magnesium oxide plus H₂(g).',
          zh: '蒸汽與熾熱的鎂帶劇烈反應，發出強烈的白光，生成白色的固態氧化鎂並釋出氫氣。',
        },
        hkdseExplanation: {
          en: 'Notice the product with steam is the oxide MgO(s), NOT Mg(OH)₂. In the HKDSE lab setup, heated wet sand or mineral wool supplies the steam.',
          zh: '注意：金屬與蒸汽反應生成金屬氧化物（MgO）和氫，而非氫氧化物；實驗中利用加熱濕砂或濕潤礦物棉來提供蒸汽。',
        },
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Burns with a dazzling white light',
          zh: '燃燒時產生眩目的白光',
        },
        shortStatus: { en: 'White light', zh: '眩目白光' },
        chemicalEquation: {
          en: '2Mg(s) + O₂(g) → 2MgO(s)',
          zh: '2Mg(s) + O₂(g) → 2MgO(s)',
        },
        observations: {
          en: 'On strong heating, burns with a dazzling white light to produce a white powder (magnesium oxide).',
          zh: '強熱下燃燒時產生眩目的白光，並生成白色粉末（氧化鎂）。',
        },
        hkdseExplanation: {
          en: 'Classic HKDSE experiment: magnesium burns with a dazzling white light to form basic white magnesium oxide (MgO).',
          zh: '鎂在強熱下劇烈燃燒並發出眩目白光，是測定金屬氧化物實驗式的經典 HKDSE 實驗。',
        },
      },
    },
  },
  {
    id: 'aluminium',
    name: { en: 'Aluminium', zh: '鋁' },
    symbol: 'Al',
    atomicNumber: 13,
    reactivityRank: 5,
    cardHint: {
      en: 'Light silvery metal covered by a thin surface oxide film.',
      zh: '表面通常被一層薄薄的氧化鋁緊緊覆蓋着的輕金屬。',
    },
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
        verdictLabel: {
          en: 'Reacts vigorously (after oxide dissolves)',
          zh: '除去氧化層後劇烈反應',
        },
        shortStatus: { en: 'Delay → fast', zh: '先慢後快' },
        chemicalEquation: {
          en: '2Al(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂(g)',
          zh: '2Al(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂(g)',
        },
        ionicEquation: {
          en: '2Al(s) + 6H⁺(aq) → 2Al³⁺(aq) + 3H₂(g)',
          zh: '2Al(s) + 6H⁺(aq) → 2Al³⁺(aq) + 3H₂(g)',
        },
        observations: {
          en: 'Slow at first, then reacts vigorously with rapid streams of colourless H₂(g) bubbles to produce a colourless solution.',
          zh: '初時反應較慢，當表面氧化鋁層被酸溶解後，便劇烈反應並急速釋出無色氣泡（H₂），金屬溶解並釋出熱。',
        },
        hkdseExplanation: {
          en: 'Classic HKDSE exam point: Aluminium initially appears slow because of its protective Al₂O₃ coating. Once dilute HCl dissolves the oxide layer, Al reacts vigorously.',
          zh: 'HKDSE 常考要點：鋁表面覆蓋着不透水的氧化鋁（Al₂O₃）保護層；當稀氫氯酸溶解該氧化層後，鋁便會劇烈反應。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No gas bubbles or visible change when aluminium is placed in cold water.',
          zh: '在冷水中沒有任何氣泡或可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Aluminium does not react with cold water—both because it sits below calcium and because its impervious Al₂O₃ surface layer protects the metal.',
          zh: '鋁位於鈣之下，加上表面有一層緊密保護的氧化鋁層，因此不與冷水反應。',
        },
      },
      steam: {
        reacts: true,
        tier: 'vigorous',
        verdictLabel: {
          en: 'Reacts with steam (when oxide removed)',
          zh: '除去氧化層後能與蒸汽反應',
        },
        shortStatus: { en: 'Forms Al₂O₃', zh: '生成 Al₂O₃' },
        chemicalEquation: {
          en: '2Al(s) + 3H₂O(g) → Al₂O₃(s) + 3H₂(g)',
          zh: '2Al(s) + 3H₂O(g) → Al₂O₃(s) + 3H₂(g)',
        },
        observations: {
          en: 'Appears unreactive if coated with oxide; once the Al₂O₃ layer is removed, heated aluminium reacts vigorously (more than Zn, less than Mg) to form white Al₂O₃ and H₂(g).',
          zh: '若表面氧化鋁層未除去，鋁看似不反應；把氧化鋁層除去後，鋁與蒸汽的反應較鋅劇烈但較鎂溫和，生成白色氧化鋁和氫。',
        },
        hkdseExplanation: {
          en: 'Textbook note: Al’s thin Al₂O₃ layer blocks steam at first, but bare aluminium lies between Mg and Zn in reactivity with steam.',
          zh: '課本重點：氧化鋁層能防止鋁與其他物質反應；一旦除去氧化鋁，鋁與蒸汽的反應劇烈程度介乎鎂和鋅之間。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: {
          en: 'Burns when powdered; forms Al₂O₃',
          zh: '鋁粉強熱燃燒生成白色氧化鋁',
        },
        shortStatus: { en: 'Forms Al₂O₃', zh: '白色粉末' },
        chemicalEquation: {
          en: '4Al(s) + 3O₂(g) → 2Al₂O₃(s)',
          zh: '4Al(s) + 3O₂(g) → 2Al₂O₃(s)',
        },
        observations: {
          en: 'On strong heating, aluminium powder burns while releasing a large amount of heat to form white powder (Al₂O₃).',
          zh: '強熱下，鋁粉燃燒時釋出大量熱，並生成白色粉末（氧化鋁）。',
        },
        hkdseExplanation: {
          en: 'Aluminium reacts with oxygen to form a tough, impervious Al₂O₃ film on solid sheets, while aluminium powder burns vigorously.',
          zh: '鋁與氧反應生成緊密的氧化鋁保護層，因而能保護鋁製品免受進一步腐蝕；鋁粉在強熱下則會劇烈燃燒。',
        },
      },
    },
  },
  {
    id: 'zinc',
    name: { en: 'Zinc', zh: '鋅' },
    symbol: 'Zn',
    atomicNumber: 30,
    reactivityRank: 6,
    cardHint: {
      en: 'Bluish-silver metal used to galvanize steel.',
      zh: '帶微藍的銀白色金屬，常用於鍍鋅以防止鐵器生鏽。',
    },
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
        verdictLabel: {
          en: 'Reacts moderately with dilute HCl',
          zh: '與稀氫氯酸以適中速率反應',
        },
        shortStatus: { en: 'Moderate', zh: '速率適中' },
        chemicalEquation: {
          en: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)',
          zh: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)',
        },
        ionicEquation: {
          en: 'Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)',
          zh: 'Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts steadily with moderate effervescence of colourless H₂(g); zinc granules dissolve to give a colourless solution.',
          zh: '穩定地釋出無色氣泡（H₂），鋅粒逐漸溶解生成無色氯化鋅溶液，試管變暖。',
        },
        hkdseExplanation: {
          en: 'Zinc reacts at a convenient, moderate rate with dilute HCl, making it ideal for preparing hydrogen gas in the school lab.',
          zh: '鋅與稀氫氯酸反應的劇烈程度低於鎂、鋁，但高於鐵，反應速率適中，適合在實驗室製備氫氣。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Zinc granules sink in cold water with no gas bubbles or visible change.',
          zh: '鋅粒沉於冷水底，沒有任何氣泡或可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Zinc is not reactive enough to react with cold water; it requires steam (hot water vapour) to displace hydrogen.',
          zh: '鋅的活性不足以與冷水反應，必須與高溫蒸汽反應才可釋出氫氣。',
        },
      },
      steam: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: {
          en: 'Reacts with steam on heating',
          zh: '強熱下與蒸汽反應',
        },
        shortStatus: { en: 'ZnO (Y→W)', zh: '熱黃冷白 ZnO' },
        chemicalEquation: {
          en: 'Zn(s) + H₂O(g) → ZnO(s) + H₂(g)',
          zh: 'Zn(s) + H₂O(g) → ZnO(s) + H₂(g)',
        },
        observations: {
          en: 'Heated zinc reacts steadily (less vigorously than Mg) with steam to form zinc oxide (yellow when hot, white when cold) and H₂(g).',
          zh: '與蒸汽反應的劇烈程度低於鎂，生成氧化鋅（高溫時呈黃色，冷卻後呈白色）及無色氫氣。',
        },
        hkdseExplanation: {
          en: 'Must-know HKDSE colour detail: Zinc oxide (ZnO) is yellow when hot and white when cold!',
          zh: 'HKDSE 必考顏色變化：氧化鋅（ZnO）在高溫時呈黃色，冷卻後變回白色！',
        },
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: {
          en: 'Burns to form ZnO (yellow hot, white cold)',
          zh: '強熱燃燒生成氧化鋅（熱黃冷白）',
        },
        shortStatus: { en: 'ZnO (Y→W)', zh: '熱黃冷白 ZnO' },
        chemicalEquation: {
          en: '2Zn(s) + O₂(g) → 2ZnO(s)',
          zh: '2Zn(s) + O₂(g) → 2ZnO(s)',
        },
        observations: {
          en: 'On strong heating, zinc powder burns with heat released to form powder that is yellow when hot and white after cooling.',
          zh: '強熱下鋅粉燃燒時釋出熱，並生成粉末（高溫時呈黃色，冷卻後呈白色）。',
        },
        hkdseExplanation: {
          en: 'Remember the reversible colour change of ZnO: yellow when hot, white upon cooling (compare with PbO: orange when hot, yellow when cold).',
          zh: '注意對比兩種氧化物：氧化鋅（ZnO）高溫時呈黃色、冷卻後呈白色；氧化鉛(II)（PbO）高溫時呈橙色、冷卻後呈黃色。',
        },
      },
    },
  },
  {
    id: 'iron',
    name: { en: 'Iron', zh: '鐵' },
    symbol: 'Fe',
    atomicNumber: 26,
    reactivityRank: 7,
    cardHint: {
      en: 'Most widely produced metal; rusts to reddish-brown.',
      zh: '產量最高的金屬；暴露於空氣及水中會生鏽呈紅棕色。',
    },
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
        verdictLabel: {
          en: 'Reacts slowly; pale green FeCl₂(aq)',
          zh: '緩慢反應並生成淺綠色 FeCl₂(aq)',
        },
        shortStatus: { en: 'Pale green', zh: '淺綠色溶液' },
        chemicalEquation: {
          en: 'Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)',
          zh: 'Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)',
        },
        ionicEquation: {
          en: 'Fe(s) + 2H⁺(aq) → Fe²⁺(aq) + H₂(g)',
          zh: 'Fe(s) + 2H⁺(aq) → Fe²⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts slowly with gentle bubbling of colourless H₂(g); the colourless acid turns pale green due to Fe²⁺(aq).',
          zh: '緩慢地反應並釋出無色氣泡（H₂）；由於生成 Fe²⁺(aq) 離子，無色溶液漸變為淺綠色。',
        },
        hkdseExplanation: {
          en: 'Crucial HKDSE rule: Dilute HCl oxidises iron only to pale green iron(II) chloride (FeCl₂), NOT yellow-brown iron(III) chloride (FeCl₃).',
          zh: 'HKDSE 高頻陷阱：稀氫氯酸只會把鐵氧化成淺綠色的氯化鐵(II)（FeCl₂），而不是黃棕色的氯化鐵(III)（FeCl₃）。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No direct reaction with air-free cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Clean iron shows no bubbling or hydrogen evolution in cold water.',
          zh: '潔淨的鐵在冷水中沒有氣泡產生（不會置換出氫）。',
        },
        hkdseExplanation: {
          en: 'Iron does not displace hydrogen from cold water. (Rusting requires BOTH water and oxygen over time; cold water alone does not react.)',
          zh: '鐵位於活性序中游，不能與冷水反應產生氫氣（鐵生鏽需同時有水和氧的存在）。',
        },
        isExamTrap: true,
      },
      steam: {
        reacts: true,
        tier: 'slow',
        verdictLabel: {
          en: 'Reacts slowly with steam to form Fe₃O₄',
          zh: '與蒸汽緩慢反應生成黑色 Fe₃O₄',
        },
        shortStatus: { en: 'Black Fe₃O₄', zh: '黑色 Fe₃O₄' },
        chemicalEquation: {
          en: '3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g)',
          zh: '3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g)',
        },
        observations: {
          en: 'Red-hot iron reacts slowly with steam (less vigorously than Zn), turning into black solid Fe₃O₄ and evolving H₂(g).',
          zh: '熾熱的鐵與蒸汽緩慢反應（劇烈程度較鋅更低），生成黑色固體氧化鐵(II、III)（Fe₃O₄）及氫氣。',
        },
        hkdseExplanation: {
          en: 'High-frequency HKDSE trap! Heating iron in steam produces black triiron tetraoxide (Fe₃O₄, containing both FeO and Fe₂O₃), NOT rust.',
          zh: 'HKDSE 必考重點：鐵與蒸汽反應生成的是黑色的「氧化鐵(II、III)」（Fe₃O₄，同時含有氧化鐵(II) 和氧化鐵(III)），而非鐵鏽！',
        },
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'moderate',
        verdictLabel: {
          en: 'Burns with yellow sparks to form Fe₃O₄',
          zh: '產生黃色火花並生成黑色 Fe₃O₄',
        },
        shortStatus: { en: 'Yellow sparks', zh: '黃色火花' },
        chemicalEquation: {
          en: '3Fe(s) + 2O₂(g) → Fe₃O₄(s)',
          zh: '3Fe(s) + 2O₂(g) → Fe₃O₄(s)',
        },
        observations: {
          en: 'On strong heating, iron powder burns with yellow sparks (without a flame) and forms a black solid (Fe₃O₄).',
          zh: '強熱下，鐵粉燃燒時產生黃色火花（不見火焰），並生成黑色固體（氧化鐵(II、III)，Fe₃O₄）。',
        },
        hkdseExplanation: {
          en: 'Iron powder emits yellow sparks in air/oxygen to form black Fe₃O₄ (iron(II, III) oxide).',
          zh: '課本重點：鐵粉燃燒時產生黃色火花而非火焰，產物為黑色的氧化鐵(II、III)（Fe₃O₄）。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'tin',
    name: { en: 'Tin', zh: '錫' },
    symbol: 'Sn',
    atomicNumber: 50,
    reactivityRank: 8,
    cardHint: {
      en: 'Silvery malleable metal used in food cans and solder.',
      zh: '富展性的銀白色金屬，常用於鍍錫鐵罐及焊料合金。',
    },
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
        verdictLabel: {
          en: 'Reacts very slowly with dilute HCl',
          zh: '與稀氫氯酸反應非常緩慢',
        },
        shortStatus: { en: 'Very slow', zh: '非常緩慢' },
        chemicalEquation: {
          en: 'Sn(s) + 2HCl(aq) → SnCl₂(aq) + H₂(g)',
          zh: 'Sn(s) + 2HCl(aq) → SnCl₂(aq) + H₂(g)',
        },
        ionicEquation: {
          en: 'Sn(s) + 2H⁺(aq) → Sn²⁺(aq) + H₂(g)',
          zh: 'Sn(s) + 2H⁺(aq) → Sn²⁺(aq) + H₂(g)',
        },
        observations: {
          en: 'Reacts very slowly at room temperature (faster when warmed) with sparse colourless bubbles of H₂(g).',
          zh: '常溫下與稀氫氯酸反應非常緩慢（微熱時加快），表面只產生少量無色氫氣氣泡。',
        },
        hkdseExplanation: {
          en: 'Tin sits just above lead and hydrogen in the HKDSE reactivity series, so it displaces hydrogen from dilute HCl, though much more slowly than iron.',
          zh: '錫在活性序中位於鉛和氫之上，故能與稀氫氯酸反應生成氯化錫(II)及氫氣，但速率遠低於鐵和鋅。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Tin remains shiny and unreactive in cold water with no gas bubbles.',
          zh: '錫在冷水中保持光澤，不發生任何反應。',
        },
        hkdseExplanation: {
          en: 'Tin is too low in the reactivity series to react with cold water — one reason tin-plating is used on food cans.',
          zh: '錫不與冷水反應，因此常用作食品罐頭（馬口鐵）的防鏽鍍層。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Even when strongly heated, tin shows no reaction with steam.',
          zh: '即使在強烈加熱下，錫也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'In the HKDSE curriculum, steam reacts with metals from K down to Fe; metals below iron (Sn, Pb, Cu, Hg, Ag, Pt, Au) do not react with steam.',
          zh: '根據 HKDSE 課程，能與蒸汽反應的金屬止於鐵（K 至 Fe）；鐵以下的金屬（錫、鉛、銅、汞、銀、鉑、金）均不與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: {
          en: 'Oxidises slowly on strong heating',
          zh: '強熱下緩慢氧化生成 SnO₂',
        },
        shortStatus: { en: 'Forms SnO₂', zh: '生成 SnO₂' },
        chemicalEquation: {
          en: 'Sn(s) + O₂(g) → SnO₂(s)',
          zh: 'Sn(s) + O₂(g) → SnO₂(s)',
        },
        observations: {
          en: 'Melts without burning and slowly forms a white/pale yellow surface layer of tin(IV) oxide when heated strongly.',
          zh: '強熱下熔化但不燃燒，表面緩慢氧化生成白色或淡黃色的氧化錫(IV)。',
        },
        hkdseExplanation: {
          en: 'Tin does not burn in air, but like lead and copper it reacts slowly with oxygen on strong heating.',
          zh: '錫與鉛和銅一樣在空氣中加熱時不燃燒，但會緩慢與氧反應生成金屬氧化物。',
        },
      },
    },
  },
  {
    id: 'lead',
    name: { en: 'Lead', zh: '鉛' },
    symbol: 'Pb',
    atomicNumber: 82,
    reactivityRank: 9,
    cardHint: {
      en: 'Dense bluish-grey metal used in radiation shielding.',
      zh: '密度甚高的藍灰色金屬，常用於防輻射屏蔽。',
    },
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
        verdictLabel: {
          en: 'Reacts very slowly, then stops (PbCl₂)',
          zh: '反應非常慢並隨即停止（PbCl₂）',
        },
        shortStatus: { en: 'Stops (PbCl₂)', zh: '生成 PbCl₂ 停止' },
        chemicalEquation: {
          en: 'Pb(s) + 2HCl(aq) → PbCl₂(s) + H₂(g)',
          zh: 'Pb(s) + 2HCl(aq) → PbCl₂(s) + H₂(g)',
        },
        ionicEquation: {
          en: 'Pb(s) + 2H⁺(aq) + 2Cl⁻(aq) → PbCl₂(s) + H₂(g)',
          zh: 'Pb(s) + 2H⁺(aq) + 2Cl⁻(aq) → PbCl₂(s) + H₂(g)',
        },
        observations: {
          en: 'A few tiny bubbles of H₂(g) appear initially, then the reaction quickly stops as white insoluble PbCl₂ coats the lead.',
          zh: '反應非常慢，初時表面有極少量氣泡，隨即因生成不溶於水的白色氯化鉛(II) 覆蓋鉛表面而停止反應。',
        },
        hkdseExplanation: {
          en: 'High-frequency HKDSE trap! Lead is above H in the reactivity series so it DOES react initially, but insoluble PbCl₂(s) forms a protective layer that halts further reaction.',
          zh: 'HKDSE 高頻陷阱！鉛在活性序中位於氫之上，故會與稀氫氯酸發生反應，但因生成的氯化鉛(II)（PbCl₂）不溶於水並緊密覆蓋表面，阻礙反應繼續進行。',
        },
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No effervescence or visible change when lead is placed in cold water.',
          zh: '在冷水中沒有氣泡或可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Lead lies far below calcium in the reactivity series and does not react with cold water.',
          zh: '鉛的活性低於鈣，不與冷水或熱水反應。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Even on strong heating, lead produces no hydrogen gas with steam.',
          zh: '即使在強烈加熱下，鉛也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'Lead sits below iron in the HKDSE Metal Reactivity Series and cannot react with steam.',
          zh: '課本重點（表 11.3）：鉛位於鐵之下，即使強烈加熱也不與冷水或蒸汽反應。',
        },
        isExamTrap: true,
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: {
          en: 'Oxidises on heating to PbO (orange hot, yellow cold)',
          zh: '強熱熔化並生成氧化鉛(II)（熱橙冷黃）',
        },
        shortStatus: { en: 'PbO (O→Y)', zh: '熱橙冷黃 PbO' },
        chemicalEquation: {
          en: '2Pb(s) + O₂(g) → 2PbO(s)',
          zh: '2Pb(s) + O₂(g) → 2PbO(s)',
        },
        observations: {
          en: 'Melts without burning and forms lead(II) oxide powder on the surface: orange when hot, yellow after cooling.',
          zh: '強熱下熔化但不燃燒，並在表面生成粉末（高溫時呈橙色，冷卻後呈黃色）。',
        },
        hkdseExplanation: {
          en: 'Key HKDSE observation: PbO is orange when hot and yellow when cold (compare with ZnO: yellow when hot, white when cold).',
          zh: 'HKDSE 必考觀察：鉛與氧反應時不燃燒，生成的氧化鉛(II)（PbO）高溫時呈橙色，冷卻後呈黃色。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'copper',
    name: { en: 'Copper', zh: '銅' },
    symbol: 'Cu',
    atomicNumber: 29,
    reactivityRank: 10,
    cardHint: {
      en: 'Reddish-brown metal prized for electrical wiring.',
      zh: '紅棕色金屬，具極佳導電性，常用作電線及水管。',
    },
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
        verdictLabel: {
          en: 'No reaction with dilute HCl',
          zh: '不與稀氫氯酸反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        ionicEquation: {
          en: 'Cu(s) + H⁺(aq) → No reaction',
          zh: 'Cu(s) + H⁺(aq) → 沒有反應',
        },
        observations: {
          en: 'No observable change; reddish-brown copper metal stays intact with zero gas bubbles.',
          zh: '沒有可觀察變化；紅棕色的銅保持不變，沒有釋出任何氣泡。',
        },
        hkdseExplanation: {
          en: 'Copper sits below hydrogen in the HKDSE Metal Reactivity Series, so it cannot displace hydrogen from dilute HCl(aq). (Note: Cu only reacts with oxidising acids like HNO₃.)',
          zh: '銅在金屬活性序中位於氫之下，不能從稀氫氯酸置換出氫氣。（注意：銅只與具氧化性的硝酸反應，不與稀氫氯酸或稀硫酸反應。）',
        },
        isExamTrap: true,
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Reddish-brown copper shows zero change in cold water.',
          zh: '紅棕色的銅在冷水中沒有任何變化。',
        },
        hkdseExplanation: {
          en: 'Copper is unreactive towards water, which is why copper pipes are widely used for cold and hot water plumbing.',
          zh: '銅不與冷水或熱水反應，因此廣泛用於製造供水喉管。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Even when heated strongly in steam, copper produces no hydrogen gas.',
          zh: '即使在強烈加熱下，銅也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'Copper sits below hydrogen and iron in the reactivity series and does not react with steam.',
          zh: '銅位於活性序較低位置，即使強烈加熱也不與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: {
          en: 'Surface turns black (CuO) on very strong heating',
          zh: '非常強熱下表面變為黑色（CuO）',
        },
        shortStatus: { en: 'Black CuO', zh: '黑色 CuO' },
        chemicalEquation: {
          en: '2Cu(s) + O₂(g) → 2CuO(s)',
          zh: '2Cu(s) + O₂(g) → 2CuO(s)',
        },
        observations: {
          en: 'Does not burn with a flame, but on very strong heating the reddish-brown surface turns black as copper(II) oxide forms.',
          zh: '在非常強熱下不燃燒，但紅棕色表面變為黑色（生成氧化銅(II)，CuO）。',
        },
        hkdseExplanation: {
          en: 'Important HKDSE distinction! Copper does NOT react with water, steam, or dilute HCl, yet it DOES react with oxygen on very strong heating to form black CuO.',
          zh: 'HKDSE 重要區別：銅不與水、蒸汽或稀氫氯酸反應，但在非常強熱下會與氧反應，令表面變為黑色的氧化銅(II)。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'mercury',
    name: { en: 'Mercury', zh: '汞' },
    symbol: 'Hg',
    atomicNumber: 80,
    reactivityRank: 11,
    cardHint: {
      en: 'Silvery liquid metal at room temperature (the only liquid metal).',
      zh: '常溫下唯一呈液態的銀白色金屬（俗稱水銀）。',
    },
    palette: {
      backdropTop: '#4c596b',
      backdropBottom: '#69778c',
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
        verdictLabel: {
          en: 'No reaction with dilute HCl',
          zh: '不與稀氫氯酸反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        ionicEquation: {
          en: 'Hg(l) + H⁺(aq) → No reaction',
          zh: 'Hg(l) + H⁺(aq) → 沒有反應',
        },
        observations: {
          en: 'Liquid mercury settles at the bottom of dilute HCl with no gas bubbles or observable change.',
          zh: '液態汞沉於稀氫氯酸底部，沒有氣泡或任何可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Mercury lies below hydrogen in the HKDSE Metal Reactivity Series and cannot displace hydrogen from dilute acids.',
          zh: '汞是活性最低的金屬之一，位於氫之下，因此與稀氫氯酸或稀硫酸均沒有反應。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Silvery liquid mercury sinks to the bottom of cold water with no reaction.',
          zh: '銀白色液態汞沉於冷水底，不發生任何反應。',
        },
        hkdseExplanation: {
          en: 'Only K, Na, and Ca react with cold water; mercury is near the bottom of the reactivity series.',
          zh: '只有鉀、鈉和鈣能與冷水反應；汞的活性甚低，不與冷水反應。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Even when strongly heated, mercury shows no reaction with steam.',
          zh: '即使在強烈加熱下，汞也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'In the HKDSE curriculum, metals below iron (Pb, Cu, Hg, Ag, Pt, Au) do not react with steam.',
          zh: '課本第 34 頁明確指出：鉛、銅、汞、銀、鉑和金即使在強烈加熱下，也不與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: true,
        tier: 'slow',
        verdictLabel: {
          en: 'Forms red HgO powder on very strong heating',
          zh: '非常強熱下表面生成紅色粉末（HgO）',
        },
        shortStatus: { en: 'Red HgO', zh: '紅色 HgO' },
        chemicalEquation: {
          en: '2Hg(l) + O₂(g) → 2HgO(s)',
          zh: '2Hg(l) + O₂(g) → 2HgO(s)',
        },
        observations: {
          en: 'Does not burn, but on very strong heating in air, a red powder (mercury(II) oxide) forms on the surface.',
          zh: '非常強熱下不燃燒，但表面會生成紅色粉末（氧化汞(II)，HgO）。',
        },
        hkdseExplanation: {
          en: 'Key HKDSE Table 11.1 point! Mercury (like Cu) reacts slowly with oxygen on very strong heating to form red HgO, whereas Ag, Pt, and Au do not react with oxygen.',
          zh: 'HKDSE 課本表 11.1 重點：汞在非常強熱下能與氧反應生成紅色的氧化汞(II)；至於銀、鉑和金即使非常強熱亦不與氧反應。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'silver',
    name: { en: 'Silver', zh: '銀' },
    symbol: 'Ag',
    atomicNumber: 47,
    reactivityRank: 12,
    cardHint: {
      en: 'Lustrous precious metal with the highest conductivity.',
      zh: '導電性最高的閃亮貴金屬，常用作首飾及餐具。',
    },
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
        verdictLabel: {
          en: 'No reaction with dilute HCl',
          zh: '不與稀氫氯酸反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        ionicEquation: {
          en: 'Ag(s) + H⁺(aq) → No reaction',
          zh: 'Ag(s) + H⁺(aq) → 沒有反應',
        },
        observations: {
          en: 'No observable change; bright silvery metal shows no effervescence or dissolution.',
          zh: '沒有可觀察變化；銀塊保持光澤，沒有釋出任何氣泡。',
        },
        hkdseExplanation: {
          en: 'Silver lies below hydrogen in the Metal Reactivity Series and cannot displace hydrogen from dilute hydrochloric acid.',
          zh: '銀位於活性序的底部（在氫之下），不能與稀氫氯酸發生反應。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Silver stays bright and unchanged in cold water.',
          zh: '銀在冷水中沒有任何可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Silver is near the bottom of the reactivity series and does not react with cold water.',
          zh: '銀的活性極低，不與冷水或熱水反應。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No visible change even when silver is strongly heated in steam.',
          zh: '即使在強烈加熱下，銀也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'Silver is far too unreactive to displace hydrogen from steam.',
          zh: '銀位於活性序底部，即使強烈加熱亦不能與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction even on very strong heating',
          zh: '非常強熱下也沒有可觀察變化',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Silver shows no observable change even under very strong heating in oxygen/air.',
          zh: '即使在非常強熱下也沒有可觀察變化（不與氧反應）。',
        },
        hkdseExplanation: {
          en: 'Key HKDSE boundary: Cu and Hg react on very strong heating with oxygen, whereas Ag, Pt, and Au do not react with oxygen at all.',
          zh: 'HKDSE 關鍵分界線：銅與汞在非常強熱下能與氧反應，但銀、鉑和金即使在非常強熱下也不與氧反應。',
        },
        isExamTrap: true,
      },
    },
  },
  {
    id: 'platinum',
    name: { en: 'Platinum', zh: '鉑' },
    symbol: 'Pt',
    atomicNumber: 78,
    reactivityRank: 13,
    cardHint: {
      en: 'Dense silvery-white noble metal used for flame-test wires.',
      zh: '密度高的銀白色貴金屬（白金），常用於焰色試驗鉑絲。',
    },
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
        verdictLabel: {
          en: 'No reaction with dilute HCl',
          zh: '不與稀氫氯酸反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        ionicEquation: {
          en: 'Pt(s) + H⁺(aq) → No reaction',
          zh: 'Pt(s) + H⁺(aq) → 沒有反應',
        },
        observations: {
          en: 'No observable change; platinum remains completely inert in dilute hydrochloric acid.',
          zh: '沒有可觀察變化；鉑在稀氫氯酸中完全不反應。',
        },
        hkdseExplanation: {
          en: 'Platinum lies near the bottom of the HKDSE Metal Reactivity Series (below H) and does not react with dilute HCl(aq).',
          zh: '鉑屬於活性最低的金屬，位於氫之下，不與稀氫氯酸發生反應。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No observable change in cold water.',
          zh: '在冷水中沒有任何可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Platinum is extremely unreactive and does not react with cold water.',
          zh: '鉑極不活潑，不與冷水或熱水反應。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No observable change even when strongly heated in steam.',
          zh: '即使在強烈加熱下，鉑也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'Platinum does not react with steam at any temperature.',
          zh: '鉑在強烈加熱下亦完全不與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction even on very strong heating',
          zh: '非常強熱下也沒有可觀察變化',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Remains bright silvery-white with no observable change even under very strong heating in air.',
          zh: '非常強熱下也沒有可觀察變化，保持銀白色光澤。',
        },
        hkdseExplanation: {
          en: 'Because platinum does not react with oxygen when strongly heated in a Bunsen flame, platinum wire is ideal for flame tests.',
          zh: '鉑即使在非常強熱下亦不與氧反應，因此常用作焰色試驗的鉑絲。',
        },
      },
    },
  },
  {
    id: 'gold',
    name: { en: 'Gold', zh: '金' },
    symbol: 'Au',
    atomicNumber: 79,
    reactivityRank: 14,
    cardHint: {
      en: 'Malleable yellow precious metal found native in nature.',
      zh: '最不活潑的黃色貴金屬，在自然界常以游離元素形式存在。',
    },
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
        verdictLabel: {
          en: 'No reaction with dilute HCl',
          zh: '不與稀氫氯酸反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        ionicEquation: {
          en: 'Au(s) + H⁺(aq) → No reaction',
          zh: 'Au(s) + H⁺(aq) → 沒有反應',
        },
        observations: {
          en: 'No observable change; the yellow gold remains completely unaffected in dilute HCl.',
          zh: '沒有可觀察變化；黃色金塊在稀氫氯酸中完全不變。',
        },
        hkdseExplanation: {
          en: 'Gold sits at the very bottom of the HKDSE Metal Reactivity Series (below H), so it has no reaction with dilute hydrochloric acid.',
          zh: '金位於金屬活性序的最底端（活性最低），完全不與稀氫氯酸反應。',
        },
      },
      water: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with cold water',
          zh: '不與冷水反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No observable change; gold stays completely inert.',
          zh: '沒有任何可觀察變化。',
        },
        hkdseExplanation: {
          en: 'Gold is unreactive towards water, which is why gold artefacts remain intact underwater for centuries.',
          zh: '金不與水反應，因此海底沉船中的金器歷經數百年仍能保持閃亮。',
        },
      },
      steam: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction with steam',
          zh: '不與蒸汽反應',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'No observable change when gold is heated in steam.',
          zh: '即使在強烈加熱下，金也不與蒸汽反應。',
        },
        hkdseExplanation: {
          en: 'Gold is the least reactive metal in Table 11.3 and never reacts with steam.',
          zh: '金是活性序中最不活潑的金屬，完全不與蒸汽反應。',
        },
      },
      oxygen: {
        reacts: false,
        tier: 'unreactive',
        verdictLabel: {
          en: 'No reaction even on very strong heating',
          zh: '非常強熱下也沒有可觀察變化',
        },
        shortStatus: { en: 'No reaction', zh: '不反應' },
        chemicalEquation: NO_REACTION_EQ,
        observations: {
          en: 'Gold stays shiny yellow and does not oxidise even under very strong heating in air.',
          zh: '非常強熱下也沒有可觀察變化，仍然保持閃亮黃色。',
        },
        hkdseExplanation: {
          en: 'Gold is found native (uncombined) in Earth’s crust because it does not react with oxygen, water, or dilute acids.',
          zh: '金極不活潑，即使在非常強熱下亦不與氧反應，故在自然界中能以純金屬形式存在。',
        },
      },
    },
  },
] as const;

export function getMetalById(id: string): MetalItem | undefined {
  return METALS.find((m) => m.id === id);
}
