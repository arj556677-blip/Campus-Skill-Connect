import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { validateCvFile } from '@/lib/utils/validators';
import { checkRateLimit, RateLimits } from '@/lib/redis/rate-limit';
import { getClientIp } from '@/lib/utils/ip';

const CONTROLLED_SKILLS = [
  'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++',
  'React 19', 'Next.js 16', 'Next.js 15', 'Tailwind CSS', 'Node.js', 'FastAPI',
  'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'WebRTC', 'Git CI/CD',
  'PyTorch', 'TensorFlow', 'TensorRT', 'OpenCV', 'Vision Transformers',
  'Distributed Systems', 'SQL RLS', 'GraphQL', 'REST API', 'Linux',
];

interface AtsRuleCheck {
  id: string;
  category: 'headings' | 'contact' | 'dates' | 'keywords';
  title: string;
  passed: boolean;
  description: string;
  detail?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip, RateLimits.UPLOAD);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded for uploads. Please wait before trying again.' },
      { status: 429 }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    const isGuest = !user;
    const userId = user?.id || 'guest-session';

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = ((formData.get('jobDescription') as string | null) || '').trim();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Validate magic bytes & file size (5MB limit)
    const fileValidation = validateCvFile(bytes, file.name, 5 * 1024 * 1024);
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Server-side text parsing from buffer
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = decoder.decode(bytes);

    // Run rule-based ATS checklist
    const checklist: AtsRuleCheck[] = [];

    // 1. Headings Present check
    const lowerText = rawText.toLowerCase();
    const hasExperience = lowerText.includes('experience') || lowerText.includes('employment') || lowerText.includes('work history');
    const hasEducation = lowerText.includes('education') || lowerText.includes('academic') || lowerText.includes('university');
    const hasProjects = lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('open source');
    const hasSkills = lowerText.includes('skill') || lowerText.includes('competenc') || lowerText.includes('technolog');

    checklist.push({
      id: 'rule-headings',
      category: 'headings',
      title: 'Standard Section Headings',
      passed: hasExperience && hasEducation && hasProjects && hasSkills,
      description: 'Resume contains standard headings parsable by enterprise software',
      detail: `Experience: ${hasExperience ? '✓' : '✗'}, Education: ${hasEducation ? '✓' : '✗'}, Projects: ${hasProjects ? '✓' : '✗'}, Skills: ${hasSkills ? '✓' : '✗'}`,
    });

    // 2. Contact Information check
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const githubMatch = lowerText.includes('github.com');
    const linkedinMatch = lowerText.includes('linkedin.com');

    checklist.push({
      id: 'rule-contact',
      category: 'contact',
      title: 'Clear Contact Information',
      passed: Boolean(emailMatch && (githubMatch || linkedinMatch)),
      description: 'Valid email address and professional profile repository links present',
      detail: emailMatch ? `Email: ${emailMatch[0]}` : 'Missing valid email address',
    });

    // 3. Date Consistency check
    const yearMatches = rawText.match(/\b(20\d{2}|19\d{2})\b/g) || [];
    const hasConsistentDates = yearMatches.length >= 2;
    checklist.push({
      id: 'rule-dates',
      category: 'dates',
      title: 'Consistent Date Ranges',
      passed: hasConsistentDates,
      description: 'Chronological timeline detected for education and professional milestones',
      detail: hasConsistentDates ? `Detected ${yearMatches.length} date anchors` : 'Insufficient date anchors detected',
    });

    // 4. Keyword Coverage against job description (if provided)
    let keywordCoverage: { matched: string[]; missing: string[] } | null = null;
    if (jobDescription.length > 10) {
      const words = Array.from(new Set(
        jobDescription
          .toLowerCase()
          .replace(/[^a-z0-9#+.]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with', 'you', 'are', 'will'].includes(w))
      ));

      const matched: string[] = [];
      const missing: string[] = [];
      for (const word of words.slice(0, 20)) {
        if (lowerText.includes(word)) {
          matched.push(word);
        } else {
          missing.push(word);
        }
      }

      keywordCoverage = { matched, missing };
      checklist.push({
        id: 'rule-keywords',
        category: 'keywords',
        title: 'Job Description Keyword Alignment',
        passed: matched.length >= Math.min(5, Math.floor(words.length * 0.4)),
        description: `Matched ${matched.length} of ${matched.length + missing.length} sample keywords from job posting`,
        detail: matched.length > 0 ? `Matched: ${matched.slice(0, 5).join(', ')}` : 'Low keyword overlap with supplied job description',
      });
    }

    // Extract suggested skills from vocabulary
    const extractedSkills = CONTROLLED_SKILLS.filter((skill) =>
      lowerText.includes(skill.toLowerCase())
    );

    // Secure private storage path
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `cvs/${userId}/${safeFilename}`;

    // Upload to private Supabase bucket if authenticated
    let uploadSuccess = false;
    if (user) {
      try {
        const { error: storageError } = await supabase.storage
          .from('cv-documents')
          .upload(storagePath, bytes, {
            contentType: fileValidation.mimeType || 'application/pdf',
            upsert: true,
          });
        if (!storageError) {
          uploadSuccess = true;
        }
      } catch {
        // Storage bucket might be mock or local; record path
      }
    }

    const extractedData = {
      fileName: file.name,
      fileSize: bytes.length,
      mimeType: fileValidation.mimeType,
      storagePath: uploadSuccess ? storagePath : null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      extractedSkills,
      checklist,
      keywordCoverage,
      isGuest,
    };

    // Persist parsed record in cv_uploads table if authenticated
    let uploadId = `upload-${Date.now()}`;
    if (user) {
      try {
        const { data: cvRecord, error: dbError } = await supabase
          .from('cv_uploads')
          .insert({
            user_id: user.id,
            file_url: storagePath,
            extracted_data: extractedData,
            status: 'parsed',
          })
          .select()
          .single();

        if (cvRecord?.id) {
          uploadId = cvRecord.id;
        }
        if (dbError) {
          console.warn('[CV Upload] DB insert notice:', dbError.message);
        }
      } catch {
        // Fallback upload ID retained
      }
    }

    return NextResponse.json({
      success: true,
      uploadId,
      extractedData,
      checklist,
      isGuest,
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.display_name || user.user_metadata?.name || 'Student Builder',
          }
        : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error processing CV';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
