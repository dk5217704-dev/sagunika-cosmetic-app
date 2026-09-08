import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Navigation,
  Radio,
  Play,
  RotateCcw,
  Check,
  MapPin,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';

interface OrderShipmentTrackerProps {
  order: Order;
  compact?: boolean;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export type ShipmentStage = 'processing' | 'packed' | 'shipped' | 'delivered';

export interface StageInfo {
  id: ShipmentStage;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  pickupDescription: string;
  statusMatch: OrderStatus[];
}

export const SHIPMENT_STAGES: StageInfo[] = [
  {
    id: 'processing',
    label: 'Processing',
    shortLabel: 'Process',
    icon: Sparkles,
    description: 'Order confirmed & formulation verified by Sagunika alchemists',
    pickupDescription: 'Order confirmed & vault items prepared for studio packaging',
    statusMatch: ['confirmed']
  },
  {
    id: 'packed',
    label: 'Packed',
    shortLabel: 'Packed',
    icon: Package,
    description: 'Encased in ceremonial rose-gold gift packaging & sealed with wax crest',
    pickupDescription: 'Handcrafted in signature gift box & placed in studio pickup lockers',
    statusMatch: ['packed']
  },
  {
    id: 'shipped',
    label: 'Shipped',
    shortLabel: 'Shipped',
    icon: Truck,
    description: 'Dispatched with BlueDart Air Express courier • En route to your address',
    pickupDescription: 'Ready for Collection at Sagunika Studio, Koregaon Park Pune',
    statusMatch: ['shipped', 'out_for_delivery']
  },
  {
    id: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    icon: CheckCircle2,
    description: 'Parcel safely received & verified with patron signature',
    pickupDescription: 'Order collected by patron from Studio Concierge',
    statusMatch: ['delivered']
  }
];

export function getStageDetails(status: OrderStatus) {
  if (status === 'cancelled') {
    return {
      stageIndex: -1,
      currentStage: null,
      percent: 0,
      isCancelled: true
    };
  }

  if (status === 'delivered') {
    return {
      stageIndex: 3,
      currentStage: 'delivered' as ShipmentStage,
      percent: 100,
      isCancelled: false
    };
  }

  if (status === 'out_for_delivery') {
    return {
      stageIndex: 2,
      currentStage: 'shipped' as ShipmentStage,
      percent: 85,
      isCancelled: false
    };
  }

  if (status === 'shipped') {
    return {
      stageIndex: 2,
      currentStage: 'shipped' as ShipmentStage,
      percent: 68,
      isCancelled: false
    };
  }

  if (status === 'packed') {
    return {
      stageIndex: 1,
      currentStage: 'packed' as ShipmentStage,
      percent: 42,
      isCancelled: false
    };
  }

  // 'confirmed' or initial
  return {
    stageIndex: 0,
    currentStage: 'processing' as ShipmentStage,
    percent: 18,
    isCancelled: false
  };
}

export const OrderShipmentTracker: React.FC<OrderShipmentTrackerProps> = ({
  order,
  compact = false,
  onStatusChange
}) => {
  const isPickup = order.deliveryType === 'pickup';
  const { stageIndex, currentStage, percent, isCancelled } = getStageDetails(order.status);

  // Real-time simulated telemetry ticker (updates seconds elapsed)
  const [secondsAgo, setSecondsAgo] = useState(14);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 55 ? 4 : prev + 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Real-time automatic simulation loop
  useEffect(() => {
    if (!isSimulating || !onStatusChange) return;

    const timer = setTimeout(() => {
      if (order.status === 'confirmed') {
        onStatusChange(order.id, 'packed');
      } else if (order.status === 'packed') {
        onStatusChange(order.id, 'shipped');
      } else if (order.status === 'shipped') {
        onStatusChange(order.id, 'out_for_delivery');
      } else if (order.status === 'out_for_delivery') {
        onStatusChange(order.id, 'delivered');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4A154B', '#B76E79', '#D4AF37', '#E8B4B8']
        });
        setIsSimulating(false);
      } else {
        setIsSimulating(false);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [isSimulating, order.status, order.id, onStatusChange]);

  const handleStageSelect = (targetStage: ShipmentStage) => {
    if (!onStatusChange) return;
    let newStatus: OrderStatus = 'confirmed';
    if (targetStage === 'processing') newStatus = 'confirmed';
    else if (targetStage === 'packed') newStatus = 'packed';
    else if (targetStage === 'shipped') newStatus = 'shipped';
    else if (targetStage === 'delivered') {
      newStatus = 'delivered';
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4A154B', '#B76E79', '#D4AF37']
      });
    }
    onStatusChange(order.id, newStatus);
  };

  if (isCancelled) {
    return (
      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="font-medium">This order was cancelled. Payment refund processed to source account.</p>
      </div>
    );
  }

  // =========================================================
  // COMPACT VIEW (Displayed in card summary before expansion)
  // =========================================================
  if (compact) {
    return (
      <div className="pt-2 pb-1 space-y-2">
        {/* Stages Header Label */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#4A154B]">
              {order.status === 'delivered'
                ? 'Delivered'
                : order.status === 'out_for_delivery'
                ? 'Out for VIP Delivery'
                : order.status === 'shipped'
                ? 'In Transit (BlueDart Air)'
                : order.status === 'packed'
                ? 'Gift Packed at Studio'
                : 'Processing Formulation'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-gray-500">
            {percent}% Complete
          </span>
        </div>

        {/* 4-Step Visual Progress Bar */}
        <div className="relative">
          {/* Background Bar */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4A154B] via-[#B76E79] to-[#D4AF37] transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Stepper Dots */}
          <div className="flex justify-between -mt-2">
            {SHIPMENT_STAGES.map((st, idx) => {
              const isCompleted = stageIndex > idx;
              const isCurrent = stageIndex === idx;

              return (
                <div key={st.id} className="flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-[#4A154B] border-[#4A154B] text-white'
                        : isCurrent
                        ? 'bg-[#B76E79] border-white ring-2 ring-[#B76E79] ring-offset-1 text-white animate-pulse'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-2 h-2 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-[9px] mt-1 font-medium transition-colors ${
                      isCompleted || isCurrent
                        ? 'text-[#4A154B] font-bold'
                        : 'text-gray-400'
                    }`}
                  >
                    {st.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // DETAILED VIEW (Displayed when user expands order)
  // =========================================================
  const activeStageInfo = SHIPMENT_STAGES[Math.max(0, stageIndex)];

  return (
    <div className="space-y-4 pt-1">
      {/* Top Real-Time Tracking Header */}
      <div className="p-3.5 bg-gradient-to-br from-[#FAF0F3] via-white to-[#FAF8F9] rounded-2xl border border-[#E8B4B8]/60 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-bold text-[#4A154B] uppercase tracking-wider">
              Real-Time Shipment Progress
            </span>
          </div>

          <span className="text-[10px] text-gray-500 font-mono bg-white px-2 py-0.5 rounded-full border border-gray-200">
            Updated {secondsAgo}s ago
          </span>
        </div>

        {/* Dynamic Carrier / Tracking Badge */}
        <div className="mt-2.5 flex items-center justify-between text-xs border-t border-[#E8D5C4]/40 pt-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#4A154B] text-white flex items-center justify-center shadow-2xs">
              {isPickup ? <MapPin className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs">
                {isPickup ? 'Studio Concierge Collection' : 'BlueDart Air Express (Courier)'}
              </p>
              <p className="text-[10px] text-gray-500">
                {isPickup
                  ? 'Koregaon Park Studio • Lane 5'
                  : `AWB Tracking: BD-${order.orderNumber.replace('SG-', '')}-IN`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-[#B76E79] block">
              {order.status === 'delivered' ? 'DELIVERY COMPLETED' : 'ESTIMATED ARRIVAL'}
            </span>
            <span className="text-xs font-bold text-gray-800">
              {order.estimatedDelivery || 'Tomorrow by 4:00 PM'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stage Interactive Horizontal Visualization */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8D5C4]/70 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Shipment Milestones
          </span>
          <span className="text-xs font-extrabold text-[#4A154B] bg-[#FAF0F3] px-2.5 py-0.5 rounded-full border border-[#E8B4B8]/50">
            {percent}% Completed
          </span>
        </div>

        {/* Progress Bar with Connecting Pipeline */}
        <div className="relative px-2 pt-2 pb-1">
          {/* Pipeline Background */}
          <div className="absolute left-6 right-6 top-6 h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden z-0">
            <div
              className="h-full bg-gradient-to-r from-[#4A154B] via-[#B76E79] to-[#D4AF37] transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* 4 Stage Nodes */}
          <div className="relative z-10 flex justify-between">
            {SHIPMENT_STAGES.map((stage, idx) => {
              const isCompleted = stageIndex > idx;
              const isCurrent = stageIndex === idx;
              const isPending = stageIndex < idx;
              const IconComp = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageSelect(stage.id)}
                  title={`Click to set status to ${stage.label}`}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  {/* Node Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#4A154B] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-gradient-to-tr from-[#B76E79] to-[#4A154B] text-white ring-4 ring-[#E8B4B8]/60 shadow-md animate-pulse scale-105'
                        : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-[#B76E79]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <IconComp className="w-4 h-4" />
                    )}
                  </div>

                  {/* Node Label */}
                  <span
                    className={`text-xs mt-2 font-bold tracking-tight transition-colors ${
                      isCompleted
                        ? 'text-[#4A154B]'
                        : isCurrent
                        ? 'text-[#B76E79] font-extrabold'
                        : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </span>

                  {/* Stage Tag */}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : isCurrent
                        ? 'bg-[#4A154B] text-white'
                        : 'text-gray-300'
                    }`}
                  >
                    {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Wait'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Stage Detailed Callout */}
        <div className="p-3 bg-[#FAF8F9] rounded-xl border border-[#E8D5C4]/60 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-[#4A154B] text-white mt-0.5 shadow-2xs">
            {React.createElement(activeStageInfo.icon, { className: 'w-4 h-4' })}
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">
                Current Status: {activeStageInfo.label}
              </span>
              <span className="text-[10px] text-[#B76E79] font-bold uppercase tracking-wider">
                Step {stageIndex + 1} of 4
              </span>
            </div>
            <p className="text-gray-600 mt-0.5 text-[11px] leading-relaxed">
              {isPickup ? activeStageInfo.pickupDescription : activeStageInfo.description}
            </p>
          </div>
        </div>

        {/* Interactive Real-Time Simulator & Stepper Bar */}
        {onStatusChange && (
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 text-[11px] text-gray-500">
              <Sparkles className="w-3 h-3 text-[#B76E79]" />
              <span>Real-Time Demo Controls:</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Auto Simulation button */}
              <button
                type="button"
                id={`btn-simulate-tracking-${order.id}`}
                onClick={() => {
                  if (order.status === 'delivered') {
                    // Reset to confirmed so they can replay
                    onStatusChange(order.id, 'confirmed');
                    setIsSimulating(true);
                  } else {
                    setIsSimulating((prev) => !prev);
                  }
                }}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  isSimulating
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    : 'bg-[#FAF0F3] text-[#4A154B] hover:bg-[#F3E5EB] border border-[#E8B4B8]/50'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    <span>Simulating Live...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Auto-Play Progress</span>
                  </>
                )}
              </button>

              {/* Direct Fast Forward Button */}
              {order.status !== 'delivered' ? (
                <button
                  type="button"
                  id={`btn-next-stage-${order.id}`}
                  onClick={() => {
                    const nextStage =
                      order.status === 'confirmed'
                        ? 'packed'
                        : order.status === 'packed'
                        ? 'shipped'
                        : 'delivered';
                    if (nextStage === 'delivered') {
                      confetti({
                        particleCount: 70,
                        spread: 60,
                        origin: { y: 0.6 },
                        colors: ['#4A154B', '#B76E79', '#D4AF37']
                      });
                    }
                    onStatusChange(order.id, nextStage);
                  }}
                  className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-[#4A154B] text-white hover:bg-[#67226B] transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
                >
                  <span>Advance Stage</span>
                  <Navigation className="w-3 h-3 rotate-90" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStatusChange(order.id, 'confirmed')}
                  className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
