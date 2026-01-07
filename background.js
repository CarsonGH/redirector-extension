let rules = [];

async function loadRules() {
  const data = await browser.storage.local.get('rules');
  rules = data.rules || [];
}

function patternToRegex(pattern) {
  // Check if pattern starts with wildcard subdomain
  const hasSubdomainWildcard = pattern.startsWith('*.');
  
  // Escape regex special chars except *
  let escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  // Replace * with .*
  escaped = escaped.replace(/\*/g, '(.*)');
  
  // Build regex: http/https required, www optional only (not other subdomains)
  // Unless pattern explicitly starts with *. for any subdomain
  if (hasSubdomainWildcard) {
    // *.domain.com - match any subdomain (captured)
    return new RegExp('^https?://' + escaped, 'i');
  } else {
    // domain.com - match bare domain or www. only
    return new RegExp('^https?://(?:www\\.)?' + escaped, 'i');
  }
}

function redirect(details) {
  for (const rule of rules) {
    if (!rule.enabled || !rule.from || !rule.to) continue;
    
    const regex = patternToRegex(rule.from);
    const match = details.url.match(regex);
    
    if (match) {
      // Build the new URL
      let newUrl = rule.to;
      
      // Replace $1, $2 etc with captured groups from wildcards
      for (let i = 1; i < match.length; i++) {
        newUrl = newUrl.replace('$' + i, match[i] || '');
      }
      
      // Also support simple * replacement (replaces all * with first capture)
      if (newUrl.includes('*') && match[1] !== undefined) {
        newUrl = newUrl.replace(/\*/g, match[1]);
      }
      
      // Add https:// if no protocol specified
      if (!newUrl.match(/^https?:\/\//)) {
        newUrl = 'https://' + newUrl;
      }
      
      return { redirectUrl: newUrl };
    }
  }
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking']
);

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'update') loadRules();
});

loadRules();
