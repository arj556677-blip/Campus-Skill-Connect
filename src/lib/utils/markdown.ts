/**
 * Safe Markdown Sanitizer & AST Tokenizer
 * Strictly prevents XSS attacks without relying on dangerous innerHTML.
 */

export interface MarkdownToken {
  type: 'paragraph' | 'heading' | 'bullet' | 'code' | 'bold' | 'text';
  content: string;
  level?: number;
}

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /onerror\s*=\s*['"]?[^'">\s]+/gi,
  /onload\s*=\s*['"]?[^'">\s]+/gi,
  /onclick\s*=\s*['"]?[^'">\s]+/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
];

/**
 * Strips dangerous HTML tags and malicious event handler attributes.
 */
export function sanitizeMarkdown(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // Strip all known dangerous executable patterns
  for (const pattern of XSS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // HTML entity encode remaining raw angle brackets to neutralize arbitrary injection
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return sanitized;
}

/**
 * Parses markdown into safe structured tokens for React rendering
 */
export function parseMarkdownToTokens(input: string): MarkdownToken[] {
  const safeText = sanitizeMarkdown(input);
  const lines = safeText.split('\n');
  const tokens: MarkdownToken[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Headings
    if (line.startsWith('### ')) {
      tokens.push({ type: 'heading', level: 3, content: line.slice(4) });
    } else if (line.startsWith('## ')) {
      tokens.push({ type: 'heading', level: 2, content: line.slice(3) });
    } else if (line.startsWith('# ')) {
      tokens.push({ type: 'heading', level: 1, content: line.slice(2) });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      tokens.push({ type: 'bullet', content: line.slice(2) });
    } else if (line.startsWith('```')) {
      tokens.push({ type: 'code', content: line.replace(/```/g, '') });
    } else {
      tokens.push({ type: 'paragraph', content: line });
    }
  }

  return tokens;
}
