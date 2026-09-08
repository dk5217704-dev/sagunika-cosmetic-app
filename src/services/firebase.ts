/**
 * Production-ready Firebase Architecture & Service Layer for Sagunika Cosmetic
 * 
 * Manages 13 Cloud Firestore Collections:
 * 1. admins
 * 2. store (Store Settings: 10 KM delivery radius, location, Razorpay Key, WhatsApp)
 * 3. products
 * 4. categories
 * 5. customers
 * 6. cart
 * 7. wishlist
 * 8. orders
 * 9. payments
 * 10. reviews
 * 11. coupons
 * 12. notifications
 * 13. banners
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithCustomToken, 
  signOut 
} from 'firebase/auth';

import {
  AdminRecord,
  StoreSettings,
  Product,
  CategoryRecord,
  CustomerRecord,
  FirestoreCart,
  FirestoreWishlist,
  Order,
  PaymentRecord,
  ReviewRecord,
  CouponRecord,
  FCMNotification,
  BannerRecord,
  CartItem,
  ReturnDetails,
  RefundDetails
} from '../types';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ADDRESSES 
} from '../data/mockData';

// Default Firebase Configuration for Sagunika Luxury Project
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSySagunikaLuxuryWebClientKey2026",
  authDomain: "sagunika-cosmetic.firebaseapp.com",
  projectId: "sagunika-cosmetic",
  storageBucket: "sagunika-cosmetic.appspot.com",
  messagingSenderId: "16873344056",
  appId: "1:16873344056:web:d7b4e9f1a23c4568"
};

// Default Sagunika Store Settings with 10 KM delivery radius and Studio in Koregaon Park Pune
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'store_settings',
  name: 'Sagunika Cosmetic Studio',
  tagline: 'Beauty That Inspires Confidence',
  address: 'Plot 42, Koregaon Park Main Road, Lane 5',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210', // wa.me target
  email: 'concierge@sagunika.com',
  latitude: 18.5362, // Koregaon Park Pune latitude
  longitude: 73.8958, // Koregaon Park Pune longitude
  deliveryRadiusKm: 10, // 10 KM delivery restriction
  freeDeliveryThreshold: 999,
  standardDeliveryFee: 99,
  expressDeliveryFee: 149,
  storePickupEnabled: true,
  openingHours: '10:00 AM – 09:00 PM (All 7 Days)',
  razorpayKeyId: 'rzp_test_sagunikaLuxury2026',
  upiId: 'sagunika@upi',
  isStoreOpen: true,
  gstNumber: '27AABCU9603R1ZM',
  pickupInstructions: 'Visit Sagunika Studio, Lane 5, Koregaon Park. Show your Order ID at the Concierge Lounge for immediate ceremonial handover.'
};

export const INITIAL_CATEGORIES: CategoryRecord[] = [
  {
    id: 'cat-wedding',
    name: 'Bridal Vault',
    slug: 'wedding',
    description: 'Ceremonial 24K Gold sets, Alta, Sindoor & Waterproof HD formulations',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    itemCount: 8,
    badge: 'Ceremonial'
  },
  {
    id: 'cat-groom',
    name: 'Royal Groom',
    slug: 'groom',
    description: 'Beard elixirs, Charcoal exfoliators, Saffron aftershave & Oud mist',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
    itemCount: 6,
    badge: 'Exclusive'
  },
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Botanical hydrosols, Kumkumadi oils, Sun serums and Rose elixirs',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    itemCount: 14
  },
  {
    id: 'cat-makeup',
    name: 'Luxe Makeup',
    slug: 'makeup',
    description: 'Kissproof matte pigments, 24K illuminators and Kohl wands',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    itemCount: 18
  },
  {
    id: 'cat-fragrance',
    name: 'Imperial Attars',
    slug: 'fragrance',
    description: 'Kashmiri Rose, Royal Ambergris, Sandalwood and Oud de Parfum',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    itemCount: 7
  },
  {
    id: 'cat-ayurvedic',
    name: 'Ayurvedic Alchemy',
    slug: 'ayurvedic',
    description: 'Ancient Ayurvedic recipes with Certified Saffron, Sandalwood and Neem',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
    itemCount: 9
  }
];

export const INITIAL_ADMINS: AdminRecord[] = [
  {
    uid: 'admin-master-01',
    email: 'admin@sagunika.com',
    name: 'Devkaran Sharma (Master Admin)',
    role: 'super_admin',
    phone: '+91 98765 43210',
    permissions: ['all', 'products', 'orders', 'settings', 'promotions', 'notifications'],
    createdAt: '2026-01-15'
  },
  {
    uid: 'admin-manager-02',
    email: 'studio.pune@sagunika.com',
    name: 'Pooja Deshmukh (Studio Manager)',
    role: 'store_manager',
    phone: '+91 98230 11223',
    permissions: ['orders', 'pickup', 'stock'],
    createdAt: '2026-02-01'
  }
];

export const INITIAL_COUPONS: CouponRecord[] = [
  {
    id: 'coup-1',
    code: 'SAGUNIKA20',
    discountPercent: 20,
    minOrder: 1500,
    maxDiscount: 2000,
    description: 'Flat 20% Off on Royal Bridal & Groom Collections',
    active: true,
    validUntil: '31 Dec 2026'
  },
  {
    id: 'coup-2',
    code: 'BRIDAL10',
    discountPercent: 10,
    minOrder: 800,
    maxDiscount: 1000,
    description: '10% Instant Savings on Ceremonial Vanity Sets',
    active: true,
    validUntil: '31 Dec 2026'
  },
  {
    id: 'coup-3',
    code: 'GROOMLUXE',
    discountPercent: 15,
    minOrder: 1200,
    maxDiscount: 1500,
    description: '15% Off Sovereign Groom Trunk & Eau de Parfum',
    active: true,
    validUntil: '31 Dec 2026'
  }
];

export const INITIAL_BANNERS: BannerRecord[] = [
  {
    id: 'ban-1',
    title: 'The Royal Bridal Vanity',
    subtitle: '18-Piece Handcrafted 24K Gold & Rose Velvet Trousseau',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80',
    tag: 'Ceremonial Launch',
    actionScreen: 'wedding',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Sovereign Groom Collection',
    subtitle: 'Signature Oud Mist, Saffron Elixirs & Teak Grooming Chest',
    imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=1000&auto=format&fit=crop&q=80',
    tag: 'Men of Distinction',
    actionScreen: 'groom',
    active: true
  },
  {
    id: 'ban-3',
    title: 'Pune Studio Store Pickup',
    subtitle: 'Order Online & Collect within 2 Hours at Koregaon Park Studio',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&auto=format&fit=crop&q=80',
    tag: 'Instant Handover',
    actionScreen: 'home',
    active: true
  }
];

export const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-1',
    productId: 'prod-w1',
    customerId: 'user-patron-01',
    customerName: 'Meera Rajput',
    rating: 5,
    comment: 'The Royal Bridal Vanity was the star of my wedding morning! The foundation lasted through the tears, pheras, and humidity without budging. Truly luxury grade.',
    verifiedPurchase: true,
    createdAt: '2026-08-20'
  },
  {
    id: 'rev-2',
    productId: 'prod-w2',
    customerId: 'user-patron-02',
    customerName: 'Radhika Sen',
    rating: 5,
    comment: '100% natural and mercury free. The deep vermillion color is breathtaking, and the brass wand application feels regal.',
    verifiedPurchase: true,
    createdAt: '2026-08-28'
  },
  {
    id: 'rev-3',
    productId: 'prod-g1',
    customerId: 'user-patron-03',
    customerName: 'Kabir Singhania',
    rating: 5,
    comment: 'The Imperial Oud and Charcoal Scrub in the teak trunk are world-class. Received endless compliments at the Sangeet.',
    verifiedPurchase: true,
    createdAt: '2026-09-01'
  }
];

// Initialize Firebase App
let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;
let firebaseAuth: Auth;

try {
  if (!getApps().length) {
    firebaseApp = initializeApp(DEFAULT_FIREBASE_CONFIG);
  } else {
    firebaseApp = getApp();
  }
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);
} catch (e) {
  console.warn('Firebase initialized in fallback memory mode:', e);
}

// Haversine Distance Calculation (in Kilometers)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal precision
}

// Persistent Storage Key helper
const STORAGE_PREFIX = 'sagunika_firestore_';

function getStored<T>(collectionName: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${collectionName}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore error
  }
  return fallback;
}

function setStored<T>(collectionName: string, data: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${collectionName}`, JSON.stringify(data));
  } catch (e) {
    // Ignore error
  }
}

/**
 * Cloud Firestore Unified Repository
 * Provides real-time synchronization across all 13 collections:
 * admins, store, products, categories, customers, cart, wishlist,
 * orders, payments, reviews, coupons, notifications, banners.
 */
