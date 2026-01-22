# Skill Sources Reference

## Primary Skill Sources

### 1. SkillsMP (skillsmp.com)
- **URL**: https://skillsmp.com/
- **Description**: Agent Skills Marketplace with 60,000+ Claude skills
- **API Endpoints**:
  - Keyword search: `GET https://skillsmp.com/api/v1/skills/search?q={query}`
  - AI semantic search: `GET https://skillsmp.com/api/v1/skills/ai-search?q={query}`
- **Authentication**: Bearer token (see api_config.md)
- **Features**: AI semantic search, quality indicators, categories
- **Fallback**: If no API key, use skills.sh WebFetch then GitHub API
- **Format**: Open SKILL.md standard

### 2. skills.sh (Skills Directory)
- **URL**: https://skills.sh/
- **Description**: Open Agent Skills Ecosystem with 200+ curated skills
- **Search**:
  - With query: `https://skills.sh/?q={keywords}`
  - Browse leaderboard: `https://skills.sh`
  - Trending (24h): `https://skills.sh/trending`
- **Access Method**: WebFetch (no authentication needed)
- **Features**: Ranked by install count, trending skills, 16+ compatible agents
- **Installation**: `npx skills add <owner>/<repo>`
- **Notable Sources**:
  - vercel-labs/agent-skills (React, Next.js best practices)
  - anthropics/skills (PDF, DOCX, XLSX, MCP builder)
  - expo/skills (React Native, mobile development)
  - Security tools (Semgrep, CodeQL, vulnerability scanners)

### 3. GitHub Repositories (Last Resort)
- **Search Strategy**: Use GitHub API (rate limited)
- **API Endpoint**: `GET https://api.github.com/search/code`
- **Query Format**: `{keywords}+SKILL.md+language:markdown`
- **Rate Limits**: 60 requests/hour (unauthenticated), 5000/hour (authenticated)
- **Use Case**: Only when Tier 1 and Tier 2 don't find relevant skills
- **Key Repositories**:
  - anthropics/skills (official)
  - travisvn/awesome-claude-skills
  - ComposioHQ/awesome-claude-skills
  - VoltAgent/awesome-claude-skills

## Common Skill Categories

### Development & Engineering
- **Keywords**: coding, programming, refactor, test, debug, git, ci/cd
- **Examples**: code-review, test-automation, git-workflow

### Document Processing
- **Keywords**: pdf, docx, markdown, convert, extract, edit document
- **Examples**: pdf-editor, docx-processor, markdown-converter

### Data & Analytics
- **Keywords**: data, analytics, sql, query, visualization, analysis
- **Examples**: bigquery, data-analysis, sql-helper

### Web & Frontend
- **Keywords**: react, next.js, frontend, webapp, ui, component
- **Examples**: react-best-practices, frontend-builder, ui-components

### DevOps & Infrastructure
- **Keywords**: deploy, docker, kubernetes, aws, gcp, infrastructure
- **Examples**: cloud-deploy, docker-helper, k8s-manager

### Content Creation
- **Keywords**: write, content, blog, article, generate, creative
- **Examples**: content-writer, blog-generator, creative-writing

### API & Integration
- **Keywords**: api, rest, graphql, integration, webhook
- **Examples**: api-builder, integration-helper

### Security & Testing
- **Keywords**: security, test, vulnerability, audit, penetration
- **Examples**: security-audit, test-suite

## Installation Method

For all skills, use Vercel's add-skill utility:

```bash
npx add-skill <skill-url>
```

Supported URL formats:
- GitHub repository URLs
- Direct SKILL.md file URLs
- Skill names from known registries

## Relevance Scoring Guidelines

When ranking skills by relevance, consider:

1. **Keyword Match** (40%): Direct match with user's problem domain
2. **Functionality Overlap** (30%): Skill capabilities align with user needs
3. **Quality Indicators** (20%): Stars, recent updates, documentation quality
4. **Specificity** (10%): More specific skills preferred over generic ones

Recommend 1-3 most relevant skills, with the best match first.
