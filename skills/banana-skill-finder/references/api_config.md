# API Configuration Guide

## SkillsMP API Setup

### Why Configure SkillsMP API?

With a SkillsMP API key, you get:
- **AI semantic search** - Understands intent, not just keywords
- **60,000+ curated skills** - Largest Claude skills marketplace
- **Quality indicators** - Stars, popularity, categories
- **Better relevance** - Smarter matching than keyword search

Without API key, the skill falls back to GitHub search (still works, but less comprehensive).

### Getting Your API Key

1. Visit [SkillsMP API Documentation](https://skillsmp.com/docs/api)
2. Click "Generate API Key"
3. Copy your key (format: `sk_live_...`)

### Configuring the API Key

**Option 1: Environment Variable (Recommended)**
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export SKILLSMP_API_KEY="sk_live_your_api_key_here"

# Reload shell or run:
source ~/.bashrc
```

**Option 2: Local .env File**
```bash
# Create .env in your project or home directory
echo "SKILLSMP_API_KEY=sk_live_your_api_key_here" > ~/.claude/.env
```

**Option 3: Direct in Conversation**
Tell Claude: "My SkillsMP API key is sk_live_..." (less secure)

### Verify Configuration

Ask Claude to check:
```bash
echo $SKILLSMP_API_KEY
```

## API Endpoints

### Search Skills (Keyword)
```
GET https://skillsmp.com/api/v1/skills/search
```

**Parameters:**
- `q` (required) - Search query
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sortBy` - Sort by: `stars` | `recent`

**Headers:**
```
Authorization: Bearer sk_live_your_api_key
```

### AI Semantic Search (Recommended)
```
GET https://skillsmp.com/api/v1/skills/ai-search
```

**Parameters:**
- `q` (required) - Natural language query

**Headers:**
```
Authorization: Bearer sk_live_your_api_key
```

**Example:**
```bash
curl -X GET "https://skillsmp.com/api/v1/skills/ai-search?q=How+to+process+PDF+files" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| MISSING_API_KEY | 401 | API key not provided |
| INVALID_API_KEY | 401 | Invalid API key |
| MISSING_QUERY | 400 | Missing required query parameter |
| INTERNAL_ERROR | 500 | Internal server error |

## Fallback Strategy

If SkillsMP API is unavailable or not configured:
1. **Tier 2**: Use skills.sh WebFetch (200+ curated skills, no auth)
   - Search: `https://skills.sh/?q={keywords}`
   - Leaderboard: `https://skills.sh`
   - Trending: `https://skills.sh/trending`
2. **Tier 3**: Use GitHub API as last resort (rate limited: 60/hour)

The three-tier strategy ensures the skill always works, even without API configuration.

## Privacy Note

API keys are stored locally on your machine. Never commit them to version control.
