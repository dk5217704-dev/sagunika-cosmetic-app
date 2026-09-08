/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenName,
  Product,
  CartItem,
  Order,
  User,
  FCMNotification,
  PaymentRecord,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { BottomNavigation } from './components/BottomNavigation';
import { AndroidHeadsUpBanner } from './components/AndroidHeadsUpBanner';
import { AdminAddProductModal } from './components/AdminAddProductModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { FirebaseArchitectureModal } from './components/FirebaseArchitectureModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { InvoiceModal } from './components/InvoiceModal';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { OtpScreen } from './components/screens/OtpScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { GroomCollectionScreen } from './components/screens/GroomCollectionScreen';
import { WeddingCollectionScreen } from './components/screens/WeddingCollectionScreen';
import { ProductDetailsScreen } from './components/screens/ProductDetailsScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { CartScreen } from './components/screens/CartScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminPanelScreen } from './components/screens/AdminPanelScreen';
import { PaymentStatusScreen } from './components/screens/PaymentStatusScreen';
import { PaymentHistoryScreen } from './components/screens/PaymentHistoryScreen';
import { WhatsAppChatButton } from './components/WhatsAppChatButton';
import { firestoreRepo } from './services/firebase';
import { firebaseAuthService } from './services/firebaseAuth';
import { StoreSettings } from './types';

