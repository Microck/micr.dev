import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollReveal } from './ScrollReveal';
import { Check, Loader2 } from 'lucide-react';

type CommissionFormData = {
  emailAddress: string;
  fullName: string;
  shippingAddress: string;
  paypalEmail: string;
  communicationMethod: '' | 'Instagram' | 'Email' | 'Other';
  contactHandle: string;
  boardDescription: string;
  buildType: '' | 'Hotswap' | 'Solder';
  keyboardSize: '' | 'Below 60%' | '60–65%' | '75%–TKL' | '1800 or Full Size';
  layoutDetails: string[];
  switchCount: string;
  switchMods: '' | 'Yes' | 'No';
  includeKeycaps: '' | 'Yes' | 'No';
  inpostTracking: string;
  termsAccepted: boolean;
  additionalComments: string;
};

const TERMS_ACCEPTANCE_VALUE =
  'I have read and agree to all Terms and Conditions stated above. I understand they are binding, and it is my responsibility to read them fully before submitting.';

const layoutDetailOptions = [
  'WK',
  'WKL',
  'Split Spacebar',
  'Split Shift (leave comment as to which one)',
  'Split Backspace',
  'Stepped Caps Lock',
  'Regular Caps Lock',
  'Full Backspace',
  'Other',
] as const;

const initialFormData: CommissionFormData = {
  emailAddress: '',
  fullName: '',
  shippingAddress: '',
  paypalEmail: '',
  communicationMethod: '',
  contactHandle: '',
  boardDescription: '',
  buildType: '',
  keyboardSize: '',
  layoutDetails: [],
  switchCount: '',
  switchMods: '',
  includeKeycaps: '',
  inpostTracking: '',
  termsAccepted: false,
  additionalComments: '',
};

