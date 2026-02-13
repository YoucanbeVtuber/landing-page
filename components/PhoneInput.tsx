"use client";

import { ChangeEvent } from "react";
import { formatPhoneNumber, extractDigits } from "@/utils/phoneFormatter";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Extract digits only
    const digits = extractDigits(inputValue);
    
    // Limit to 11 digits
    const limitedDigits = digits.slice(0, 11);
    
    // Store raw digits (for validation)
    onChange(limitedDigits);
  };

  // Display formatted value
  const displayValue = formatPhoneNumber(value);

  return (
    <input
      type="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
      inputMode="numeric"
    />
  );
}
