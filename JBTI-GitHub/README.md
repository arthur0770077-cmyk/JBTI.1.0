# JBTI 人格倾向图谱

JBTI 是面向中文用户的原创人格探索 MVP。它用 40 道五级题目描述四个连续维度，并组合成 16 个便于阅读的暂定类型。项目用于自我观察和娱乐，不提供临床、教育、招聘或职业诊断。

## 本地运行

要求 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址（默认 `http://127.0.0.1:5173`）。

## 检查

```bash
npm test
npm run build
```

## 主要结构

- `app/page.tsx`：首页
- `app/test/page.tsx`：40 题作答流程、进度恢复和提交
- `app/result/page.tsx`：连续得分、解释、复制摘要和 PNG 结果卡
- `app/methods/page.tsx`：维度、计分和验证边界
- `lib/questions.ts`：原创题库
- `lib/scoring.ts`：确定性计分
- `lib/profiles.ts`：16 型暂定名称和解释
- `TYPE_NAMING.md`：最终命名工作台
- `RESEARCH.md`：竞品、GitHub 和专业资料调研

## 数据与隐私

答题进度和结果默认只保存在当前浏览器的 localStorage 中。网站没有账号、数据库或第三方分析。浏览器存储不可用时，结果页使用仅含聚合分数的链接参数作为回退，不包含逐题答案。

## 当前科学边界

题库、四维结构、阈值和结果文案属于产品原型，尚未经过目标人群样本的题项分析、因子验证、内部一致性、重测信度和公平性评估。正式发布前请按 `RESEARCH.md` 的验证路线补充证据。
