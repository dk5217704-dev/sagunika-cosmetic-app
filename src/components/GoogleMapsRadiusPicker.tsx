import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Store, 
  Info,
  Compass,
  Maximize2
} from 'lucide-react';
import { StoreSettings, Address } from '../types';
import { calculateDistanceKm } from '../services/firebase';

interface GoogleMapsRadiusPickerProps {
  storeSettings: StoreSettings;
  selectedAddress: Address;
  onAddressSelect: (address: Address, distanceKm: number, isEligible: boolean) => void;
}

interface PuneLocality {
  name: string;
  street: string;
  pincode: string;
  lat: number;
  lng: number;
  description: string;
}

const PUNE_LOCALITIES: PuneLocality[] = [
  {
    name: 'Koregaon Park (North Main Road)',
    street: 'Plot 12, Lane 7, Koregaon Park',
    pincode: '411001',
    lat: 18.5378,
    lng: 73.8965,
    description: '0.8 KM from Studio (Fast Dispatch)'
  },
  {
    name: 'Kalyani Nagar',
    street: 'Central Avenue, Near Joggers Park',
    pincode: '411006',
    lat: 18.5492,
    lng: 73.9034,
    description: '2.1 KM from Studio (Under 10 KM)'
  },
  {
    name: 'Viman Nagar',
    street: 'Sakore Nagar, Phoenix Marketcity Road',
    pincode: '411014',
    lat: 18.5679,
    lng: 73.9143,
    description: '4.5 KM from Studio (Under 10 KM)'
  },
  {
    name: 'Shivaji Nagar / FC Road',
    street: 'Deccan Gymkhana, FC Road',
    pincode: '411004',
    lat: 18.5204,
    lng: 73.8436,
    description: '5.8 KM from Studio (Under 10 KM)'
  },
  {
    name: 'Magarpatta City (Hadapsar)',
    street: 'Cybercity Tower 4, Hadapsar',
    pincode: '411028',
    lat: 18.5158,
    lng: 73.9272,
    description: '7.2 KM from Studio (Under 10 KM)'
  },
  {
    name: 'Baner (Pashan Link Road)',
    street: 'High Street, Baner',
    pincode: '411045',
    lat: 18.5590,
    lng: 73.7868,
    description: '9.4 KM from Studio (Border of 10 KM Zone)'
  },
  {
    name: 'Kothrud (Karve Road)',
    street: 'Near Paud Road Circle, Kothrud',
    pincode: '411038',
    lat: 18.5074,
    lng: 73.8077,
    description: '12.4 KM (Exceeds 10 KM Delivery Zone)'
  },
  {
    name: 'Hinjewadi Phase 1 (Infotech Park)',
    street: 'Maan Road, Hinjewadi Rajiv Gandhi IT Park',
    pincode: '411057',
    lat: 18.5912,
    lng: 73.7389,
    description: '19.8 KM (Outside Delivery Zone)'
  }
];

