/**
 * Secure URL and File Validators
 * Enforces HTTPS-only, anti-SSRF protections, and magic file signatures.
 */

const FORBIDDEN_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS/GCP metadata service
  'metadata.google.internal',
  '[::1]',
]);

export interface UrlValidationResult {
  valid: boolean;
  sanitizedUrl?: string;
  hostname?: string;
  error?: string;
}

export function validateSecureHttpsUrl(input: string): UrlValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'URL string is required' };
  }

  const trimmed = input.trim();
  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'Protocol must be secure HTTPS (https://)' };
    }

    const host = parsed.hostname.toLowerCase();
    if (FORBIDDEN_HOSTNAMES.has(host) || host.endsWith('.local') || host.endsWith('.internal')) {
      return { valid: false, error: 'Internal and loopback hosts are forbidden' };
    }

    return {
      valid: true,
      sanitizedUrl: parsed.toString(),
      hostname: host,
    };
  } catch {
    return { valid: false, error: 'Malformed URL format' };
  }
}

export interface FileValidationResult {
  valid: boolean;
  mimeType?: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateCvFile(
  bytes: Uint8Array,
  fileName: string,
  maxBytes: number = MAX_FILE_SIZE
): FileValidationResult {
  if (!bytes || bytes.length === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (bytes.length > maxBytes) {
    return { valid: false, error: `File exceeds maximum allowed size of 5 MB (${bytes.length} bytes)` };
  }

  // Check magic signatures
  // PDF: %PDF- (0x25 0x50 0x44 0x46)
  const isPdf =
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46;

  // DOCX / ZIP container: PK\x03\x04 (0x50 0x4B 0x03 0x04)
  const isDocx =
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4B &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04;

  const lowerName = fileName.toLowerCase();

  if (isPdf && lowerName.endsWith('.pdf')) {
    return { valid: true, mimeType: 'application/pdf' };
  }

  if (isDocx && (lowerName.endsWith('.docx') || lowerName.endsWith('.doc'))) {
    return {
      valid: true,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  return {
    valid: false,
    error: 'Invalid file format. Upload must be a valid PDF or DOCX file verified by file signature.',
  };
}