// Icons
import {
  Smartphone,
  Maximize2,
  Code2,
  Database,
  Layers,
  Sparkles,
  Shield,
  Bell,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenName>('splash');
  const [phoneForOtp, setPhoneForOtp] = useState('+91 98765 43210');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // User State: Defaults to Customer or authenticated session
  const [user, setUser] = useState<User>(() => firebaseAuthService.getCurrentUser());

  // Cloud Firestore Persistence State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => firestoreRepo.getStoreSettings());
  const [products, setProducts] = useState<Product[]>(() => firestoreRepo.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => firestoreRepo.getCart(user?.uid || 'user_guest_default'));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => firestoreRepo.getWishlist(user?.uid || 'user_guest_default'));
  const [orders, setOrders] = useState<Order[]>(() => firestoreRepo.getOrders());
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('SAGUNIKA20');

  // Sync cart & wishlist whenever active user changes
  useEffect(() => {
    if (user?.uid) {
      setCart(firestoreRepo.getCart(user.uid));
      setWishlistIds(firestoreRepo.getWishlist(user.uid));
    }
  }, [user?.uid]);

  // FCM Notifications
  const [notifications, setNotifications] = useState<FCMNotification[]>(INITIAL_NOTIFICATIONS);
  const [fcmEnabled, setFcmEnabled] = useState(true);
  const [activeHeadsUpNotification, setActiveHeadsUpNotification] = useState<FCMNotification | null>(null);

  // Modal & Inspector States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [paymentStatusOutcome, setPaymentStatusOutcome] = useState<{
    status: 'success' | 'failure';
    order: Order | null;
    paymentRecord: PaymentRecord | null;
  }>({
    status: 'success',
    order: null,
    paymentRecord: null,
  });

  // Device Display Mode: 'phone_frame' or 'responsive'
  const [viewMode, setViewMode] = useState<'phone_frame' | 'responsive'>('phone_frame');

  // ==========================
  // HANDLERS
  // ==========================

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('product_details');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      firestoreRepo.saveWishlist(user.uid, next);
      return next;
    });
  };

  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    selectedShade?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [
          ...prev,
          {
            product,
            quantity,
            selectedShadeOrSize: selectedShade || product.shadesOrSizes[0],
          },
        ];
      }
      firestoreRepo.saveCart(user.uid, next);
      return next;
    });
  };

  const handleBuyNow = (
    product: Product,
    quantity: number = 1,
    selectedShade?: string
  ) => {
    handleAddToCart(product, quantity, selectedShade);
    setActiveScreen('checkout');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      let next: CartItem[];
      if (quantity <= 0) {
        next = prev.filter((i) => i.product.id !== productId);
      } else {
        next = prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      }
      firestoreRepo.saveCart(user.uid, next);
      return next;
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      firestoreRepo.saveCart(user.uid, next);
      return next;
    });
  };

  const handleMoveToWishlist = (product: Product) => {
    // Remove from cart
    setCart((prev) => {
      const next = prev.filter((i) => i.product.id !== product.id);
      firestoreRepo.saveCart(user.uid, next);
      return next;
    });
    // Add to wishlist
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) return prev;
      const next = [...prev, product.id];
      firestoreRepo.saveWishlist(user.uid, next);
      return next;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    firestoreRepo.saveCart(user.uid, []);
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    firestoreRepo.saveWishlist(user.uid, []);
  };

  const handleAddAllWishlistToCart = () => {
    setCart((prev) => {
      const next = [...prev];
      wishlistProducts.forEach((product) => {
        const existingIdx = next.findIndex((item) => item.product.id === product.id);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + 1,
          };
        } else {
          next.push({
            product,
            quantity: 1,
            selectedShadeOrSize: product.shadesOrSizes[0],
          });
        }
      });
      firestoreRepo.saveCart(user.uid, next);
      return next;
    });
    setActiveScreen('cart');
  };

  const handleProceedToCheckout = (discount: number, coupon: string) => {
    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
    setActiveScreen('checkout');
  };

  const handleOpenInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const handlePlaceOrder = (newOrder: Order, paymentRecord?: PaymentRecord) => {
    const updatedOrders = firestoreRepo.createOrder(newOrder);
    setOrders(updatedOrders);
    setCart([]); // Clear cart
    firestoreRepo.saveCart(user.uid, []);

    if (paymentRecord) {
      setPaymentStatusOutcome({
        status: 'success',
        order: newOrder,
        paymentRecord,
      });
      setActiveScreen('payment_status');
    } else {
      setActiveScreen('orders');
    }

    // Trigger simulated FCM push notification
    if (fcmEnabled) {
      const orderPush: FCMNotification = {
        id: `notif-${Date.now()}`,
        title: `✨ Order Confirmed: #${newOrder.orderNumber}`,
        body: `Payment verified. Your parcel with ${newOrder.items.length} cosmetic item(s) is being handcrafted at Sagunika Studio.`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
        targetScreen: 'orders',
      };
      setNotifications((prev) => [orderPush, ...prev]);
      setActiveHeadsUpNotification(orderPush);
    }
  };

  const handlePaymentFailed = (pendingOrder: Order, paymentRecord: PaymentRecord) => {
    setPaymentStatusOutcome({
      status: 'failure',
      order: pendingOrder,
      paymentRecord,
    });
    setActiveScreen('payment_status');
  };

  const handleReorder = (order: Order) => {
    setCart((prev) => [...prev, ...order.items]);
    setActiveScreen('cart');
  };

  // Role Toggle (Customer vs Store Admin)
  const handleToggleRole = () => {
    setUser((curr) => ({
      ...curr,
      role: curr.role === 'admin' ? 'customer' : 'admin',
    }));
  };

  // Add Product as Admin
  const handleAddProductAsAdmin = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);

    // Simulated FCM notification for new drop
    if (fcmEnabled) {
      const dropNotif: FCMNotification = {
        id: `notif-${Date.now()}`,
        title: `🎉 New Catalog Drop: ${newProduct.name}`,
        body: `Sagunika Store Admin has published a new ${newProduct.category} formulation. Available now!`,
        timestamp: 'Just now',
        read: false,
        type: 'promotion',
        targetScreen: 'home',
      };
      setNotifications((prev) => [dropNotif, ...prev]);
      setActiveHeadsUpNotification(dropNotif);
    }
  };

  // Push Trigger Simulation
  const handleTriggerTestPush = (type: 'wedding' | 'order' | 'groom') => {
    let notif: FCMNotification;
    if (type === 'wedding') {
      notif = {
        id: `notif-${Date.now()}`,
        title: '✨ 24K Royal Bridal Flash Sale!',
        body: 'Flat 35% off on our limited edition Wedding Vanity & Sindoor sets for the next 4 hours.',
        timestamp: 'Just now',
        read: false,
        type: 'promotion',
        targetScreen: 'wedding',
      };
    } else if (type === 'order') {
      notif = {
        id: `notif-${Date.now()}`,
        title: '📦 BlueDart VIP Flight Assigned',
        body: 'Your Sagunika Bridal Vanity Box is flying to Pune! Expected delivery tomorrow.',
        timestamp: 'Just now',
        read: false,
        type: 'order',
        targetScreen: 'orders',
      };
    } else {
      notif = {
        id: `notif-${Date.now()}`,
        title: '👑 Imperial Oud Restocked',
        body: 'The Royal Groom Sovereign Care Trunk is back in inventory. Prepare for the grand day.',
        timestamp: 'Just now',
        read: false,
        type: 'promotion',
        targetScreen: 'groom',
      };
    }
    setNotifications((prev) => [notif, ...prev]);
    setActiveHeadsUpNotification(notif);
  };

  // Check if bottom navigation should be visible
  const showBottomNav =
    activeScreen !== 'splash' &&
    activeScreen !== 'login' &&
    activeScreen !== 'signup' &&
    activeScreen !== 'forgot_password' &&
    activeScreen !== 'otp' &&
    activeScreen !== 'product_details' &&
    activeScreen !== 'admin_panel';

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartProductIds = cart.map((i) => i.product.id);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F3EFF2] text-gray-900 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-[#B76E79]/30">
      {/* Top AI Studio Header & Developer Controls Bar */}
      <header className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8D5C4]/70 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B76E79] to-[#4A154B] p-[2px] shadow-xs">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center font-serif font-bold text-xs text-[#4A154B]">
              SC
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-sm tracking-wide text-[#4A154B]">
                Sagunika Cosmetic
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#B76E79] border border-[#E8B4B8]/40">
                Flutter Android E-Commerce
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Beauty That Inspires Confidence • Firebase Auth, Firestore, Storage & FCM
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <button
            onClick={() =>
              setViewMode((m) => (m === 'phone_frame' ? 'responsive' : 'phone_frame'))
            }
            className="px-2.5 py-1.5 rounded-xl border border-[#E8D5C4] hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center space-x-1 transition-colors"
            title="Toggle Android Phone Frame vs Full View"
          >
            {viewMode === 'phone_frame' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#4A154B]" />
                <span className="hidden sm:inline">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#4A154B]" />
                <span className="hidden sm:inline">Android Frame</span>
              </>
            )}
          </button>

          {/* Flutter Source Code Modal */}
          <button
            id="btn-open-flutter-code"
            onClick={() => setIsFlutterModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#B76E79]/50 hover:bg-[#FAF0F3] text-xs font-semibold text-[#8C4A5A] flex items-center space-x-1 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#B76E79]" />
            <span className="hidden sm:inline">Flutter Code</span>
          </button>

          {/* Admin Panel Button */}
          <button
            id="btn-top-admin-panel"
            onClick={() => setActiveScreen('admin_panel')}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4A5A] hover:opacity-90 text-xs font-semibold text-white flex items-center space-x-1 shadow-xs transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          {/* Firebase Suite Inspector */}
          <button
            id="btn-open-firebase-inspector"
            onClick={() => setIsFirebaseModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-[#4A154B] hover:bg-[#67226B] text-xs font-semibold text-white flex items-center space-x-1 shadow-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Firebase DB</span>
          </button>
        </div>
      </header>

      {/* Screen Navigator Quick Jump Bar (For instant testing of all screens) */}
      <div className="w-full max-w-5xl mb-3 px-3 py-2 bg-white/70 backdrop-blur-xs rounded-xl border border-[#E8D5C4]/50 overflow-x-auto flex items-center space-x-1 text-[11px] no-scrollbar">
        <span className="font-bold text-gray-400 uppercase text-[9px] mr-1 flex-shrink-0">
          Screen Jump:
        </span>
        {[
          { id: 'splash', label: '1. Splash' },
          { id: 'login', label: '2. Login' },
          { id: 'signup', label: '2b. Signup' },
          { id: 'forgot_password', label: '2c. Forgot' },
          { id: 'otp', label: '3. OTP' },
          { id: 'home', label: '4. Home' },
          { id: 'categories', label: '5. Categories' },
          { id: 'groom', label: '6. Groom' },
          { id: 'wedding', label: '7. Wedding' },
          { id: 'product_details', label: '8. Details' },
          { id: 'wishlist', label: '9. Wishlist' },
          { id: 'cart', label: '10. Cart' },
          { id: 'checkout', label: '11. Checkout' },
          { id: 'orders', label: '12. Orders' },
          { id: 'profile', label: '13. Profile' },
          { id: 'payment_status', label: '14. Payment Status' },
          { id: 'payment_history', label: '15. Payment Ledger' },
          { id: 'admin_panel', label: '★ Admin Panel' },
        ].map((scr) => (
          <button
            key={scr.id}
            onClick={() => {
              if (scr.id === 'product_details' && !selectedProduct) {
                setSelectedProduct(products[0]);
              }
              setActiveScreen(scr.id as ScreenName);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeScreen === scr.id
                ? 'bg-[#4A154B] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-white hover:text-[#4A154B]'
            }`}
          >
            {scr.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTAINER: Realistic Android Device Frame or Responsive View */}
      <main
        className={`relative transition-all duration-300 w-full ${
          viewMode === 'phone_frame'
            ? 'max-w-[420px] rounded-[42px] p-2.5 bg-[#17171C] ring-1 ring-black/10 shadow-[0_25px_60px_rgba(45,12,52,0.22)]'
            : 'max-w-5xl lg:max-w-6xl w-full rounded-3xl bg-white shadow-xl border border-[#E8D5C4] mx-auto'
        }`}
      >
        {/* Phone Frame Enclosure & Screen Canvas */}
        <div
          className={`relative w-full overflow-hidden bg-white flex flex-col justify-between ${
            viewMode === 'phone_frame'
              ? 'rounded-[34px] min-h-[780px] max-h-[85vh] overflow-y-auto'
              : 'rounded-3xl min-h-[720px]'
          }`}
        >
          {/* Simulated Android Status Bar */}
          <AndroidStatusBar darkIcons={activeScreen !== 'splash'} />

          {/* Android Heads-Up Push Notification Banner */}
          <AndroidHeadsUpBanner
            notification={activeHeadsUpNotification}
            onDismiss={() => setActiveHeadsUpNotification(null)}
            onClick={(notif) => {
              if (notif.targetScreen) {
                setActiveScreen(notif.targetScreen);
              }
              setActiveHeadsUpNotification(null);
            }}
          />

          {/* Dynamic Active Screen Rendering */}
          <div className="flex-1 w-full overflow-y-auto no-scrollbar">
            {activeScreen === 'splash' && (
              <SplashScreen
                onContinue={(target) => setActiveScreen(target)}
                isLoggedIn={true}
              />
            )}

            {activeScreen === 'login' && (
              <LoginScreen
                initialMode="login"
                onSendOtp={(phone) => {
                  setPhoneForOtp(phone);
                  setActiveScreen('otp');
                }}
                onGoogleLogin={async () => {
                  const googleUser = await firebaseAuthService.signInWithGoogle();
                  setUser(googleUser);
                  setActiveScreen('home');
                }}
                onLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                  setActiveScreen('home');
                }}
                onContinueAsGuest={() => setActiveScreen('home')}
              />
            )}

            {activeScreen === 'signup' && (
              <LoginScreen
                initialMode="signup"
                onSendOtp={(phone) => {
                  setPhoneForOtp(phone);
                  setActiveScreen('otp');
                }}
                onGoogleLogin={async () => {
                  const googleUser = await firebaseAuthService.signInWithGoogle();
                  setUser(googleUser);
                  setActiveScreen('home');
                }}
                onLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                  setActiveScreen('home');
                }}
                onContinueAsGuest={() => setActiveScreen('home')}
              />
            )}

            {activeScreen === 'forgot_password' && (
              <LoginScreen
                initialMode="forgot"
                onSendOtp={(phone) => {
                  setPhoneForOtp(phone);
                  setActiveScreen('otp');
                }}
                onGoogleLogin={async () => {
                  const googleUser = await firebaseAuthService.signInWithGoogle();
                  setUser(googleUser);
                  setActiveScreen('home');
                }}
                onLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                  setActiveScreen('home');
                }}
                onContinueAsGuest={() => setActiveScreen('home')}
              />
            )}

            {activeScreen === 'otp' && (
              <OtpScreen
                phoneNumber={phoneForOtp}
                onVerifySuccess={async () => {
                  const phoneUser = await firebaseAuthService.signInWithPhone(phoneForOtp, '123456');
                  setUser(phoneUser);
                  setActiveScreen('home');
                }}
                onBackToLogin={() => setActiveScreen('login')}
              />
            )}

            {activeScreen === 'home' && (
              <HomeScreen
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={(scr) => setActiveScreen(scr)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
                unreadNotificationCount={unreadNotificationCount}
                onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
              />
            )}

            {activeScreen === 'categories' && (
              <CategoriesScreen
                onNavigate={(scr) => setActiveScreen(scr)}
                onSelectCategoryFilter={() => {}}
              />
            )}

            {activeScreen === 'groom' && (
              <GroomCollectionScreen
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={(scr) => setActiveScreen(scr)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
              />
            )}

            {activeScreen === 'wedding' && (
              <WeddingCollectionScreen
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={(scr) => setActiveScreen(scr)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
              />
            )}

            {activeScreen === 'product_details' && (
              <ProductDetailsScreen
                product={selectedProduct || products[0]}
                onBack={() => setActiveScreen('home')}
                isWishlisted={wishlistIds.includes((selectedProduct || products[0]).id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNavigate={(scr) => setActiveScreen(scr)}
              />
            )}

            {activeScreen === 'wishlist' && (
              <WishlistScreen
                wishlistProducts={wishlistProducts}
                onRemoveWishlist={handleToggleWishlist}
                onMoveToCart={handleAddToCart}
                onAddAllToCart={handleAddAllWishlistToCart}
                onClearWishlist={handleClearWishlist}
                onSelectProduct={handleSelectProduct}
                onNavigate={(scr) => setActiveScreen(scr)}
                cartProductIds={cartProductIds}
              />
            )}

            {activeScreen === 'cart' && (
              <CartScreen
                cartItems={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onMoveToWishlist={handleMoveToWishlist}
                onClearCart={handleClearCart}
                onNavigate={(scr) => setActiveScreen(scr)}
                onProceedToCheckout={handleProceedToCheckout}
                freeDeliveryThreshold={storeSettings.freeDeliveryThreshold}
                standardDeliveryFee={storeSettings.standardDeliveryFee}
              />
            )}

            {activeScreen === 'checkout' && (
              <CheckoutScreen
                cartItems={cart}
                addresses={user.savedAddresses}
                discountAmount={discountAmount}
                appliedCoupon={appliedCoupon}
                storeSettings={storeSettings}
                onPlaceOrder={handlePlaceOrder}
                onPaymentFailed={handlePaymentFailed}
                onNavigate={(scr) => setActiveScreen(scr)}
              />
            )}

            {activeScreen === 'orders' && (
              <OrdersScreen
                orders={orders}
                storeSettings={storeSettings}
                onNavigate={(scr) => setActiveScreen(scr)}
                onReorder={handleReorder}
                onOpenInvoice={handleOpenInvoice}
                onUpdateOrders={(updated) => setOrders(updated)}
              />
            )}

            {activeScreen === 'profile' && (
              <ProfileScreen
                user={user}
                orders={orders}
                onUpdateUser={(updated) => setUser(updated)}
                onReorder={handleReorder}
                onToggleRole={handleToggleRole}
                onOpenAddProductModal={() => setIsAdminModalOpen(true)}
                onNavigate={(scr) => setActiveScreen(scr)}
                onOpenFlutterCode={() => setIsFlutterModalOpen(true)}
                onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
                onOpenInvoice={handleOpenInvoice}
                onLogout={async () => {
                  await firebaseAuthService.signOut();
                  setActiveScreen('login');
                }}
                fcmEnabled={fcmEnabled}
                onToggleFCM={() => setFcmEnabled((prev) => !prev)}
                wishlistCount={wishlistIds.length}
                orderCount={orders.length}
              />
            )}

            {activeScreen === 'payment_status' && (
              <PaymentStatusScreen
                status={paymentStatusOutcome.status}
                order={paymentStatusOutcome.order || orders[0] || null}
                paymentRecord={paymentStatusOutcome.paymentRecord}
                storeSettings={storeSettings}
                onNavigate={(scr) => setActiveScreen(scr)}
                onOpenInvoice={handleOpenInvoice}
                onRetryPayment={() => setActiveScreen('checkout')}
                onSwitchToCod={() => {
                  if (paymentStatusOutcome.order) {
                    const codOrder = {
                      ...paymentStatusOutcome.order,
                      paymentMethod: 'cod' as const,
                      paymentStatus: 'pending' as const,
                    };
                    firestoreRepo.createOrder(codOrder);
                    setOrders(firestoreRepo.getOrders());
                    setActiveScreen('orders');
                  } else {
                    setActiveScreen('checkout');
                  }
                }}
              />
            )}

            {activeScreen === 'payment_history' && (
              <PaymentHistoryScreen
                orders={orders}
                storeSettings={storeSettings}
                onNavigate={(scr) => setActiveScreen(scr)}
                onOpenInvoice={handleOpenInvoice}
                onSelectOrder={(ord) => {
                  setActiveScreen('orders');
                }}
              />
            )}

            {activeScreen === 'admin_panel' && (
              <AdminPanelScreen
                products={products}
                orders={orders}
                storeSettings={storeSettings}
                onUpdateProducts={(p) => setProducts(p)}
                onUpdateOrders={(o) => setOrders(o)}
                onUpdateStoreSettings={(s) => setStoreSettings(s)}
                onBroadcastNotification={(notif) => {
                  setNotifications((prev) => [notif, ...prev]);
                  setActiveHeadsUpNotification(notif);
                }}
                onNavigate={(scr) => setActiveScreen(scr)}
              />
            )}
          </div>

          {/* WhatsApp VIP Concierge Floating Button */}
          <WhatsAppChatButton storeSettings={storeSettings} />

          {/* Persistent Flutter Bottom Navigation Bar */}
          {showBottomNav && (
            <BottomNavigation
              activeScreen={activeScreen}
              onNavigate={(scr) => setActiveScreen(scr)}
              cartCount={cartCount}
              hasActiveOrder={orders.some((o) => o.status === 'shipped' || o.status === 'confirmed')}
            />
          )}

          {/* Android Home Navigation Gesture Pill */}
          {viewMode === 'phone_frame' && (
            <div className="w-full py-1.5 flex justify-center bg-white">
              <div className="w-28 h-1 rounded-full bg-gray-300" />
            </div>
          )}
        </div>
      </main>

      {/* ADMIN ADD PRODUCT MODAL (Strict Admin Only Privilege) */}
      <AdminAddProductModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAddProduct={handleAddProductAsAdmin}
      />

      {/* FLUTTER SOURCE CODE VIEWER & EXPORT MODAL */}
      <FlutterCodeViewerModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />

      {/* FIREBASE SUITE ARCHITECTURE INSPECTOR MODAL */}
      <FirebaseArchitectureModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        productCount={products.length}
        orderCount={orders.length}
      />

      {/* RAZORPAY & GST TAX INVOICE MODAL */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        order={selectedInvoiceOrder}
        storeSettings={storeSettings}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* FCM PUSH NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onSelectNotification={(notif) => {
          if (notif.targetScreen) {
            setActiveScreen(notif.targetScreen);
          }
          setIsNotificationDrawerOpen(false);
        }}
        onTriggerTestPush={handleTriggerTestPush}
      />
    </div>
  );
}
