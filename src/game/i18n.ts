export type Language = 'en' | 'zh-HK';

export interface LocalizedText {
  en: string;
  zh: string;
}

const STORAGE_KEY = 'hkdse_metal_reactions_lang';

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh-HK') {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

export function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage access errors
  }
}

export function pickText(text: LocalizedText, lang: Language): string {
  return lang === 'zh-HK' ? text.zh : text.en;
}

export const UI_COPY = {
  en: {
    appTitle: 'HKDSE Metal Reactions',
    appSubtitle:
      'Test all 14 metals with dilute HCl, cold water, steam, and oxygen with instant HKDSE explanations.',
    toggleLangLabel: '繁中',
    toggleLangAria: 'Switch language to Traditional Chinese',
    stepSubstance: '1. Choose Substance',
    stepDeckMode: '2. Choose Deck Mode',
    substanceMixed: 'Mixed Revision',
    substanceMixedFormula: 'All 4 Substances',
    modeAllTitle: 'All 14 Metals',
    modeAllDetail: 'Full HKDSE set (K to Au)',
    modeTrapsTitle: 'Exam Traps',
    modeTrapsDetail: 'High-frequency DSE traps',
    modeBlitzTitle: 'Quick Blitz',
    modeBlitzDetail: '7 random cards',
    startPractice: 'Start Swipe Practice',
    openReferenceTable: 'HKDSE Reactivity Reference Table',
    titleControlHint:
      'Swipe Left or ← Reacts · Swipe Right or → No Reaction · Enter/Space Start',
    headerMixedTitle: 'Metal Reactions',
    headerHcl: 'Metal × HCl',
    headerWater: 'Metal × Water',
    headerSteam: 'Metal × Steam',
    headerOxygen: 'Metal × O₂',
    scoreLabel: 'Score',
    streakLabel: 'Streak',
    atomicNoPrefix: 'Atomic No.',
    swipeHintCard: 'Swipe left or right · or tap action below',
    reactsBtn: 'Reacts',
    noReactionBtn: 'No Reaction',
    noReactionStamp: 'NO REACTION',
    keyboardHint: 'Keyboard: ← Reacts · → No Reaction · P Pause · M Mute',
    correctBanner: 'Correct!',
    incorrectBannerPrefix: 'Incorrect — You chose',
    ptsUnit: 'pts',
    minusLife: '-1 Life',
    chemicalEquationLabel: 'Chemical Equation',
    ionicEquationLabel: 'Ionic Equation',
    observationLabel: 'Observation',
    explanationLabel: 'HKDSE Curriculum Explanation',
    nextCardBtn: 'Next Card',
    finishRunBtn: 'Finish Run',
    viewSummaryBtn: 'View Summary',
    swipeHintFeedback: 'Swipe left or right anywhere · or tap above',
    swipeNextBadge: 'NEXT',
    swipeSummaryBadge: 'SUMMARY',
    matrixTitle: 'HKDSE Reactivity Matrix',
    all4Tab: 'All 4',
    all4SubstancesLabel: 'All 4 Substances',
    checkedSuffix: 'Checked',
    metalCol: 'Metal',
    waterCol: 'H₂O',
    steamCol: 'Steam',
    hclCol: 'HCl',
    oxygenCol: 'O₂',
    matrixLegendReacts: '✓ Reacts',
    matrixLegendNone: '× No Reaction',
    metalsCountLabel: '14 Metals',
    loggedSuffix: 'Logged',
    mostReactive: 'Most Reactive',
    leastReactive: 'Least Reactive',
    pauseTitle: 'Practice Paused',
    resumeBtn: 'Resume',
    reactivityGuideBtn: 'HKDSE Reactivity Series',
    restartBtn: 'Restart Deck',
    changeModeBtn: 'Change Substance / Mode',
    victoryTitle: 'Deck Completed!',
    defeatTitle: 'Out of Hearts',
    victorySubtitle: 'All cards in this deck have been classified.',
    defeatSubtitlePrefix: 'Completed',
    defeatSubtitleMiddle: 'of',
    defeatSubtitleSuffix: 'cards.',
    accuracyLabel: 'Accuracy',
    bestStreakLabel: 'Best Streak',
    perfectRunMsg:
      'Perfect run! You accurately predicted every metal reaction in this deck.',
    reviewHeading: 'Reactions to Review',
    playAgainBtn: 'Play Again',
    substanceMenuBtn: 'Substance Menu',
    referenceModalTitle: 'HKDSE Reactivity Reference',
    ariaLivesRemaining: (lives: number, max: number) =>
      `${lives} of ${max} lives remaining`,
    ariaOpenLog: 'Open reactivity series log',
    ariaMute: 'Mute sound effects',
    ariaUnmute: 'Unmute sound effects',
    ariaPause: 'Pause practice',
    ariaResume: 'Resume practice',
    ariaCloseRef: 'Close reference guide',
    ariaReactsWith: (reagent: string) => `Reacts with ${reagent}`,
    ariaNoReactionWith: (reagent: string) => `No reaction with ${reagent}`,
    ariaAnsweredCorrect: 'Answered correctly',
    ariaAnsweredWrong: 'Answered incorrectly',
  },
  'zh-HK': {
    appTitle: 'HKDSE 金屬反應溫習',
    appSubtitle:
      '測試 14 種金屬與稀氫氯酸、冷水、蒸汽及氧的反應，即時查看 HKDSE 方程式與觀察重點。',
    toggleLangLabel: 'EN',
    toggleLangAria: '切換至英文介面 (Switch to English)',
    stepSubstance: '1. 選擇反應物',
    stepDeckMode: '2. 選擇練習模式',
    substanceMixed: '綜合溫習',
    substanceMixedFormula: '全部 4 種反應物',
    modeAllTitle: '全部 14 種金屬',
    modeAllDetail: '完整 HKDSE 金屬活性序 (鉀至金)',
    modeTrapsTitle: 'DSE 常見陷阱',
    modeTrapsDetail: '重點考試易錯題目',
    modeBlitzTitle: '7 題快測',
    modeBlitzDetail: '隨機抽取 7 張卡片',
    startPractice: '開始滑動練習',
    openReferenceTable: 'HKDSE 金屬活性序總表',
    titleControlHint:
      '向左滑動／← 會反應 · 向右滑動／→ 不反應 · Enter/Space 開始',
    headerMixedTitle: '金屬的活性',
    headerHcl: '金屬 × 稀氫氯酸',
    headerWater: '金屬 × 冷水',
    headerSteam: '金屬 × 蒸汽',
    headerOxygen: '金屬 × 氧',
    scoreLabel: '分數',
    streakLabel: '連對',
    atomicNoPrefix: '原子序',
    swipeHintCard: '向左或向右滑動 · 或點擊下方按鈕',
    reactsBtn: '會反應',
    noReactionBtn: '不反應',
    noReactionStamp: '不反應',
    keyboardHint: '鍵盤操作：← 會反應 · → 不反應 · P 暫停 · M 靜音',
    correctBanner: '答對了！',
    incorrectBannerPrefix: '答錯了 — 你選擇了',
    ptsUnit: '分',
    minusLife: '-1 生命',
    chemicalEquationLabel: '化學方程式',
    ionicEquationLabel: '離子方程式',
    observationLabel: '實驗觀察',
    explanationLabel: 'HKDSE 課程重點解釋',
    nextCardBtn: '下一題',
    finishRunBtn: '完成練習',
    viewSummaryBtn: '查看總結',
    swipeHintFeedback: '左右滑動卡片繼續 · 或點擊上方按鈕',
    swipeNextBadge: '下一題',
    swipeSummaryBadge: '總結',
    matrixTitle: 'HKDSE 金屬活性序總表',
    all4Tab: '全部',
    all4SubstancesLabel: '全部 4 種反應物',
    checkedSuffix: '已作答',
    metalCol: '金屬',
    waterCol: '冷水',
    steamCol: '蒸汽',
    hclCol: '稀酸',
    oxygenCol: '氧',
    matrixLegendReacts: '✓ 會反應',
    matrixLegendNone: '× 不反應',
    metalsCountLabel: '14 種金屬',
    loggedSuffix: '已記錄',
    mostReactive: '最活潑',
    leastReactive: '最不活潑',
    pauseTitle: '練習已暫停',
    resumeBtn: '繼續練習',
    reactivityGuideBtn: '金屬活性序參考表',
    restartBtn: '重新開始',
    changeModeBtn: '更換反應物／模式',
    victoryTitle: '練習完成！',
    defeatTitle: '生命值已耗盡',
    victorySubtitle: '已完成本組所有金屬反應題目。',
    defeatSubtitlePrefix: '已完成',
    defeatSubtitleMiddle: '／',
    defeatSubtitleSuffix: '題。',
    accuracyLabel: '準確率',
    bestStreakLabel: '最高連對',
    perfectRunMsg: '表現出色！你已準確掌握本組所有金屬的反應規律。',
    reviewHeading: '需要重溫的反應',
    playAgainBtn: '再玩一次',
    substanceMenuBtn: '返回主選單',
    referenceModalTitle: 'HKDSE 金屬活性序參考',
    ariaLivesRemaining: (lives: number, max: number) =>
      `剩餘 ${lives} / ${max} 顆心`,
    ariaOpenLog: '開啟金屬活性序記錄表',
    ariaMute: '關閉音效',
    ariaUnmute: '開啟音效',
    ariaPause: '暫停練習',
    ariaResume: '繼續練習',
    ariaCloseRef: '關閉參考表',
    ariaReactsWith: (reagent: string) => `與${reagent}會反應`,
    ariaNoReactionWith: (reagent: string) => `與${reagent}不反應`,
    ariaAnsweredCorrect: '答對',
    ariaAnsweredWrong: '答錯',
  },
} as const;
