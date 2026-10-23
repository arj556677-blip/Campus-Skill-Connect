import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('--- Creating Auth Users for Demo Builders & Recruiters ---');

  const demoUsers = [
    {
      email: 'priya@iimb.ac.in',
      password: 'Password123!',
      display_name: 'Priya Sharma',
      role: 'student',
      headline: 'AI Product Strategy & FinTech Systems',
      bio: 'MBA candidate in Tech Management at IIM Bangalore. Exploring algorithmic trading systems and AI copilot architectures.',
      institution_id: 'a4444444-4444-4444-4444-444444444444', // IIMB
      zone_id: 'c2222222-2222-2222-2222-222222222222', // Bangalore Silicon Valley
      field: 'Product Management & FinTech',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'kavya@nid.edu',
      password: 'Password123!',
      display_name: 'Kavya Desai',
      role: 'student',
      headline: 'Design Systems Architect & Interaction Designer',
      bio: 'Postgraduate scholar at NID Ahmedabad. Passionate about tactile UI micro-interactions, accessible design systems, and Figma tokens.',
      institution_id: 'a2222222-2222-2222-2222-222222222222', // NID
      zone_id: 'c1111111-1111-1111-1111-111111111111', // Mumbai Tech Hub / Western Zone
      field: 'UI/UX & Human-Computer Interaction',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'aditya@jnu.ac.in',
      password: 'Password123!',
      display_name: 'Aditya Verma',
      role: 'student',
      headline: 'Quantum Computing & Cryptographic Protocols',
      bio: 'Research scholar at JNU School of Computer and Systems Sciences. Focus on post-quantum cryptographic lattice algorithms.',
      institution_id: 'a3333333-3333-3333-3333-333333333333', // JNU
      zone_id: 'c3333333-3333-3333-3333-333333333333', // Delhi NCR Innovation Corridor
      field: 'Information Security & Quantum Algorithms',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'neha@bits-pilani.ac.in',
      password: 'Password123!',
      display_name: 'Neha Reddy',
      role: 'student',
      headline: 'Cloud Infrastructure & High-Performance Go Backend',
      bio: 'Building eBPF observability tools, distributed message brokers, and Kubernetes operators.',
      institution_id: 'a6666666-6666-6666-6666-666666666666', // BITS
      zone_id: 'c4444444-4444-4444-4444-444444444444', // Hyderabad Tech City
      field: 'Distributed Systems & Cloud Engineering',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'marcus@stripe.com',
      password: 'Password123!',
      display_name: 'Marcus Chen',
      role: 'recruiter',
      headline: 'University Talent Partner @ Stripe',
      bio: 'Sourcing ambitious student engineers for core payments, distributed transaction processing, and developer infrastructure.',
      zone_id: 'c2222222-2222-2222-2222-222222222222', // Bangalore
      field: 'Fintech & Distributed Systems',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'elena@scale.com',
      password: 'Password123!',
      display_name: 'Elena Rostova',
      role: 'recruiter',
      headline: 'Senior Technical Scout @ Scale AI',
      bio: 'Looking for ML research fellows, computer vision engineers, and LLM fine-tuning contributors for frontier model evaluations.',
      zone_id: 'c1111111-1111-1111-1111-111111111111', // Mumbai Tech Hub
      field: 'Generative AI & Machine Learning',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
    {
      email: 'david@microsoft.com',
      password: 'Password123!',
      display_name: 'David Patel',
      role: 'recruiter',
      headline: 'Lead Campus Talent Scout @ Microsoft',
      bio: 'Partnering with universities across India for Azure Cloud, Open-Source Dev Tools, and Systems Engineering internships.',
      zone_id: 'c4444444-4444-4444-4444-444444444444', // Hyderabad Tech City
      field: 'Cloud Infrastructure & Systems',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    },
  ];

  for (const u of demoUsers) {
    try {
      // 1. Create or get user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: {
          display_name: u.display_name,
          role: u.role,
        },
      });

      let userId = authData?.user?.id;
      if (authError) {
        if (authError.message.includes('already registered')) {
          // fetch user
          const { data: listData } = await supabase.auth.admin.listUsers();
          const existing = listData?.users?.find((x) => x.email === u.email);
          userId = existing?.id;
        } else {
          console.error('Auth create error:', u.email, authError.message);
          continue;
        }
      }

      if (!userId) continue;

      // 2. Upsert profile
      const profileData = {
        id: userId,
        display_name: u.display_name,
        role: u.role,
        headline: u.headline,
        bio: u.bio,
        institution_id: u.institution_id || null,
        zone_id: u.zone_id || null,
        field: u.field,
        avatar_url: u.avatar_url,
        is_verified: true,
        is_campus_verified: u.role === 'student' || u.role === 'faculty',
        profile_visibility: 'public',
        updated_at: new Date().toISOString(),
      };

      const { error: profError } = await supabase.from('profiles').upsert(profileData);
      if (profError) {
        console.error('Profile upsert error:', u.display_name, profError.message);
      } else {
        console.log('✓ Successfully provisioned:', u.display_name, `(${u.role})`);
      }
    } catch (err) {
      console.error('Unexpected error:', u.email, err);
    }
  }

  console.log('--- ALL AUTH & PROFILES PROVISIONED ---');
}

run().catch(console.error);
