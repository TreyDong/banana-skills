#!/usr/bin/env python3
"""
Claude Code & Codex Conversation Import Script
Imports local Claude Code / Codex conversation history into OpenClaw memory system.

Usage:
    python3 import_conversations.py                    # Import all, dry-run disabled
    python3 import_conversations.py --dry-run          # Preview only, no files written
    python3 import_conversations.py --source codex    # Codex only
    python3 import_conversations.py --source claude_code  # Claude Code only
    python3 import_conversations.py --since 2026-01-01  # Only sessions on or after date
    python3 import_conversations.py --help            # Show full help
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from collections import defaultdict

# ─── PATHS ───────────────────────────────────────────────────────────────────
CLAUDE_TRANSCRIPTS = Path.home() / ".claude" / "transcripts"
CODEX_SESSIONS = Path.home() / ".codex" / "sessions"
OUTPUT_BASE = Path.home() / ".openclaw" / "workspace" / "logs" / "message-archive-raw"
MEMORY_OUTPUT = Path.home() / ".openclaw" / "workspace" / "memory"

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def ts_to_date(ts_str):
    """Convert ISO timestamp string to YYYY-MM-DD."""
    if not ts_str:
        return "unknown"
    try:
        return datetime.fromisoformat(ts_str.replace("Z", "+00:00")).strftime("%Y-%m-%d")
    except Exception:
        return "unknown"


def ts_to_datetime(ts_str):
    """Convert ISO timestamp to readable datetime."""
    if not ts_str:
        return ""
    try:
        return datetime.fromisoformat(ts_str.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return ts_str


def extract_text_content(content):
    """Extract text from various Claude/Codex content structures."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                if item.get("type") == "input_text":
                    parts.append(item.get("text", ""))
                elif item.get("type") == "text":
                    parts.append(item.get("text", ""))
                elif item.get("text"):
                    parts.append(item.get("text", ""))
            elif isinstance(item, str):
                parts.append(item)
        return "\n".join(parts)
    if isinstance(content, dict):
        return content.get("text", str(content))
    return str(content)


def is_noise_message(content, role):
    """Check if a message is system noise (environment context, etc.)."""
    if role != "user":
        return False
    if not content:
        return True
    stripped = content.strip()
    return (
        stripped.startswith("<environment_context>")
        or stripped.startswith("&lt;environment_context&gt;")
        or stripped.startswith("```")
        or len(stripped) < 5
    )


# ─── CLAUDE CODE PARSER ──────────────────────────────────────────────────────

