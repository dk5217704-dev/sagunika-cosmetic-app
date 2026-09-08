import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Check
} from 'lucide-react';
import { User } from '../../types';
import { firebaseAuthService } from '../../services/firebaseAuth';

interface LoginScreenProps {
  initialMode?: 'login' | 'signup' | 'forgot' | 'phone';
  onSendOtp: (phone: string) => void;
  onGoogleLogin: () => void;
  onLoginSuccess?: (user: User) => void;
  onContinueAsGuest: () => void;
}

type AuthTab = 'login' | 'signup' | 'phone' | 'forgot';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialMode = 'login',
  onSendOtp,
  onGoogleLogin,
  onLoginSuccess,
  onContinueAsGuest,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('SagunikaLuxe2026!');
  const [confirmPassword, setConfirmPassword] = useState('SagunikaLuxe2026!');
  const [fullName, setFullName] = useState('Ananya Sharma');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [countryCode, setCountryCode] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);

  // 1. Handle Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const user = await firebaseAuthService.signInWithEmail(email, password);
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Invalid email or password. Please try again.');
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 8) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fullPhone = `${countryCode} ${phoneNumber}`;
      const newUser = await firebaseAuthService.signUpWithEmail(
        fullName,
        email,
        fullPhone,
        password
      );
      setIsLoading(false);
      setUnverifiedUser(newUser);
      setSuccessMessage(
        `Account created successfully! A verification email was sent to ${email}.`
      );
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Could not register account. Email may already be in use.');
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await firebaseAuthService.sendPasswordReset(email);
      setIsLoading(false);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Failed to dispatch reset email. Please try again.');
    }
  };

  // 4. Handle Phone OTP Submission
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSendOtp(`${countryCode} ${phoneNumber}`);
    }, 500);
  };

  // 5. Handle Resend Verification Email
  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    setIsLoading(true);
    try {
      const res = await firebaseAuthService.sendVerificationEmail(unverifiedUser);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err?.message || 'Could not resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Simulate Verification Confirmation (User clicks link in email)
  const handleSimulateVerificationSuccess = () => {
    if (!unverifiedUser) return;
    const verified = firebaseAuthService.confirmEmailVerified(unverifiedUser);
    setUnverifiedUser(null);
    setSuccessMessage('Email verified successfully! Welcome to Sagunika Cosmetic.');
    if (onLoginSuccess) {
      onLoginSuccess(verified);
    }
  };

  // 7. Handle Google Login
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const googleUser = await firebaseAuthService.signInWithGoogle();
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(googleUser);
      } else {
        onGoogleLogin();
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Google Sign-In was cancelled or unavailable.');
      onGoogleLogin();
    }
  };

  return (
    <div
      id="screen-login"
      className="min-h-[640px] h-full flex flex-col justify-between p-5 bg-gradient-to-b from-[#FAF8F9] via-white to-[#FDF7F8] overflow-y-auto no-scrollbar"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8ED]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#4A154B] text-white flex items-center justify-center font-serif font-bold text-xs shadow-2xs">
              SC
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-[#4A154B] tracking-wider block">
                SAGUNIKA COSMETIC
              </span>
              <span className="text-[9px] text-[#B76E79] font-medium block">
                Firebase Authentication Suite
              </span>
            </div>
          </div>
          <button
            id="btn-skip-login"
            onClick={onContinueAsGuest}
            className="text-xs font-semibold text-[#8C4A5A] hover:text-[#4A154B] underline underline-offset-4 cursor-pointer"
          >
            Skip for now
          </button>
        </div>

        {/* Welcome Text */}
        <div className="mt-5 space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] border border-[#E8B4B8]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="text-[11px] font-medium text-[#4A154B]">
              {activeTab === 'signup'
                ? 'Begin Your Bridal Journey'
                : activeTab === 'forgot'
                ? 'Account Recovery'
                : 'Welcome Back'}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2D0C34]">
            {activeTab === 'login' && 'Patron Sign In'}
            {activeTab === 'signup' && 'Create Boutique Account'}
            {activeTab === 'phone' && 'Sign In with Phone OTP'}
            {activeTab === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-gray-500">
            {activeTab === 'login' && 'Enter your credentials to access your luxury bridal vanity & orders.'}
            {activeTab === 'signup' && 'Register for bespoke recommendations, reward points & priority delivery.'}
            {activeTab === 'phone' && 'Receive a one-time passcode on your registered mobile number.'}
            {activeTab === 'forgot' && "Enter your email and we'll send you a secure Firebase reset link."}
          </p>
        </div>

        {/* Auth Mode Tabs Navigation */}
        <div className="mt-5 grid grid-cols-3 gap-1 p-1 bg-[#FAF0F3]/80 rounded-xl border border-[#E8B4B8]/40 text-center">
          <button
            type="button"
            id="tab-auth-login"
            onClick={() => {
              setActiveTab('login');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-auth-signup"
            onClick={() => {
              setActiveTab('signup');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            id="tab-auth-phone"
            onClick={() => {
              setActiveTab('phone');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="font-medium leading-relaxed">{successMessage}</p>
              {unverifiedUser && (
                <div className="pt-1 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleSimulateVerificationSuccess}
                    className="px-2 py-1 rounded bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 cursor-pointer shadow-2xs flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Click to Confirm Verified</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="px-2 py-1 rounded bg-white border border-emerald-300 text-emerald-700 font-bold text-[10px] hover:bg-emerald-50 cursor-pointer"
                  >
                    Resend Email
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 1: EMAIL LOGIN FORM */}
        {/* ================================================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleEmailLogin} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                Email Address
              </label>
              <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#B76E79]">
                <Mail className="w-4 h-4 text-gray-400 ml-3 pointer-events-none" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  required
                  className="w-full px-3 py-2.5 text-xs text-gray-900 font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#4A154B]">
                  Password
                </label>
                <button
                  type="button"
                  id="btn-goto-forgot"
                  onClick={() => {
                    setActiveTab('forgot');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] font-medium text-[#B76E79] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#B76E79]">
                <Lock className="w-4 h-4 text-gray-400 ml-3 pointer-events-none" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2.5 text-xs text-gray-900 font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-400 hover:text-gray-600 mr-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#4A154B] focus:ring-[#4A154B] cursor-pointer"
                />
                <span className="text-[11px]">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In with Firebase</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================= */}
        {/* TAB 2: SIGN UP FORM */}
        {/* ================================================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                Full Name
              </label>
              <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#B76E79]">
                <UserIcon className="w-4 h-4 text-gray-400 ml-3 pointer-events-none" />
                <input
                  id="signup-name-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Royal Name"
                  required
                  className="w-full px-3 py-2 text-xs text-gray-900 font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                Email Address (Verification Sent)
              </label>
              <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#B76E79]">
                <Mail className="w-4 h-4 text-gray-400 ml-3 pointer-events-none" />
                <input
                  id="signup-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  required
                  className="w-full px-3 py-2 text-xs text-gray-900 font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-[#E8D5C4] bg-white shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-[#B76E79]">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-[#FAF8F9] px-2.5 py-2 text-xs font-medium text-gray-700 border-r border-[#E8D5C4] outline-none"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  id="signup-phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  maxLength={10}
                  required
                  className="w-full px-3 py-2 text-xs text-gray-900 font-medium outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#4A154B] mb-1">
                  Password
                </label>
                <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs">
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full px-2.5 py-2 text-xs text-gray-900 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#4A154B] mb-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs">
                  <input
                    id="signup-confirm-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full px-2.5 py-2 text-xs text-gray-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#FAF0F3] rounded-xl border border-[#E8B4B8]/40 text-[11px] text-gray-600 flex items-start space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79] flex-shrink-0 mt-0.5" />
              <span>Includes 300 Welcome Loyalty Points & instant BlueDart delivery tracking.</span>
            </div>

            <button
              type="submit"
              id="btn-submit-signup"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account & Send Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================= */}
        {/* TAB 3: PHONE OTP FORM */}
        {/* ================================================= */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-[#E8D5C4] overflow-hidden focus-within:ring-2 focus-within:ring-[#B76E79] bg-white shadow-2xs">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-[#FAF8F9] px-3 py-3 text-xs font-medium text-gray-700 border-r border-[#E8D5C4] outline-none"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <div className="relative flex-1 flex items-center">
                  <input
                    id="phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="w-full px-3 py-3 text-sm text-gray-900 font-medium tracking-wide outline-none"
                  />
                  <Phone className="w-4 h-4 text-gray-400 mr-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-get-otp"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Request Firebase OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================= */}
        {/* TAB 4: FORGOT PASSWORD FORM */}
        {/* ================================================= */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                Registered Email Address
              </label>
              <div className="relative flex items-center rounded-xl border border-[#E8D5C4] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#B76E79]">
                <Mail className="w-4 h-4 text-gray-400 ml-3 pointer-events-none" />
                <input
                  id="forgot-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@example.com"
                  required
                  className="w-full px-3 py-2.5 text-xs text-gray-900 font-medium outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-forgot"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Firebase Reset Link</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-bold text-[#8C4A5A] hover:text-[#4A154B] underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EFE8ED]" />
          </div>
          <span className="relative px-3 bg-[#FAF8F9] text-[11px] font-medium text-gray-400">
            or continue with
          </span>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          id="btn-google-login"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-[#E8D5C4] bg-white hover:bg-[#FAF8F9] text-gray-700 font-bold text-xs shadow-2xs active:scale-[0.99] transition-all flex items-center justify-center space-x-3 cursor-pointer"
        >
          {/* Google Icon SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Footer Security Notice */}
      <div className="pt-4 text-center space-y-1.5">
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
          <span>Firebase Authentication • 256-Bit SSL Encrypted</span>
        </div>
        <p className="text-[10px] text-gray-400">
          By continuing, you agree to Sagunika Cosmetic Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
