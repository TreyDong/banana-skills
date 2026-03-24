# Banana Skills

A collection of AI agent skills for Claude Code and other AI coding assistants.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🍌 Available Skills

### 1. banana-skill-finder

Automatically discover and recommend relevant Claude skills when you encounter tasks that could benefit from specialized capabilities.

**Installation:**
```bash
npx skills add TreyDong/banana-skills/skills/banana-skill-finder
```

**Features:**
- Proactive skill recommendations based on user needs
- Three-tier search strategy (SkillsMP API → skills.sh → GitHub)
- Smart relevance ranking
- One-command installation with `npx skills add`

**Triggers automatically when:**
- Working with specific file formats (PDF, DOCX, Excel, images, etc.)
- Describing repetitive or specialized tasks
- Asking "is there a skill/tool for..."
- Struggling with domain-specific work
- Needing best practices or patterns

### 2. banana-sync-to-notion

Sync local Markdown files to Notion with full formatting support and directory structure preservation.

**Installation:**
```bash
npx skills add TreyDong/banana-skills/skills/banana-sync-to-notion
```

**Features:**
- Complete Markdown formatting support (bold, italic, code, links, tables, callouts)
- Automatic emoji icons based on filenames
- Duplicate detection for incremental syncs
- Smart chunking for large files
- Relative link conversion to Notion page links

**Use when:**
- "Sync to Notion" or "backup to Notion"
- Uploading files to Notion
- Migrating documentation to Notion

### 3. claude-codex-import

Import your local Claude Code and Codex conversation history into OpenClaw's memory system.

**Installation:**
```bash
npx skills add TreyDong/banana-skills/skills/claude-codex-import
```

**Features:**
- Parses Claude Code (`~/.claude/transcripts/`) and Codex (`~/.codex/sessions/`) JSONL session files
- Filters system noise (environment context) automatically
- Outputs formatted markdown session archives + daily memory candidates
- Supports `--dry-run`, `--source`, `--since` for flexible imports

**Triggers automatically when:**
- Asking to import, migrate, or load Claude Code/Codex chat history
- Wanting to rebuild memory from past coding agent sessions
- Publishing a skill based on previous agent sessions

## 🚀 Quick Start

### Install a Single Skill

```bash
npx skills add TreyDong/banana-skills/skills/banana-skill-finder
```

### Install All Skills

```bash
npx skills add TreyDong/banana-skills
```

## 📖 Documentation

Each skill includes detailed documentation in its `SKILL.md` file:

- **banana-skill-finder**: [skills/banana-skill-finder/SKILL.md](skills/banana-skill-finder/SKILL.md)
- **banana-sync-to-notion**: [skills/banana-sync-to-notion/SKILL.md](skills/banana-sync-to-notion/SKILL.md)
- **claude-codex-import**: [skills/claude-codex-import/SKILL.md](skills/claude-codex-import/SKILL.md)

## 🛠️ Setup Requirements

### For banana-skill-finder

**Optional (Recommended)**: Configure SkillsMP API key for AI semantic search:

```bash
export SKILLSMP_API_KEY="sk_live_your_api_key"
```

Get your API key from [SkillsMP](https://skillsmp.com/docs/api).

Without the API key, the skill automatically falls back to skills.sh and GitHub search.

### For banana-sync-to-notion

**Required**: Configure Notion API credentials:

1. Create a Notion Integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. Get your integration token and target page ID
3. Create `.env` file in the skill directory:

```bash
NOTION_TOKEN=your_notion_integration_token
NOTION_ROOT_PAGE_ID=target_page_id
```

4. Install dependencies:
```bash
cd banana-sync-to-notion
npm install
```

## 🌟 Compatible Agents

These skills work with:
- Claude Code
- Cursor
- Windsurf
- GitHub Copilot
- Codex
- And 10+ other AI coding assistants supporting the open SKILL.md standard

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Contact

Created by [Your Name]

---

🍌 Happy coding with Banana Skills!
