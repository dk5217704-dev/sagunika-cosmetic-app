import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface AndroidStatusBarProps {
  darkIcons?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ darkIcons = false }) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkIcons ? 'text-gray-800' : 'text-gray-900';

  return (
    <div className={`w-full px-5 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none z-30 transition-colors ${textColor}`}>
      <div className="flex items-center space-x-1">
        <span>{time}</span>
      </div>
      
      {/* Front camera punch hole simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/85 ring-1 ring-white/20 mx-auto shadow-inner"></div>

      <div className="flex items-center space-x-2">
        <Signal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold tracking-tighter">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center">
          <Battery className="w-4 h-4 fill-current" />
          <span className="text-[9px] ml-0.5 font-bold">98%</span>
        </div>
      </div>
    </div>
  );
};
