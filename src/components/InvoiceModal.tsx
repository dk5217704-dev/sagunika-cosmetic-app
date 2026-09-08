import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { generateInvoiceData } from '../utils/invoiceUtils';

interface InvoiceModalProps {
  isOpen: boolean;
  order: Order | null;
  storeSettings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  order,
  storeSettings,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const invoice = generateInvoiceData(order, storeSettings);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCopy = () => {
    const textContent = `
============================================================
              SAGUNIKA COSMETIC STUDIO
                 TAX INVOICE / BILL OF SALE
============================================================
Invoice Number: ${invoice.invoiceNumber}
Date: ${invoice.invoiceDate}
Order ID: #${invoice.orderNumber}
GSTIN: ${invoice.seller.gstin}
State Code: ${invoice.seller.stateCode} (Maharashtra)

BILLED & SHIPPED TO:
Customer: ${invoice.buyer.name}
Phone: ${invoice.buyer.phone}
Address: ${invoice.buyer.address}, ${invoice.buyer.city}, ${invoice.buyer.state} - ${invoice.buyer.pincode}

ITEMS PURCHASED:
${invoice.items
  .map(
    (i) =>
      `[${i.slNo}] ${i.name} (HSN: ${i.hsnCode}) x ${i.quantity} @ Rs.${i.unitPrice} = Rs.${i.total}`
  )
  .join('\n')}

Subtotal: Rs.${invoice.subtotal.toLocaleString('en-IN')}
Coupon Discount: Rs.${invoice.couponDiscount.toLocaleString('en-IN')}
Delivery Fee: Rs.${invoice.deliveryFee.toLocaleString('en-IN')}
Taxable Value: Rs.${invoice.totalTaxable.toLocaleString('en-IN')}
CGST (9%): Rs.${invoice.totalCGST.toLocaleString('en-IN')}
SGST (9%): Rs.${invoice.totalSGST.toLocaleString('en-IN')}
------------------------------------------------------------
GRAND TOTAL: Rs.${invoice.grandTotal.toLocaleString('en-IN')}
Amount in Words: ${invoice.totalInWords}

PAYMENT DETAILS:
Status: ${invoice.paymentStatus.toUpperCase()}
Gateway: Razorpay Verified
Payment ID: ${invoice.razorpayPaymentId}
Mode: ${invoice.paymentMethod.toUpperCase()}

Registered Studio:
${invoice.seller.name}
${invoice.seller.address}, ${invoice.seller.city}, ${invoice.seller.state} - ${invoice.seller.pincode}
Email: ${invoice.seller.email} | Contact: ${invoice.seller.phone}
============================================================
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice ${invoice.invoiceNumber} - Sagunika Cosmetic`,
          text: `Tax Invoice ${invoice.invoiceNumber} for Order #${invoice.orderNumber} from Sagunika Cosmetic Studio.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Sagunika Cosmetic Tax Invoice: ${invoice.invoiceNumber} | Order #${invoice.orderNumber} | Total: ₹${invoice.grandTotal}`
      );
      alert('Invoice reference copied to clipboard!');
    }
  };

  return (
    <div
      id="modal-tax-invoice"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8D5C4] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Toolbar (Non-printable) */}
        <div className="bg-gradient-to-r from-[#4A154B] via-[#5C1B5E] to-[#4A154B] text-white px-5 py-3 flex items-center justify-between shadow-xs flex-shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#E8B4B8]" />
            <div>
              <h3 className="font-serif text-sm font-bold tracking-wide">GST Tax Invoice</h3>
              <p className="text-[10px] text-[#FAF0F3] font-mono">#{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-print-invoice"
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              id="btn-download-invoice"
              type="button"
              onClick={handleDownloadCopy}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Download Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-close-invoice"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-800 bg-white">
          {/* Top Brand Header */}
          <div className="border-b-2 border-[#E8D5C4] pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-bold tracking-wider text-[#4A154B]">
                  SAGUNIKA
                </span>
                <span className="text-[10px] uppercase font-bold text-[#B76E79] bg-[#FAF0F3] px-2 py-0.5 rounded-md border border-[#E8B4B8]/50">
                  Luxury Cosmetics
                </span>
              </div>
              <p className="text-xs text-gray-500 font-serif italic mt-0.5">
                Beauty That Inspires Confidence
              </p>
              <div className="mt-2 text-[11px] text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-800">{invoice.seller.name}</p>
                <p>{invoice.seller.address}</p>
                <p>
                  {invoice.seller.city}, {invoice.seller.state} – {invoice.seller.pincode}
                </p>
                <p>
                  GSTIN: <span className="font-mono font-bold text-gray-900">{invoice.seller.gstin}</span> • State Code: {invoice.seller.stateCode}
                </p>
                <p>Email: {invoice.seller.email} • Ph: {invoice.seller.phone}</p>
              </div>
            </div>

            <div className="sm:text-right bg-[#FAF8F9] p-3.5 rounded-xl border border-[#E8D5C4]/70 sm:min-w-[210px]">
              <span className="text-[10px] font-bold tracking-widest text-[#B76E79] uppercase block">
                Original For Recipient
              </span>
              <h2 className="font-serif text-lg font-bold text-[#4A154B] mt-0.5">TAX INVOICE</h2>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between sm:justify-end gap-3 text-gray-600">
                  <span>Invoice No:</span>
                  <span className="font-mono font-bold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-gray-600">
                  <span>Invoice Date:</span>
                  <span className="font-medium text-gray-900">{invoice.invoiceDate}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-gray-600">
                  <span>Order Ref:</span>
                  <span className="font-mono font-bold text-[#4A154B]">#{invoice.orderNumber}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-gray-600">
                  <span>Place of Supply:</span>
                  <span className="font-medium text-gray-900">Maharashtra (27)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200">
              <span className="text-[10px] font-bold text-[#B76E79] uppercase tracking-wider block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-gray-900 text-sm">{invoice.buyer.name}</p>
              <p className="text-gray-600 mt-0.5">{invoice.buyer.address}</p>
              <p className="text-gray-600">
                {invoice.buyer.city}, {invoice.buyer.state} – {invoice.buyer.pincode}
              </p>
              <p className="text-gray-600 mt-1">Phone: {invoice.buyer.phone}</p>
              <p className="text-gray-500 text-[11px]">State: Maharashtra (Code: 27)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200">
              <span className="text-[10px] font-bold text-[#4A154B] uppercase tracking-wider block mb-1">
                Dispatch & Payment Verification
              </span>
              <div className="space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Gateway:</span>
                  <span className="font-semibold text-blue-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Razorpay Secure
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID:</span>
                  <span className="font-mono font-bold text-gray-900 text-[11px]">
                    {invoice.razorpayPaymentId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-semibold capitalize text-gray-900">
                    {invoice.paymentMethod === 'cod' ? 'Cash on Delivery' : invoice.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    {invoice.paymentStatus === 'paid' ? 'PAID / SETTLED' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#4A154B] text-white font-serif text-[11px]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-2 text-center">HSN</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Taxable Val</th>
                    <th className="py-2.5 px-2 text-right">CGST (9%)</th>
                    <th className="py-2.5 px-2 text-right">SGST (9%)</th>
                    <th className="py-2.5 px-3 text-right font-bold">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {invoice.items.map((item) => (
                    <tr key={item.slNo} className="hover:bg-gray-50/60">
                      <td className="py-2.5 px-3 font-medium text-gray-400">{item.slNo}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        <span>{item.name}</span>
                        {item.shadeOrSize && (
                          <span className="block text-[10px] text-gray-500 font-sans">
                            Variant: {item.shadeOrSize}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px] text-gray-500">
                        {item.hsnCode}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-gray-800">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        ₹{item.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-gray-500">
                        ₹{item.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-gray-500">
                        ₹{item.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Summary & Grand Total Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
            <div className="p-3.5 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/40 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B] block">
                Amount in Words
              </span>
              <p className="font-serif italic text-gray-800 font-medium leading-relaxed">
                {invoice.totalInWords}
              </p>

              <div className="pt-2 border-t border-[#E8B4B8]/30 flex items-center space-x-2 text-[11px] text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Authentic Luxury Formulation Guarantee. Includes 18% GST.</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium text-gray-900">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {invoice.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount Applied:</span>
                  <span className="font-medium">-₹{invoice.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Net Taxable Value:</span>
                <span className="font-mono text-gray-900">₹{invoice.totalTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono">₹{invoice.totalCGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono">₹{invoice.totalSGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping & Handcrafted Handling:</span>
                <span className="font-medium text-gray-900">
                  {invoice.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${invoice.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t-2 border-gray-300 text-sm font-bold text-[#4A154B]">
                <span>Total Amount Payable:</span>
                <span className="text-base font-extrabold font-mono">
                  ₹{invoice.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Razorpay Digital Seal & Signatory */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Razorpay Digital Stamp */}
            <div className="p-3 rounded-xl border-2 border-dashed border-emerald-600/70 bg-emerald-50/50 flex items-center space-x-3 text-left w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="font-bold text-emerald-800 uppercase text-[11px] tracking-wider">
                  PAID • RAZORPAY VERIFIED
                </div>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Txn: {invoice.razorpayPaymentId}
                </div>
                <div className="text-[9px] text-gray-500">Authorized Merchant: Sagunika Cosmetics</div>
              </div>
            </div>

            {/* Authorized Signatory */}
            <div className="text-center sm:text-right">
              <div className="font-serif italic font-bold text-base text-[#4A154B] tracking-wide">
                Devkaran Sharma
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Authorized Signatory • Sagunika Studio
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">
                This is a digitally generated tax invoice requiring no physical seal.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 flex-shrink-0 print:hidden">
          <span>Need help? Contact concierge@sagunika.com</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