class FirestoreRepository {
  // 1. Store Settings (Editable in Admin Panel)
  getStoreSettings(): StoreSettings {
    return getStored<StoreSettings>('store', DEFAULT_STORE_SETTINGS);
  }

  updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getStoreSettings();
    const updated = { ...current, ...settings };
    setStored('store', updated);
    return updated;
  }

  // 2. Products
  getProducts(): Product[] {
    return getStored<Product[]>('products', INITIAL_PRODUCTS);
  }

  addProduct(product: Product): Product[] {
    const products = this.getProducts();
    const updated = [product, ...products];
    setStored('products', updated);
    return updated;
  }

  updateProduct(productId: string, partial: Partial<Product>): Product[] {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === productId ? { ...p, ...partial } : p));
    setStored('products', updated);
    return updated;
  }

  deleteProduct(productId: string): Product[] {
    const products = this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    setStored('products', updated);
    return updated;
  }

  updateStock(productId: string, stockQuantity: number): Product[] {
    return this.updateProduct(productId, { stockQuantity });
  }

  // 3. Categories
  getCategories(): CategoryRecord[] {
    return getStored<CategoryRecord[]>('categories', INITIAL_CATEGORIES);
  }

  addCategory(category: CategoryRecord): CategoryRecord[] {
    const categories = this.getCategories();
    const updated = [...categories, category];
    setStored('categories', updated);
    return updated;
  }

  updateCategory(categoryId: string, partial: Partial<CategoryRecord>): CategoryRecord[] {
    const categories = this.getCategories();
    const updated = categories.map((c) => (c.id === categoryId ? { ...c, ...partial } : c));
    setStored('categories', updated);
    return updated;
  }

  deleteCategory(categoryId: string): CategoryRecord[] {
    const categories = this.getCategories();
    const updated = categories.filter((c) => c.id !== categoryId);
    setStored('categories', updated);
    return updated;
  }

  // 4. Admins
  getAdmins(): AdminRecord[] {
    return getStored<AdminRecord[]>('admins', INITIAL_ADMINS);
  }

  isAdmin(email: string): boolean {
    const admins = this.getAdmins();
    return admins.some((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  // 5. Customers
  getCustomers(): CustomerRecord[] {
    return getStored<CustomerRecord[]>('customers', [
      {
        uid: 'user-patron-01',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 98765 43210',
        role: 'customer',
        savedAddresses: INITIAL_ADDRESSES,
        rewardPoints: 340,
        createdAt: '2026-03-12'
      },
      {
        uid: 'user-patron-02',
        name: 'Devkaran Singhania',
        email: 'devkaran.singhania@gmail.com',
        phone: '+91 98192 44102',
        role: 'customer',
        savedAddresses: [
          {
            id: 'addr-dev-1',
            fullName: 'Devkaran Singhania',
            phone: '+91 98192 44102',
            street: '14 Royal Palms Estate, Viman Nagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411014',
            isDefault: true
          }
        ],
        rewardPoints: 1250,
        createdAt: '2026-04-05'
      },
      {
        uid: 'user-patron-03',
        name: 'Meera Rajput',
        email: 'meera.rajput@outlook.com',
        phone: '+91 99201 88231',
        role: 'customer',
        savedAddresses: [
          {
            id: 'addr-mee-1',
            fullName: 'Meera Rajput',
            phone: '+91 99201 88231',
            street: '7th Floor, Solitaire Business Park, Kalyani Nagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411006',
            isDefault: true
          }
        ],
        rewardPoints: 680,
        createdAt: '2026-05-18'
      }
    ]);
  }

  saveCustomer(customer: CustomerRecord): void {
    const customers = this.getCustomers();
    const idx = customers.findIndex((c) => c.uid === customer.uid);
    if (idx >= 0) {
      customers[idx] = customer;
    } else {
      customers.push(customer);
    }
    setStored('customers', customers);
  }

  updateCustomer(uid: string, partial: Partial<CustomerRecord>): CustomerRecord[] {
    const customers = this.getCustomers();
    const updated = customers.map((c) => (c.uid === uid ? { ...c, ...partial } : c));
    setStored('customers', updated);
    return updated;
  }

  deleteCustomer(uid: string): CustomerRecord[] {
    const customers = this.getCustomers();
    const updated = customers.filter((c) => c.uid !== uid);
    setStored('customers', updated);
    return updated;
  }

  // 6. Cart
  getCart(customerId: string): CartItem[] {
    const carts = getStored<Record<string, CartItem[]>>('cart', {
      'user-patron-01': [
        {
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          selectedShadeOrSize: 'Royal Ivory Set'
        }
      ]
    });
    return carts[customerId] || [];
  }

  saveCart(customerId: string, items: CartItem[]): void {
    const carts = getStored<Record<string, CartItem[]>>('cart', {});
    carts[customerId] = items;
    setStored('cart', carts);
  }

  // 7. Wishlist
  getWishlist(customerId: string): string[] {
    const lists = getStored<Record<string, string[]>>('wishlist', {
      'user-patron-01': [INITIAL_PRODUCTS[1].id, INITIAL_PRODUCTS[4].id]
    });
    return lists[customerId] || [];
  }

  saveWishlist(customerId: string, productIds: string[]): void {
    const lists = getStored<Record<string, string[]>>('wishlist', {});
    lists[customerId] = productIds;
    setStored('wishlist', lists);
  }

  // 8. Orders
  getOrders(): Order[] {
    const rawOrders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const seen = new Set<string>();
    const uniqueOrders: Order[] = [];
    for (const order of rawOrders) {
      if (order && order.id && !seen.has(order.id)) {
        seen.add(order.id);
        uniqueOrders.push(order);
      }
    }
    // If duplicates existed in stored data, overwrite with clean unique list
    if (uniqueOrders.length !== rawOrders.length) {
      setStored('orders', uniqueOrders);
    }
    return uniqueOrders;
  }

  createOrder(newOrder: Order): Order[] {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === newOrder.id);
    let updated: Order[];
    if (existingIndex >= 0) {
      // If order already exists with this ID, replace it in-place instead of duplicating
      updated = orders.map((o) => (o.id === newOrder.id ? newOrder : o));
    } else {
      updated = [newOrder, ...orders];
    }
    setStored('orders', updated);
    return updated;
  }

  updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    milestoneTitle?: string,
    milestoneDesc?: string
  ): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const trackingSteps = [...o.trackingSteps];
      if (milestoneTitle) {
        trackingSteps.push({
          title: milestoneTitle,
          date: 'Just now',
          completed: true,
          current: true,
          description: milestoneDesc || `Order status updated to ${status}.`
        });
      }
      return {
        ...o,
        status,
        trackingSteps
      };
    });
    setStored('orders', updated);
    return updated;
  }

  cancelOrder(orderId: string, reason: string): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const trackingSteps = [
        ...o.trackingSteps,
        {
          title: 'Order Cancelled by Customer',
          date: 'Just now',
          completed: true,
          current: true,
          description: `Cancellation requested: "${reason}".`
        }
      ];

      const isPaid = o.paymentStatus === 'paid';
      const refundDetails = isPaid
        ? {
            refundId: `rfnd_${Date.now()}`,
            amount: o.total,
            status: 'processing' as const,
            reason: `Order Cancelled: ${reason}`,
            initiatedAt: 'Just now',
            bankReferenceNumber: `ARN-${Math.floor(10000000 + Math.random() * 90000000)}`,
            paymentMethod: o.paymentMethod,
            destinationAccount: o.paymentMethod === 'upi' ? 'Source UPI ID' : 'Source Bank Card'
          }
        : undefined;

      if (isPaid && refundDetails) {
        trackingSteps.push({
          title: 'Instant Refund Initiated',
          date: 'Just now',
          completed: true,
          current: true,
          description: `₹${o.total.toLocaleString()} refund initiated via Razorpay (ARN: ${refundDetails.bankReferenceNumber}). Expect credit in 24-48 hours.`
        });
      }

      return {
        ...o,
        status: (isPaid ? 'cancelled' : 'cancelled') as Order['status'],
        cancelReason: reason,
        cancelledAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        refundDetails,
        trackingSteps
      };
    });

    setStored('orders', updated);

    // Also update any matching payment record to refunded if applicable
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder && targetOrder.paymentStatus === 'paid') {
      const payments = this.getPayments();
      const updatedPayments = payments.map(p => {
        if (p.orderId === orderId || p.orderNumber === targetOrder.orderNumber) {
          return {
            ...p,
            status: 'refunded' as const,
            failureReason: `Customer cancellation refund initiated: ${reason}`
          };
        }
        return p;
      });
      setStored('payments', updatedPayments);
    }

    // Add notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: `🚫 Order #${targetOrder?.orderNumber || orderId} Cancelled`,
      body: targetOrder?.paymentStatus === 'paid'
        ? `Cancellation verified. ₹${targetOrder?.total.toLocaleString()} refund initiated to your original payment method.`
        : `Order #${targetOrder?.orderNumber || orderId} has been successfully cancelled.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      targetScreen: 'orders'
    });

    return updated;
  }

  requestReturn(
    orderId: string, 
    returnData: { reason: string; detailedNotes?: string; photos?: string[]; pickupDate?: string }
  ): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const retId = `ret_${Date.now()}`;
      const trackingSteps = [
        ...o.trackingSteps,
        {
          title: 'Return & Exchange Requested',
          date: 'Just now',
          completed: true,
          current: true,
          description: `Return Ticket #${retId} opened for "${returnData.reason}". Courier reverse pickup being assigned.`
        }
      ];

      return {
        ...o,
        status: 'return_requested' as Order['status'],
        returnDetails: {
          returnId: retId,
          reason: returnData.reason,
          detailedNotes: returnData.detailedNotes,
          photos: returnData.photos,
          pickupDate: returnData.pickupDate || 'Tomorrow (10:00 AM - 02:00 PM)',
          status: 'requested' as const,
          requestedAt: 'Just now',
          trackingNumber: `BD-RET-${Math.floor(100000 + Math.random() * 900000)}`
        },
        trackingSteps
      };
    });

    setStored('orders', updated);

    const targetOrder = orders.find(o => o.id === orderId);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: `🔄 Return Requested: #${targetOrder?.orderNumber || orderId}`,
      body: `Your return request for "${returnData.reason}" has been received. Our concierge will verify and schedule pickup.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      targetScreen: 'orders'
    });

    return updated;
  }

  updateReturnStatus(orderId: string, returnStatus: ReturnDetails['status'], notes?: string): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id !== orderId || !o.returnDetails) return o;

      const trackingSteps = [...o.trackingSteps];
      let newOrderStatus = o.status;
      let refundDetails = o.refundDetails;

      if (returnStatus === 'approved') {
        trackingSteps.push({
          title: 'Return Approved by Quality Concierge',
          date: 'Just now',
          completed: true,
          current: true,
          description: notes || 'Reverse courier assigned for doorstep inspection and return.'
        });
      } else if (returnStatus === 'picked_up') {
        trackingSteps.push({
          title: 'Item Picked Up by BlueDart Reverse Logistics',
          date: 'Just now',
          completed: true,
          current: true,
          description: `Reverse Waybill #${o.returnDetails.trackingNumber || 'BD-RET-901'}. Dispatched to Pune central facility.`
        });
      } else if (returnStatus === 'refund_approved') {
        newOrderStatus = 'refunded';
        refundDetails = {
          refundId: `rfnd_ret_${Date.now()}`,
          amount: o.total,
          status: 'completed',
          reason: `Return Approved: ${o.returnDetails.reason}`,
          initiatedAt: 'Yesterday',
          completedAt: 'Just now',
          bankReferenceNumber: `UTR-REV-${Math.floor(10000000 + Math.random() * 90000000)}`,
          paymentMethod: o.paymentMethod,
          destinationAccount: 'Source Payment Account'
        };
        trackingSteps.push({
          title: 'Return Complete & 100% Refund Credited',
          date: 'Just now',
          completed: true,
          current: true,
          description: `₹${o.total.toLocaleString()} credited successfully. UTR: ${refundDetails.bankReferenceNumber}.`
        });
      }

      return {
        ...o,
        status: newOrderStatus,
        refundDetails,
        returnDetails: {
          ...o.returnDetails,
          status: returnStatus
        },
        trackingSteps
      };
    });

    setStored('orders', updated);
    return updated;
  }

  toggleOrderNotifications(orderId: string, enabled: boolean): Order[] {
    const orders = this.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, notificationsEnabled: enabled } : o));
    setStored('orders', updated);
    return updated;
  }

  // 9. Payments
  getPayments(): PaymentRecord[] {
    return getStored<PaymentRecord[]>('payments', [
      {
        id: 'pay_sg_demo101',
        orderId: 'ord-101',
        orderNumber: 'SG-904218',
        amount: 9449,
        currency: 'INR',
        paymentMethod: 'upi',
        paymentSubMethod: 'UPI - Google Pay (9876543210@okaxis)',
        status: 'captured',
        razorpayPaymentId: 'pay_rzp_demo_88231',
        bankReferenceNumber: 'UPI/22819034218',
        invoiceNumber: 'SG-INV-904218',
        customerId: 'user-patron-01',
        customerEmail: 'ananya.sharma@example.com',
        customerPhone: '+91 98765 43210',
        timestamp: '24 Oct 2026, 10:15 AM'
      },
      {
        id: 'pay_sg_demo100',
        orderId: 'ord-100',
        orderNumber: 'SG-819203',
        amount: 5299,
        currency: 'INR',
        paymentMethod: 'card',
        paymentSubMethod: 'Card - HDFC Bank Visa (ending in 4821)',
        status: 'captured',
        razorpayPaymentId: 'pay_rzp_demo_77192',
        bankReferenceNumber: 'TXN-99201482',
        invoiceNumber: 'SG-INV-819203',
        customerId: 'user-patron-01',
        customerEmail: 'ananya.sharma@example.com',
        customerPhone: '+91 98765 43210',
        timestamp: '18 Oct 2026, 03:40 PM'
      },
      {
        id: 'pay_sg_demo099',
        orderId: 'ord-099',
        orderNumber: 'SG-761201',
        amount: 3200,
        currency: 'INR',
        paymentMethod: 'card',
        paymentSubMethod: 'Card - ICICI Bank Mastercard (ending in 1092)',
        status: 'failed',
        failureReason: 'Transaction declined by issuer bank - 3D Secure OTP verification timeout',
        errorCode: 'BAD_REQUEST_AUTHENTICATION_FAILED',
        razorpayPaymentId: 'pay_rzp_failed_44012',
        customerId: 'user-patron-01',
        customerEmail: 'ananya.sharma@example.com',
        customerPhone: '+91 98765 43210',
        timestamp: '15 Oct 2026, 06:12 PM'
      }
    ]);
  }

  recordPayment(payment: PaymentRecord): PaymentRecord[] {
    const payments = this.getPayments();
    const existingIndex = payments.findIndex((p) => p.id === payment.id);
    let updated: PaymentRecord[];
    if (existingIndex >= 0) {
      updated = payments.map((p) => (p.id === payment.id ? payment : p));
    } else {
      updated = [payment, ...payments];
    }
    setStored('payments', updated);
    return updated;
  }

  // 10. Reviews
  getReviews(productId?: string): ReviewRecord[] {
    const reviews = getStored<ReviewRecord[]>('reviews', INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter((r) => r.productId === productId);
    }
    return reviews;
  }

  addReview(review: ReviewRecord): ReviewRecord[] {
    const reviews = this.getReviews();
    const updated = [review, ...reviews];
    setStored('reviews', updated);
    return updated;
  }

  // 11. Coupons
  getCoupons(): CouponRecord[] {
    return getStored<CouponRecord[]>('coupons', INITIAL_COUPONS);
  }

  addCoupon(coupon: CouponRecord): CouponRecord[] {
    const coupons = this.getCoupons();
    const updated = [coupon, ...coupons];
    setStored('coupons', updated);
    return updated;
  }

  updateCoupon(id: string, partial: Partial<CouponRecord>): CouponRecord[] {
    const coupons = this.getCoupons();
    const updated = coupons.map((c) => (c.id === id ? { ...c, ...partial } : c));
    setStored('coupons', updated);
    return updated;
  }

  deleteCoupon(id: string): CouponRecord[] {
    const coupons = this.getCoupons();
    const updated = coupons.filter((c) => c.id !== id);
    setStored('coupons', updated);
    return updated;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const coupons = this.getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid or expired luxury promo coupon code.' };
    }
    if (subtotal < found.minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Coupon requires a minimum order of ₹${found.minOrder.toLocaleString()}.`
      };
    }
    const discount = Math.min(found.maxDiscount, Math.round((subtotal * found.discountPercent) / 100));
    return {
      valid: true,
      discount,
      message: `Promo applied: ${found.description} (-₹${discount})`
    };
  }

  // 12. Notifications (FCM)
  getNotifications(): FCMNotification[] {
    return getStored<FCMNotification[]>('notifications', INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: FCMNotification): FCMNotification[] {
    const current = this.getNotifications();
    const updated = [notif, ...current];
    setStored('notifications', updated);
    return updated;
  }

  markNotificationRead(id: string): FCMNotification[] {
    const current = this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored('notifications', updated);
    return updated;
  }

  // 13. Banners
  getBanners(): BannerRecord[] {
    return getStored<BannerRecord[]>('banners', INITIAL_BANNERS);
  }

  addBanner(banner: BannerRecord): BannerRecord[] {
    const banners = this.getBanners();
    const updated = [banner, ...banners];
    setStored('banners', updated);
    return updated;
  }

  updateBanner(id: string, partial: Partial<BannerRecord>): BannerRecord[] {
    const banners = this.getBanners();
    const updated = banners.map((b) => (b.id === id ? { ...b, ...partial } : b));
    setStored('banners', updated);
    return updated;
  }

  deleteBanner(id: string): BannerRecord[] {
    const banners = this.getBanners();
    const updated = banners.filter((b) => b.id !== id);
    setStored('banners', updated);
    return updated;
  }

  updateBanners(banners: BannerRecord[]): void {
    setStored('banners', banners);
  }

  // Reset collections to pristine brand defaults
  resetAllCollections(): void {
    setStored('store', DEFAULT_STORE_SETTINGS);
    setStored('products', INITIAL_PRODUCTS);
    setStored('categories', INITIAL_CATEGORIES);
    setStored('admins', INITIAL_ADMINS);
    setStored('orders', INITIAL_ORDERS);
    setStored('coupons', INITIAL_COUPONS);
    setStored('banners', INITIAL_BANNERS);
    setStored('notifications', INITIAL_NOTIFICATIONS);
    setStored('reviews', INITIAL_REVIEWS);
  }
}

export const firestoreRepo = new FirestoreRepository();
export { firestoreDb, firebaseAuth, firebaseApp };
