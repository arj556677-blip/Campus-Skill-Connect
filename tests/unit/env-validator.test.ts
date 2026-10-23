import { describe, it, expect } from 'vitest';
import { validateEnv } from '@/lib/env';

describe('Environment Variable Validator', () => {
  it('succeeds with valid configuration', () => {
    const validConfig = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'valid_anon_public_key_string_12345',
      NODE_ENV: 'test' as const,
    };

    const parsed = validateEnv(validConfig);
    expect(parsed.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test-project.supabase.co');
    expect(parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('valid_anon_public_key_string_12345');
    expect(parsed.NODE_ENV).toBe('test');
  });

  it('rejects invalid Supabase URL format', () => {
    const invalidConfig = {
      NEXT_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'valid_key_string_12345',
    };

    expect(() => validateEnv(invalidConfig)).toThrow('Environment validation failed');
  });

  it('rejects too short public anon key', () => {
    const invalidConfig = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'short',
    };

    expect(() => validateEnv(invalidConfig)).toThrow('Environment validation failed');
  });
});
