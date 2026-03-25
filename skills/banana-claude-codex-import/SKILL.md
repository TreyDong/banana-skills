---
name: banana-claude-codex-import
description: >
  Import, migrate, or load local Claude Code or Codex conversation history, chat logs, or session archives into memory.
  Triggers when: user asks to import Claude/Codex conversations, migrate chat history, load past coding agent sessions,
  consolidate previous Claude/Codex work, analyze or review past coding sessions, or rebuild memory from coding agent logs.
  Does NOT trigger for: ChatGPT/Claude web app exports (use banana-chatgpt-import for those).
---

# banana-claude-codex-import

When a user wants to bring their local Claude Code or Codex conversation history into OpenClaw memory.

## Trigger recognition

The user wants to:
- "导入 Claude Code / Codex 的对话记录"
- "migrate my Claude Code sessions"
- "把之前的 coding agent 对话历史导入 memory"
- " Consolidate past Codex work into memory"
- "从 Claude Code 恢复记忆"
- "Analyze my previous coding sessions"
- 主动检测到用户本地有 `~/.claude/projects/` 或 `~/.codex/sessions/` 目录

## Workflow

1. **Verify data exists** — confirm `~/.claude/projects/` or `~/.codex/sessions/` exist on the machine
2. **Run import script** — execute `import_conversations.py` with `--dry-run` first to preview results
3. **Check coverage** — verify session counts, date range, and content quality before full import
4. **Run full import** — remove `--dry-run` flag to write archives and memory candidates
5. **Distill into MEMORY.md** — read the generated `memory/YYYY-MM-DD_import_candidates.md`, extract key facts/decisions into long-term memory

## Key decisions to capture for MEMORY.md

After import, distill these from the session archives:
- What projects / topics the user worked on
- Key technical decisions made (tools chosen, architectures chosen, what failed)
- Recurring workflows or patterns
- Any personal preferences or working style revealed in the conversations

## CLI

```bash
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py

# Preview only
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py --dry-run

# Specific source and date filter
python3 ~/.openclaw/skills/banana-claude-codex-import/scripts/import_conversations.py \
  --source claude_code --since 2026-01-01
```

## Output locations

- Session archives → `logs/message-archive-raw/{claude_code,codex}/`
- Memory candidates → `memory/YYYY-MM-DD_import_candidates.md`
