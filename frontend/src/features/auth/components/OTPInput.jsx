import { useState, useRef, useEffect } from 'react';
import { useOTPState } from '../hooks/useAuth';

const OTPInput = ({ value, onChange, onComplete, disabled = false }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);
  const { resetOTPState } = useOTPState();

  // 6-digit OTP input
  const digits = Array(6).fill('');

  const handleInputChange = (index, digit) => {
    // Only allow numbers
    const numValue = digit.replace(/\D/g, '');
    
    if (numValue.length > 1) {
      // Handle paste event
      const pastedDigits = numValue.split('').slice(0, 6);
      const newOTP = [...value.split('')];
      
      pastedDigits.forEach((d, i) => {
        if (index + i < 6) {
          newOTP[index + i] = d;
        }
      });
      
      const finalOTP = newOTP.join('').slice(0, 6);
      onChange(finalOTP);
      
      // Move focus to the next empty input or last filled
      const nextEmptyIndex = newOTP.findIndex(d => !d);
      if (nextEmptyIndex !== -1) {
        setFocusedIndex(nextEmptyIndex);
      } else {
        setFocusedIndex(5);
        if (finalOTP.length === 6) {
          onComplete(finalOTP);
        }
      }
    } else {
      // Handle single digit input
      const newOTP = value.split('');
      newOTP[index] = numValue;
      const finalOTP = newOTP.join('');
      
      onChange(finalOTP);
      
      // Move to next input if current is filled
      if (numValue && index < 5) {
        setFocusedIndex(index + 1);
      }
      
      // Complete if all digits are filled
      if (finalOTP.length === 6) {
        onComplete(finalOTP);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOTP = value.split('');
      
      if (value[index]) {
        // Clear current digit
        newOTP[index] = '';
      } else if (index > 0) {
        // Move to previous and clear
        newOTP[index - 1] = '';
        setFocusedIndex(index - 1);
      }
      
      onChange(newOTP.join(''));
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      setFocusedIndex(index + 1);
    }
    
    // Handle escape to reset
    if (e.key === 'Escape') {
      resetOTPState();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handleInputChange(focusedIndex, pastedData);
  };

  // Focus management
  useEffect(() => {
    if (inputRefs.current[focusedIndex] && !disabled) {
      inputRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex, disabled]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled && !value) {
      inputRefs.current[0].focus();
    }
  }, []);

  const getDigitValue = (index) => {
    return value[index] || '';
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3">
      {digits.map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={getDigitValue(index)}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 text-center
              text-xl sm:text-2xl font-bold
              bg-white/[0.05] border-2 
              rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${focusedIndex === index && !disabled
                ? 'border-brand-offwhite/50 bg-white/[0.08] ring-2 ring-brand-offwhite/20'
                : 'border-brand-offwhite/20 hover:border-brand-offwhite/30'
              }
              ${getDigitValue(index) && !disabled
                ? 'text-brand-offwhite border-brand-offwhite/40'
                : 'text-brand-offwhite/60'
              }
            `}
            placeholder="0"
          />
          {/* Animated underline for focused input */}
          {focusedIndex === index && !disabled && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-offwhite rounded-full animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
