export type DimensionId = "social" | "pace" | "perception" | "decision";
export type AnswerValue = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<string, AnswerValue>;

export interface Question {
  id: string;
  text: string;
  dimension: DimensionId;
  direction: 1 | -1;
  weight: number;
}

export interface Pole {
  code: string;
  name: string;
  short: string;
  description: string;
}

export interface Dimension {
  id: DimensionId;
  name: string;
  question: string;
  left: Pole;
  right: Pole;
}

export interface DimensionScore {
  dimension: Dimension;
  raw: number;
  leftPercent: number;
  rightPercent: number;
  selectedCode: string;
  selectedName: string;
  strength: number;
  band: "平衡" | "轻微" | "清晰" | "鲜明";
}

export interface AssessmentResult {
  code: string;
  scores: Record<DimensionId, DimensionScore>;
  answeredAt: string;
}

export interface SavedProgress {
  version: 1;
  currentIndex: number;
  answers: Answers;
  updatedAt: string;
}
