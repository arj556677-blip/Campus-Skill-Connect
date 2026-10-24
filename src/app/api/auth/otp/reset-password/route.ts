import { NextRequest, NextResponse } from 'next/server';
import { completePasswordReset } from '@/lib/auth/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, resetToken, newPassword } = body;

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, reset token, and new password are required.' },
        { status: 400 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const result = await completePasswordReset(email, resetToken, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update password.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully. You may now log in with your new credentials.',
    });
  } catch (err: unknown) {
    console.error('[API /api/auth/otp/reset-password] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update password. Please try again.' },
      { status: 500 }
    );
  }
}
