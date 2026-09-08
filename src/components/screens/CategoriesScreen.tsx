import React from 'react';
import {
  Sparkles,
  Crown,
  Droplets,
  Smile,
  Feather,
  Leaf,
  HeartHandshake,
  ArrowRight,
  Search,
} from 'lucide-react';
import { CATEGORIES_DATA } from '../../data/mockData';
import { ScreenName } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoriesScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onSelectCategoryFilter?: (categoryId: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  onNavigate,
  onSelectCategoryFilter,
}) => {
  const { t, language } = useLanguage();

  const getCategoryTitle = (catId: string, defaultTitle: string) => {
    switch (catId) {
      case 'makeup': return t.catMakeup;
      case 'skincare': return t.catSkincare;
      case 'haircare': return t.catHaircare;
      case 'fragrance': return t.catFragrance;
      case 'beauty_tools': return t.catBeautyTools;
      case 'personal_care': return t.catPersonalCare;
      case 'wedding': return t.catWedding;
      case 'groom': return t.catGroom;
      default: return defaultTitle;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#B76E79]" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-[#4A154B]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#B76E79]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#8C4A5A]" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-[#67226B]" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-[#4A154B]" />;
    }
  };

  const handleCategoryClick = (id: string) => {
    if (id === 'wedding') {
      onNavigate('wedding');
    } else if (id === 'groom') {
      onNavigate('groom');
    } else {
      if (onSelectCategoryFilter) {
        onSelectCategoryFilter(id);
      }
      onNavigate('home');
    }
  };

  return (
    <div id="screen-categories" className="pb-24 bg-[#FAF8F9] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3.5 border-b border-[#E8D5C4]/60">
        <h2 className="font-serif text-lg font-bold text-[#4A154B] text-center">
          {language === 'hi' ? 'सौंदर्य उत्पाद श्रेणियां' : 'Cosmetic Collections'}
        </h2>
        <p className="text-[10px] text-gray-500 text-center tracking-wide">
          {language === 'hi' ? 'शादी, समारोह एवं दैनिक चमक के लिए शुद्ध फॉर्मूलेशन' : 'Curated Luxury Formulations for Ceremonies & Daily Radiance'}
        </p>
      </div>

      {/* Featured Special Collections Banner Cards */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#4A154B]">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
          <span>{language === 'hi' ? 'शाही उत्सव संग्रह' : 'Curated Ceremonial Edit'}</span>
        </div>

        {/* Wedding Collection Highlight Card */}
        <div
          id="category-card-wedding"
          onClick={() => onNavigate('wedding')}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#B76E79] to-[#8C4A5A] text-white p-4 shadow-[0_4px_16px_rgba(183,110,121,0.25)] cursor-pointer group active:scale-[0.99] transition-all"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'दुल्हन व समारोह' : 'Bridal & Ceremony'}
              </span>
              <h3 className="font-serif text-lg font-bold">
                {t.catWedding}
              </h3>
              <p className="text-[11px] text-rose-100 max-w-[200px]">
                {language === 'hi' ? 'वैनिटी सेट्स, हर्बल सिंदूर, और 24K गोल्ड इल्यूमिनेटर।' : 'Trousseau vanity sets, herbal sindoor, and 24K gold illuminators.'}
              </p>
              <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold">
                <span>{language === 'hi' ? 'वेडिंग वॉल्ट देखें' : 'Explore Bridal Vault'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Groom Collection Highlight Card */}
        <div
          id="category-card-groom"
          onClick={() => onNavigate('groom')}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D0C34] to-[#4A154B] text-white p-4 shadow-[0_4px_16px_rgba(74,21,75,0.25)] cursor-pointer group active:scale-[0.99] transition-all"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'पुरुष सौंदर्य एवं दाढ़ी केयर' : 'Gentleman Care'}
              </span>
              <h3 className="font-serif text-lg font-bold">
                {t.catGroom}
              </h3>
              <p className="text-[11px] text-[#E8D5C4] max-w-[200px]">
                {language === 'hi' ? 'दाढ़ी केयर, मैसूर चंदन शेविंग व शाही इत्र।' : 'Pre-wedding beard care, Mysore sandalwood shaving & royal oud.'}
              </p>
              <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-[#E8D5C4]">
                <span>{language === 'hi' ? 'ग्रूम ट्रंक देखें' : 'Explore Groom Trunk'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Crown className="w-8 h-8 text-[#E8D5C4]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Standard Categories */}
      <div className="px-4 mt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A154B] mb-3">
          {language === 'hi' ? 'सभी श्रेणियां देखें' : 'Explore All Categories'}
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES_DATA.map((category) => (
            <div
              key={category.id}
              id={`cat-card-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-xl border border-[#E8D5C4]/60 p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between active:scale-95 group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0F3] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  {getIcon(category.icon)}
                </div>
                <h5 className="font-serif text-sm font-bold text-gray-900 leading-snug group-hover:text-[#4A154B] transition-colors">
                  {getCategoryTitle(category.id, category.title)}
                </h5>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                  {category.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EFE8ED] flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#B76E79]">
                  {category.itemCount}+ {language === 'hi' ? 'उत्पाद' : 'Products'}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#4A154B] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
