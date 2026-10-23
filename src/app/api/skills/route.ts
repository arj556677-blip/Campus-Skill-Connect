import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';

    const supabase = await createServerSupabaseClient();
    let dbQuery = supabase
      .from('skills')
      .select('id, name, category, is_verified')
      .order('name', { ascending: true })
      .limit(50);

    if (query) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    if (category && category !== 'all') {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data: skills, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ skills: skills || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const AddSkillSchema = z.object({
  skillId: z.string().uuid().optional(),
  name: z.string().min(2).max(50).optional(),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = AddSkillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { skillId, name, proficiency } = parsed.data;
    const supabase = await createServerSupabaseClient();

    let targetSkillId = skillId;

    // If new skill name passed, find or create in controlled vocabulary
    if (!targetSkillId && name) {
      const cleanName = name.trim();
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .ilike('name', cleanName)
        .single();

      if (existingSkill) {
        targetSkillId = existingSkill.id;
      } else {
        const { data: newSkill, error: createErr } = await supabase
          .from('skills')
          .insert({ name: cleanName, category: 'software', is_verified: false })
          .select('id')
          .single();

        if (createErr) throw createErr;
        targetSkillId = newSkill.id;
      }
    }

    if (!targetSkillId) {
      return NextResponse.json({ error: 'Skill ID or name required' }, { status: 400 });
    }

    // Insert into user_skills (self-declared by default)
    const { data: userSkill, error: linkErr } = await supabase
      .from('user_skills')
      .upsert(
        {
          user_id: user.id,
          skill_id: targetSkillId,
          proficiency,
          is_self_declared: true,
        },
        { onConflict: 'user_id,skill_id' }
      )
      .select('*, skill:skills(id, name, category)')
      .single();

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, userSkill }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userSkillId = searchParams.get('id');

    if (!userSkillId) {
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, deletedId: userSkillId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
