# Changelog

All notable changes to Banana Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-22

### Added

#### banana-skill-finder
- Initial release of skill-finder
- Three-tier search strategy (SkillsMP API, skills.sh, GitHub)
- Proactive skill recommendations based on user context
- Smart relevance ranking
- Support for SkillsMP AI semantic search
- Fallback to skills.sh leaderboard and GitHub API
- Automatic installation via `npx skills add`

#### banana-sync-to-notion
- Initial release of Notion sync skill
- Full Markdown formatting support (bold, italic, code, links, lists, tables, callouts)
- Automatic emoji icon selection based on filenames
- Recursive directory structure preservation
- Duplicate detection for incremental syncs
- Smart chunking for large files (handles Notion's 2000-char limit)
- Relative link conversion to Notion page links
- Clean and re-sync commands
- Comprehensive progress reporting

### Changed
- Renamed from `sync-files` to `banana-sync-to-notion` for clarity
- Removed Feishu sync functionality to focus on Notion
- Migrated from Chinese to English documentation
- Updated dependencies to use official Notion SDK (`@notionhq/client`)

### Removed
- Feishu sync scripts and documentation
- Puppeteer dependency (was only used for Feishu)
- Chinese language documentation from skill files

## [1.1.0] - 2026-11-15

### Added

#### banana-design (v1.0.0)
- UI and artifact design system distilled from 18 popular open-source agent projects (lobehub, dify, langflow, opencode, …), with per-rule provenance in `references/sources.md`
- Semantic token spec + CSS stylesheet (`assets/banana-tokens.css`) and long-form report layer (`assets/banana-report.css`)
- Component patterns, interaction/state rules, accessibility and copywriting rules
- Workflow for constraining AI-generated UI: task briefing, prohibited patterns, executable checks, review grading (P0–P3)
- Artifact type × scenario strategy: goal-setting flow, per-artifact tactics (app UI / slides / long-form / dashboard / landing page / email), domain adjustments (education / healthcare / government / finance / industrial), slide-deck production parameters (1280×720 canvas → PDF 960×540pt → PPTX) and per-artifact acceptance checks
- Documentation in Chinese

## [Unreleased]

### Planned
- Enhance skill-finder with local skill recommendations
- Add image upload support for banana-sync-to-notion
- Create skill templates for common use cases

---

[1.1.0]: https://github.com/TreyDong/banana-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/TreyDong/banana-skills/releases/tag/v1.0.0
