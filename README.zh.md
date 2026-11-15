# Banana Skills

Claude Code 和其他 AI 编码助手的技能集合。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | 简体中文

## 🍌 可用技能

### 1. banana-skill-finder

当你遇到可能需要专业能力的任务时，自动发现并推荐相关的 Claude skills。

**安装：**
```bash
npx skills add TreyDong/banana-skills/skills/banana-skill-finder
```

**功能特性：**
- 根据用户需求主动推荐技能
- 三层搜索策略（SkillsMP API → skills.sh → GitHub）
- 智能相关度排序
- 一键安装 `npx skills add`

**自动触发时机：**
- 处理特定文件格式（PDF、DOCX、Excel、图片等）
- 描述重复性或专业任务
- 询问"有没有...工具"
- 在特定领域遇到困难
- 需要最佳实践或模式

### 2. banana-sync-to-notion

将本地 Markdown 文件同步到 Notion，支持完整格式和目录结构保留。

**安装：**
```bash
npx skills add TreyDong/banana-skills/skills/banana-sync-to-notion
```

**功能特性：**
- 完整 Markdown 格式支持（粗体、斜体、代码、链接、表格、Callout）
- 根据文件名自动选择 emoji 图标
- 重复检测，支持增量同步
- 智能分块处理大文件
- 相对链接转换为 Notion 页面链接

**使用场景：**
- "同步到 Notion" 或 "备份到 Notion"
- 上传文件到 Notion
- 迁移文档到 Notion

### 4. banana-design（中文文档）

界面与制品设计规范：token、组件写法、交互与可访问性规则，约束 AI 生成 UI 的流程与自检清单，并按制品类型（界面 / 幻灯片 / 长文 / 大屏 / 营销页 / 邮件）与场景（教育 / 医疗 / 政务等）先定设计目标再选策略。从 18 个高星开源 Agent 项目的源码与规范文件蒸馏而来，每条规则可溯源。

**安装：**
```bash
npx skills add TreyDong/banana-skills/skills/banana-design
```

**功能特性：**
- 语义 token 规范与可接入的 CSS 样式表（`assets/banana-tokens.css`）
- 组件与样式写法，含正误代码对照
- 交互、状态、可访问性与文案规则
- 约束 AI 生成 UI 的流程、禁止项与可执行检查
- 制品类型 × 场景的设计目标与策略表（含幻灯片生产参数）

**触发时机：**
- 写或改任何界面代码
- 做幻灯片、长文报告、数据大屏等制品
- 评审界面、给 AI 派 UI 任务之前

## 🚀 快速开始

### 安装单个技能

```bash
npx skills add TreyDong/banana-skills/skills/banana-skill-finder
```

### 安装所有技能

```bash
npx skills add TreyDong/banana-skills
```

## 📖 文档

每个技能都包含详细文档（在 `SKILL.md` 文件中）：

- **banana-skill-finder**: [skills/banana-skill-finder/SKILL.md](skills/banana-skill-finder/SKILL.md)
- **banana-sync-to-notion**: [skills/banana-sync-to-notion/SKILL.md](skills/banana-sync-to-notion/SKILL.md)
- **banana-design**（中文）: [skills/banana-design/SKILL.md](skills/banana-design/SKILL.md)

## 🛠️ 配置要求

### banana-skill-finder

**可选（推荐）**：配置 SkillsMP API key 以启用 AI 语义搜索：

```bash
export SKILLSMP_API_KEY="sk_live_your_api_key"
```

从 [SkillsMP](https://skillsmp.com/docs/api) 获取 API key。

没有 API key 时，技能会自动降级使用 skills.sh 和 GitHub 搜索。

### banana-sync-to-notion

**必需**：配置 Notion API 凭证：

1. 在 [Notion Integrations](https://www.notion.so/my-integrations) 创建集成
2. 获取 integration token 和目标页面 ID
3. 在技能目录创建 `.env` 文件：

```bash
NOTION_TOKEN=your_notion_integration_token
NOTION_ROOT_PAGE_ID=target_page_id
```

4. 安装依赖：
```bash
cd banana-sync-to-notion
npm install
```

## 🌟 兼容的 AI 助手

这些技能支持：
- Claude Code
- Cursor
- Windsurf
- GitHub Copilot
- Codex
- 以及 10+ 其他支持开放 SKILL.md 标准的 AI 编码助手

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🤝 贡献

欢迎贡献！你可以：
- 报告 bug
- 建议新功能
- 提交 pull request

## 📧 联系方式

Created by [Trey (Banana)](https://github.com/TreyDong)

---

🍌 用 Banana Skills 快乐编码！
