import React, { useEffect } from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { FCMNotification } from '../types';

interface AndroidHeadsUpBannerProps {
  notification: FCMNotification | null;
  onDismiss: () => void;
  onClick: (notification: FCMNotification) => void;
}

export const AndroidHeadsUpBanner: React.FC<AndroidHeadsUpBannerProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className="absolute top-8 left-3 right-3 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        onClick={() => onClick(notification)}
        className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#E8D5C4] shadow-[0_10px_30px_rgba(74,21,75,0.2)] flex items-start space-x-3 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-full bg-[#4A154B] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#E8B4B8]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-[#B76E79] uppercase">
              Sagunika Cosmetic
            </span>
            <span className="text-[9px] text-gray-400">now</span>
          </div>
          <h5 className="text-xs font-bold text-[#2D0C34] truncate mt-0.5">
            {notification.title}
          </h5>
          <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">
            {notification.body}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
