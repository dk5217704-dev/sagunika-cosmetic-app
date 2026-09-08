import React from 'react';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { ScreenName } from '../types';

interface BottomNavigationProps {
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  cartCount: number;
  hasActiveOrder?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeScreen,
  onNavigate,
  cartCount,
  hasActiveOrder = false,
}) => {
  const navItems: { id: ScreenName; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Grid className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
        <div className="relative">
          <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {cartCount > 0 && (
            <span
              id="cart-badge-count"
              className="absolute -top-1.5 -right-2 bg-[#B76E79] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse"
            >
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <div className="relative">
          <Package className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {hasActiveOrder && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#67226B] rounded-full ring-1 ring-white"></span>
          )}
        </div>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
    },
  ];

  return (
    <nav
      id="sagunika-bottom-nav"
      aria-label="Bottom Navigation"
      className="sticky bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-[#E8D5C4]/60 px-3 py-2 z-40 shadow-[0_-4px_20px_rgba(74,21,75,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            activeScreen === item.id ||
            (item.id === 'home' && (activeScreen === 'groom' || activeScreen === 'wedding')) ||
            (item.id === 'cart' && activeScreen === 'checkout');

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`group flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#4A154B] font-bold'
                  : 'text-gray-400 hover:text-[#B76E79]'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-[#B76E79] via-[#4A154B] to-[#B76E79] rounded-full"></span>
              )}
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#F3EAF4] text-[#4A154B]' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'text-[#4A154B] font-semibold' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
