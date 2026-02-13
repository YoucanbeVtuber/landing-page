/**
 * Formats a phone number string with hyphens
 * @param digits - Raw digits (e.g., "01012345678")
 * @returns Formatted phone number (e.g., "010-1234-5678")
 */
export function formatPhoneNumber(digits: string): string {
  const cleaned = extractDigits(digits);
  
  if (cleaned.length === 0) return '';
  
  // 010-1234-5678 format for both 10 and 11 digits
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }
}

/**
 * Extracts only digits from a string
 * @param value - Input string (may contain hyphens, spaces, etc.)
 * @returns Digits only
 */
export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}
