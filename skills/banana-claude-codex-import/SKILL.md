---
name: banana-claude-codex-import
description: >
  Import local Claude Code or Codex conversation history into OpenClaw memory. Triggers when:
  user asks to "导入"Claude/Codex conversations or chat logs, migrate or consolidate past coding agent sessions,
  load previous Claude Code or Codex work into memory, analyze or review past coding sessions,
  or rebuild memory from local coding agent session files.
  Also triggers proactively when ~/.claude/projects/ or ~/.codex/sessions/ directories are detected.
  Does NOT trigger for: ChatGPT/Claude web app exports (→ banana-chatgpt-import).
---

# banana-claude-codex-import

Import local Claude Code (`~/.claude/`) and Codex (`~/.codex/`) conversation history into OpenClaw's memory system, making past coding work queryable and part of long-term memory.

## When to use this skill

Use this skill when the user:
- Wants to import, migrate, or consolidate Claude Code or Codex sessions
- Asks to "导入" or "migrate" past coding agent conversations
- Wants to make past Claude Code / Codex work searchable in memory
- Needs to rebuild memory from previous coding agent sessions
- Mentions `~/.claude/` or `~/.codex/` session files
- Is reviewing past work and wants to extract key decisions/patterns into memory

## What this skill does

1. **Detect** whether Claude Code and/or Codex data exists locally
2. **Preview** with `--dry-run` to show session count, date range, and sample content
3. **Import** all sessions to `logs/message-archive-raw/`
4. **Generate** memory candidates for distillation into `MEMORY.md`

## Workflow

### Step 1: Dry-run first

Always run with `--dry-run` first to verify data coverage:

```bash
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py --dry-run
```

Check:
- Session count (aim for 50+ for Claude Code, 50+ for Codex)
- Date range
- Whether content looks real (not just noise/environment context)

If results look good, proceed.

### Step 2: Full import

```bash
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py
```

This writes:
- Session archives → `logs/message-archive-raw/{claude_code,codex}/`
- Memory draft → `memory/YYYY-MM-DD_import_candidates.md`

### Step 3: Distill into MEMORY.md

Read `memory/YYYY-MM-DD_import_candidates.md` and extract high-value content into `MEMORY.md`:

```markdown
## Claude Code / Codex 导入记忆（YYYY-MM）

> N sessions imported from `logs/message-archive-raw/`

### 技术决策
- [key decision 1]
- [key decision 2]

### 项目 / 主题
- [project 1]: [what was done]
- [project 2]: [what was done]

### 工具 & 工作流
- [tool/workflow pattern observed across sessions]
```

## Source data

| Source | Path | Format |
|--------|------|--------|
| Claude Code sessions | `~/.claude/projects/*.jsonl` | JSONL, user/assistant/tool_result entries |
| Claude Code index | `~/.claude/history.jsonl` | sessionId → metadata |
| Codex sessions | `~/.codex/sessions/**/rollout-*.jsonl` | JSONL, session_meta/response_item entries |

## CLI options

```bash
--dry-run              # Preview only, no files written
--source both          # Import both Claude Code and Codex (default)
--source claude_code   # Claude Code only
--source codex         # Codex only
--since YYYY-MM-DD     # Only sessions on or after date
```

## What makes a good memory distillation

After import, the most valuable things to capture in `MEMORY.md`:

1. **Technical decisions** — architecture choices, tools selected/rejected, what failed
2. **Recurring workflows** — patterns in how the user works with coding agents
3. **Project context** — what each project is about, key milestones
4. **Personal preferences** — working style, communication patterns, explicit preferences stated

Avoid: verbatim copying of conversations. Capture the distilled meaning.
