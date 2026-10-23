import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/auth/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const result = verifyOtpCode(email, otp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      resetToken: result.resetToken,
      message: 'Verification code confirmed. You may now create your new password.',
    });
  } catch (err: unknown) {
    console.error('[API /api/auth/otp/verify] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
