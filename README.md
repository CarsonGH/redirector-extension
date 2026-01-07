# Simple Redirector

A lightweight Firefox extension for URL redirects.

## AMO Description

```
Lightweight URL redirector with wildcard support. Automatically redirect URLs based on customizable rules.

**Features:**
- Simple toggle to enable/disable individual rules
- Wildcard matching with `*` for any characters
- Use `$1`, `$2` in destination to preserve captured paths
- Automatically handles http/https and www prefixes
- Use `*.domain.com` to match all subdomains

**Privacy & Security:**
- Zero data collection — all rules stored locally only
- Never reads or accesses page content
- Only intercepts navigation URLs for redirects
- No content scripts, no tracking, no analytics
- Open source and auditable

**Examples:**
- `chatgpt.com/*` → `claude.ai/$1` (redirect ChatGPT to Claude)
- `twitter.com/*` → `nitter.net/$1` (use Nitter frontend)
- `reddit.com/*` → `old.reddit.com/$1` (force old Reddit)

**Pattern Syntax:**
- `*` matches any characters
- `$1` in destination inserts the first wildcard capture
- `*.example.com/*` matches all subdomains
```

## Usage

Click the extension icon to manage redirect rules. Each rule has:
- **Checkbox** - Enable/disable the rule
- **From** - URL pattern to match
- **To** - Destination URL

## Pattern Syntax

| Pattern | Matches |
|---------|---------|
| `chatgpt.com/*` | `chatgpt.com/...` and `www.chatgpt.com/...` |
| `*.chatgpt.com/*` | Any subdomain: `api.chatgpt.com/...`, `blog.chatgpt.com/...` |
| `example.com/old/*` | Only paths starting with `/old/` |

### Wildcards

Use `*` to match any characters. Capture with `$1`, `$2`, etc. in the destination:

| From | To | Result |
|------|-----|--------|
| `chatgpt.com/*` | `claude.ai/$1` | Path preserved: `/c/123` → `/c/123` |
| `chatgpt.com/*` | `claude.ai/` | Path dropped: `/c/123` → `/` |
| `old.com/*/page` | `new.com/$1/page` | Middle captured |

### Auto-handled

- `http://` and `https://` both match
- `www.` is optional (matches with or without)
- Other subdomains require explicit `*.domain.com` pattern
- Destination gets `https://` added if no protocol specified

## Install

1. Go to `about:debugging` in Firefox
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json`

## Examples

| From | To | Effect |
|------|-----|--------|
| `chatgpt.com/*` | `claude.ai/$1` | Redirect ChatGPT to Claude |
| `twitter.com/*` | `nitter.net/$1` | Use Nitter frontend |
| `reddit.com/*` | `old.reddit.com/$1` | Force old Reddit |
