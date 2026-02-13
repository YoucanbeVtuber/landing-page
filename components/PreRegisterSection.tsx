"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/content/copy";
import ContactForm from "./ContactForm";

export default function PreRegisterSection() {
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSuccess = () => {
    setToastMessage(COPY.preRegister.form.success);
    setShowToast(true);
    setShowForm(false);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleError = () => {
    setToastMessage(COPY.preRegister.form.error);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <section id="pre-register" className="relative min-h-screen py-32 px-6 gradient-purple-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {COPY.preRegister.title}
          </h2>
          <p className="text-lg md:text-xl text-purple-100 mb-12">
            {COPY.preRegister.subtitle}
          </p>

          {!showForm ? (
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-10 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {COPY.preRegister.ctaButton}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ContactForm onSuccess={handleSuccess} onError={handleError} />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <motion.div
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {toastMessage}
        </motion.div>
      )}
    </section>
  );
}
