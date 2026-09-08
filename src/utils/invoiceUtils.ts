/**
 * Invoice & Tax Calculation Utilities for Sagunika Cosmetic
 * Conforms to Indian GST regulations (HSN 3304 for Skincare/Cosmetics, 3307 for Fragrance)
 */

import { Order, CartItem, StoreSettings } from '../types';

export function numberToIndianWords(num: number): string {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero Rupees Only';

  const n = Math.floor(num);

  function convertGroup(n: number): string {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  }

  let crore = Math.floor(n / 10000000);
  let lakh = Math.floor((n % 10000000) / 100000);
  let thousand = Math.floor((n % 100000) / 1000);
  let remainder = n % 1000;

  let res = '';
  if (crore > 0) res += convertGroup(crore) + ' Crore ';
  if (lakh > 0) res += convertGroup(lakh) + ' Lakh ';
  if (thousand > 0) res += convertGroup(thousand) + ' Thousand ';
  if (remainder > 0) res += convertGroup(remainder);

  return (res.trim() + ' Rupees Only').replace(/\s+/g, ' ');
}

export interface InvoiceItem {
  slNo: number;
  name: string;
  subtitle: string;
  shadeOrSize?: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  total: number;
}

export interface TaxInvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  seller: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    pan: string;
    stateCode: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    stateCode: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  couponDiscount: number;
  deliveryFee: number;
  totalTaxable: number;
  totalCGST: number;
  totalSGST: number;
  grandTotal: number;
  totalInWords: string;
}

export function generateInvoiceData(order: Order, storeSettings: StoreSettings): TaxInvoiceData {
  const sellerStateCode = '27'; // Maharashtra
  const buyerStateCode = order.shippingAddress?.state?.toLowerCase().includes('maharashtra') ? '27' : '27';

  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;

  const items: InvoiceItem[] = order.items.map((item, index) => {
    // HSN 3304 for Cosmetics/Skincare, HSN 3307 for Fragrance/Attar
    const hsnCode = item.product.category === 'fragrance' ? '33074900' : '33049990';
    const itemTotalGross = item.product.price * item.quantity;
    
    // Reverse-calculate 18% GST (9% CGST + 9% SGST) from inclusive price
    const taxableValue = Math.round((itemTotalGross / 1.18) * 100) / 100;
    const gstAmount = itemTotalGross - taxableValue;
    const cgstAmount = Math.round((gstAmount / 2) * 100) / 100;
    const sgstAmount = Math.round((gstAmount / 2) * 100) / 100;

    totalTaxable += taxableValue;
    totalCGST += cgstAmount;
    totalSGST += sgstAmount;

    return {
      slNo: index + 1,
      name: item.product.name,
      subtitle: item.product.subtitle,
      shadeOrSize: item.selectedShadeOrSize,
      hsnCode,
      quantity: item.quantity,
      unitPrice: Math.round((item.product.price / 1.18) * 100) / 100,
      discount: (item.product.originalPrice || item.product.price) - item.product.price,
      taxableValue,
      cgstRate: 9,
      cgstAmount,
      sgstRate: 9,
      sgstAmount,
      total: itemTotalGross,
    };
  });

  const grandTotal = order.total;

  return {
    invoiceNumber: `SG-INV-${order.orderNumber.replace(/[^0-9]/g, '') || '202601'}`,
    invoiceDate: order.createdAt.includes('Just') ? new Date().toLocaleDateString('en-IN') : order.createdAt,
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    razorpayPaymentId: order.razorpayPaymentId || `pay_sg_${order.orderNumber}`,
    seller: {
      name: storeSettings.name,
      address: storeSettings.address,
      city: storeSettings.city,
      state: storeSettings.state,
      pincode: storeSettings.pincode,
      gstin: storeSettings.gstNumber || '27AABCU9603R1ZM',
      pan: 'AABCU9603R',
      stateCode: sellerStateCode,
      email: storeSettings.email,
      phone: storeSettings.phone,
    },
    buyer: {
      name: order.shippingAddress?.fullName || 'Valued Patron',
      phone: order.shippingAddress?.phone || '+91 98765 43210',
      address: order.shippingAddress?.street || 'Lane 7, Koregaon Park',
      city: order.shippingAddress?.city || 'Pune',
      state: order.shippingAddress?.state || 'Maharashtra',
      pincode: order.shippingAddress?.pincode || '411001',
      stateCode: buyerStateCode,
    },
    items,
    subtotal: order.subtotal,
    couponDiscount: order.discount,
    deliveryFee: order.deliveryFee,
    totalTaxable: Math.round(totalTaxable * 100) / 100,
    totalCGST: Math.round(totalCGST * 100) / 100,
    totalSGST: Math.round(totalSGST * 100) / 100,
    grandTotal,
    totalInWords: numberToIndianWords(grandTotal),
  };
}
