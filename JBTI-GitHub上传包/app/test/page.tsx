"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Keyboard, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/site-header";
import { answerOptions, questions } from "@/lib/questions";
import { scoreAssessment } from "@/lib/scoring";
import { clearAssessment, readProgress, saveProgress, saveResult } from "@/lib/storage";
import type { Answers, AnswerValue } from "@/lib/jbti-types";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const indexRef = useRef(0);
  const answersRef = useRef<Answers>({});
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  useEffect(() => {
    const saved = readProgress();
    if (saved) {
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
      indexRef.current = saved.currentIndex;
      answersRef.current = saved.answers;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    indexRef.current = currentIndex;
    answersRef.current = answers;
    if (hydrated) setStorageAvailable(saveProgress(currentIndex, answers));
  }, [answers, currentIndex, hydrated]);

  const choose = useCallback((value: AnswerValue) => {
    setAnswers((current) => ({ ...current, [questions[indexRef.current].id]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (answersRef.current[questions[indexRef.current].id] === undefined) {
      toast.error("请先选择一个更接近你的答案");
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (["1", "2", "3", "4", "5"].includes(event.key)) choose(Number(event.key) as AnswerValue);
      if (event.key === "ArrowLeft") setCurrentIndex((index) => Math.max(0, index - 1));
      if (event.key === "Enter" && indexRef.current < questions.length - 1) goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, goNext]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = () => undefined;
    try {
      void Promise.resolve(context.registerTool({
        name: "read_jbti_progress",
        title: "读取 JBTI 作答进度",
        description: "读取当前 JBTI 测试题号和已答题数量，不读取或返回具体答案。",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => ({ questionNumber: indexRef.current + 1, answeredCount: Object.keys(answersRef.current).length, total: questions.length }),
      }, { signal: lifecycle.signal })).catch(report);
      void Promise.resolve(context.registerTool({
        name: "navigate_to_jbti_question",
        title: "跳转到 JBTI 题目",
        description: "将可见测试界面跳转到指定题号，不修改任何答案。",
        inputSchema: {
          type: "object",
          properties: { questionNumber: { type: "integer", minimum: 1, maximum: questions.length } },
          required: ["questionNumber"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const value = input as { questionNumber?: unknown };
          if (!Number.isInteger(value.questionNumber) || Number(value.questionNumber) < 1 || Number(value.questionNumber) > questions.length) {
            throw new Error("questionNumber 必须是 1 到 40 的整数");
          }
          const nextIndex = Number(value.questionNumber) - 1;
          setCurrentIndex(nextIndex);
          return { questionNumber: nextIndex + 1, answered: answersRef.current[questions[nextIndex].id] !== undefined };
        },
      }, { signal: lifecycle.signal })).catch(report);
    } catch { /* unsupported WebMCP implementations are non-blocking */ }
    return () => lifecycle.abort();
  }, []);

  function restart() {
    clearAssessment();
    setAnswers({});
    setCurrentIndex(0);
    toast.success("已清空本次作答");
  }

  function submit() {
    try {
      const result = scoreAssessment(answers);
      const stored = saveResult(result);
      if (stored) {
        router.push("/result");
      } else {
        const values = ["social", "pace", "perception", "decision"].map((id) => result.scores[id as keyof typeof result.scores].leftPercent);
        router.push(`/result?code=${result.code}&scores=${values.join(",")}`);
      }
    } catch {
      toast.error("还有题目没有回答，请检查进度");
    }
  }

  if (!hydrated) return <div className="test-loading" aria-live="polite">正在恢复你的探索进度…</div>;

  return (
    <main className="test-page">
      <SiteHeader />
      <section className="test-shell" aria-labelledby="question-title">
        <div className="test-status">
          <div className="test-count">
            <span>QUESTION</span>
            <strong>{String(currentIndex + 1).padStart(2, "0")}</strong>
            <small>/ {questions.length}</small>
          </div>
          <div className="test-progress">
            <div><span>已完成 {answeredCount} 题</span><span>{Math.round(progress)}%</span></div>
            <Progress value={progress} aria-label={`已完成 ${Math.round(progress)}%`} />
          </div>
          <Button variant="ghost" className="restart-button" onClick={restart}><RotateCcw /> 重新开始</Button>
        </div>

        <div className="question-stage">
          <div className="question-meta">
            <span>{currentQuestion.dimension === "social" ? "能量方式" : currentQuestion.dimension === "pace" ? "行动节奏" : currentQuestion.dimension === "perception" ? "认知焦点" : "决策重心"}</span>
            <span className={storageAvailable ? "saved-state" : "saved-state warning"}><Save size={14} /> {storageAvailable ? "已保存在本机" : "本机存储不可用"}</span>
          </div>
          <h1 id="question-title">{currentQuestion.text}</h1>
          <p className="question-hint">请选择与你最近一段时间最相近的情况。</p>

          <fieldset className="answer-grid">
            <legend className="sr-only">选择符合程度</legend>
            {answerOptions.map((option) => {
              const selected = answers[currentQuestion.id] === option.value;
              return (
                <label className={selected ? "answer-option selected" : "answer-option"} key={option.value}>
                  <input type="radio" name={currentQuestion.id} value={option.value} checked={selected} onChange={() => choose(option.value)} />
                  <span className="option-number">{option.short}</span>
                  <span>{option.label}</span>
                  <Check className="option-check" size={18} aria-hidden="true" />
                </label>
              );
            })}
          </fieldset>
        </div>

        <div className="test-controls">
          <Button variant="outline" size="lg" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}>
            <ArrowLeft /> 上一题
          </Button>
          <span className="keyboard-tip"><Keyboard size={15} /> 数字键作答 · 回车继续</span>
          {currentIndex < questions.length - 1 ? (
            <Button size="lg" onClick={goNext} disabled={answers[currentQuestion.id] === undefined}>下一题 <ArrowRight /></Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild><Button size="lg" disabled={answeredCount !== questions.length}>查看我的结果 <ArrowRight /></Button></DialogTrigger>
              <DialogContent className="submit-dialog">
                <DialogHeader><DialogTitle>准备绘制你的人格坐标</DialogTitle><DialogDescription>你已经完成全部 40 道题。提交后仍可重新测试，本次答案不会上传到服务器。</DialogDescription></DialogHeader>
                <div className="submit-summary"><span>{answeredCount}</span><p>道题已完成<br /><small>预计下一步 1 秒</small></p></div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">再检查一下</Button></DialogClose>
                  <Button onClick={submit}>生成结果</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
    </main>
  );
}
