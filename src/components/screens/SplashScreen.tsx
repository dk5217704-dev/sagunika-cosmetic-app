import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ScreenName } from '../../types';

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
      className="relative min-h-[640px] h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#FAF8F9] via-[#FFFFFF] to-[#FDF7F8] text-center overflow-hidden select-none"
    >
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#E8B4B8]/20 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-[#4A154B]/10 to-transparent blur-2xl pointer-events-none" />

      {/* Top Brand Pill */}
      <div className="pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8]/40 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
          <span className="text-[11px] font-semibold tracking-wider text-[#4A154B] uppercase">
            Luxury Cosmetics & Fragrances
          </span>
        </div>
      </div>

      {/* Center Luxury Emblem & Typography */}
      <div className="flex flex-col items-center max-w-xs space-y-6 my-auto">
        {/* Monogram Crest */}
        <div className="relative group cursor-pointer" onClick={handleEnter}>
          <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#B76E79] via-[#E8D5C4] to-[#4A154B] shadow-[0_10px_30px_rgba(183,110,121,0.25)] animate-pulse">
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2 border border-[#F3EAF4]">
              <span className="font-serif text-4xl font-bold bg-gradient-to-r from-[#4A154B] via-[#8C4A5A] to-[#B76E79] bg-clip-text text-transparent">
                SC
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-[#B76E79] font-semibold mt-0.5">
                EST. 2026
              </span>
            </div>
          </div>
          {/* Subtle spinning outer ring accent */}
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#B76E79]/30 pointer-events-none animate-spin [animation-duration:24s]" />
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1
            id="brand-title"
            className="text-3xl font-serif font-bold tracking-wider text-[#2D0C34]"
          >
            SAGUNIKA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B76E79]">
            COSMETIC
          </p>
          <div className="w-12 h-[1.5px] bg-gradient-to-r from-[#B76E79] to-[#4A154B] mx-auto my-3 opacity-60" />
          <p
            id="brand-tagline"
            className="text-sm font-medium text-[#4A154B]/85 italic tracking-wide"
          >
            "Beauty That Inspires Confidence"
          </p>
        </div>
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
