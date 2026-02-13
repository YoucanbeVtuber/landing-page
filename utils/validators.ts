/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number (10-11 digits)
 * @param phone - Phone number digits to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}
