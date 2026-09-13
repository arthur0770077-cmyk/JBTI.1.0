import type { Metadata } from "next";
import { HardDrive, Link2Off, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "隐私说明" };

export default function PrivacyPage() {
  return (
    <main><SiteHeader /><section className="info-hero compact"><p className="eyebrow"><ShieldCheck size={15} /> PRIVACY</p><h1>答案属于你，<br />也只留在你的设备里。</h1><p>JBTI 首版没有账号、服务器数据库或行为分析服务。以下说明适用于当前本地原型。</p></section>
      <section className="privacy-grid">
        <article><HardDrive /><h2>保存在浏览器本机</h2><p>未完成的答案和最近一次结果使用 localStorage 保存，便于刷新后继续。清除浏览器网站数据会同时清除这些内容。</p></article>
        <article><Link2Off /><h2>链接不包含原始答案</h2><p>正常情况下结果从本机读取；当本机存储不可用时，只在链接中放入聚合后的四维分数与类型代码，不放入逐题答案。</p></article>
        <article><ShieldCheck /><h2>不收集身份信息</h2><p>网站不要求姓名、手机号、邮箱或登录信息，也不会把测试结果用于招聘、医疗、教育或其他高影响决策。</p></article>
      </section>
      <section className="plain-copy"><h2>你可以怎样控制数据</h2><p>点击结果页的“重新测试”会删除本机保存的本次答案与结果。你也可以通过浏览器设置清除本网站的数据。下载的结果卡片由浏览器在本机生成，保存后由你自行管理。</p><h2>当前限制</h2><p>如果未来加入账号、云端保存或访问统计，本说明需要在功能上线前更新，并明确数据用途、保存期限和删除方式。</p></section>
      <SiteFooter /></main>
  );
}
