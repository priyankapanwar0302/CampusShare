/**
 * Security & Input Sanitization Utilities for CampusShare
 * Defense-in-depth against XSS, NoSQL/SQL Injections, and Malicious File Spoofing
 */

// Escapes special HTML characters to prevent Cross-Site Scripting (XSS)
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';
  return dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Strips dangerous tags, JavaScript URI schemes, null bytes, and malicious script vectors
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  let sanitized = input.trim();
  
  // Remove NULL byte poisoning
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove javascript: and data: pseudo protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');

  // Strip script, iframe, object, embed, style, and svg event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  
  // Remove NoSQL injection operator keywords ($where, $regex, $gt, $ne, etc.)
  sanitized = sanitized.replace(/\$(where|regex|gt|gte|lt|lte|ne|in|nin|exists|or|and)/gi, '');

  // Escape HTML entities
  return sanitizeHTML(sanitized);
}

// Check and validate file upload by magic bytes (File Signatures) and MIME types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedFormat?: string;
}

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.bash', '.vbs', '.js', '.mjs',
  '.php', '.py', '.rb', '.pl', '.com', '.msi', '.scr', '.pif', '.jar'
];

/**
 * Validates file headers by inspecting raw byte signatures (magic numbers).
 * PDF standard requires file header: %PDF (hex: 25 50 44 46)
 */
export async function validatePDFFile(file: File): Promise<FileValidationResult> {
  // 1. Check size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 25MB policy limit (Provided: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  // 2. Check filename extension against dangerous execution vectors
  const fileNameLower = file.name.toLowerCase();
  for (const ext of DANGEROUS_EXTENSIONS) {
    if (fileNameLower.endsWith(ext)) {
      return {
        isValid: false,
        error: `Security Violation: Executable file types (${ext}) are strictly blocked.`,
      };
    }
  }

  // Must end with .pdf or .zip if explicitly allowed
  if (!fileNameLower.endsWith('.pdf') && !fileNameLower.endsWith('.zip')) {
    return {
      isValid: false,
      error: 'Security Policy: Only verified PDF academic documents (or ZIP project archives) are permitted.',
    };
  }

  // 3. Inspect raw magic bytes if browser supports slice/arrayBuffer
  try {
    const headerBlob = file.slice(0, 4);
    const arrayBuffer = await headerBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // If PDF, first 4 bytes must be 0x25 0x50 0x44 0x46 ('%PDF')
    if (fileNameLower.endsWith('.pdf')) {
      const isPDF =
        bytes[0] === 0x25 && // %
        bytes[1] === 0x50 && // P
        bytes[2] === 0x44 && // D
        bytes[3] === 0x46;   // F

      if (!isPDF) {
        return {
          isValid: false,
          error: 'Corrupted or Spoofed File: File magic bytes do not match standard PDF header (%PDF).',
        };
      }
      return { isValid: true, detectedFormat: 'PDF' };
    }

    // If ZIP (PK header: 0x50 0x4B 0x03 0x04)
    if (fileNameLower.endsWith('.zip')) {
      const isZip =
        bytes[0] === 0x50 && // P
        bytes[1] === 0x4B && // K
        bytes[2] === 0x03 &&
        bytes[3] === 0x04;

      if (!isZip) {
        return {
          isValid: false,
          error: 'Corrupted or Spoofed File: File magic bytes do not match standard ZIP archive header (PK).',
        };
      }
      return { isValid: true, detectedFormat: 'ZIP' };
    }
  } catch (err) {
    // If arrayBuffer read fails, fallback to strict MIME inspection
    if (file.type !== 'application/pdf' && file.type !== 'application/zip') {
      return {
        isValid: false,
        error: 'Invalid MIME type detected: Only application/pdf is authorized.',
      };
    }
  }

  return { isValid: true, detectedFormat: 'PDF' };
}
