
export enum ElementType {
  FIRE = '火',
  WATER = '水',
  WIND = '風',
  EARTH = '地',
  VOID = '空',
}

export interface ElementData {
  type: ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  gradient: string;
  icon: string;
  description: string;
  hexColor: string;
}

export interface KotodamaCharData {
  element: ElementType;
  value: number;
  symbol: string;
  image: string;
  keyword: string;
}

export interface CharacterDetail {
  char: string;
  baseChar: string;
  element: ElementType;
  soundValue: number;
  baseMultiplier: number;
  adjustment: number;
  totalValue: number;
  isSmall?: boolean;
  isVoiced?: boolean;
  isSemiVoiced?: boolean;
  symbol?: string;
  image?: string;
  keyword?: string;
}

export interface CharAnalysis {
  char: string;
  nature: string;
  symbol: string;
  talent: string;
  caution: string;
  luckTip: string;
}

export interface KotodamaResult {
  lastName: string;
  firstName: string;
  primaryElement: ElementType;
  lastNameScores: Record<ElementType, number>;
  firstNameScores: Record<ElementType, number>;
  details: CharacterDetail[];
  reading: {
    characterAnalyses: CharAnalysis[];
    summaryTitle: string;
    summaryText: string;
  };
}

export interface GeminiResponse {
  characterAnalyses: CharAnalysis[];
  summaryTitle: string;
  summaryText: string;
}
