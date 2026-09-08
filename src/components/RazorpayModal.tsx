import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { StoreSettings } from '../types';

interface RazorpayModalProps {
  isOpen: boolean;
  orderNumber: string;
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeSettings: StoreSettings;
  onClose: () => void;
  onSuccess: (
    paymentId: string,
    paymentMethod: 'razorpay' | 'upi' | 'card' | 'netbanking' | 'wallet',
    subMethod?: string
  ) => void;
  onFailure?: (reason: string, errorCode: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  orderNumber,
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  storeSettings,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState<'idle' | 'authorizing' | 'otp' | 'waiting_upi' | 'redirecting_bank'>('idle');

  // Test Mode: Simulate Success vs Simulate Failure
  const [simulateOutcome, setSimulateOutcome] = useState<'success' | 'failure'>('success');
  const [failureReasonPreset, setFailureReasonPreset] = useState<string>(
    'Transaction declined by issuer bank - 3D Secure authentication failed'
  );

  // UPI State
  const [upiSubTab, setUpiSubTab] = useState<'apps' | 'qr' | 'vpa'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'bhim'>('gpay');
  const [vpaId, setVpaId] = useState(
    customerPhone ? `${customerPhone.replace(/[^0-9]/g, '')}@okaxis` : 'ananya@okhdfcbank'
  );
  const [qrCountdown, setQrCountdown] = useState(300); // 5 mins

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8821 9012 8921');
  const [cardHolder, setCardHolder] = useState(customerName || 'Ananya Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [saveCard, setSaveCard] = useState(true);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'rupay' | 'amex'>('visa');

  // 3D Secure OTP State
  const [bankOtp, setBankOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [allBankSelect, setAllBankSelect] = useState<string>('');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState<'paytm' | 'phonepe' | 'amazonpay' | 'mobikwik'>('paytm');

  // QR Timer countdown
  useEffect(() => {
    let timer: any;
    if (isOpen && selectedMethod === 'upi' && upiSubTab === 'qr' && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown((c) => (c > 0 ? c - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, selectedMethod, upiSubTab, qrCountdown]);

  // Card detection
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    if (raw.startsWith('4')) setCardType('visa');
    else if (/^(5[1-5])/.test(raw)) setCardType('mastercard');
    else if (/^(60|65)/.test(raw)) setCardType('rupay');
    else if (/^(34|37)/.test(raw)) setCardType('amex');
    else setCardType('visa');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  if (!isOpen) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);

    if (selectedMethod === 'card') {
      setProcessStage('otp');
      setOtpTimer(45);
      return;
    }

    if (selectedMethod === 'upi') {
      setProcessStage('waiting_upi');
    } else if (selectedMethod === 'netbanking') {
      setProcessStage('redirecting_bank');
    } else {
      setProcessStage('authorizing');
    }

    // Complete transaction after simulation delay
    setTimeout(() => {
      completeTransaction();
    }, 2000);
  };

  const handleConfirmBankOtp = () => {
    setProcessStage('authorizing');
    setTimeout(() => {
      completeTransaction();
    }, 1500);
  };

  const completeTransaction = () => {
    setIsProcessing(false);
    setProcessStage('idle');

    if (simulateOutcome === 'failure') {
      if (onFailure) {
        const errCode =
          selectedMethod === 'card'
            ? 'BAD_REQUEST_AUTHENTICATION_FAILED'
            : selectedMethod === 'upi'
            ? 'UPI_COLLECT_REQUEST_EXPIRED'
            : 'BANK_GATEWAY_TIMEOUT';
        onFailure(failureReasonPreset, errCode);
      } else {
        alert(`Payment Failed: ${failureReasonPreset}`);
      }
      return;
    }

    // SUCCESS FLOW
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const generatedPaymentId = `pay_rzp_${randomSuffix}`;

    let subMethodString = 'Razorpay Instant';
    if (selectedMethod === 'upi') {
      const appName =
        selectedUpiApp === 'gpay'
          ? 'Google Pay'
          : selectedUpiApp === 'phonepe'
          ? 'PhonePe'
          : selectedUpiApp === 'paytm'
          ? 'Paytm UPI'
          : selectedUpiApp === 'cred'
          ? 'CRED UPI'
          : 'BHIM UPI';
      subMethodString = upiSubTab === 'qr' ? 'UPI Dynamic QR' : `UPI - ${appName} (${vpaId})`;
    } else if (selectedMethod === 'card') {
      const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '8921';
      subMethodString = `Card - ${cardType.toUpperCase()} (ending in ${last4})`;
    } else if (selectedMethod === 'netbanking') {
      subMethodString = `Net Banking - ${allBankSelect || selectedBank}`;
    } else if (selectedMethod === 'wallet') {
      subMethodString = `Wallet - ${
        selectedWallet === 'paytm'
          ? 'Paytm Wallet'
          : selectedWallet === 'phonepe'
          ? 'PhonePe Wallet'
          : selectedWallet === 'amazonpay'
          ? 'Amazon Pay'
          : 'MobiKwik'
      }`;
    }

    onSuccess(generatedPaymentId, selectedMethod, subMethodString);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="modal-razorpay-gateway"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Razorpay Authentic Branding Header */}
        <div className="bg-gradient-to-r from-[#0C2340] via-[#15345B] to-[#0C2340] text-white p-4 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-bold text-base font-serif text-blue-300">
              R
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs tracking-wide">Razorpay Trusted Gateway</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-gray-300">Sagunika Cosmetic Studio • Koregaon Park</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Order Total</span>
            <span className="text-base font-bold font-mono text-emerald-300">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Developer Sandbox Simulator Switcher */}
        <div className="bg-[#FAF8F9] px-4 py-2 border-b border-gray-200 flex items-center justify-between text-[11px]">
          <span className="text-gray-500 font-medium">Gateway Simulator:</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSimulateOutcome('success')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                simulateOutcome === 'success'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⚡ Simulate Success
            </button>
            <button
              type="button"
              onClick={() => setSimulateOutcome('failure')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                simulateOutcome === 'failure'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ❌ Simulate Failure
            </button>
          </div>
        </div>

        {simulateOutcome === 'failure' && (
          <div className="bg-rose-50 px-4 py-2 border-b border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <span className="text-[10px] font-bold">Failure Reason:</span>
            <select
              value={failureReasonPreset}
              onChange={(e) => setFailureReasonPreset(e.target.value)}
              className="text-[10px] bg-white border border-rose-300 rounded px-1.5 py-0.5 max-w-[240px] text-gray-800"
            >
              <option value="Transaction declined by issuer bank - 3D Secure authentication failed">
                3D Secure OTP Failed
              </option>
              <option value="Insufficient funds in customer bank account">
                Insufficient Funds
              </option>
              <option value="Bank network gateway timeout during processing">
                Bank Server Timeout
              </option>
              <option value="UPI collect request expired after 5 minutes">
                UPI Collect Expired
              </option>
            </select>
          </div>
        )}

        {/* 3D SECURE OTP SIMULATOR MODAL OVERLAY */}
        {processStage === 'otp' && (
          <div className="p-6 bg-white flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-gray-900">Verified by Visa / 3D Secure</h3>
              <p className="text-xs text-gray-500">
                A one-time password has been sent to your registered mobile ending in <strong>4321</strong>.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={bankOtp}
                onChange={(e) => setBankOtp(e.target.value)}
                className="w-full text-center text-lg tracking-widest font-mono py-2.5 border-2 border-blue-500 rounded-xl focus:outline-hidden"
              />

              <button
                type="button"
                onClick={() => setBankOtp('849201')}
                className="text-[11px] text-blue-600 hover:underline font-semibold block mx-auto"
              >
                ⚡ Click to Auto-fill Demo OTP: 849201
              </button>

              <button
                type="button"
                onClick={handleConfirmBankOtp}
                className="w-full py-3 bg-[#0C2340] hover:bg-[#15345B] text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Authorize Payment of ₹{amount.toLocaleString('en-IN')}
              </button>

              <button
                type="button"
                onClick={() => setProcessStage('idle')}
                className="text-[11px] text-gray-400 hover:text-gray-600"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        )}

        {/* WAITING FOR UPI / BANK REDIRECT SIMULATION OVERLAY */}
        {(processStage === 'waiting_upi' || processStage === 'redirecting_bank' || processStage === 'authorizing') && (
          <div className="p-8 bg-white flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <RefreshCw className="w-7 h-7 animate-spin text-[#0C2340]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-gray-900">
                {processStage === 'waiting_upi'
                  ? 'Approve Request on UPI App'
                  : processStage === 'redirecting_bank'
                  ? 'Connecting to Bank Gateway'
                  : 'Authorizing with Razorpay...'}
              </h3>
              <p className="text-xs text-gray-500 max-w-xs">
                {processStage === 'waiting_upi'
                  ? 'Please open Google Pay / PhonePe / Paytm and authorize the collect request of ₹' +
                    amount.toLocaleString('en-IN') +
                    '.'
                  : 'Please do not refresh the page or press the back button.'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-600">
              Order: #{orderNumber} • Amount: ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
        )}

        {/* MAIN PAYMENT SELECTION (WHEN IDLE) */}
        {processStage === 'idle' && (
          <div className="flex-1 overflow-y-auto">
            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50/70 p-1 gap-1">
              {[
                { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                { id: 'wallet', label: 'Wallets', icon: Wallet },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-razorpay-${tab.id}`}
                    type="button"
                    onClick={() => setSelectedMethod(tab.id as any)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                      active
                        ? 'bg-white text-[#0C2340] shadow-xs border border-gray-200'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 space-y-4">
              {/* ==================================================== */}
              {/* 1. UPI TAB */}
              {/* ==================================================== */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  {/* UPI Submode: Apps vs QR vs VPA */}
                  <div className="flex rounded-xl bg-gray-100 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('apps')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        upiSubTab === 'apps' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'
                      }`}
                    >
                      UPI Apps
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('qr')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        upiSubTab === 'qr' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'
                      }`}
                    >
                      Scan QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('vpa')}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        upiSubTab === 'vpa' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'
                      }`}
                    >
                      Enter UPI ID
                    </button>
                  </div>

                  {/* Mode 1: Popular UPI Apps */}
                  {upiSubTab === 'apps' && (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        Select Preferred UPI App
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'gpay', name: 'Google Pay', handle: '@okaxis' },
                          { id: 'phonepe', name: 'PhonePe', handle: '@ybl' },
                          { id: 'paytm', name: 'Paytm UPI', handle: '@paytm' },
                          { id: 'cred', name: 'CRED UPI', handle: '@cred' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setSelectedUpiApp(app.id as any);
                              setVpaId(
                                `${customerPhone?.replace(/[^0-9]/g, '') || '9876543210'}${app.handle}`
                              );
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              selectedUpiApp === app.id
                                ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-gray-900 block">{app.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{app.handle}</span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selectedUpiApp === app.id
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedUpiApp === app.id && <span className="text-[10px]">✓</span>}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                        <span className="text-[10px] text-gray-400 block font-medium">Mapped VPA</span>
                        <span className="font-mono font-bold text-gray-800">{vpaId}</span>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Dynamic QR Code */}
                  {upiSubTab === 'qr' && (
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm relative">
                        {/* Realistic SVG UPI QR Mock */}
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner squares */}
                          <rect x="10" y="10" width="25" height="25" stroke="#0C2340" strokeWidth="4" fill="none" />
                          <rect x="17" y="17" width="11" height="11" fill="#0C2340" />
                          <rect x="65" y="10" width="25" height="25" stroke="#0C2340" strokeWidth="4" fill="none" />
                          <rect x="72" y="17" width="11" height="11" fill="#0C2340" />
                          <rect x="10" y="65" width="25" height="25" stroke="#0C2340" strokeWidth="4" fill="none" />
                          <rect x="17" y="72" width="11" height="11" fill="#0C2340" />
                          {/* Inner pixels */}
                          <rect x="42" y="12" width="6" height="6" fill="#0C2340" />
                          <rect x="52" y="20" width="6" height="6" fill="#0C2340" />
                          <rect x="42" y="32" width="8" height="6" fill="#0C2340" />
                          <rect x="12" y="42" width="6" height="8" fill="#0C2340" />
                          <rect x="24" y="48" width="8" height="8" fill="#0C2340" />
                          <rect x="48" y="48" width="10" height="10" fill="#0C2340" />
                          <rect x="68" y="42" width="8" height="6" fill="#0C2340" />
                          <rect x="80" y="52" width="8" height="8" fill="#0C2340" />
                          <rect x="42" y="68" width="6" height="10" fill="#0C2340" />
                          <rect x="55" y="78" width="8" height="8" fill="#0C2340" />
                          <rect x="75" y="72" width="10" height="8" fill="#0C2340" />
                          {/* Center badge */}
                          <rect x="44" y="44" width="12" height="12" fill="#B76E79" rx="2" />
                        </svg>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-800 block">
                          Scan with any UPI App (GPay, PhonePe, Paytm)
                        </span>
                        <div className="flex items-center justify-center space-x-1 text-[11px] text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>QR Expires in: {formatSeconds(qrCountdown)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 3: Manual UPI ID */}
                  {upiSubTab === 'vpa' && (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-700 block">
                        Enter UPI ID / VPA
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or name@okhdfcbank"
                          value={vpaId}
                          onChange={(e) => setVpaId(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl font-mono focus:ring-1 focus:ring-blue-600 outline-hidden"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] text-emerald-600 font-bold">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        A collect request will be sent to your UPI application.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* 2. CARD TAB */}
              {/* ==================================================== */}
              {selectedMethod === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-700">Card Number</label>
                      <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                        {cardType} Card
                      </span>
                    </div>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl font-mono focus:ring-1 focus:ring-blue-600 outline-hidden tracking-wider"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Cardholder Name"
                      className="w-full px-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-600 outline-hidden uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl font-mono focus:ring-1 focus:ring-blue-600 outline-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-gray-700">CVV</label>
                        <span className="text-[9px] text-gray-400">3 or 4 digits</span>
                      </div>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl font-mono focus:ring-1 focus:ring-blue-600 outline-hidden tracking-widest"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 pt-1 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                    <span className="text-[11px]">Save card securely as per RBI guidelines</span>
                  </label>
                </div>
              )}

              {/* ==================================================== */}
              {/* 3. NET BANKING TAB */}
              {/* ==================================================== */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-3 text-xs">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    Popular Indian Banks
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'HDFC Bank',
                      'ICICI Bank',
                      'State Bank of India',
                      'Axis Bank',
                      'Kotak Mahindra Bank',
                      'Punjab National Bank',
                    ].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => {
                          setSelectedBank(bank);
                          setAllBankSelect('');
                        }}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all text-xs flex items-center justify-between ${
                          selectedBank === bank && !allBankSelect
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-blue-900 font-bold'
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="truncate">{bank}</span>
                        {selectedBank === bank && !allBankSelect && (
                          <span className="text-blue-600 font-bold ml-1">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Or Select from All Banks
                    </label>
                    <select
                      value={allBankSelect}
                      onChange={(e) => {
                        setAllBankSelect(e.target.value);
                        if (e.target.value) setSelectedBank(e.target.value);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-800"
                    >
                      <option value="">-- Choose Other Bank --</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                      <option value="YES Bank">YES Bank</option>
                      <option value="IDFC First Bank">IDFC First Bank</option>
                      <option value="Federal Bank">Federal Bank</option>
                      <option value="Standard Chartered">Standard Chartered</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* 4. WALLET TAB */}
              {/* ==================================================== */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-3 text-xs">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    Supported Digital Wallets
                  </span>

                  <div className="space-y-2">
                    {[
                      { id: 'paytm', name: 'Paytm Wallet', balance: '₹4,850' },
                      { id: 'phonepe', name: 'PhonePe Wallet', balance: '₹12,400' },
                      { id: 'amazonpay', name: 'Amazon Pay Balance', balance: '₹6,150' },
                      { id: 'mobikwik', name: 'MobiKwik', balance: '₹1,200' },
                    ].map((w) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          selectedWallet === w.id
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Wallet className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-bold text-xs text-gray-900 block">{w.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">Linked Balance: {w.balance}</span>
                          </div>
                        </div>

                        <input
                          type="radio"
                          name="wallet"
                          checked={selectedWallet === w.id}
                          onChange={() => setSelectedWallet(w.id as any)}
                          className="accent-blue-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  id="btn-razorpay-submit-pay"
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0C2340] to-[#1E3A8A] text-white font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center space-x-2 disabled:opacity-75 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pay ₹{amount.toLocaleString('en-IN')} via Razorpay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 flex-shrink-0">
          <span>Sagunika Studio × Razorpay Verified</span>
          <span>Secured by 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
};
