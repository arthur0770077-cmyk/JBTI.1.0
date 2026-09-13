import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye, Layers3 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "关于 JBTI" };

export default function AboutPage() {
  return (
    <main><SiteHeader /><section className="info-hero compact"><p className="eyebrow"><Compass size={15} /> ABOUT JBTI</p><h1>一个把“类型”<br />重新画成坐标的实验</h1><p>JBTI 暂定含义为 Journey · Balance · Tendency · Insight：从经历出发，在两端之间寻找平衡，观察倾向，再把它变成新的洞察。</p></section>
      <section className="about-values"><article><Eye /><span>01</span><h2>诚实呈现灰度</h2><p>接近中点时就明确说接近中点，不用夸张语言制造“命中感”。</p></article><article><Layers3 /><span>02</span><h2>把类型当入口</h2><p>四字代码方便记忆，真正值得阅读的是连续分数和它随情境变化的可能。</p></article><article><Compass /><span>03</span><h2>让建议可以尝试</h2><p>结果页提供具体观察动作，而不是决定职业、关系或能力的结论。</p></article></section>
      <section className="name-options"><p className="section-kicker">NAME EXPLORATION</p><h2>我们也考虑过另外两个方向</h2><div><article><strong>Just Be True Inside</strong><p>更像一句面向自我接纳的品牌宣言，但不够准确地说明测量边界。</p></article><article><strong>Joyful Behavior & Temperament Index</strong><p>更像量表名称，但“temperament”容易让尚未验证的原型显得过度专业。</p></article><article className="selected"><strong>Journey · Balance · Tendency · Insight</strong><p>当前采用。它强调过程、连续性和自我观察，最符合首版定位。</p></article></div></section>
      <div className="info-cta"><Link href="/test" className="button button-primary">开始我的探索 <ArrowRight /></Link></div><SiteFooter /></main>
  );
}
