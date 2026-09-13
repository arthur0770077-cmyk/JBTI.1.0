"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Copy, Download, Info, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dimensionOrder, dimensions } from "@/lib/dimensions";
import { poleInsights, typeProfiles } from "@/lib/profiles";
import { clearAssessment, readResult } from "@/lib/storage";
import type { AssessmentResult, DimensionId, DimensionScore } from "@/lib/jbti-types";

function resultFromQuery(): AssessmentResult | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const rawScores = params.get("scores")?.split(",").map(Number);
  if (!code || code.length !== 4 || !rawScores || rawScores.length !== 4 || rawScores.some((score) => !Number.isFinite(score) || score < 0 || score > 100)) return null;
  const scores = {} as Record<DimensionId, DimensionScore>;
  dimensionOrder.forEach((id, index) => {
    const leftPercent = Math.round(rawScores[index]);
    const dimension = dimensions[id];
    const selected = code[index] === dimension.left.code ? dimension.left : dimension.right;
    const distance = Math.abs(leftPercent - 50);
    scores[id] = {
      dimension, raw: 0, leftPercent, rightPercent: 100 - leftPercent,
      selectedCode: selected.code, selectedName: selected.name,
      strength: distance * 2,
      band: distance <= 8 ? "平衡" : distance <= 20 ? "轻微" : distance <= 35 ? "清晰" : "鲜明",
    };
  });
  return { code, scores, answeredAt: new Date().toISOString() };
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = [...text];
  let line = "";
  let lineY = y;
  for (const char of chars) {
    const candidate = line + char;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, lineY);
      line = char;
      lineY += lineHeight;
    } else {
      line = candidate;
    }
  }
  if (line) context.fillText(line, x, lineY);
}

