import type { Dimension, DimensionId } from "./jbti-types";

export const dimensionOrder: DimensionId[] = ["social", "pace", "perception", "decision"];

export const dimensions: Record<DimensionId, Dimension> = {
  social: {
    id: "social", name: "能量方式", question: "你更常从哪里恢复与调动能量？",
    left: { code: "C", name: "共鸣", short: "在互动中点亮思路", description: "更容易通过交流、共同活动和外部反馈调动状态。" },
    right: { code: "Q", name: "静聚", short: "在独处中收拢注意", description: "更容易通过安静、个人空间和内部整理恢复状态。" },
  },
  pace: {
    id: "pace", name: "行动节奏", question: "你更偏好怎样安排事情？",
    left: { code: "P", name: "规划", short: "让结构承接行动", description: "偏好提前建立顺序、边界与完成标准。" },
    right: { code: "F", name: "灵动", short: "让变化带来空间", description: "偏好保留选择，根据现场信息及时调整。" },
  },
  perception: {
    id: "perception", name: "认知焦点", question: "你更习惯怎样理解信息？",
    left: { code: "E", name: "实证", short: "从可核对之处出发", description: "更关注具体事实、已有经验与可执行细节。" },
    right: { code: "I", name: "探新", short: "从可能性展开联想", description: "更关注潜在联系、未来变化与新的解释。" },
  },
  decision: {
    id: "decision", name: "决策重心", question: "你更常用什么校准决定？",
    left: { code: "R", name: "推理", short: "用一致标准校准", description: "更关注逻辑一致、原则与问题本身。" },
    right: { code: "H", name: "关怀", short: "用人的处境校准", description: "更关注关系影响、价值感受与个体差异。" },
  },
};
