export type ScreenName = 
  | 'splash'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'otp'
  | 'home'
  | 'categories'
  | 'groom'
  | 'wedding'
  | 'product_details'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'profile'
  | 'admin_panel'
  | 'payment_history'
  | 'payment_status';

export type UserRole = 'customer' | 'admin';

// ==========================================
// 13 CLOUD FIRESTORE COLLECTIONS SCHEMAS
// ==========================================

// 1. admins
export interface AdminRecord {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager';
  phone: string;
  permissions: string[];
  createdAt: string;
}

// 2. store (Store Settings)
export interface StoreSettings {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  latitude: number;
  longitude: number;
  deliveryRadiusKm: number; // default 10 KM
  freeDeliveryThreshold: number; // e.g. 999
  standardDeliveryFee: number; // e.g. 99
  expressDeliveryFee: number; // e.g. 149
  storePickupEnabled: boolean;
  openingHours: string;
  razorpayKeyId: string;
  upiId: string;
  isStoreOpen: boolean;
  gstNumber?: string;
  pickupInstructions?: string;
}

// 3. products
export type CategoryType = 
  | 'wedding'
  | 'groom'
  | 'skincare'
  | 'makeup'
  | 'fragrance'
  | 'haircare'
  | 'ayurvedic';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'bestseller'
  | 'newest';

export type PriceRangeOption =
  | 'all'
  | 'under-1500'
  | '1500-3000'
  | '3000-5000'
  | 'above-5000';

export type OccasionOption =
  | 'all'
  | 'wedding'
  | 'reception'
  | 'sangeet'
  | 'haldi'
  | 'festive'
  | 'daily';

export interface Product {
  id: string;
  name: string;
  brand: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  category: CategoryType;
  collection?: 'wedding' | 'groom' | 'general';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images: string[];
  description: string;
  keyIngredients: string[];
  howToUse: string;
  shadesOrSizes: string[];
  stockQuantity: number;
  tags: string[];
  occasions?: string[];
  createdAt?: string;
}

// 4. categories
export interface CategoryRecord {
  id: string;
  name: string;
  slug: CategoryType;
  description: string;
  image: string;
  itemCount: number;
  badge?: string;
}

// 5. customers
export interface CustomerRecord {
  uid: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  fcmToken?: string;
  savedAddresses: Address[];
  rewardPoints: number;
  emailVerified?: boolean;
  createdAt: string;
}

export interface User extends CustomerRecord {}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  isDefault: boolean;
}

// 6. cart
export interface CartItem {
  product: Product;
  quantity: number;
  selectedShadeOrSize?: string;
}

export interface FirestoreCart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: string;
}

// 7. wishlist
export interface FirestoreWishlist {
  id: string;
  customerId: string;
  productIds: string[];
  updatedAt: string;
}

// 8. orders
export type OrderStatus = 
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export interface OrderTrackingStep {
  title: string;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export interface RefundDetails {
  refundId: string;
  amount: number;
  status: 'initiated' | 'processing' | 'completed' | 'failed';
  reason: string;
  initiatedAt: string;
  completedAt?: string;
  bankReferenceNumber?: string; // UTR or ARN
  paymentMethod: string;
  destinationAccount?: string;
}

export interface ReturnDetails {
  returnId: string;
  reason: string;
  detailedNotes?: string;
  status: 'requested' | 'approved' | 'pickup_scheduled' | 'picked_up' | 'inspected' | 'refund_approved';
  requestedAt: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  photos?: string[];
  trackingNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  shippingAddress: Address;
  distanceKm?: number;
  pickupSlot?: {
    date: string;
    time: string;
  };
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  estimatedDelivery: string;
  deliveryDate?: string;
  trackingSteps: OrderTrackingStep[];
  cancelReason?: string;
  cancelledAt?: string;
  refundDetails?: RefundDetails;
  returnDetails?: ReturnDetails;
  notificationsEnabled?: boolean;
}

// 9. payments
export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  paymentSubMethod?: string; // e.g. "Google Pay (9876543210@okaxis)", "HDFC Visa ending 4821", "ICICI Netbanking", "Paytm Wallet"
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  errorCode?: string;
  bankReferenceNumber?: string;
  invoiceNumber?: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  timestamp: string;
}

// 10. reviews
export interface ReviewRecord {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

// 11. coupons
export interface CouponRecord {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  maxDiscount: number;
  description: string;
  active: boolean;
  validUntil: string;
}

// 12. notifications
export interface FCMNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promotion' | 'system';
  targetScreen?: ScreenName;
  targetProductId?: string;
  customerId?: string;
}

// 13. banners
export interface BannerRecord {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag: string;
  actionScreen: ScreenName;
  active: boolean;
}
