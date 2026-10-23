import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders, RateLimits } from '@/lib/redis/rate-limit';
import { getClientIp } from '@/lib/utils/ip';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Apply Redis sliding-window rate limit (10 requests/minute for AI endpoints) - fail closed per spec
  const rateLimit = await checkRateLimit(ip, RateLimits.AI_ENDPOINT, { failClosed: true });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'AI rate limit exceeded (10 requests/min). Please wait.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit, RateLimits.AI_ENDPOINT) }
    );
  }

  try {
    const { messages } = await request.json();
    const lastUserMessage = messages?.[messages.length - 1]?.content || '';

    // If GOOGLE_AI_API_KEY is present in environment, call Gemini
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    let reply = '';

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the Campus Skill Connect AI Career & Engineering Copilot.
User context: Student or faculty builder sharing verified evidence of work.
Provide helpful, realistic technical feedback, interview prep, or resume suggestions based on evidence.
User message: ${lastUserMessage}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch {
        // Fallback to intelligent built-in advisor
      }
    }

    if (!reply) {
      // High-signal contextual advisor response
      if (lastUserMessage.toLowerCase().includes('faang') || lastUserMessage.toLowerCase().includes('backend')) {
        reply = `### Technical Assessment for Scalable Backend Roles:
1. **Highlight Your Systems Work**: Evidence demonstrating cache invalidation, sliding window rate limiting, and connection pools shows real depth. Interviewers specifically drill on race conditions (Cache Stampede, Thundering Herd, Write-Through vs Write-Back).
2. **PostgreSQL RLS as Security Proof**: Emphasize multi-tenant row-level security policies and canonical schema isolation rather than client-only filters.
3. **Recommended Next Challenge**: Implement a distributed consensus or leader-election demo using Redis Redlock or Raft.`;
      } else if (lastUserMessage.toLowerCase().includes('interview') || lastUserMessage.toLowerCase().includes('redis')) {
        reply = `### Mock Interview Drill: In-Memory Systems & State
Here are 3 core questions you should prepare for:
1. **Sliding Window vs Token Bucket**: Why choose sorted sets for sliding-window rate limiting instead of a fixed counter? *(Hint: Fixed counters suffer from boundary bursts where 2x requests can slip through at window resets).*
2. **Cache Eviction Under Pressure**: In a high-traffic campus system, what eviction policy would you configure (LRU, LFU, or volatile-ttl) and why?
3. **Distributed Invalidation**: When a user modifies visibility in PostgreSQL, how do you prevent stale cache reads across multiple edge nodes?`;
      } else if (lastUserMessage.toLowerCase().includes('ats') || lastUserMessage.toLowerCase().includes('resume')) {
        reply = `### Resume ATS Optimization Checklist:
1. **Quantification**: Ensure each bullet item has an explicit, measurable impact: e.g., *"Reduced p99 database query latency from 140ms to 8ms"*.
2. **Keyword Density**: Include standard industry skills you have actually used: *RESTful API, SSR Auth, CI/CD, Redis Pub/Sub, Docker Orchestration*.
3. **Format**: Use a single-column layout with clean headings for optimal parsing across standard Applicant Tracking Systems.`;
      } else {
        reply = `I am your Campus Career & Engineering Copilot!

**How can I help you today?**
1. Run a mock backend engineering interview.
2. Brainstorm a cross-campus research project combining Computer Vision with WebRTC.
3. Review your portfolio description for recruiter outbound messages.`;
      }
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
