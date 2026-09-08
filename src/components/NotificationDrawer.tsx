import React from 'react';
import { X, Bell, Sparkles, Package, Send, Check } from 'lucide-react';
import { FCMNotification, ScreenName } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: FCMNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notification: FCMNotification) => void;
  onTriggerTestPush: (type: 'wedding' | 'order' | 'groom') => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onTriggerTestPush,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm h-full flex flex-col border-l border-[#E8D5C4] shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE8ED] flex items-center justify-between bg-[#FAF8F9]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                FCM Push Center
              </h3>
              <span className="text-[10px] text-gray-500">
                Firebase Cloud Messaging Updates
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Simulator Buttons */}
        <div className="p-3 bg-[#FAF0F3] border-b border-[#E8B4B8]/40 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C4A5A] block">
            Simulate Incoming FCM Push:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => onTriggerTestPush('wedding')}
              className="px-2.5 py-1 rounded-md bg-white border border-[#E8B4B8] text-[10px] font-bold text-[#B76E79] hover:bg-[#FDF7F8] flex items-center space-x-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Wedding Offer</span>
            </button>
            <button
              onClick={() => onTriggerTestPush('order')}
              className="px-2.5 py-1 rounded-md bg-white border border-[#E8D5C4] text-[10px] font-bold text-[#4A154B] hover:bg-[#F3EAF4] flex items-center space-x-1 shadow-2xs"
            >
              <Package className="w-3 h-3" />
              <span>Order Update</span>
            </button>
            <button
              onClick={() => onTriggerTestPush('groom')}
              className="px-2.5 py-1 rounded-md bg-white border border-gray-300 text-[10px] font-bold text-gray-800 hover:bg-gray-100 flex items-center space-x-1 shadow-2xs"
            >
              <span>👑 Groom Alert</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-gray-700">Recent Alerts</span>
            <button
              onClick={onMarkAllRead}
              className="text-[10px] font-semibold text-[#B76E79] hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? 'bg-white border-gray-100'
                  : 'bg-[#F3EAF4]/40 border-[#4A154B]/20 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-[#4A154B]">{notif.title}</h4>
                <span className="text-[9px] text-gray-400">{notif.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                {notif.body}
              </p>
              {notif.targetScreen && (
                <div className="mt-2 text-[10px] font-bold text-[#B76E79] flex items-center space-x-1">
                  <span>Tap to view →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