export const GoogleMapsRadiusPicker: React.FC<GoogleMapsRadiusPickerProps> = ({
  storeSettings,
  selectedAddress,
  onAddressSelect
}) => {
  const currentLat = selectedAddress.latitude || 18.5378;
  const currentLng = selectedAddress.longitude || 73.8965;

  const currentDistance = calculateDistanceKm(
    storeSettings.latitude,
    storeSettings.longitude,
    currentLat,
    currentLng
  );

  const isWithinRadius = currentDistance <= storeSettings.deliveryRadiusKm;

  const handleSelectLocality = (locality: PuneLocality) => {
    const distance = calculateDistanceKm(
      storeSettings.latitude,
      storeSettings.longitude,
      locality.lat,
      locality.lng
    );

    const eligible = distance <= storeSettings.deliveryRadiusKm;

    const newAddress: Address = {
      ...selectedAddress,
      street: locality.street,
      city: 'Pune',
      pincode: locality.pincode,
      latitude: locality.lat,
      longitude: locality.lng,
      distanceKm: distance
    };

    onAddressSelect(newAddress, distance, eligible);
  };

  return (
    <div id="google-maps-delivery-radar" className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#FAF0F3] text-[#B76E79] flex items-center justify-center">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
              Google Maps Delivery Verification
            </h4>
            <span className="text-[10px] text-gray-500">
              Sagunika Studio Max Radius: <strong className="text-[#4A154B] font-bold">{storeSettings.deliveryRadiusKm} KM</strong>
            </span>
          </div>
        </div>

        {/* Live Distance Pill */}
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 ${
            isWithinRadius
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
          }`}
        >
          <Navigation className="w-3 h-3" />
          <span>{currentDistance} KM Away</span>
        </span>
      </div>

      {/* Visual Google Map Radar Diagram */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner flex flex-col justify-between p-3">
        {/* Radar concentric rings representing distances */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <div className="w-72 h-72 rounded-full border border-emerald-400" />
          <div className="w-52 h-52 rounded-full border border-dashed border-emerald-300" />
          <div className="w-32 h-32 rounded-full border border-emerald-200" />
        </div>

        {/* Top Info Tag */}
        <div className="relative z-10 flex items-center justify-between text-[10px]">
          <span className="bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono">
            Origin: {storeSettings.name} (Koregaon Park)
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
            Zone: {storeSettings.deliveryRadiusKm} KM Radius
          </span>
        </div>

        {/* Map Center & Destination Indicators */}
        <div className="relative z-10 flex items-center justify-center my-auto space-x-8">
          {/* Store Pin */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#4A154B] text-white flex items-center justify-center shadow-lg ring-2 ring-[#B76E79]">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-white mt-1 bg-black/50 px-1.5 py-0.5 rounded">
              Sagunika Studio
            </span>
          </div>

          {/* Dotted Connecting Flight Path */}
          <div className="flex-1 max-w-[90px] border-t-2 border-dashed border-[#B76E79] relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-300 font-mono bg-black/60 px-1 rounded">
              {currentDistance} km
            </span>
          </div>

          {/* Customer Destination Pin */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg ring-2 ${
                isWithinRadius ? 'bg-emerald-600 ring-emerald-300' : 'bg-rose-600 ring-rose-300 animate-bounce'
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-white mt-1 bg-black/50 px-1.5 py-0.5 rounded max-w-[90px] truncate">
              {selectedAddress.city}
            </span>
          </div>
        </div>

        {/* Bottom Coordinates Status */}
        <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <span>GPS: {currentLat.toFixed(4)}°N, {currentLng.toFixed(4)}°E</span>
          <span className={isWithinRadius ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {isWithinRadius ? '✓ Verified within 10 KM' : '✕ Exceeds 10 KM Limit'}
          </span>
        </div>
      </div>

      {/* Radius Check Alert Banner */}
      {!isWithinRadius ? (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Doorstep Delivery Unavailable ({currentDistance} KM)
            </p>
            <p className="text-[11px] text-rose-700 leading-snug">
              This address is outside our <strong>{storeSettings.deliveryRadiusKm} KM</strong> luxury courier zone. 
              Please switch to <strong>Store Pickup at Sagunika Studio (Koregaon Park)</strong> or choose a location within {storeSettings.deliveryRadiusKm} KM.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-[11px]">
            Address verified within our <strong>{storeSettings.deliveryRadiusKm} KM</strong> delivery radius. Sagunika VIP courier active.
          </span>
        </div>
      )}

      {/* Quick Pune Locality Selector for Testing Restrictions */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-bold text-gray-700 block">
          Select or Test Pune Address Location:
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {PUNE_LOCALITIES.map((loc) => {
            const d = calculateDistanceKm(
              storeSettings.latitude,
              storeSettings.longitude,
              loc.lat,
              loc.lng
            );
            const inside = d <= storeSettings.deliveryRadiusKm;
            const isCurr = Math.abs(currentLat - loc.lat) < 0.001 && Math.abs(currentLng - loc.lng) < 0.001;

            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectLocality(loc)}
                className={`p-2 rounded-lg text-left border transition-all text-xs ${
                  isCurr
                    ? 'border-[#4A154B] bg-[#FAF0F3] ring-1 ring-[#4A154B]'
                    : 'border-gray-200 bg-gray-50/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 truncate text-[11px]">{loc.name}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      inside ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {d} km
                  </span>
                </div>
                <span className="text-[9px] text-gray-500 block truncate mt-0.5">{loc.street}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
