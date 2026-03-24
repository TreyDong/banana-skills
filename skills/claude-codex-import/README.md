# Claude Code & Codex Conversation Importer

Import your local Claude Code and Codex conversation history into the OpenClaw memory system.

## What it does

Parses the session files from Claude Code (`~/.claude/transcripts/`) and Codex (`~/.codex/sessions/`), then generates:

1. **Session archives** — formatted markdown copies of each conversation
2. **Daily memory candidates** — a draft organized by date for reviewing and merging into `MEMORY.md`

## Quick start

```bash
python3 import_conversations.py
```

That's it. Everything goes to `~/.openclaw/workspace/logs/message-archive-raw/` and `~/.openclaw/workspace/memory/`.

## CLI options

```
--dry-run              # Preview only, don't write files
--source claude_code   # Only import Claude Code sessions
--source codex        # Only import Codex sessions
--since 2026-01-01    # Only sessions from this date onward
```

## Requirements

- Python 3.8+
- [OpenClaw](https://github.com/openclaw/openclaw) installed
- Local Claude Code and/or Codex session directories

## What gets imported

| Source | Sessions | Typical size |
|--------|----------|-------------|
| Claude Code (`~/.claude/transcripts/*.jsonl`) | 1–50 | 10–50 sessions |
| Codex (`~/.codex/sessions/**/rollout-*.jsonl`) | 1–100 | 20–200 sessions |

Sessions with only system noise (`<environment_context>` messages) are automatically skipped.

## After import

1. Read `memory/YYYY-MM-DD_import_candidates.md` to review session summaries
2. Distill the most valuable facts and decisions
3. Merge into your `MEMORY.md`


