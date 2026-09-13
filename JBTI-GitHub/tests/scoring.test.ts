import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../lib/questions";
import { MissingAnswersError, scoreAssessment } from "../lib/scoring";
import type { Answers, AnswerValue } from "../lib/jbti-types";

const fill = (value: AnswerValue): Answers => Object.fromEntries(questions.map((question) => [question.id, value])) as Answers;
const towardLeft = (): Answers => Object.fromEntries(questions.map((question) => [question.id, question.direction === 1 ? 5 : 1])) as Answers;
const towardRight = (): Answers => Object.fromEntries(questions.map((question) => [question.id, question.direction === 1 ? 1 : 5])) as Answers;

test("全部选择最低值时，正反向题保持四个维度平衡", () => {
  const result = scoreAssessment(fill(1), "2026-09-13T00:00:00.000Z");
  assert.deepEqual(Object.values(result.scores).map((score) => score.leftPercent), [50, 50, 50, 50]);
});

test("全部选择最高值时，正反向题保持四个维度平衡", () => {
  const result = scoreAssessment(fill(5));
  assert.deepEqual(Object.values(result.scores).map((score) => score.leftPercent), [50, 50, 50, 50]);
});

test("全部选择中间值时返回中点与平衡带", () => {
  const result = scoreAssessment(fill(3));
  assert.ok(Object.values(result.scores).every((score) => score.leftPercent === 50 && score.band === "平衡"));
});

test("正反向题混合可以稳定指向四个左侧倾向", () => {
  const result = scoreAssessment(towardLeft());
  assert.equal(result.code, "CPER");
  assert.ok(Object.values(result.scores).every((score) => score.leftPercent === 100));
});

test("反向混合可以稳定指向四个右侧倾向", () => {
  const result = scoreAssessment(towardRight());
  assert.equal(result.code, "QFIH");
  assert.ok(Object.values(result.scores).every((score) => score.leftPercent === 0));
});

test("缺失答案时明确拒绝计分并返回题号", () => {
  const answers = towardLeft();
  delete answers.q40;
  assert.throws(() => scoreAssessment(answers), (error) => error instanceof MissingAnswersError && error.missingIds[0] === "q40");
});

test("维度临界值保留中间带，但映射到最近一侧代码", () => {
  const answers = fill(3);
  answers.q01 = 5;
  const result = scoreAssessment(answers);
  assert.equal(result.scores.social.leftPercent, 55);
  assert.equal(result.scores.social.band, "平衡");
  assert.equal(result.code[0], "C");
});

test("四个维度的结果类型按固定顺序映射", () => {
  const answers = towardRight();
  for (const question of questions.filter((item) => item.dimension === "social")) {
    answers[question.id] = question.direction === 1 ? 5 : 1;
  }
  const result = scoreAssessment(answers);
  assert.equal(result.code, "CFIH");
});
