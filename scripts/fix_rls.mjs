import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:TechVista%402026@db.zuszzptghicmymbsddov.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to Supabase PostgreSQL!');

  const sql = `
    -- 1. Helper function for work ownership (SECURITY DEFINER avoids RLS recursion)
    CREATE OR REPLACE FUNCTION is_work_owner(p_work_id UUID, p_user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      IF p_work_id IS NULL OR p_user_id IS NULL THEN
        RETURN false;
      END IF;
      RETURN EXISTS (
        SELECT 1 FROM works WHERE id = p_work_id AND owner_id = p_user_id
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

    -- 2. Helper function for granted work access (SECURITY DEFINER avoids RLS recursion)
    CREATE OR REPLACE FUNCTION can_access_work(p_work_id UUID, p_user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      IF p_work_id IS NULL OR p_user_id IS NULL THEN
        RETURN false;
      END IF;
      RETURN EXISTS (
        SELECT 1 FROM work_access WHERE work_id = p_work_id AND granted_user_id = p_user_id
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

    -- 3. Fix work_access policies
    DROP POLICY IF EXISTS "Work Access: work owner can manage" ON work_access;
    DROP POLICY IF EXISTS "Work Access: granted user can view" ON work_access;

    CREATE POLICY "Work Access: work owner can manage" ON work_access FOR ALL USING (
      is_work_owner(work_id, auth.uid())
    );

    CREATE POLICY "Work Access: granted user can view" ON work_access FOR SELECT USING (
      granted_user_id = auth.uid()
    );

    -- 4. Fix works visibility policy
    DROP POLICY IF EXISTS "Works: viewable based on visibility" ON works;
    CREATE POLICY "Works: viewable based on visibility" ON works FOR SELECT USING (
      owner_id = auth.uid()
      OR (
        NOT is_blocked(auth.uid(), owner_id)
        AND (
          visibility IN ('public', 'worldwide')
          OR (visibility = 'connections' AND are_connected(auth.uid(), owner_id))
          OR (visibility = 'campus' AND shares_campus(auth.uid(), owner_id))
          OR (visibility = 'selected_users' AND can_access_work(id, auth.uid()))
        )
      )
    );
  `;

  await client.query(sql);
  console.log('RLS policies updated successfully without recursion!');

  const res = await client.query('SELECT count(*) FROM works;');
  console.log('Works count:', res.rows[0].count);

  await client.end();
}

main().catch(err => {
  console.error('Error applying RLS fix:', err);
  process.exit(1);
});
