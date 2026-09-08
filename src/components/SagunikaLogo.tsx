import React from 'react';

interface SagunikaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'horizontal' | 'mark-only' | 'badge' | 'vertical';
  lightText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const SagunikaLogo: React.FC<SagunikaLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  lightText = false,
  showSubtitle = true,
  className = '',
}) => {
  // Dimension maps
  const emblemSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  }[size];

  const fullWidthSizes = {
    xs: 'w-24',
    sm: 'w-32',
    md: 'w-44',
    lg: 'w-56',
    xl: 'w-72',
    '2xl': 'w-88',
  }[size];

  // The Exact Circular Metallic Gold & Cream Emblem
  const EmblemImage = (
    <div
      className={`relative ${emblemSizes} flex-shrink-0 rounded-full overflow-hidden shadow-xs transition-transform hover:scale-105 select-none bg-[#FAF4EE] border border-[#E8D5C4]/70`}
    >
      <img
        src="/assets/sagunika_logo_emblem.svg"
        alt="Sagunika Cosmetics Official Crest"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );

  // Mark-only variant
  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {EmblemImage}
      </div>
    );
  }

  // Full stacked logo variant (Used on Splash, Login, Drawer Header)
  if (variant === 'full' || variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E8D5C4]/70 bg-[#FAF4EE] p-3">
          <img
            src="/assets/sagunika_logo.svg"
            alt="Sagunika Cosmetics Official Brand Logo"
            referrerPolicy="no-referrer"
            className={`${fullWidthSizes} h-auto object-contain mx-auto drop-shadow-xs`}
          />
        </div>
      </div>
    );
  }

  // Badge variant
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#FAF5F0] border border-[#D4AF37]/50 shadow-xs select-none ${className}`}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <img
            src="/assets/sagunika_logo.svg"
            alt="Sagunika Monogram"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[2.1] translate-y-[22%]"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-serif font-extrabold text-xs tracking-wider text-[#111111] uppercase">
            SAGUNIKA
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] text-[#C59B27] uppercase mt-0.5">
            COSMETIC
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (Default header / navigation logo)
  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {EmblemImage}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline space-x-1.5">
          <span
            className={`font-serif font-extrabold tracking-[0.14em] leading-none ${
              lightText ? 'text-white' : 'text-[#111111]'
            } ${
              size === 'xs'
                ? 'text-xs'
                : size === 'sm'
                ? 'text-sm'
                : size === 'md'
                ? 'text-base'
                : 'text-lg'
            }`}
          >
            SAGUNIKA
          </span>
          <span
            className={`text-[9px] font-bold tracking-[0.2em] uppercase ${
              lightText ? 'text-amber-200' : 'text-[#B88628]'
            }`}
          >
            COSMETIC
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[9px] font-medium tracking-tight leading-tight mt-0.5 ${
              lightText ? 'text-amber-100/90' : 'text-[#7B2455]'
            }`}
          >
            Beauty That Inspires Confidence
          </span>
        )}
      </div>
    </div>
  );
};