export function Commissions() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CommissionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<
    | Exclude<keyof CommissionFormData, 'layoutDetails' | 'termsAccepted'>
    | null
  >(null);
  const [layoutDetailsError, setLayoutDetailsError] = useState(false);

  const stringFieldNames = [
    'emailAddress',
    'fullName',
    'shippingAddress',
    'paypalEmail',
    'communicationMethod',
    'contactHandle',
    'boardDescription',
    'buildType',
    'keyboardSize',
    'switchCount',
    'switchMods',
    'includeKeycaps',
    'inpostTracking',
    'additionalComments',
  ] as const;

  type StringFieldName = (typeof stringFieldNames)[number];

  const isStringFieldName = (name: string): name is StringFieldName =>
    (stringFieldNames as readonly string[]).includes(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (!isStringFieldName(name)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLayoutDetailToggle = (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setFormData((prev) => {
      const next = checked
        ? Array.from(new Set([...prev.layoutDetails, option]))
        : prev.layoutDetails.filter((value) => value !== option);

      return {
        ...prev,
        layoutDetails: next,
      };
    });

    if (layoutDetailsError) {
      setLayoutDetailsError(false);
    }
  };

  const handleTermsAcceptedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      termsAccepted: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.layoutDetails.length === 0) {
      setLayoutDetailsError(true);
      return;
    }

    setIsSubmitting(true);

    // Google Forms submission
    // Form ID: 1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw
    const formId = '1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw';
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // Create form data for Google Forms
    const googleFormData = new FormData();
    googleFormData.append('emailAddress', formData.emailAddress);
    googleFormData.append('entry.632203679', formData.fullName);
    googleFormData.append('entry.953846509', formData.shippingAddress);
    googleFormData.append('entry.1677500050', formData.paypalEmail);
    googleFormData.append('entry.673371819', formData.communicationMethod);
    googleFormData.append('entry.870558618', formData.contactHandle);
    googleFormData.append('entry.918252436', formData.boardDescription);
    googleFormData.append('entry.103391198', formData.buildType);
    googleFormData.append('entry.664147544', formData.keyboardSize);

    for (const detail of formData.layoutDetails) {
      googleFormData.append('entry.262032242', detail);
    }

    googleFormData.append('entry.1338355639', formData.switchCount);
    googleFormData.append('entry.483733296', formData.switchMods);
    googleFormData.append('entry.1872997171', formData.includeKeycaps);
    googleFormData.append('entry.223961881', formData.inpostTracking);

    if (formData.termsAccepted) {
      googleFormData.append('entry.30082598', TERMS_ACCEPTANCE_VALUE);
    }

    googleFormData.append('entry.1582632785', formData.additionalComments);

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

  const inputClasses = (fieldName: StringFieldName) =>
    `w-full px-0 pt-6 pb-2 bg-transparent border-0 border-b-2 outline-none transition-all duration-300 font-sans text-lg ${
      isDark
        ? focusedField === fieldName || formData[fieldName]
          ? 'border-[#a7a495] text-[#a7a495]'
          : 'border-[#a7a495]/30 text-[#a7a495]'
        : focusedField === fieldName || formData[fieldName]
          ? 'border-[#1c1c1c] text-[#1c1c1c]'
          : 'border-[#1c1c1c]/30 text-[#1c1c1c]'
    } placeholder:text-transparent focus:placeholder:text-opacity-50 ${
      isDark ? 'focus:placeholder:text-[#a7a495]/50' : 'focus:placeholder:text-[#1c1c1c]/50'
    }`;

  const labelClasses = (fieldName: StringFieldName) =>
    `absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
      focusedField === fieldName || formData[fieldName]
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
                    Contact
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('emailAddress')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('emailAddress')}
                        placeholder="you@example.com"
                        required
                      />
                      <label className={labelClasses('emailAddress')}>Email *</label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('fullName')}
                        placeholder="Full name"
                        required
                      />
                      <label className={labelClasses('fullName')}>Full Name *</label>
                    </div>

                    <div className="relative">
                      <select
                        name="communicationMethod"
                        value={formData.communicationMethod}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('communicationMethod')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('communicationMethod')} appearance-none cursor-pointer`}
                        required
                      >
                        <option value="">Select one</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                      </select>
                      <label className={labelClasses('communicationMethod')}>
                        Preferred Method of Communication *
                      </label>
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

                    <div className="relative">
                      <input
                        type="text"
                        name="contactHandle"
                        value={formData.contactHandle}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('contactHandle')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('contactHandle')}
                        placeholder="username / email"
                        required
                      />
                      <label className={labelClasses('contactHandle')}>
                        Username / Email (so I can contact you) *
                      </label>
                    </div>

                    <div className="relative md:col-span-2">
                      <input
                        type="email"
                        name="paypalEmail"
                        value={formData.paypalEmail}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('paypalEmail')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('paypalEmail')}
                        placeholder="paypal@example.com"
                        required
                      />
                      <label className={labelClasses('paypalEmail')}>
                        PayPal Email (for invoice) *
                      </label>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

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
                    Shipping
                  </h2>

                  <div className="space-y-8">
                    <div className="relative">
                      <textarea
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('shippingAddress')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('shippingAddress')} min-h-[140px] resize-none`}
                        placeholder="Country, City, Postal Code"
                        rows={4}
                        required
                      />
                      <label className={labelClasses('shippingAddress')}>
                        Full Shipping Address (Country, City, Postal Code) *
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="inpostTracking"
                        value={formData.inpostTracking}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('inpostTracking')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('inpostTracking')}
                        placeholder="Tracking number"
                      />
                      <label className={labelClasses('inpostTracking')}>
                        InPost tracking number (shipment to microkeebs)
                      </label>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
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

                  <div className="space-y-10">
                    <div className="relative">
                      <textarea
                        name="boardDescription"
                        value={formData.boardDescription}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('boardDescription')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('boardDescription')} min-h-[160px] resize-none`}
                        placeholder="Board name, designer, color, notes"
                        rows={5}
                        required
                      />
                      <label className={labelClasses('boardDescription')}>
                        Please describe the board! (Name, designer, color, etc.) *
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <select
                          name="buildType"
                          value={formData.buildType}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('buildType')}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClasses('buildType')} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="">Select one</option>
                          <option value="Hotswap">Hotswap</option>
                          <option value="Solder">Solder</option>
                        </select>
                        <label className={labelClasses('buildType')}>
                          Is this board hotswap or solder? *
                        </label>
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

                      <div className="relative">
                        <select
                          name="keyboardSize"
                          value={formData.keyboardSize}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('keyboardSize')}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClasses('keyboardSize')} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="">Select one</option>
                          <option value="Below 60%">Below 60%</option>
                          <option value="60–65%">60–65%</option>
                          <option value="75%–TKL">75%–TKL</option>
                          <option value="1800 or Full Size">1800 or Full Size</option>
                        </select>
                        <label className={labelClasses('keyboardSize')}>Size of keyboard *</label>
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

                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          name="switchCount"
                          value={formData.switchCount}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('switchCount')}
                          onBlur={() => setFocusedField(null)}
                          className={inputClasses('switchCount')}
                          placeholder="e.g., 70"
                          min={1}
                          required
                        />
                        <label className={labelClasses('switchCount')}>
                          How many switches are you sending? (number) *
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="switchMods"
                          value={formData.switchMods}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('switchMods')}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClasses('switchMods')} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="">Select one</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label className={labelClasses('switchMods')}>
                          Switch modification services? *
                        </label>
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

                      <div className="relative">
                        <select
                          name="includeKeycaps"
                          value={formData.includeKeycaps}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('includeKeycaps')}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClasses('includeKeycaps')} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="">Select one</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label className={labelClasses('includeKeycaps')}>
                          Will you be sending keycaps with your board? *
                        </label>
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
                    </div>

                    <div>
                      <div className="flex items-end justify-between gap-6 mb-4">
                        <h3
                          className={`text-lg font-semibold ${
                            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                          }`}
                        >
                          Layout Details (Select all that apply) *
                        </h3>
                        {layoutDetailsError ? (
                          <p
                            className={`text-sm ${
                              isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
                            }`}
                          >
                            select at least one
                          </p>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {layoutDetailOptions.map((option) => {
                          const checked = formData.layoutDetails.includes(option);

                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors cursor-pointer group ${
                                isDark
                                  ? 'border-[#a7a495]/20 hover:border-[#a7a495]/40'
                                  : 'border-[#1c1c1c]/20 hover:border-[#1c1c1c]/40'
                              } ${
                                checked
                                  ? isDark
                                    ? 'bg-[#a7a495]/10'
                                    : 'bg-[#1c1c1c]/5'
                                  : ''
                              }`}
                            >
                              <div className="relative flex-shrink-0">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={handleLayoutDetailToggle(option)}
                                  className="peer sr-only"
                                />
                                <div
                                  className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                                    isDark
                                      ? 'border-[#a7a495]/50 group-hover:border-[#a7a495]'
                                      : 'border-[#1c1c1c]/50 group-hover:border-[#1c1c1c]'
                                  } peer-checked:bg-current peer-checked:border-current ${
                                    isDark ? 'peer-checked:text-[#a7a495]' : 'peer-checked:text-[#1c1c1c]'
                                  }`}
                                >
                                  <svg
                                    className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                                      checked ? 'opacity-100' : 'opacity-0'
                                    } ${isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <span
                                className={`text-sm sm:text-base ${
                                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                                }`}
                              >
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.35}>
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
                    Terms and Conditions
                  </h2>

                  <div
                    className={`space-y-6 max-h-96 overflow-y-auto pr-4 mb-8 ${
                      isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
                    }`}
                  >
                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>
                        You must provide all components; including switches and stabilizers (and any required hardware).
                        Ensuring part compatibility is the commissioner's responsibility. If possible, please include a
                        few extra switches just in case.
                      </p>

                      <p>
                        If you need me to lube and/or film your switches, I charge an extra fee of €0.55 per switch. I do
                        not desolder switches under any circumstance. You must include the films if selected.
                      </p>

                      <p>Stabilizer tuning is included only if stabilizers are provided by the commissioner.</p>

                      <p>
                        You must pay for shipping both ways. All shipments will be done through InPost by default. I will
                        send you an invoice for the return shipping and all services once the build is complete. Payment
                        must be received before the board is sent back.
                      </p>

                      <p>
                        I am not responsible for any packages that are lost in transit, delayed, damaged, or any other
                        shipping issues (in either direction).
                      </p>

                      <p>I am not liable for any damage or issues during shipping.</p>

                      <p>
                        I do not offer mill-max, through-hole, or per-key LED soldering services. Hotswap builds are
                        accepted. Solder builds are accepted at an additional fee of €0.55 per switch.
                      </p>

                      <p>Your completed build may be photographed or used in content. There is no option to opt out.</p>

                      <p>PayPal processing fees will be added (Goods & Services invoice).</p>

                      <p>
                        The invoice must be paid within 7 days of being sent. If payment is not received, the commission
                        may be paused or cancelled.
                      </p>

                      <p>
                        If the invoice remains unpaid and you are unresponsive for 30 days after invoicing, the items
                        will be considered abandoned and will become the property of microkeebs.
                      </p>

                      <p>
                        No guarantees or warranties are expressed or implied (including sound/feel). Manufacturer
                        defects or component failures are not my responsibility.
                      </p>

                      <p>Minor cosmetic marks/wear can occur during normal assembly.</p>

                      <p>Any customs fees, VAT, taxes, or import charges are the commissioner's responsibility.</p>

                      <p>
                        You must provide an InPost tracking number when shipping to me. I may photo/video items on
                        arrival to document condition.
                      </p>

                      <p>
                        I reserve the right to refuse or stop a commission at any time (missing/unsafe/incompatible
                        parts).
                      </p>

                      <p>
                        The board must be shipped to me unbuilt (not assembled). If the board arrives built/assembled,
                        an additional €20 fee will be added.
                      </p>

                      <p>No refunds once work has begun.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
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
                    Final
                  </h2>

                  <div className="space-y-8">
                    <div className="relative">
                      <textarea
                        name="additionalComments"
                        value={formData.additionalComments}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('additionalComments')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('additionalComments')} min-h-[140px] resize-none`}
                        placeholder="Any additional comments or concerns"
                        rows={4}
                      />
                      <label className={labelClasses('additionalComments')}>
                        Any additional comments or concerns?
                      </label>
                    </div>

                    <div
                      className={`rounded-2xl p-6 border ${
                        isDark ? 'border-[#a7a495]/20' : 'border-[#1c1c1c]/20'
                      }`}
                    >
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData.termsAccepted}
                            onChange={handleTermsAcceptedChange}
                            required
                            className="peer sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                              isDark
                                ? 'border-[#a7a495]/50 group-hover:border-[#a7a495]'
                                : 'border-[#1c1c1c]/50 group-hover:border-[#1c1c1c]'
                            } peer-checked:bg-current peer-checked:border-current ${
                              isDark ? 'peer-checked:text-[#a7a495]' : 'peer-checked:text-[#1c1c1c]'
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                                formData.termsAccepted ? 'opacity-100' : 'opacity-0'
                              } ${isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span
                          className={`text-sm leading-relaxed ${
                            isDark ? 'text-[#a7a495]/90' : 'text-[#1c1c1c]/90'
                          }`}
                        >
                          {TERMS_ACCEPTANCE_VALUE}
                        </span>
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
