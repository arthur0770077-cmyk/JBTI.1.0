import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Scale } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dimensionOrder, dimensions } from "@/lib/dimensions";

export const metadata: Metadata = { title: "测试方法", description: "JBTI 原型题库、计分方式与验证边界。" };

export default function MethodsPage() {
  return (
    <main><SiteHeader />
      <section className="info-hero">
        <p className="eyebrow"><FlaskConical size={15} /> METHOD · VERSION 1.0</p>
        <h1>我们怎样绘制<br />这张人格坐标</h1>
        <p>JBTI 把类型代码当作阅读入口，把连续得分当作主要信息。下面公开首版的题库结构、计分规则和仍需验证的部分。</p>
      </section>
      <section className="method-grid">
        {dimensionOrder.map((id, index) => {
          const item = dimensions[id];
          return <article key={id}><span>0{index + 1}</span><h2>{item.name}</h2><p>{item.question}</p><div><strong>{item.left.code} · {item.left.name}</strong><i /><strong>{item.right.code} · {item.right.name}</strong></div><small>{item.left.description}<br />{item.right.description}</small></article>;
        })}
      </section>
      <section className="formula-section">
        <div><p className="section-kicker">SCORING</p><h2>计分保持简单，也保持可解释</h2></div>
        <ol>
          <li><span>1</span><p>每题使用 1–5 级程度选项，以 3 为中点，转换为 −2 到 +2。</p></li>
          <li><span>2</span><p>每个维度有 10 题。描述左侧倾向的题按原方向计分，描述右侧倾向的题反向计分。</p></li>
          <li><span>3</span><p>各题等权相加后映射到 0–100%。没有隐藏权重，也没有随机修正。</p></li>
          <li><span>4</span><p>离 50% 越近，两端越平衡。四字代码只表示最接近的组合，不等于离散人格分类。</p></li>
        </ol>
      </section>
      <section className="evidence-section">
        <div className="evidence-card verified"><BookOpen /><h2>资料支持的原则</h2><ul><li>人格特质更适合用连续维度表达，硬切成类型会损失中间信息。</li><li>量表需要分别考察内容效度、结构效度、信度、测量误差与公平性。</li><li>IPIP 提供公共领域人格题项和计分示例，可作为测量设计学习资源。</li></ul></div>
        <div className="evidence-card inferred"><Scale /><h2>本版的产品推断</h2><ul><li>单题界面和键盘快捷键可能降低手机端与桌面端的作答负担。</li><li>连续条形图和中间区间说明，可能比只给四字代码更不容易造成绝对化理解。</li><li>40 题在完成时间和维度覆盖之间提供一个适合原型的折中。</li></ul></div>
        <div className="evidence-card hypothesis"><FlaskConical /><h2>尚未验证的假设</h2><ul><li>四个原创维度是否各自形成稳定、可区分的结构。</li><li>题目在不同年龄、地区与使用情境中是否保持相同含义。</li><li>阈值、结果文案和重测结果是否具有足够稳定性。</li></ul></div>
      </section>
      <section className="validation-roadmap">
        <p className="section-kicker">BEFORE RELEASE</p><h2>正式发布前的验证路线</h2>
        <div><span>认知访谈</span><i /><span>小样本预测</span><i /><span>题项分析</span><i /><span>独立样本验证</span></div>
        <p>先让目标用户逐题解释他们理解的含义，修改歧义题；再收集真实样本检查缺失率、分布、题项相关和内部一致性；随后探索结构并在独立样本中确认，同时评估重测稳定性和群体差异。任何阶段发现维度含义不稳定，都应先返工题库，而不是包装一个漂亮的“准确率”。</p>
      </section>
      <section className="source-list">
        <h2>主要专业资料</h2>
        <a href="https://ipip.ori.org/" target="_blank" rel="noreferrer">International Personality Item Pool（公共领域题项与计分资源）<ArrowRight /></a>
        <a href="https://www.apa.org/science/standards.html" target="_blank" rel="noreferrer">APA / AERA / NCME《教育与心理测验标准》<ArrowRight /></a>
        <a href="https://www.cosmin.nl/" target="_blank" rel="noreferrer">COSMIN 测量属性与内容效度框架<ArrowRight /></a>
        <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11798685/" target="_blank" rel="noreferrer">测量量表开发与验证实践指南<ArrowRight /></a>
        <p>以上资料用于约束设计原则。JBTI 没有直接采用或声称复现其中任何现成量表。</p>
      </section>
      <div className="info-cta"><Link href="/test" className="button button-primary">理解边界后开始测试 <ArrowRight /></Link></div>
      <SiteFooter />
    </main>
  );
}
