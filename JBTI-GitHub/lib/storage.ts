import type { Answers, AssessmentResult, SavedProgress } from "./jbti-types";

export const PROGRESS_KEY = "jbti-progress-v1";
export const RESULT_KEY = "jbti-result-v1";

export function readProgress(): SavedProgress | null {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<SavedProgress>;
    if (value.version !== 1 || typeof value.currentIndex !== "number" || !value.answers || typeof value.answers !== "object") {
      window.localStorage.removeItem(PROGRESS_KEY);
      return null;
    }
    const answers = Object.fromEntries(Object.entries(value.answers).filter(([, answer]) => [1, 2, 3, 4, 5].includes(Number(answer)))) as Answers;
    return { version: 1, currentIndex: Math.max(0, Math.min(39, value.currentIndex)), answers, updatedAt: value.updatedAt || new Date().toISOString() };
  } catch {
    try { window.localStorage.removeItem(PROGRESS_KEY); } catch { /* storage may be unavailable */ }
    return null;
  }
}

export function saveProgress(currentIndex: number, answers: Answers): boolean {
  try {
    const value: SavedProgress = { version: 1, currentIndex, answers, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function saveResult(result: AssessmentResult): boolean {
  try {
    window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    window.localStorage.removeItem(PROGRESS_KEY);
    return true;
  } catch {
    return false;
  }
}

export function readResult(): AssessmentResult | null {
  try {
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as AssessmentResult;
    if (!value.code || !value.scores || !value.answeredAt) return null;
    return value;
  } catch {
    return null;
  }
}

export function clearAssessment(): void {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(RESULT_KEY);
  } catch { /* storage may be unavailable */ }
}
