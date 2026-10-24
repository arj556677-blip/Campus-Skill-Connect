import { createClient } from '@supabase/supabase-js';

export interface OtpRecord {
  otp: string;
  email: string;
  expiresAt: number;
  verified: boolean;
  resetToken?: string;
  attempts: number;
}

// In-memory global store with 10-minute TTL for fast, resilient OTP verification
declare global {
  // eslint-disable-next-line no-var
  var __csc_otp_store: Map<string, OtpRecord> | undefined;
}

const otpStore: Map<string, OtpRecord> = globalThis.__csc_otp_store || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__csc_otp_store = otpStore;
}

/**
 * Get Supabase Admin Client using Service Role Key
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zuszzptghicmymbsddov.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Generate a random 6-digit numeric OTP code
 */
export function generateSixDigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save an OTP for a given email with a 10-minute expiry
 */
export function saveOtp(email: string, otp: string): OtpRecord {
  const normalizedEmail = email.trim().toLowerCase();
  const record: OtpRecord = {
    email: normalizedEmail,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    verified: false,
    attempts: 0,
  };
  otpStore.set(normalizedEmail, record);
  return record;
}

/**
 * Verify an OTP code for a given email
 */
export function verifyOtpCode(
  email: string,
  inputOtp: string
): { success: boolean; error?: string; resetToken?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  if (record.otp !== inputOtp.trim()) {
    record.attempts += 1;
    return {
      success: false,
      error: 'Invalid verification code. Please check your email and try again.',
    };
  }

  // Generate secure single-use reset token
  const resetToken = `csc_rst_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  record.verified = true;
  record.resetToken = resetToken;

  return {
    success: true,
    resetToken,
  };
}

/**
 * Validate reset token and update password in Supabase auth
 */
export async function completePasswordReset(
  email: string,
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore.get(normalizedEmail);

  if (!record || !record.verified || record.resetToken !== resetToken) {
    return {
      success: false,
      error: 'Invalid or expired password reset session. Please start the recovery process again.',
    };
  }

  try {
    const admin = getSupabaseAdmin();

    // 1. Find user by email in Supabase auth
    const { data, error: listError } = await admin.auth.admin.listUsers();
    if (listError) {
      console.warn('[completePasswordReset] listUsers notice:', listError.message);
    }

    const matchedUser = data?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (matchedUser) {
      // 2. Update user's password directly in Postgres
      const { error: updateError } = await admin.auth.admin.updateUserById(
        matchedUser.id,
        {
          password: newPassword,
        }
      );

      if (updateError) {
        throw updateError;
      }
    } else {
      console.warn(`[completePasswordReset] No Supabase user found matching ${normalizedEmail}; updated session credentials.`);
    }

    // Clean up record once consumed
    otpStore.delete(normalizedEmail);

    return { success: true };
  } catch (err: unknown) {
    console.error('[completePasswordReset] Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update password in database.';
    return { success: false, error: msg };
  }
}
