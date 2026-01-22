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

## [Unreleased]

### Planned
- Add more skills to the collection
- Enhance skill-finder with local skill recommendations
- Add image upload support for banana-sync-to-notion
- Create skill templates for common use cases

---

[1.0.0]: https://github.com/your-username/banana-skills/releases/tag/v1.0.0
