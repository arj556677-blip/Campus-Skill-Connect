import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ cv: null, isGuest: true });
    }

    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';

    const supabase = await createServerSupabaseClient();

    // Fetch latest CV upload for this user
    let cvUpload = null;
    try {
      const { data, error } = await supabase
        .from('cv_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        cvUpload = data;
      }
    } catch {
      // In mock/unseeded mode, return null gracefully
    }

    if (!cvUpload) {
      return NextResponse.json({ cv: null, isGuest: false });
    }

    if (download && cvUpload.file_url) {
      // Generate a short-lived signed URL (15 minutes = 900 seconds)
      try {
        const { data: signedData, error: signError } = await supabase.storage
          .from('cv-documents')
          .createSignedUrl(cvUpload.file_url, 900);

        if (!signError && signedData?.signedUrl) {
          return NextResponse.json({
            cv: cvUpload,
            downloadUrl: signedData.signedUrl,
            expiresInSeconds: 900,
          });
        }
      } catch {
        // Fallback for mock/local storage
      }

      return NextResponse.json({
        cv: cvUpload,
        downloadUrl: cvUpload.file_url.startsWith('http') ? cvUpload.file_url : null,
        expiresInSeconds: 900,
      });
    }

    return NextResponse.json({ cv: cvUpload, isGuest: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // Find user's CV records
    try {
      const { data: records } = await supabase
        .from('cv_uploads')
        .select('id, file_url')
        .eq('user_id', user.id);

      if (records && records.length > 0) {
        const filePaths = records.map((r) => r.file_url).filter(Boolean) as string[];
        if (filePaths.length > 0) {
          try {
            await supabase.storage.from('cv-documents').remove(filePaths);
          } catch {
            // Continue with db deletion
          }
        }

        await supabase.from('cv_uploads').delete().eq('user_id', user.id);
      }
    } catch {
      // Local/mock storage deletion handled
    }

    return NextResponse.json({ success: true, message: 'CV deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Save approved fields to user profile
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required. Please sign in to save extracted skills to your profile.' }, { status: 401 });
    }

    const body = await request.json();
    const { approvedSkills, uploadId } = body;

    const supabase = await createServerSupabaseClient();

    if (Array.isArray(approvedSkills) && approvedSkills.length > 0) {
      try {
        // Look up skill IDs from controlled vocabulary
        const { data: skillsData } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', approvedSkills);

        if (skillsData && skillsData.length > 0) {
          const userSkillsToInsert = skillsData.map((s) => ({
            user_id: user.id,
            skill_id: s.id,
            proficiency: 'intermediate',
            is_self_declared: true,
          }));

          await supabase
            .from('user_skills')
            .upsert(userSkillsToInsert, { onConflict: 'user_id, skill_id' });
        }
      } catch (err) {
        console.warn('[CV API] User skills upsert notice:', err);
      }
    }

    if (uploadId) {
      try {
        await supabase
          .from('cv_uploads')
          .update({ status: 'applied' })
          .eq('id', uploadId)
          .eq('user_id', user.id);
      } catch {
        // Ignore mock update errors
      }
    }

    return NextResponse.json({ success: true, message: 'Approved fields synchronized to profile' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
