import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ScreenName } from '../../types';
import { SagunikaLogo } from '../SagunikaLogo';

interface SplashScreenProps {
  onContinue: (target: ScreenName) => void;
  isLoggedIn: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue, isLoggedIn }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    onContinue(isLoggedIn ? 'home' : 'login');
  };

  return (
    <div
      id="screen-splash"
      className="relative min-h-[640px] h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#FAF4EE] via-[#FDFBF8] to-[#FAF4EE] text-center overflow-hidden select-none"
    >
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#EED48F]/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-[#D4A747]/20 to-transparent blur-3xl pointer-events-none" />

      {/* Top Brand Pill */}
      <div className="pt-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/40 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B88628]" />
          <span className="text-[11px] font-bold tracking-widest text-[#111111] uppercase">
            Official Luxury Flagship
          </span>
        </div>
      </div>

      {/* Center Luxury Emblem & Official Logo */}
      <div className="flex flex-col items-center max-w-xs space-y-4 my-auto cursor-pointer" onClick={handleEnter}>
        <div className="relative group p-2">
          {/* Official Emblem & Full Typography */}
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-1 bg-[#FAF4EE] border border-[#E8D5C4] shadow-lg flex items-center justify-center transition-transform hover:scale-[1.02]">
            <img
              src="/assets/sagunika_logo.svg"
              alt="Sagunika Cosmetics Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <p
          id="brand-tagline"
          className="text-xs font-medium text-[#7B2455] italic tracking-wider mt-1"
        >
          "Beauty That Inspires Confidence"
        </p>
      </div>

      {/* Bottom Action & Status */}
      <div className="w-full max-w-xs space-y-4 pb-4">
        {/* Progress Bar */}
        <div className="w-full bg-[#EFE8ED] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B76E79] to-[#4A154B] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Enter Button */}
        <button
          id="btn-splash-enter"
          onClick={handleEnter}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(74,21,75,0.25)] hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <span>Explore Boutique</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
          <span>Firebase Secured • 100% Genuine Cosmetics</span>
        </div>
      </div>
    </div>
  );
};
