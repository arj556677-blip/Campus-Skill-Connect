import { describe, it, expect } from 'vitest';
import { validateSecureHttpsUrl, validateCvFile } from '@/lib/utils/validators';

describe('Secure URL and File Validators', () => {
  describe('validateSecureHttpsUrl', () => {
    it('approves legitimate https URLs', () => {
      const result = validateSecureHttpsUrl('https://github.com/my-org/project');
      expect(result.valid).toBe(true);
      expect(result.hostname).toBe('github.com');
    });

    it('rejects unencrypted http URLs', () => {
      const result = validateSecureHttpsUrl('http://insecure-site.com/demo');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTPS');
    });

    it('blocks loopback and anti-SSRF targets', () => {
      expect(validateSecureHttpsUrl('https://localhost:3000/api').valid).toBe(false);
      expect(validateSecureHttpsUrl('https://127.0.0.1/admin').valid).toBe(false);
      expect(validateSecureHttpsUrl('https://169.254.169.254/latest/meta-data').valid).toBe(false);
      expect(validateSecureHttpsUrl('https://service.internal/secret').valid).toBe(false);
    });

    it('rejects malformed inputs and javascript: protocol pseudo-URLs', () => {
      expect(validateSecureHttpsUrl('javascript:alert(1)').valid).toBe(false);
      expect(validateSecureHttpsUrl('data:text/html,<script>alert(1)</script>').valid).toBe(false);
      expect(validateSecureHttpsUrl('not a url at all').valid).toBe(false);
    });
  });

  describe('validateCvFile', () => {
    it('accepts valid PDF magic bytes %PDF-', () => {
      // Magic bytes for PDF: %PDF-
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]);
      const result = validateCvFile(pdfBytes, 'resume.pdf');
      expect(result.valid).toBe(true);
      expect(result.mimeType).toBe('application/pdf');
    });

    it('accepts valid DOCX magic bytes PK\\x03\\x04', () => {
      // Magic bytes for PK zip: PK\x03\x04
      const docxBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
      const result = validateCvFile(docxBytes, 'cv.docx');
      expect(result.valid).toBe(true);
      expect(result.mimeType).toContain('wordprocessingml');
    });

    it('rejects fake extension if magic bytes do not match', () => {
      // Renamed exe or text file as .pdf
      const fakeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]); // MZ executable header
      const result = validateCvFile(fakeBytes, 'malicious.pdf');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file format');
    });

    it('rejects files exceeding 5 MB', () => {
      const hugeBytes = new Uint8Array(6 * 1024 * 1024);
      hugeBytes[0] = 0x25;
      hugeBytes[1] = 0x50;
      hugeBytes[2] = 0x44;
      hugeBytes[3] = 0x46;
      const result = validateCvFile(hugeBytes, 'huge.pdf');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });
  });
});
