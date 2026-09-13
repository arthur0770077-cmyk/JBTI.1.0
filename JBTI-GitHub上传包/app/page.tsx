import Link from "next/link";
import { ArrowRight, Clock3, Compass, LockKeyhole, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const dimensions = [
  { code: "C · Q", name: "共鸣 / 静聚", tone: "var(--cyan)" },
  { code: "P · F", name: "规划 / 灵动", tone: "var(--coral)" },
  { code: "E · I", name: "实证 / 探新", tone: "var(--lime)" },
  { code: "R · H", name: "推理 / 关怀", tone: "var(--sky)" },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Journey · Balance · Tendency · Insight</p>
          <h1><span className="hero-line">倾向是一张地图，</span><br /><em>不是一枚标签。</em></h1>
          <p className="hero-lede">
            用 40 个日常选择，观察你如何恢复能量、安排节奏、理解信息与做出决定。
            结果保留灰度，也为接近中点的你留出空间。
          </p>
          <div className="hero-actions">
            <Link href="/test" className="button button-primary">
              开始探索 <ArrowRight size={18} />
            </Link>
            <Link href="/methods" className="button button-quiet">先了解方法</Link>
          </div>
          <div className="trust-row" aria-label="测试信息">
            <span><Clock3 size={16} /> 约 6–8 分钟</span>
            <span><Compass size={16} /> 4 个连续维度</span>
            <span><LockKeyhole size={16} /> 答案只留在本机</span>
          </div>
        </div>

        <div className="coordinate-card" aria-label="JBTI 四维人格坐标示意图">
          <div className="coordinate-grid" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="coordinate-center">
            <span>JBTI</span>
            <small>YOUR INNER MAP</small>
          </div>
          {dimensions.map((dimension, index) => (
            <div className={`axis-label axis-${index + 1}`} key={dimension.code}>
              <strong style={{ color: dimension.tone }}>{dimension.code}</strong>
              <span>{dimension.name}</span>
            </div>
          ))}
          <div className="coordinate-note">没有标准答案<br />只选更像你的那一边</div>
        </div>
      </section>

      <section className="quick-start" aria-labelledby="quick-start-title">
        <div>
          <p className="section-kicker">一次完整的自我观察</p>
          <h2 id="quick-start-title">从作答到读懂自己，三步完成</h2>
        </div>
        <ol className="step-grid">
          <li><span>01</span><h3>凭第一反应作答</h3><p>面对具体情境，选择此刻更接近你的程度。</p></li>
          <li><span>02</span><h3>获得连续倾向</h3><p>除了四字代码，你还能看到每一维的强度与中间区间。</p></li>
          <li><span>03</span><h3>带走可用线索</h3><p>把优势、压力点和成长建议，当作下一次观察的起点。</p></li>
        </ol>
      </section>

      <section className="sample-section" aria-labelledby="sample-title">
        <div className="sample-heading">
          <p className="section-kicker">结果示例 · CPIR</p>
          <h2 id="sample-title">坐标绘制者</h2>
          <p>在人群中获取灵感，用结构承接想象，再用清晰的理由把想法落地。</p>
        </div>
        <div className="sample-bars">
          {[
            ["共鸣", "静聚", 67], ["规划", "灵动", 62], ["实证", "探新", 31], ["推理", "关怀", 72],
          ].map(([left, right, score]) => (
            <div className="sample-bar" key={left}>
              <div><span>{left}</span><strong>{score}%</strong><span>{right}</span></div>
              <div className="bar-track"><i style={{ width: `${score}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="boundary-note">
        <div>
          <p className="section-kicker">使用边界</p>
          <h2>答案是线索，不是定论。</h2>
        </div>
        <p>
          JBTI 当前为原创产品原型，用于自我探索与娱乐。它不提供心理、医疗、教育或职业诊断，
          也不能替代专业评估。人的表现会随情境、角色与时间变化。
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
