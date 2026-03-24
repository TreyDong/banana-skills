---
name: claude-codex-import
description: Import Claude Code and Codex conversation history into OpenClaw memory. Triggers when: user asks to import, migrate, or load Claude Code/Codex聊天记录/对话历史/conversation history/session archive into memory; user mentions their local Claude Code or Codex transcripts, history, or session files; user wants to rebuild memory from coding agent sessions; user wants to consolidate past Claude/Codex work into OpenClaw. Also useful when analyzing past coding work, auditing agent decisions, or preparing to publish a skill based on previous agent sessions.
---

# claude-codex-import

> Import local Claude Code (`~/.claude/transcripts/`) and Codex (`~/.codex/sessions/`) conversation history into OpenClaw's memory system.

## What this skill does

Parses the JSONL session files from Claude Code and Codex on your local machine, then writes:

```
logs/message-archive-raw/claude_code/*.md   ← formatted session archives
logs/message-archive-raw/codex/*.md
memory/YYYY-MM-DD_import_candidates.md       ← daily memory candidates
MEMORY.md                                    ← long-term memory (manual merge)
```

## When to use this

- You want to **import your Claude Code or Codex conversation history** into OpenClaw
- You want to **rebuild memory from past coding agent sessions**
- You want to **consolidate past Claude/Codex work** before setting up a new agent
- You want to **publish a skill** based on knowledge extracted from previous sessions
- You want to **audit what a coding agent did** in a specific past session

## Quick start

```bash
# Full import — everything, all dates
python3 ~/.openclaw/skills/claude-codex-import/import_conversations.py

# Preview only (no files written)
python3 ~/.openclaw/skills/claude-codex-import/import_conversations.py --dry-run

# Only Codex, sessions from 2026 onward
python3 ~/.openclaw/skills/claude-codex-import/import_conversations.py \
  --source codex --since 2026-01-01

# Only Claude Code
python3 ~/.openclaw/skills/claude-codex-import/import_conversations.py \
  --source claude_code
```

## CLI options

| Flag | Description |
|------|-------------|
| `--dry-run` | Print summary without writing any files |
| `--source {both,claude_code, codex}` | Which source to import (default: both) |
| `--since YYYY-MM-DD` | Only import sessions on or after this date |

## Data sources

| Source | Path | Format |
|--------|------|--------|
| Claude Code | `~/.claude/transcripts/*.jsonl` | JSONL — `type: user/assistant/tool_use/tool_result` |
| Claude Code history index | `~/.claude/history.jsonl` | JSONL — user input entries |
| Codex sessions | `~/.codex/sessions/**/rollout-*.jsonl` | JSONL — `type: session_meta/response_item` |
| Codex history index | `~/.codex/history.jsonl` | JSONL — user input entries |

**What gets imported:** Only sessions with real user messages. System noise like `<environment_context>` injection messages are automatically filtered out.

## Output format

### Session archive (`logs/message-archive-raw/{source}/{session_id}.md`)

Each file contains one complete session:

```markdown
# Session: ses_40f926fafffejDr7Fhno00fJgw

- **Source**: claude_code
- **Date**: 2026-01-24
- **Messages**: 834

---

**👤 User** • 2026-01-24 14:32
    Analyze the slash command system...

**🤖 Assistant** • 2026-01-24 14:35
    I'll start by examining...
```

### Daily memory candidates (`memory/YYYY-MM-DD_import_candidates.md`)

Grouped by date, one entry per session. Use this as a draft for `MEMORY.md` — the content is raw; review and distill before merging into the real `MEMORY.md`.

## Memory merge guide

After running the import:

1. Read `memory/YYYY-MM-DD_import_candidates.md`
2. Extract the most valuable facts, decisions, and project context
3. Merge into the relevant section of `MEMORY.md` in this format:

```markdown
## Claude Code / Codex 导入记忆（YYYY-MM 至 YYYY-MM）

> 来源：claude-codex-import skill | YYYY-MM-DD | N 个会话归档于 `logs/message-archive-raw/`

### 项目 / 主题
- **Context**: ...
- **Key decisions**: ...
- **Technical notes**: ...
```

## Requirements

- Python 3.8+
- Local `~/.claude/transcripts/` and/or `~/.codex/sessions/` directories
- Write access to `~/.openclaw/workspace/logs/` and `~/.openclaw/workspace/memory/`

## Maintenance

If Claude Code or Codex updates their JSONL format, update the parser in `import_conversations.py`:
- Look for the `parse_claude_code_transcripts()` and `parse_codex_sessions()` functions
- The key fields are `type`, `content`, and `timestamp` — adjust extraction logic if they change
- Run with `--dry-run` first to verify parsing before writing files

## Skill packaging

To package this skill for distribution:

```bash
python3 -m scripts.package_skill ~/.openclaw/skills/claude-codex-import
```

This produces a `.skill` file that can be installed on other OpenClaw instances.
