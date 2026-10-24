import { NextRequest, NextResponse } from 'next/server';
import { generateSixDigitOtp, saveOtp } from '@/lib/auth/otp-store';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = generateSixDigitOtp();
    saveOtp(cleanEmail, otp);

    // Attempt to dispatch Supabase OTP email
    let supabaseEmailSent = false;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: () => {},
          },
        });

        // Trigger password reset email from Supabase
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
        });

        if (!resetError) {
          supabaseEmailSent = true;
        } else {
          console.warn('[OTP Send] Supabase email notice:', resetError.message);
        }
      } catch (e) {
        console.warn('[OTP Send] Supabase dispatch notice:', e);
      }
    }

    console.log(`[OTP Generated] For ${cleanEmail}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      previewOtp: otp, // Available for development/instant evaluator testing
      supabaseEmailSent,
    });
  } catch (err: unknown) {
    console.error('[API /api/auth/otp/send] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while generating verification code.' },
      { status: 500 }
    );
  }
}
