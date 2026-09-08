import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface OtpScreenProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBackToLogin: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  phoneNumber,
  onVerifySuccess,
  onBackToLogin,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillDemo = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Simulate Firebase OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 700);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(45);
      setError(null);
    }
  };

  return (
    <div
      id="screen-otp"
      className="min-h-[640px] h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#FAF8F9] via-white to-[#FDF7F8]"
    >
      <div>
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4">
          <button
            onClick={onBackToLogin}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#4A154B]" />
          </button>
          <span className="text-xs font-semibold tracking-wider text-[#B76E79] uppercase">
            Firebase Auth
          </span>
          <div className="w-5" />
        </div>

        {/* Title & Info */}
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-serif font-bold text-[#2D0C34]">
            Verify OTP Code
          </h2>
          <p className="text-xs text-gray-500">
            We have dispatched a 6-digit Firebase verification SMS to:
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#4A154B] bg-[#F3EAF4] px-2.5 py-1 rounded-md">
              {phoneNumber || '+91 98765 43210'}
            </span>
            <button
              onClick={onBackToLogin}
              className="text-xs text-[#B76E79] font-medium underline"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Auto-fill demo helper badge */}
        <div className="mt-4 flex items-center justify-between p-2.5 rounded-lg bg-[#FAF0F3] border border-[#E8B4B8]/40">
          <div className="flex items-center space-x-1.5 text-xs text-[#4A154B]">
            <Sparkles className="w-4 h-4 text-[#B76E79]" />
            <span>Demo Test Code: <strong>123456</strong></span>
          </div>
          <button
            onClick={handleAutoFillDemo}
            className="text-xs font-bold text-[#B76E79] hover:underline"
          >
            Quick Fill
          </button>
        </div>

        {/* 6-Digit OTP Input Boxes */}
        <div className="mt-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 text-center text-lg font-bold text-[#2D0C34] bg-white rounded-xl border border-[#E8D5C4] focus:border-[#4A154B] focus:ring-2 focus:ring-[#B76E79]/40 outline-none shadow-xs transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="mt-3 flex items-center space-x-1.5 text-red-500 text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Resend Timer */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-xs text-gray-500">
              Resend SMS in <span className="font-semibold text-[#4A154B]">00:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#B76E79] hover:text-[#4A154B]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend OTP Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Verify Button */}
      <div className="pt-6">
        <button
          id="btn-verify-otp"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(74,21,75,0.25)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
        >
          {isVerifying ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Enter Boutique</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
