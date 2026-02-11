import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollReveal } from './ScrollReveal';
import { Check, Loader2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  discord: string;
  keyboardType: string;
  budget: string;
  switches: string;
  keycaps: string;
};

const initialFormData: FormData = {
  name: '',
  email: '',
  discord: '',
  keyboardType: '',
  budget: '',
  switches: '',
  keycaps: '',
};

const initialFormData: FormData = {
  name: '',
  email: '',
  discord: '',
  keyboardType: '',
  budget: '',
  switches: '',
  keycaps: '',
  additionalInfo: '',
};

export function Commissions() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Google Forms submission
    // Form ID: 1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw
    const formId = '1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw';
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // Create form data for Google Forms
    const googleFormData = new FormData();
    // Map our form fields to Google Forms entry IDs
    googleFormData.append('entry.103391198', formData.name);
    googleFormData.append('entry.1872997171', formData.email);
    googleFormData.append('entry.262032242', formData.discord);
    googleFormData.append('entry.30082598', formData.keyboardType);
    googleFormData.append('entry.483733296', formData.budget);
    googleFormData.append('entry.664147544', formData.switches);
    googleFormData.append('entry.673371819', formData.keycaps);

    try {
      // Submit to Google Forms using fetch with no-cors mode
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData,
      });

      // Show success state
      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) =>
    `w-full px-0 py-3 bg-transparent border-0 border-b-2 outline-none transition-all duration-300 font-sans text-lg ${
      isDark
        ? focusedField === fieldName || formData[fieldName as keyof FormData]
          ? 'border-[#a7a495] text-[#a7a495]'
          : 'border-[#a7a495]/30 text-[#a7a495]'
        : focusedField === fieldName || formData[fieldName as keyof FormData]
          ? 'border-[#1c1c1c] text-[#1c1c1c]'
          : 'border-[#1c1c1c]/30 text-[#1c1c1c]'
    } placeholder:text-transparent focus:placeholder:text-opacity-50 ${
      isDark ? 'focus:placeholder:text-[#a7a495]/50' : 'focus:placeholder:text-[#1c1c1c]/50'
    }`;

  const labelClasses = (fieldName: string) =>
    `absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
      focusedField === fieldName || formData[fieldName as keyof FormData]
        ? isDark
          ? 'text-[#a7a495] text-xs -top-5'
          : 'text-[#1c1c1c] text-xs -top-5'
        : isDark
          ? 'text-[#a7a495]/60 text-lg top-3'
          : 'text-[#1c1c1c]/60 text-lg top-3'
    }`;

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Header */}
        <ScrollReveal>
          <header className="mb-16 sm:mb-24">
            <h1
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.85] tracking-tight mb-6 ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              Commissions
            </h1>
            <p
              className={`max-w-xl text-lg sm:text-xl leading-relaxed ${
                isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
              }`}
            >
              Interested in a custom keyboard build? Fill out the form below and I'll get back to you within 48 hours.
            </p>
          </header>
        </ScrollReveal>

        {/* Form */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-3xl p-8 sm:p-12 text-center ${
                isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isDark ? 'bg-[#a7a495]/20 text-[#a7a495]' : 'bg-[#1c1c1c]/10 text-[#1c1c1c]'
                }`}
              >
                <Check size={32} />
              </div>
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-4 ${
                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                }`}
              >
                Request Received!
              </h2>
              <p
                className={`text-lg mb-8 ${
                  isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
                }`}
              >
                Thank you for your interest. I'll review your request and get back to you soon.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 cursor-target ${
                  isDark
                    ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
                    : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
                }`}
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-12"
            >
              {/* Personal Info Section */}
              <ScrollReveal delay={0.1}>
                <div
                  className={`rounded-3xl p-8 sm:p-12 ${
                    isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
                  }`}
                >
                  <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 ${
                      isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                    }`}
                  >
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('name')}
                        placeholder="Your name"
                        required
                      />
                      <label className={labelClasses('name')}>Name *</label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('email')}
                        placeholder="your@email.com"
                        required
                      />
                      <label className={labelClasses('email')}>Email *</label>
                    </div>

                    {/* Discord */}
                    <div className="relative md:col-span-2">
                      <input
                        type="text"
                        name="discord"
                        value={formData.discord}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('discord')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('discord')}
                        placeholder="username#0000"
                      />
                      <label className={labelClasses('discord')}>Discord (optional)</label>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Build Details Section */}
              <ScrollReveal delay={0.2}>
                <div
                  className={`rounded-3xl p-8 sm:p-12 ${
                    isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
                  }`}
                >
                  <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 ${
                      isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                    }`}
                  >
                    Build Details
                  </h2>

                  <div className="space-y-8">
                    {/* Keyboard Type */}
                    <div className="relative">
                      <select
                        name="keyboardType"
                        value={formData.keyboardType}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('keyboardType')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('keyboardType')} appearance-none cursor-pointer`}
                        required
                      >
                        <option value="">Select a type</option>
                        <option value="60%">60%</option>
                        <option value="65%">65%</option>
                        <option value="75%">75%</option>
                        <option value="TKL">TKL (Tenkeyless)</option>
                        <option value="Full Size">Full Size</option>
                        <option value="Alice">Alice / Arisu</option>
                        <option value="Other">Other</option>
                      </select>
                      <label className={labelClasses('keyboardType')}>Keyboard Type *</label>
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${
                          isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'
                        }`}
                      >
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="relative">
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('budget')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('budget')} appearance-none cursor-pointer`}
                        required
                      >
                        <option value="">Select budget range</option>
                        <option value="$100-$200">$100 - $200</option>
                        <option value="$200-$400">$200 - $400</option>
                        <option value="$400-$600">$400 - $600</option>
                        <option value="$600-$1000">$600 - $1000</option>
                        <option value="$1000+">$1000+</option>
                      </select>
                      <label className={labelClasses('budget')}>Budget *</label>
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${
                          isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'
                        }`}
                      >
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Switches */}
                    <div className="relative">
                      <input
                        type="text"
                        name="switches"
                        value={formData.switches}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('switches')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('switches')}
                        placeholder="e.g., Gateron Oil Kings, Cherry MX Browns"
                      />
                      <label className={labelClasses('switches')}>
                        Preferred Switches (optional)
                      </label>
                    </div>

                    {/* Keycaps */}
                    <div className="relative">
                      <input
                        type="text"
                        name="keycaps"
                        value={formData.keycaps}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('keycaps')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('keycaps')}
                        placeholder="e.g., GMK Botanical, ePBT Kuro Shiro"
                      />
                      <label className={labelClasses('keycaps')}>
                        Preferred Keycaps (optional)
                      </label>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Submit Button */}
              <ScrollReveal delay={0.3}>
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 cursor-target overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
                        : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </span>
                  </button>
                </div>
              </ScrollReveal>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Note */}
        <ScrollReveal delay={0.4}>
          <div className="mt-16 text-center">
            <p
              className={`text-sm ${
                isDark ? 'text-[#a7a495]/50' : 'text-[#1c1c1c]/50'
              }`}
            >
              All commission requests are reviewed personally. Response time is typically 24-48 hours.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