export default function ResultPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setResult(readResult() || resultFromQuery());
    setLoaded(true);
  }, []);

  const profile = result ? typeProfiles[result.code] : null;
  const insights = useMemo(() => {
    if (!result) return null;
    return dimensionOrder.map((id) => poleInsights[id][result.scores[id].selectedCode]);
  }, [result]);

  function summaryText() {
    if (!result || !profile) return "";
    const axes = dimensionOrder.map((id) => `${dimensions[id].name}：${result.scores[id].selectedName} ${result.scores[id].strength}%`).join("；");
    return `我的 JBTI 类型是 ${result.code}「${profile.name}」：${profile.subtitle}。\n${axes}\nJBTI 是用于自我探索的非临床原型测试。`;
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText());
      toast.success("结果摘要已复制");
    } catch {
      toast.error("浏览器未允许复制，请稍后重试");
    }
  }

  function drawCard(download = false) {
    if (!result || !profile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#071b22";
    context.fillRect(0, 0, 1200, 630);
    context.strokeStyle = "rgba(255,255,255,.08)";
    context.lineWidth = 1;
    for (let x = 0; x < 1200; x += 48) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 630); context.stroke(); }
    for (let y = 0; y < 630; y += 48) { context.beginPath(); context.moveTo(0, y); context.lineTo(1200, y); context.stroke(); }
    context.fillStyle = "#17b6a4"; context.fillRect(68, 68, 14, 14);
    context.fillStyle = "#ff6b57"; context.fillRect(88, 68, 14, 14);
    context.fillStyle = "#78bde8"; context.fillRect(68, 88, 14, 14);
    context.fillStyle = "#d6ed66"; context.fillRect(88, 88, 14, 14);
    context.fillStyle = "#a9c0c5"; context.font = "600 22px 'Microsoft YaHei UI', sans-serif"; context.fillText("JBTI · MY INNER MAP", 128, 94);
    context.fillStyle = "#d6ed66"; context.font = "900 94px 'Microsoft YaHei UI', sans-serif"; context.fillText(result.code, 68, 230);
    context.fillStyle = "#ffffff"; context.font = "900 58px 'Microsoft YaHei UI', sans-serif"; context.fillText(profile.name, 68, 310);
    context.fillStyle = "#b7cbd0"; context.font = "500 27px 'Microsoft YaHei UI', sans-serif"; wrapCanvasText(context, profile.subtitle, 70, 365, 520, 42);

    dimensionOrder.forEach((id, index) => {
      const score = result.scores[id];
      const x = 690;
      const y = 135 + index * 105;
      context.fillStyle = "#d9e7e8"; context.font = "700 23px 'Microsoft YaHei UI', sans-serif"; context.fillText(`${score.dimension.left.name}  ${score.leftPercent}%`, x, y);
      context.textAlign = "right"; context.fillText(`${score.rightPercent}%  ${score.dimension.right.name}`, 1120, y); context.textAlign = "left";
      context.fillStyle = "rgba(255,255,255,.13)"; context.beginPath(); context.roundRect(x, y + 18, 430, 12, 6); context.fill();
      const gradient = context.createLinearGradient(x, 0, x + 430, 0); gradient.addColorStop(0, "#17b6a4"); gradient.addColorStop(1, "#d6ed66");
      context.fillStyle = gradient; context.beginPath(); context.roundRect(x, y + 18, 430 * (score.leftPercent / 100), 12, 6); context.fill();
    });
    context.fillStyle = "#78969d"; context.font = "500 18px 'Microsoft YaHei UI', sans-serif"; context.fillText("倾向是一张地图，不是一枚标签。 · 非临床测评", 68, 580);
    if (download) {
      const anchor = document.createElement("a");
      anchor.download = `JBTI-${result.code}-result.png`;
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
      toast.success("结果卡片已保存");
    }
  }

  useEffect(() => { if (result && profile) drawCard(false); }, [result, profile]);

  if (!loaded) return <div className="test-loading" aria-live="polite">正在读取你的人格坐标…</div>;
  if (!result || !profile || !insights) {
    return (
      <main><SiteHeader /><section className="empty-result"><span>?</span><h1>还没有可以读取的结果</h1><p>完成 40 道题后，你的人格坐标会出现在这里。</p><Link href="/test" className="button button-primary">开始测试 <ArrowRight size={18} /></Link></section></main>
    );
  }

  const nearMiddle = dimensionOrder.filter((id) => result.scores[id].band === "平衡");

  return (
    <main className="result-page">
      <SiteHeader />
      <section className="result-hero">
        <div className="result-identity">
          <p className="eyebrow"><Sparkles size={15} /> 你的默认路线已生成</p>
          <div className="result-code">{result.code}</div>
          <span className="provisional-label">暂定人格称号 · 等你参与命名</span>
          <h1>{profile.name}</h1>
          <p className="result-subtitle">{profile.subtitle}</p>
          <p className="result-summary">{profile.summary}</p>
          <div className="result-actions">
            <Button onClick={copySummary}><Copy /> 复制结果摘要</Button>
            <Button variant="outline" onClick={() => drawCard(true)}><Download /> 保存结果卡片</Button>
          </div>
        </div>
        <div className="result-map" aria-label="四维倾向得分">
          <div className="map-heading"><span>04 AXES</span><strong>连续倾向图</strong></div>
          {dimensionOrder.map((id) => {
            const score = result.scores[id];
            return (
              <div className="dimension-result" key={id}>
                <div className="dimension-title"><span>{score.dimension.name}</span><strong>{score.band}偏向 · {score.selectedName}</strong></div>
                <div className="dimension-poles"><span>{score.dimension.left.name} {score.leftPercent}%</span><span>{score.rightPercent}% {score.dimension.right.name}</span></div>
                <div className="result-track"><i style={{ left: `${score.leftPercent}%` }} /><span /></div>
                <p>{score.leftPercent >= 50 ? score.dimension.left.description : score.dimension.right.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {nearMiddle.length > 0 && (
        <aside className="balance-callout">
          <Info size={21} />
          <div><strong>你的坐标里有 {nearMiddle.length} 个中间区间</strong><p>这表示两端都可能是你的可用方式，具体表现更容易受情境影响。四字代码只是最近的组合，不代表固定分类。</p></div>
        </aside>
      )}

      <section className="insight-section">
        <div className="insight-heading"><p className="section-kicker">把结果带回生活</p><h2>四组可以继续观察的线索</h2><p>这些描述来自你在每个维度上更接近的一端。它们是讨论起点，不是对行为的预测。</p></div>
        <div className="insight-grid">
          <article><span>01</span><h3>可能优势</h3><ul>{insights.map((item) => <li key={item.strength}>{item.strength}</li>)}</ul></article>
          <article><span>02</span><h3>压力点与盲区</h3><ul>{insights.map((item) => <li key={item.pressure}>{item.pressure}</li>)}</ul></article>
          <article><span>03</span><h3>沟通与关系</h3><ul>{insights.map((item) => <li key={item.relation}>{item.relation}</li>)}</ul></article>
          <article><span>04</span><h3>学习与工作环境</h3><ul>{insights.map((item) => <li key={item.work}>{item.work}</li>)}</ul></article>
        </div>
      </section>

      <section className="growth-section">
        <div><p className="section-kicker">NEXT OBSERVATION</p><h2>下一次，可以这样试试</h2></div>
        <ol>{insights.map((item, index) => <li key={item.growth}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.growth}</p></li>)}</ol>
      </section>

      <section className="result-boundary">
        <div><strong>这些结果不代表什么</strong><p>它不代表能力高低、适合或不适合某个职业，也不代表你在所有情境中都会用同一种方式。当前题库与阈值尚未经过正式样本验证。</p></div>
        <Link href="/methods">查看计分方法 <ArrowRight size={16} /></Link>
      </section>

      <div className="retake-row">
        <Button variant="outline" onClick={() => { clearAssessment(); window.location.href = "/test"; }}><RotateCcw /> 重新测试</Button>
        <span>结果生成于 {new Date(result.answeredAt).toLocaleString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
      </div>
      <canvas ref={canvasRef} className="share-canvas" aria-hidden="true" />
      <SiteFooter />
    </main>
  );
}
