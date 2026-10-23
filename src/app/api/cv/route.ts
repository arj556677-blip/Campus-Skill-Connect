import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';

    // Fetch latest CV upload for this user
    const { data: cvUpload, error } = await supabase
      .from('cv_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !cvUpload) {
      return NextResponse.json({ cv: null });
    }

    if (download && cvUpload.file_url) {
      // Generate a short-lived signed URL (15 minutes = 900 seconds)
      const { data: signedData, error: signError } = await supabase.storage
        .from('cv-documents')
        .createSignedUrl(cvUpload.file_url, 900);

      if (signError) {
        return NextResponse.json({ error: 'Failed to generate signed download URL' }, { status: 500 });
      }

      return NextResponse.json({
        cv: cvUpload,
        downloadUrl: signedData?.signedUrl,
        expiresInSeconds: 900,
      });
    }

    return NextResponse.json({ cv: cvUpload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find user's CV records
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

    return NextResponse.json({ success: true, message: 'CV deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Save approved fields to user profile
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { approvedSkills, uploadId } = body;

    if (Array.isArray(approvedSkills) && approvedSkills.length > 0) {
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
    }

    if (uploadId) {
      await supabase
        .from('cv_uploads')
        .update({ status: 'applied' })
        .eq('id', uploadId)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, message: 'Approved fields synchronized to profile' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
