import React from 'react';
import {
  X,
  Home,
  Grid,
  Sparkles,
  Crown,
  ShoppingBag,
  Heart,
  Package,
  User as UserIcon,
  ShieldCheck,
  Languages,
  LogOut,
  ChevronRight,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { ScreenName, User } from '../types';
import { SagunikaLogo } from './SagunikaLogo';
import { useLanguage } from '../context/LanguageContext';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  user: User;
  cartCount: number;
  wishlistCount: number;
  onLogout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  user,
  cartCount,
  wishlistCount,
  onLogout,
}) => {
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleNav = (screen: ScreenName) => {
    onNavigate(screen);
    onClose();
  };

  const navItems: {
    id: string;
    screen: ScreenName;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    adminOnly?: boolean;
  }[] = [
    {
      id: 'nav-home',
      screen: 'home',
      label: t.navHome || 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'nav-categories',
      screen: 'categories',
      label: t.navCategories || 'Categories',
      icon: <Grid className="w-4 h-4" />,
    },
    {
      id: 'nav-wedding',
      screen: 'wedding',
      label: t.navWedding || 'Bridal Studio',
      icon: <Sparkles className="w-4 h-4 text-[#B76E79]" />,
      badge: 'Bespoke',
    },
    {
      id: 'nav-groom',
      screen: 'groom',
      label: t.navGroom || 'Royal Groom',
      icon: <Crown className="w-4 h-4 text-[#C59B27]" />,
      badge: 'New',
    },
    {
      id: 'nav-cart',
      screen: 'cart',
      label: t.navCart || 'Shopping Cart',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'nav-wishlist',
      screen: 'wishlist',
      label: t.navWishlist || 'Wishlist',
      icon: <Heart className="w-4 h-4" />,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      id: 'nav-orders',
      screen: 'orders',
      label: t.navOrders || 'My Orders',
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: 'nav-profile',
      screen: 'profile',
      label: t.navProfile || 'Patron Profile',
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      id: 'nav-admin',
      screen: 'admin_panel',
      label: t.navAdmin || 'Store Manager',
      icon: <ShieldCheck className="w-4 h-4 text-[#B88628]" />,
      badge: user.role === 'admin' ? 'Manager' : undefined,
      adminOnly: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container (Slide from left or right) */}
      <div className="w-[300px] sm:w-[340px] h-full bg-[#FAF4EE] flex flex-col border-l border-[#E8D5C4] shadow-2xl overflow-y-auto no-scrollbar">
        {/* TOP BRAND HEADER with EXACT OFFICIAL LOGO */}
        <div className="relative p-5 bg-gradient-to-b from-[#FAF4EE] via-[#FDFBF8] to-[#FAF4EE] border-b border-[#E8D5C4] flex flex-col items-center text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/80 transition-colors cursor-pointer"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* EXACT OFFICIAL SAGUNIKA COSMETICS LOGO */}
          <div className="mt-2 w-44 rounded-2xl bg-[#FAF4EE] border border-[#E8D5C4]/80 p-2.5 shadow-sm">
            <img
              src="/assets/sagunika_logo.svg"
              alt="Sagunika Cosmetics Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>

          <p className="text-[10px] text-[#7B2455] font-serif italic mt-2">
            "Beauty That Inspires Confidence"
          </p>

          {/* Patron greeting badge */}
          <div className="mt-3 w-full px-3 py-1.5 rounded-xl bg-white/90 border border-[#E8D5C4]/70 flex items-center justify-between text-left">
            <div className="truncate">
              <span className="text-[11px] font-bold text-gray-900 block truncate">
                {user.name || 'Sagunika Patron'}
              </span>
              <span className="text-[9px] text-gray-500 block truncate">
                {user.email || user.phone}
              </span>
            </div>
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                user.role === 'admin'
                  ? 'bg-[#111111] text-amber-300'
                  : 'bg-[#FAF0F3] text-[#7B2455] border border-[#E8B4B8]/40'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Patron'}
            </span>
          </div>
        </div>

        {/* NAVIGATION LIST */}
        <div className="flex-1 py-3 px-3 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B88628] px-3 mb-1 block">
            Navigation
          </span>

          {navItems.map((item) => {
            if (item.adminOnly && user.role !== 'admin') return null;
            const isSelected = activeScreen === item.screen;

            return (
              <button
                key={item.id}
                id={item.id}
                onClick={() => handleNav(item.screen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isSelected ? 'text-amber-300' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#B76E79] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-amber-300' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}

          {/* Multi-language Quick Switch in Drawer */}
          <div className="pt-3 pb-1 px-1">
            <div className="p-2.5 rounded-xl bg-white/90 border border-[#E8D5C4]/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-800">
                  <Languages className="w-3.5 h-3.5 text-[#B88628]" />
                  <span>{language === 'hi' ? 'भाषा' : 'Language'}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {language === 'en' ? 'English' : 'हिंदी'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-3 border-t border-[#E8D5C4] bg-[#FAF4EE] space-y-2">
          {/* Customer Care WhatsApp Direct Link */}
          <a
            href="https://wa.me/919876543210?text=Hello%20Sagunika%20Cosmetics%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Concierge'}</span>
          </a>

          {/* Logout or Switch Account */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
          </button>

          <p className="text-center text-[9px] text-gray-400 pt-1">
            SAGUNIKA COSMETICS © 2026. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
