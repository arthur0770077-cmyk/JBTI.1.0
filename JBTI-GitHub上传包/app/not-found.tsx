import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="empty-result"><span>?</span><h1>这处坐标还没有内容</h1><p>你访问的页面不存在，回到起点继续探索吧。</p><Link href="/" className="button button-primary"><ArrowLeft size={18} /> 返回首页</Link></main>;
}
