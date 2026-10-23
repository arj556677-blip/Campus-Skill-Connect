import { describe, it, expect } from 'vitest';
import { sanitizeMarkdown, parseMarkdownToTokens } from '@/lib/utils/markdown';

describe('Markdown Sanitizer & XSS Prevention', () => {
  it('neutralizes malicious payload <img src=x onerror=alert(1)>', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const sanitized = sanitizeMarkdown(malicious);

    // Assert onerror handler is stripped and angle brackets are entity-encoded
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toContain('&lt;img');
  });

  it('neutralizes <script>alert("pwned")</script>', () => {
    const malicious = '<script>alert("pwned")</script>';
    const sanitized = sanitizeMarkdown(malicious);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert("pwned")');
  });

  it('neutralizes javascript: URIs', () => {
    const malicious = '[Click me](javascript:alert(document.cookie))';
    const sanitized = sanitizeMarkdown(malicious);

    expect(sanitized).not.toContain('javascript:');
  });

  it('neutralizes iframe and embed injections', () => {
    const malicious = '<iframe src="https://evil.com"></iframe>';
    const sanitized = sanitizeMarkdown(malicious);

    expect(sanitized).not.toContain('<iframe');
  });

  it('correctly parses legitimate markdown tokens safely', () => {
    const input = `
# Project Title
## Architecture
- Distributed consensus via Raft
- Strict linearizability
A paragraph describing performance benchmarks.
    `.trim();

    const tokens = parseMarkdownToTokens(input);
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0]).toEqual({ type: 'heading', level: 1, content: 'Project Title' });
    expect(tokens[1]).toEqual({ type: 'heading', level: 2, content: 'Architecture' });
    expect(tokens[2]).toEqual({ type: 'bullet', content: 'Distributed consensus via Raft' });
  });
});
