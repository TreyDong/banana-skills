---
name: banana-claude-codex-import
description: "Import local Claude Code and Codex conversation history into OpenClaw memory. Triggers when: user asks to import, migrate, or load Claude Code/Codex 聊天记录/对话历史/conversation history/session archive into memory; user mentions their local Claude Code or Codex transcripts, history, or session files; user wants to rebuild memory from past coding agent sessions, consolidate past Claude/Codex work, analyze or audit past coding sessions, or prepare to publish a skill based on previous agent sessions."
---

# claude-codex-import

Import Claude Code (`~/.claude/transcripts/`) and Codex (`~/.codex/sessions/`) conversation history into OpenClaw's memory system.

## Usage

```bash
python3 ~/.openclaw/skills/claude-codex-import/scripts/import_conversations.py

# Preview only — don't write files
python3 ~/.openclaw/skills/claude-codex-import/scripts/import_conversations.py --dry-run

# Only Codex, sessions from 2026 onward
python3 ~/.openclaw/skills/claude-codex-import/scripts/import_conversations.py \
  --source codex --since 2026-01-01
```

### CLI options

| Flag | Description |
|------|-------------|
| `--dry-run` | Print summary without writing any files |
| `--source {both,claude_code,codex}` | Which source to import (default: both) |
| `--since YYYY-MM-DD` | Only import sessions on or after this date |

## What gets imported

- Claude Code: `~/.claude/transcripts/*.jsonl` (type: `user`/`assistant`/`tool_use`/`tool_result`)
- Codex: `~/.codex/sessions/**/rollout-*.jsonl` (type: `session_meta`/`response_item`)
- `<environment_context>` noise messages are automatically filtered out

## Output

```
logs/message-archive-raw/claude_code/{session_id}.md   ← one file per session
logs/message-archive-raw/codex/{session_id}.md
memory/YYYY-MM-DD_import_candidates.md                 ← draft for MEMORY.md
```

Each session archive contains formatted markdown with user/assistant messages and timestamps.

## Merging into MEMORY.md

After import, read `memory/YYYY-MM-DD_import_candidates.md`, then distill the most valuable facts and decisions into `MEMORY.md`:

```markdown
## Claude Code / Codex 导入记忆（YYYY-MM）

> 来源：claude-codex-import | N 个会话归档于 `logs/message-archive-raw/`

### 项目 / 主题
- **Context**: ...
- **Key decisions**: ...
```

## Requirements

- Python 3.8+
- `~/.claude/transcripts/` and/or `~/.codex/sessions/` directories
- Write access to `~/.openclaw/workspace/logs/` and `~/.openclaw/workspace/memory/`

## Maintenance

If the JSONL format changes, update `scripts/import_conversations.py` — look for `parse_claude_code_transcripts()` and `parse_codex_sessions()`. Run with `--dry-run` first to verify.
