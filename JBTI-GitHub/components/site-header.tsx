import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="JBTI 首页">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>JBTI<small>人格倾向图谱</small></span>
      </Link>
      <nav aria-label="主要导航">
        <Link href="/methods">测试方法</Link>
        <Link href="/about">关于</Link>
        <Link href="/test" className="nav-start">开始测试</Link>
      </nav>
    </header>
  );
}
