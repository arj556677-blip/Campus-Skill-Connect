import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch user skills
    const { data: skills } = await supabase
      .from('user_skills')
      .select('*, skill:skills(name, category)')
      .eq('user_id', user.id);

    // Fetch user works
    const { data: works } = await supabase
      .from('works')
      .select('*, work_skills(skill:skills(name))')
      .eq('owner_id', user.id);

    // Fetch user connections
    const { data: connections } = await supabase
      .from('connections')
      .select('*')
      .or(`user_low.eq.${user.id},user_high.eq.${user.id}`);

    // Fetch CV uploads
    const { data: cvs } = await supabase
      .from('cv_uploads')
      .select('id, file_url, status, created_at')
      .eq('user_id', user.id);

    const exportBundle = {
      exportDate: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      profile,
      skills: skills || [],
      works: works || [],
      connections: connections || [],
      cvs: cvs || [],
      privacyCompliance: {
        framework: 'Digital Personal Data Protection Act, 2023 (DPDPA)',
        dataSubjectRights: 'Right to Access, Right to Correction, Right to Erasure',
      },
    };

    const jsonString = JSON.stringify(exportBundle, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="campus_skill_connect_data_${user.id.slice(0, 8)}.json"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
