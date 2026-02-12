import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollReveal } from './ScrollReveal';
import { Check, Loader2, X, ChevronRight, ChevronLeft } from 'lucide-react';

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
  fRow: '' | 'F12' | 'F13';
  backspace: '' | 'Standard' | 'Split';
  enter: '' | 'ANSI' | 'ISO';
  splitRightShift: boolean;
  splitLeftShift: boolean;
  bottomRow: '' | '7U' | '6.25U';
  winKey: '' | 'WK' | 'WKL';
  switchCount: string;
  switchMods: '' | 'Yes' | 'No';
  includeKeycaps: '' | 'Yes' | 'No';
  inpostTracking: string;
  termsAccepted: boolean;
  additionalComments: string;
};

const TERMS_ACCEPTANCE_VALUE =
  'I have read and agree to all Terms and Conditions stated above. I understand they are binding, and it is my responsibility to read them fully before submitting.';

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
  fRow: '',
  backspace: '',
  enter: '',
  splitRightShift: false,
  splitLeftShift: false,
  bottomRow: '',
  winKey: '',
  switchCount: '',
  switchMods: '',
  includeKeycaps: '',
  inpostTracking: '',
  termsAccepted: false,
  additionalComments: '',
};

const steps = [
  { id: 1, name: 'Contact' },
  { id: 2, name: 'Shipping' },
  { id: 3, name: 'Build' },
  { id: 4, name: 'Final' },
];

