---
name: banana-claude-codex-import
description: "Import local Claude Code and Codex conversation history into OpenClaw memory. Triggers when: user asks to import, migrate, or load Claude Code/Codex 聊天记录/对话历史/conversation history/session archive into memory; user mentions their local Claude Code or Codex transcripts, history, or session files; user wants to rebuild memory from past coding agent sessions, consolidate past Claude/Codex work, analyze or audit past coding sessions, or prepare to publish a skill based on previous agent sessions."
---

# banana-claude-codex-import

Import Claude Code (`~/.claude/`) and Codex (`~/.codex/sessions/`) conversation history into OpenClaw's memory system.

## Data sources

**Claude Code** (`~/.claude/`):
- `projects/` — session files (`{sessionId}.jsonl`), the official storage location
- `history.jsonl` — session index (sessionId → project path, timestamp, first message)

**Codex** (`~/.codex/sessions/`):
- `**/rollout-*.jsonl` — per-session JSONL files

`<environment_context>` noise entries are automatically filtered.

## Usage

```bash
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py

# Preview only — don't write files
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py --dry-run

# Only Codex, sessions from 2026 onward
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py \
  --source codex --since 2026-01-01
```

### CLI options

| Flag | Description |
|------|-------------|
| `--dry-run` | Print summary without writing any files |
| `--source {both,claude_code,codex}` | Which source to import (default: both) |
| `--since YYYY-MM-DD` | Only import sessions on or after this date |

## Output

```
logs/message-archive-raw/claude_code/{session_id}.md   ← one file per session
logs/message-archive-raw/codex/{session_id}.md
memory/YYYY-MM-DD_import_candidates.md                 ← draft for MEMORY.md
```

Each session archive contains formatted markdown with user/assistant/tool messages and timestamps.

## Merging into MEMORY.md

After import, read `memory/YYYY-MM-DD_import_candidates.md`, then distill the most valuable facts and decisions into `MEMORY.md`:

```markdown
## Claude Code / Codex 导入记忆（YYYY-MM）

> 来源：banana-claude-codex-import | N 个会话归档于 `logs/message-archive-raw/`

### 项目 / 主题
- **Context**: ...
- **Key decisions**: ...
```

## Requirements

- Python 3.8+
- `~/.claude/projects/` and/or `~/.codex/sessions/` directories
- Write access to `~/.openclaw/workspace/logs/` and `~/.openclaw/workspace/memory/`

## Maintenance

Claude Code session format: each `.jsonl` entry has `type` = `user`/`assistant`/`tool_result`.
- User content: `message.content` (string or list of blocks)
- Assistant content: `message.content` list with blocks of type `text`/`thinking`/`tool_use`

If the JSONL format changes, update `scripts/import_conversations.py` — look for `extract_content_blocks()` and the user/assistant parsing in `parse_claude_code_transcripts()`. Run with `--dry-run` first to verify.
