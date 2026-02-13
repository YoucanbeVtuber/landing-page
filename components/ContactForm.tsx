"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/content/copy";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import PhoneInput from "./PhoneInput";

interface ContactFormProps {
  onSuccess: () => void;
  onError: () => void;
}

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (contactType === 'email') {
      if (!email) {
        setError(COPY.preRegister.form.validation.emailRequired);
        return;
      }
      if (!isValidEmail(email)) {
        setError(COPY.preRegister.form.validation.emailInvalid);
        return;
      }
    } else {
      if (!phone) {
        setError(COPY.preRegister.form.validation.phoneRequired);
        return;
      }
      if (!isValidPhone(phone)) {
        setError(COPY.preRegister.form.validation.phoneInvalid);
        return;
      }
    }

    // Dummy submission
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Pre-register submission:', {
        type: contactType,
        value: contactType === 'email' ? email : phone,
      });

      onSuccess();
      
      // Reset form
      setEmail('');
      setPhone('');
    } catch (err) {
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
      {/* Contact Type Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {COPY.preRegister.form.contactTypeLabel}
        </label>
        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={() => setContactType('email')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              contactType === 'email'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {COPY.preRegister.form.email}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setContactType('phone')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              contactType === 'phone'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {COPY.preRegister.form.phone}
          </motion.button>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-6">
        {contactType === 'email' ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.preRegister.form.emailPlaceholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          />
        ) : (
          <PhoneInput
            value={phone}
            onChange={setPhone}
            placeholder={COPY.preRegister.form.phonePlaceholder}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-red-500 text-sm mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? '처리 중...' : COPY.preRegister.form.submit}
      </motion.button>
    </form>
  );
}