export function Commissions() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CommissionFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<
    | Exclude<keyof CommissionFormData, 'splitRightShift' | 'splitLeftShift' | 'termsAccepted'>
    | null
  >(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

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
    'fRow',
    'backspace',
    'enter',
    'bottomRow',
    'winKey',
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
    if (!isStringFieldName(name)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (stepError) setStepError(null);
  };

  const handleCheckboxChange = (name: 'splitRightShift' | 'splitLeftShift') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (stepError) setStepError(null);
  };

  const handleTermsAcceptedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
    if (stepError) setStepError(null);
  };

  const needsFRow = formData.keyboardSize === '75%–TKL' || formData.keyboardSize === '1800 or Full Size';

  const validateStep = (step: number): boolean => {
    setStepError(null);
    switch (step) {
      case 1:
        if (!formData.emailAddress || !formData.fullName || !formData.communicationMethod || !formData.contactHandle || !formData.paypalEmail) {
          setStepError('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!formData.shippingAddress) {
          setStepError('Please provide your shipping address');
          return false;
        }
        return true;
      case 3:
        if (!formData.boardDescription || !formData.buildType || !formData.keyboardSize || !formData.switchCount || !formData.switchMods || !formData.includeKeycaps) {
          setStepError('Please fill in all required fields');
          return false;
        }
        if (!formData.backspace || !formData.enter || !formData.bottomRow || !formData.winKey) {
          setStepError('Please select all layout options');
          return false;
        }
        if (needsFRow && !formData.fRow) {
          setStepError('Please select F-Row option');
          return false;
        }
        return true;
      case 4:
        if (!formData.termsAccepted) {
          setStepError('You must accept the Terms and Conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);

    const formId = '1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw';
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

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
    
    // Layout Details - All values submitted to entry.262032242 (checkbox group)
    if (formData.fRow === 'F12') googleFormData.append('entry.262032242', 'F-Row: F12');
    if (formData.fRow === 'F13') googleFormData.append('entry.262032242', 'F-Row: F13');
    if (formData.backspace === 'Standard') googleFormData.append('entry.262032242', 'Backspace: Standard');
    if (formData.backspace === 'Split') googleFormData.append('entry.262032242', 'Backspace: Split');
    if (formData.enter === 'ANSI') googleFormData.append('entry.262032242', 'Enter: ANSI');
    if (formData.enter === 'ISO') googleFormData.append('entry.262032242', 'Enter: ISO');
    if (formData.splitRightShift) googleFormData.append('entry.262032242', 'Split Right Shift');
    if (formData.splitLeftShift) googleFormData.append('entry.262032242', 'Split Left Shift');
    if (formData.bottomRow === '7U') googleFormData.append('entry.262032242', 'Bottom Row: 7U Spacebar');
    if (formData.bottomRow === '6.25U') googleFormData.append('entry.262032242', 'Bottom Row: 6.25U Spacebar');
    if (formData.winKey === 'WK') googleFormData.append('entry.262032242', 'Win Key: WK (Windows Key)');
    if (formData.winKey === 'WKL') googleFormData.append('entry.262032242', 'Win Key: WKL (Windows Key-less)');
    
    googleFormData.append('entry.1338355639', formData.switchCount);
    googleFormData.append('entry.483733296', formData.switchMods);
    googleFormData.append('entry.1872997171', formData.includeKeycaps);
    googleFormData.append('entry.223961881', formData.inpostTracking);
    if (formData.termsAccepted) {
      googleFormData.append('entry.30082598', TERMS_ACCEPTANCE_VALUE);
    }
    googleFormData.append('entry.1582632785', formData.additionalComments);

    try {
      await fetch(formUrl, { method: 'POST', mode: 'no-cors', body: googleFormData });
      setIsSubmitted(true);
      setFormData(initialFormData);
      setCurrentStep(1);
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

  const labelClasses = (fieldName: StringFieldName, isSelect = false) =>
    `absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
      focusedField === fieldName || formData[fieldName] || isSelect
        ? isDark
          ? 'text-[#a7a495] text-xs -top-5'
          : 'text-[#1c1c1c] text-xs -top-5'
        : isDark
          ? 'text-[#a7a495]/60 text-lg top-3'
          : 'text-[#1c1c1c]/60 text-lg top-3'
    }`;

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                step.id === currentStep
                  ? isDark
                    ? 'bg-[#a7a495] text-[#1c1c1c]'
                    : 'bg-[#1c1c1c] text-[#a7a495]'
                  : step.id < currentStep
                    ? isDark
                      ? 'bg-[#a7a495]/50 text-[#1c1c1c]'
                      : 'bg-[#1c1c1c]/50 text-[#a7a495]'
                    : isDark
                      ? 'bg-[#2a2a2a] text-[#a7a495]/50 border border-[#a7a495]/30'
                      : 'bg-[#b5b3a7] text-[#1c1c1c]/50 border border-[#1c1c1c]/30'
              }`}
            >
              {step.id < currentStep ? <Check size={18} /> : step.id}
            </div>
            <span
              className={`hidden sm:block ml-2 text-sm font-medium transition-colors duration-300 ${
                step.id === currentStep
                  ? isDark
                    ? 'text-[#a7a495]'
                    : 'text-[#1c1c1c]'
                  : isDark
                    ? 'text-[#a7a495]/50'
                    : 'text-[#1c1c1c]/50'
              }`}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-3 transition-colors duration-300 ${
                  step.id < currentStep
                    ? isDark
                      ? 'bg-[#a7a495]/50'
                      : 'bg-[#1c1c1c]/50'
                    : isDark
                      ? 'bg-[#a7a495]/20'
                      : 'bg-[#1c1c1c]/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl p-8 sm:p-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'}`}
    >
      <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
        Contact Information
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
          <label className={labelClasses('communicationMethod', true)}>Preferred Method of Communication *</label>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          <label className={labelClasses('contactHandle')}>Username / Email (for your records) *</label>
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
          <label className={labelClasses('paypalEmail')}>PayPal Email (for invoice) *</label>
        </div>
      </div>
    </motion.div>
  );

  const renderShippingStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl p-8 sm:p-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'}`}
    >
      <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
        Shipping Information
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
          <label className={labelClasses('shippingAddress')}>Full Shipping Address (Country, City, Postal Code) *</label>
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
          <label className={labelClasses('inpostTracking')}>InPost tracking number (shipment to microkeebs)</label>
        </div>
      </div>
    </motion.div>
  );

  const renderBuildStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl p-8 sm:p-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'}`}
    >
      <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
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
          <label className={labelClasses('boardDescription')}>Please describe the board! (Name, designer, color, etc.) *</label>
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
            <label className={labelClasses('buildType', true)}>Is this board hotswap or solder? *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <label className={labelClasses('keyboardSize', true)}>Size of keyboard *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* F-Row - Only show for larger keyboards */}
          {needsFRow && (
            <div className="relative">
              <select
                name="fRow"
                value={formData.fRow}
                onChange={handleChange}
                onFocus={() => setFocusedField('fRow')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses('fRow')} appearance-none cursor-pointer`}
                required
              >
                <option value="">Select one</option>
                <option value="F12">F12</option>
                <option value="F13">F13</option>
              </select>
              <label className={labelClasses('fRow', true)}>F-Row *</label>
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          <div className="relative">
            <select
              name="backspace"
              value={formData.backspace}
              onChange={handleChange}
              onFocus={() => setFocusedField('backspace')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClasses('backspace')} appearance-none cursor-pointer`}
              required
            >
              <option value="">Select one</option>
              <option value="Standard">Standard</option>
              <option value="Split">Split</option>
            </select>
            <label className={labelClasses('backspace', true)}>Backspace *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="enter"
              value={formData.enter}
              onChange={handleChange}
              onFocus={() => setFocusedField('enter')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClasses('enter')} appearance-none cursor-pointer`}
              required
            >
              <option value="">Select one</option>
              <option value="ANSI">ANSI</option>
              <option value="ISO">ISO</option>
            </select>
            <label className={labelClasses('enter', true)}>Enter *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="bottomRow"
              value={formData.bottomRow}
              onChange={handleChange}
              onFocus={() => setFocusedField('bottomRow')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClasses('bottomRow')} appearance-none cursor-pointer`}
              required
            >
              <option value="">Select one</option>
              <option value="7U">7U</option>
              <option value="6.25U">6.25U</option>
            </select>
            <label className={labelClasses('bottomRow', true)}>Bottom Row *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="winKey"
              value={formData.winKey}
              onChange={handleChange}
              onFocus={() => setFocusedField('winKey')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClasses('winKey')} appearance-none cursor-pointer`}
              required
            >
              <option value="">Select one</option>
              <option value="WK">WK (Windows Key)</option>
              <option value="WKL">WKL (Windows Key-less)</option>
            </select>
            <label className={labelClasses('winKey', true)}>Win Key *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <label className={labelClasses('switchCount')}>How many switches are you sending? *</label>
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
            <label className={labelClasses('switchMods', true)}>Switch modification services? (+€0.55/switch) *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <label className={labelClasses('includeKeycaps', true)}>Will you be sending keycaps with your board? *</label>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Split Shifts Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors cursor-pointer group ${
            isDark
              ? 'border-[#a7a495]/20 hover:border-[#a7a495]/40'
              : 'border-[#1c1c1c]/20 hover:border-[#1c1c1c]/40'
          } ${
            formData.splitRightShift
              ? isDark
                ? 'bg-[#a7a495]/10'
                : 'bg-[#1c1c1c]/5'
              : ''
          }`}>
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={formData.splitRightShift}
                onChange={handleCheckboxChange('splitRightShift')}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                isDark
                  ? 'border-[#a7a495]/50 group-hover:border-[#a7a495]'
                  : 'border-[#1c1c1c]/50 group-hover:border-[#1c1c1c]'
              } peer-checked:bg-current peer-checked:border-current ${
                isDark ? 'peer-checked:text-[#a7a495]' : 'peer-checked:text-[#1c1c1c]'
              }`}>
                <svg className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                  formData.splitRightShift ? 'opacity-100' : 'opacity-0'
                } ${isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className={`text-sm sm:text-base ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Split Right Shift</span>
          </label>

          <label className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors cursor-pointer group ${
            isDark
              ? 'border-[#a7a495]/20 hover:border-[#a7a495]/40'
              : 'border-[#1c1c1c]/20 hover:border-[#1c1c1c]/40'
          } ${
            formData.splitLeftShift
              ? isDark
                ? 'bg-[#a7a495]/10'
                : 'bg-[#1c1c1c]/5'
              : ''
          }`}>
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={formData.splitLeftShift}
                onChange={handleCheckboxChange('splitLeftShift')}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                isDark
                  ? 'border-[#a7a495]/50 group-hover:border-[#a7a495]'
                  : 'border-[#1c1c1c]/50 group-hover:border-[#1c1c1c]'
              } peer-checked:bg-current peer-checked:border-current ${
                isDark ? 'peer-checked:text-[#a7a495]' : 'peer-checked:text-[#1c1c1c]'
              }`}>
                <svg className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                  formData.splitLeftShift ? 'opacity-100' : 'opacity-0'
                } ${isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className={`text-sm sm:text-base ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Split Left Shift</span>
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderFinalStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl p-8 sm:p-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'}`}
    >
      <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
        Final Details
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
          <label className={labelClasses('additionalComments')}>Any additional comments or concerns?</label>
        </div>
        <div className={`rounded-2xl p-6 border ${isDark ? 'border-[#a7a495]/20' : 'border-[#1c1c1c]/20'}`}>
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleTermsAcceptedChange}
                required
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                isDark
                  ? 'border-[#a7a495]/50 group-hover:border-[#a7a495]'
                  : 'border-[#1c1c1c]/50 group-hover:border-[#1c1c1c]'
              } peer-checked:bg-current peer-checked:border-current ${
                isDark ? 'peer-checked:text-[#a7a495]' : 'peer-checked:text-[#1c1c1c]'
              }`}>
                <svg className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                  formData.termsAccepted ? 'opacity-100' : 'opacity-0'
                } ${isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className={`text-sm leading-relaxed ${isDark ? 'text-[#a7a495]/90' : 'text-[#1c1c1c]/90'}`}>
              I have read and agree to all{' '}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className={`underline hover:no-underline font-medium ${
                  isDark
                    ? 'text-[#a7a495] hover:text-[#c7c4b3]'
                    : 'text-[#1c1c1c] hover:text-[#2a2a2a]'
                }`}
              >
                Terms and Conditions
              </button>{' '}
              stated above. I understand they are binding, and it is my responsibility to read them fully before submitting.
            </span>
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderContactStep();
      case 2:
        return renderShippingStep();
      case 3:
        return renderBuildStep();
      case 4:
        return renderFinalStep();
      default:
        return renderContactStep();
    }
  };

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <ScrollReveal>
          <header className="mb-16 sm:mb-24">
            <h1 className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.85] tracking-tight mb-6 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}>
              Commissions
            </h1>
            <p className={`max-w-xl text-lg sm:text-xl leading-relaxed ${
              isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
            }`}>
              Want a custom keyboard build? Fill out the form below, then reach out on your preferred platform and we'll get things rolling.
            </p>
          </header>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-3xl p-8 sm:p-12 text-center ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDark ? 'bg-[#a7a495]/20 text-[#a7a495]' : 'bg-[#1c1c1c]/10 text-[#1c1c1c]'
              }`}>
                <Check size={32} />
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
                Request Received!
              </h2>
              <p className={`text-lg mb-8 ${isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'}`}>
                Request submitted. Please reach out via your selected contact method to confirm and discuss next steps.
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
              className="space-y-8"
            >
              {renderStepIndicator()}

              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>

              {stepError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}
                >
                  {stepError}
                </motion.p>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-target disabled:opacity-0 disabled:pointer-events-none ${
                    isDark
                      ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#3a3a3a]'
                      : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#c5c3b7]'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 cursor-target ${
                      isDark
                        ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
                        : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-3 px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 cursor-target disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
                        : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <ScrollReveal delay={0.4}>
          <div className="mt-16 text-center">
            <p className={`text-sm ${isDark ? 'text-[#a7a495]/50' : 'text-[#1c1c1c]/50'}`}>
              All commission requests are reviewed personally. Response time is typically 24-48 hours.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {isTermsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 p-4 sm:p-6"
            onClick={() => setIsTermsModalOpen(false)}
          >
            <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-black/60'}`} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl ${
                isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
              }`}
            >
              <div className={`sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b ${
                isDark
                  ? 'bg-[#2a2a2a] border-[#a7a495]/20'
                  : 'bg-[#b5b3a7] border-[#1c1c1c]/20'
              }`}>
                <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
                  Terms and Conditions
                </h2>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? 'hover:bg-[#a7a495]/20 text-[#a7a495]'
                      : 'hover:bg-[#1c1c1c]/10 text-[#1c1c1c]'
                  }`}
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className={`overflow-y-auto max-h-[60vh] sm:max-h-[65vh] p-6 sm:p-8 ${
                isDark ? 'text-[#a7a495]/90' : 'text-[#1c1c1c]/90'
              }`}>
                <ol className="list-decimal list-inside space-y-4">
                  <li className="text-sm leading-relaxed pl-2">
                    You must provide all components; including switches and stabilizers (and any
                    required hardware). Ensuring part compatibility is the commissioner's
                    responsibility. If possible, please include a few extra switches just in case.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    If you need me to lube and/or film your switches, I charge an extra fee of €0.55
                    per switch. I do not desolder switches under any circumstance. You must include
                    the films if selected.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    Stabilizer tuning is included only if stabilizers are provided by the
                    commissioner.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    You must pay for shipping both ways. All shipments will be done through InPost by
                    default. I will send you an invoice for the return shipping and all services once
                    the build is complete. Payment must be received before the board is sent back.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    I am not responsible for any packages that are lost in transit, delayed, damaged,
                    or any other shipping issues (in either direction).
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    I am not liable for any damage or issues during shipping.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    I do not offer mill-max, through-hole, or per-key LED soldering services. Hotswap
                    builds are accepted. Solder builds are accepted at an additional fee of €0.55 per
                    switch.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    Your completed build may be photographed or used in content. There is no option to
                    opt out.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    PayPal processing fees will be added (Goods & Services invoice).
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    The invoice must be paid within 7 days of being sent. If payment is not received,
                    the commission may be paused or cancelled.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    If the invoice remains unpaid and you are unresponsive for 30 days after invoicing,
                    the items will be considered abandoned and will become the property of microkeebs.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    No guarantees or warranties are expressed or implied (including sound/feel).
                    Manufacturer defects or component failures are not my responsibility.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    Minor cosmetic marks/wear can occur during normal assembly.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    Any customs fees, VAT, taxes, or import charges are the commissioner's
                    responsibility.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    You must provide an InPost tracking number when shipping to me. I may photo/video
                    items on arrival to document condition.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    I reserve the right to refuse or stop a commission at any time
                    (missing/unsafe/incompatible parts).
                  </li>

                  <li className="text-sm leading-relaxed pl-2">
                    The board must be shipped to me unbuilt (not assembled). If the board arrives
                    built/assembled, an additional €20 fee will be added.
                  </li>

                  <li className="text-sm leading-relaxed pl-2">No refunds once work has begun.</li>
                </ol>
              </div>

              <div className={`sticky bottom-0 z-10 px-6 sm:px-8 py-5 border-t ${
                isDark
                  ? 'bg-[#2a2a2a] border-[#a7a495]/20'
                  : 'bg-[#b5b3a7] border-[#1c1c1c]/20'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className={`w-full px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-target ${
                    isDark
                      ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
                      : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
                  }`}
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
