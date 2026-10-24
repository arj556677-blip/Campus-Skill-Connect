import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/utils/ip';

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    if (body.confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Confirmation string "DELETE MY ACCOUNT" is required for permanent account erasure.' },
        { status: 400 }
      );
    }

    // 1. Delete user's works
    await supabase.from('works').delete().eq('owner_id', user.id);

    // 2. Delete user's skills
    await supabase.from('user_skills').delete().eq('user_id', user.id);

    // 3. Delete connections and blocks
    await supabase
      .from('connections')
      .delete()
      .or(`user_low.eq.${user.id},user_high.eq.${user.id}`);
    await supabase
      .from('blocks')
      .delete()
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

    // 4. Delete CV storage files
    const { data: cvRecords } = await supabase
      .from('cv_uploads')
      .select('file_url')
      .eq('user_id', user.id);

    if (cvRecords && cvRecords.length > 0) {
      const filePaths = cvRecords.map((r) => r.file_url).filter(Boolean) as string[];
      if (filePaths.length > 0) {
        try {
          await supabase.storage.from('cv-documents').remove(filePaths);
        } catch {
          // Continue with profile deletion
        }
      }
      await supabase.from('cv_uploads').delete().eq('user_id', user.id);
    }

    // 5. Anonymize/erase profile personal data
    await supabase
      .from('profiles')
      .update({
        display_name: 'Anonymized Former User',
        username: `deleted_${user.id.slice(0, 8)}`,
        headline: null,
        bio: null,
        avatar_url: null,
        avatar_path: null,
        profile_visibility: 'only_me',
        is_verified: false,
        is_campus_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 6. Append audit log entry
    try {
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'account_erasure_requested',
        target_resource: `profile:${user.id}`,
        ip_address: ip,
        metadata: { compliance: 'DPDPA 2023 Section 12 Right to Erasure' },
      });
    } catch {
      // Ignore audit fail
    }

    // 7. Sign out from Supabase Auth
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Account and associated personal data erased successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