def parse_claude_code_transcripts(source_filter=None):
    """
    Parse Claude Code transcripts/*.jsonl files.

    Returns list of sessions:
        {id, date, messages: [(role, content, ts), ...], file}
    """
    sessions = []

    if source_filter and "codex" in source_filter:
        return sessions  # skip

    if not CLAUDE_TRANSCRIPTS.exists():
        print(f"[WARN] Claude transcripts dir not found: {CLAUDE_TRANSCRIPTS}")
        return sessions

    transcript_files = sorted(CLAUDE_TRANSCRIPTS.glob("*.jsonl"))
    print(f"[Claude Code] Found {len(transcript_files)} transcript files")

    for tf in transcript_files:
        session_id = tf.stem
        messages = []
        current_date = None

        try:
            with open(tf, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        entry = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    msg_type = entry.get("type", "")
                    ts = entry.get("timestamp", "")

                    if msg_type == "user":
                        content = extract_text_content(entry.get("content", ""))
                        if content and not is_noise_message(content, "user"):
                            messages.append(("user", content, ts))
                            if not current_date and ts:
                                current_date = ts_to_date(ts)

                    elif msg_type == "assistant":
                        content = extract_text_content(entry.get("content", ""))
                        if content:
                            messages.append(("assistant", content, ts))

                    elif msg_type == "tool_use":
                        tool_name = entry.get("tool_name", "?")
                        tool_input = entry.get("tool_input", {})
                        tool_desc = (
                            tool_input.get("description", "")
                            if isinstance(tool_input, dict)
                            else str(tool_input)
                        )
                        messages.append(("tool", f"[TOOL: {tool_name}] {tool_desc}", ts))

                    elif msg_type == "tool_result":
                        tool_output = entry.get("tool_output", "")
                        messages.append(("tool", f"[TOOL RESULT] {str(tool_output)[:300]}", ts))

        except Exception as e:
            print(f"[ERROR] Reading {tf.name}: {e}")
            continue

        if messages:
            sessions.append({
                "id": session_id,
                "source": "claude_code",
                "date": current_date or "unknown",
                "messages": messages,
                "file": str(tf)
            })

    print(f"[Claude Code] Parsed {len(sessions)} sessions with real messages")
    return sessions


# ─── CODEX PARSER ────────────────────────────────────────────────────────────

def parse_codex_sessions(source_filter=None):
    """
    Parse Codex sessions/**/rollout-*.jsonl files.

    Returns list of sessions.
    """
    sessions = []

    if source_filter and "claude_code" in source_filter:
        return sessions  # skip

    if not CODEX_SESSIONS.exists():
        print(f"[WARN] Codex sessions dir not found: {CODEX_SESSIONS}")
        return sessions

    rollout_files = sorted(CODEX_SESSIONS.glob("**/rollout-*.jsonl"))
    print(f"[Codex] Found {len(rollout_files)} session files")

    for rf in rollout_files:
        session_id = rf.stem
        messages = []
        current_date = None
        cwd = ""

        try:
            with open(rf, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        entry = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    entry_type = entry.get("type", "")
                    ts = entry.get("timestamp", "")

                    if entry_type == "session_meta":
                        payload = entry.get("payload", {})
                        cwd = payload.get("cwd", "")
                        if not current_date and ts:
                            current_date = ts_to_date(ts)

                    elif entry_type == "response_item":
                        payload = entry.get("payload", {})
                        if payload.get("type") == "message":
                            role = payload.get("role", "?")
                            content_list = payload.get("content", [])
                            content = extract_text_content(content_list)
                            if content and role in ("user", "assistant"):
                                if not is_noise_message(content, role):
                                    messages.append((role, content, ts))
                                    if not current_date and ts:
                                        current_date = ts_to_date(ts)

        except Exception as e:
            print(f"[ERROR] Reading {rf}: {e}")
            continue

        if messages:
            sessions.append({
                "id": session_id,
                "source": "codex",
                "date": current_date or "unknown",
                "messages": messages,
                "cwd": cwd,
                "file": str(rf)
            })

    print(f"[Codex] Parsed {len(sessions)} sessions with real messages")
    return sessions


# ─── FORMATTER ────────────────────────────────────────────────────────────────

def format_session_md(session):
    """Format a session as readable markdown for archive."""
    lines = []
    lines.append(f"# Session: {session['id']}")
    lines.append("")
    lines.append(f"- **Source**: {session['source']}")
    lines.append(f"- **Date**: {session['date']}")
    if session.get("cwd"):
        lines.append(f"- **CWD**: `{session['cwd']}`")
    lines.append(f"- **File**: `{session['file']}`")
    lines.append(f"- **Messages**: {len(session['messages'])}")
    lines.append("")
    lines.append("---")
    lines.append("")

    for role, content, ts in session["messages"]:
        if is_noise_message(content, role):
            continue
        role_label = {
            "user": "👤 User",
            "assistant": "🤖 Assistant",
        }.get(role, f"🔧 {role}")
        time_str = ts_to_datetime(ts)
        lines.append(f"**{role_label}** {f'• {time_str}' if time_str else ''}")
        for l in content.split("\n"):
            lines.append(f"    {l}")
        lines.append("")

    return "\n".join(lines)


def group_by_date(sessions):
    """Group sessions by date, returns {date: [sessions]}."""
    grouped = defaultdict(list)
    for s in sessions:
        grouped[s["date"]].append(s)
    return grouped


# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Import Claude Code & Codex conversation history into OpenClaw.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 import_conversations.py                    # Import everything
  python3 import_conversations.py --dry-run          # Preview only
  python3 import_conversations.py --source codex    # Codex sessions only
  python3 import_conversations.py --since 2026-01-01  # Only sessions from 2026
        """
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print summary without writing any files"
    )
    parser.add_argument(
        "--source",
        choices={"both", "claude_code", "codex"},
        default="both",
        help="Which source to import (default: both)"
    )
    parser.add_argument(
        "--since",
        dest="since_date",
        default=None,
        help="Only import sessions on or after this date (YYYY-MM-DD)"
    )
    args = parser.parse_args()

    print("=" * 60)
    print("Claude Code & Codex Conversation Import")
    if args.dry_run:
        print("  [DRY RUN — no files will be written]")
    print("=" * 60)

    # Parse
    claude_sessions = parse_claude_code_transcripts(args.source)
    codex_sessions = parse_codex_sessions(args.source)

    all_sessions = claude_sessions + codex_sessions
    if not all_sessions:
        print("[ERROR] No sessions found. Aborting.")
        sys.exit(1)

    # Filter by --since date
    if args.since_date:
        try:
            since_dt = datetime.strptime(args.since_date, "%Y-%m-%d")
            before_count = len(all_sessions)
            all_sessions = [
                s for s in all_sessions
                if s["date"] != "unknown"
                and datetime.strptime(s["date"], "%Y-%m-%d") >= since_dt
            ]
            print(f"\n[Filter] --since {args.since_date}: kept {len(all_sessions)}/{before_count} sessions")
        except ValueError:
            print(f"[WARN] Invalid date format: {args.since_date} (expected YYYY-MM-DD)")

    if not all_sessions:
        print("[ERROR] No sessions match the filter. Aborting.")
        sys.exit(1)

    # Ensure output dirs
    OUTPUT_BASE.mkdir(parents=True, exist_ok=True)
    MEMORY_OUTPUT.mkdir(parents=True, exist_ok=True)

    # Write raw session archives
    print(f"\n[Archive] Writing {len(all_sessions)} session files...")
    if not args.dry_run:
        for session in all_sessions:
            source_dir = OUTPUT_BASE / session["source"]
            source_dir.mkdir(exist_ok=True)
            safe_id = session["id"].replace("/", "_").replace("\\", "_")
            out_file = source_dir / f"{safe_id}.md"
            content = format_session_md(session)
            out_file.write_text(content, encoding="utf-8")
        print(f"[Archive] Done. Files written to {OUTPUT_BASE}")
    else:
        print(f"[Archive] DRY RUN — would write {len(all_sessions)} files to {OUTPUT_BASE}")

    # Group by date for daily memory
    by_date = group_by_date(all_sessions)

    # Generate daily memory candidates
    daily_memory_lines = []
    daily_memory_lines.append("# Daily Memory Candidates")
    daily_memory_lines.append("")
    daily_memory_lines.append(f"*Auto-generated from Claude Code & Codex import — {datetime.now().strftime('%Y-%m-%d %H:%M')}*")
    daily_memory_lines.append("")
    daily_memory_lines.append(f"*Dry run: {args.dry_run} | Source: {args.source} | Since: {args.since_date or 'all'}*")
    daily_memory_lines.append("")

    noise_prefixes = ("<environment_context>", "&lt;environment_context&gt;", "```")

    for date, day_sessions in sorted(by_date.items()):
        daily_memory_lines.append(f"## {date}")
        daily_memory_lines.append("")

        for s in day_sessions:
            first_user = ""
            for role, content, _ in s["messages"]:
                if role == "user":
                    stripped = content.strip()
                    if not any(stripped.startswith(p) for p in noise_prefixes) and len(stripped) > 5:
                        first_user = content[:200]
                        break

            safe_id = s["id"].replace("/", "_")
            archive_path = f"logs/message-archive-raw/{s['source']}/{safe_id}.md"

            daily_memory_lines.append(f"### [{s['source'].upper()}] {s['id']}")
            daily_memory_lines.append(f"- Date: {date}")
            if s.get("cwd"):
                daily_memory_lines.append(f"- Working dir: `{s['cwd']}`")
            daily_memory_lines.append(f"- Messages: {len(s['messages'])}")
            daily_memory_lines.append(f"- Started: {first_user[:150]}...")
            daily_memory_lines.append(f"- Archive: `{archive_path}`")
            daily_memory_lines.append("")

    memory_candidates = "\n".join(daily_memory_lines)

    today = datetime.now().strftime("%Y-%m-%d")
    candidate_file = MEMORY_OUTPUT / f"{today}_import_candidates.md"

    if not args.dry_run:
        candidate_file.write_text(memory_candidates, encoding="utf-8")
        print(f"[Memory] Candidates written to {candidate_file}")
    else:
        print(f"[Memory] DRY RUN — would write candidates to {candidate_file}")

    # Summary
    print("\n" + "=" * 60)
    print("IMPORT SUMMARY")
    print("=" * 60)
    print(f"  Claude Code sessions : {len(claude_sessions)}")
    print(f"  Codex sessions       : {len(codex_sessions)}")
    print(f"  Total sessions       : {len(all_sessions)}")
    if by_date:
        dates = sorted(d for d in by_date.keys() if d != "unknown")
        if dates:
            print(f"  Date range           : {dates[0]} → {dates[-1]}")
    print(f"  Archive dir          : {OUTPUT_BASE}")
    print(f"  Memory candidates    : {candidate_file}")
    if args.dry_run:
        print("  [DRY RUN — nothing was written]")
    print("=" * 60)

    # Print the daily memory candidates preview
    preview = memory_candidates[:3000]
    print(f"\n[Draft Daily Memory Preview]\n{preview}")
    if len(memory_candidates) > 3000:
        print(f"\n... (+ {len(memory_candidates)-3000} more chars)")

    return all_sessions, by_date, candidate_file


if __name__ == "__main__":
    main()
