import { dimensionOrder, dimensions } from "./dimensions";
import { questions } from "./questions";
import type { Answers, AssessmentResult, DimensionId, DimensionScore } from "./jbti-types";

export class MissingAnswersError extends Error {
  missingIds: string[];
  constructor(missingIds: string[]) {
    super(`还有 ${missingIds.length} 道题未作答`);
    this.name = "MissingAnswersError";
    this.missingIds = missingIds;
  }
}

export function scoreAssessment(answers: Answers, answeredAt = new Date().toISOString()): AssessmentResult {
  const missingIds = questions.filter((question) => answers[question.id] === undefined).map((question) => question.id);
  if (missingIds.length) throw new MissingAnswersError(missingIds);

  const scores = {} as Record<DimensionId, DimensionScore>;
  for (const dimensionId of dimensionOrder) {
    const items = questions.filter((question) => question.dimension === dimensionId);
    const max = items.reduce((sum, item) => sum + 2 * item.weight, 0);
    const raw = items.reduce((sum, item) => sum + (answers[item.id] - 3) * item.direction * item.weight, 0);
    const leftPercent = Math.round(((raw + max) / (max * 2)) * 100);
    const rightPercent = 100 - leftPercent;
    const dimension = dimensions[dimensionId];
    const selected = leftPercent >= 50 ? dimension.left : dimension.right;
    const strength = Math.abs(leftPercent - 50) * 2;
    const distance = Math.abs(leftPercent - 50);
    const band = distance <= 8 ? "平衡" : distance <= 20 ? "轻微" : distance <= 35 ? "清晰" : "鲜明";
    scores[dimensionId] = {
      dimension, raw, leftPercent, rightPercent,
      selectedCode: selected.code, selectedName: selected.name, strength, band,
    };
  }

  return {
    code: dimensionOrder.map((id) => scores[id].selectedCode).join(""),
    scores,
    answeredAt,
  };
}
