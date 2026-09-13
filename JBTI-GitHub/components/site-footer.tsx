import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><strong>JBTI</strong><span>Journey · Balance · Tendency · Insight</span></div>
      <p>原创人格探索原型 · 非临床测评</p>
      <nav aria-label="页脚导航"><Link href="/methods">方法</Link><Link href="/privacy">隐私</Link><Link href="/about">关于</Link></nav>
    </footer>
  );
}
