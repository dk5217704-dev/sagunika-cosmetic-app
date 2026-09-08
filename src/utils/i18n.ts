export type AppLanguage = 'en' | 'hi';

export interface Translations {
  // App brand & navigation
  brandName: string;
  brandTagline: string;
  brandSubtitle: string;
  navHome: string;
  navCategories: string;
  navGroom: string;
  navWedding: string;
  navCart: string;
  navWishlist: string;
  wishlist: string;
  navProfile: string;
  navOrders: string;
  navAdmin: string;

  // Categories
  catMakeup: string;
  catSkincare: string;
  catHaircare: string;
  catFragrance: string;
  catBeautyTools: string;
  catPersonalCare: string;
  catWedding: string;
  catGroom: string;
  catAll: string;

  // Search & Filter
  searchPlaceholder: string;
  filterTitle: string;
  sortBy: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortPopularity: string;
  sortNewest: string;
  filterBrand: string;
  filterCategory: string;
  filterPrice: string;
  inStockOnly: string;
  resetFilters: string;
  applyFilters: string;
  resultsCount: string;

  // Product actions & badges
  addToCart: string;
  addedToCart: string;
  buyNow: string;
  outOfStock: string;
  inStock: string;
  offPercent: string;
  quantity: string;
  selectShade: string;
  keyIngredients: string;
  howToUse: string;
  customerReviews: string;

  // Cart & Checkout
  myCart: string;
  emptyCart: string;
  emptyCartDesc: string;
  shopNow: string;
  subtotal: string;
  discount: string;
  deliveryFee: string;
  freeDelivery: string;
  grandTotal: string;
  couponCode: string;
  applyCoupon: string;
  couponApplied: string;
  proceedToCheckout: string;
  deliveryAddress: string;
  changeAddress: string;
  addAddress: string;
  fulfillmentType: string;
  doorstepDelivery: string;
  storePickup: string;
  paymentMethod: string;
  placeOrder: string;

  // Payment modes
  payUPI: string;
  payUPIDesc: string;
  payRazorpay: string;
  payRazorpayDesc: string;
  payCOD: string;
  payCODDesc: string;
  verifyUPI: string;
  enterUPI: string;

  // Orders & Tracking
  myOrders: string;
  activeOrders: string;
  completedOrders: string;
  trackOrder: string;
  orderStatusPlaced: string;
  orderStatusConfirmed: string;
  orderStatusPacked: string;
  orderStatusShipped: string;
  orderStatusOutForDelivery: string;
  orderStatusDelivered: string;
  orderStatusCancelled: string;
  cancelOrder: string;
  returnOrder: string;
  reorder: string;
  invoice: string;

  // Admin
  adminPanel: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  productPrice: string;
  productDiscount: string;
  productDescription: string;
  productStock: string;
  productImages: string;
  uploadFromGallery: string;
  captureFromCamera: string;
  saveChanges: string;
  saveProduct: string;
  adminSubtitle: string;

  // User & Settings
  profileTitle: string;
  editProfile: string;
  savedAddresses: string;
  languageSettings: string;
  selectLanguage: string;
  english: string;
  hindi: string;
  login: string;
  register: string;
  logout: string;
  notifications: string;
  fcmPush: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    brandName: 'SAGUNIKA COSMETICS',
    brandTagline: 'Beauty That Inspires Confidence',
    brandSubtitle: 'Pure 24K Gold, Herbal Botanicals & Luxury Formulations',
    navHome: 'Home',
    navCategories: 'Categories',
    navGroom: 'Groom',
    navWedding: 'Wedding',
    navCart: 'Cart',
    navWishlist: 'Wishlist',
    wishlist: 'Wishlist',
    navProfile: 'Profile',
    navOrders: 'Orders',
    navAdmin: 'Admin',

    catMakeup: 'Makeup',
    catSkincare: 'Skincare',
    catHaircare: 'Hair Care',
    catFragrance: 'Fragrance',
    catBeautyTools: 'Beauty Tools',
    catPersonalCare: 'Personal Care',
    catWedding: 'Wedding Vault',
    catGroom: 'Royal Groom',
    catAll: 'All Collections',

    searchPlaceholder: 'Search lipstick, serum, attar, gold kit...',
    filterTitle: 'Filter & Refine',
    sortBy: 'Sort By',
    sortFeatured: 'Featured Picks',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortPopularity: 'Popularity / Best Sellers',
    sortNewest: 'Newest Arrivals',
    filterBrand: 'Filter by Brand',
    filterCategory: 'Filter by Category',
    filterPrice: 'Price Range',
    inStockOnly: 'In Stock Only',
    resetFilters: 'Reset',
    applyFilters: 'Apply Filters',
    resultsCount: 'products found',

    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart ✓',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    offPercent: 'OFF',
    quantity: 'Quantity',
    selectShade: 'Select Shade / Size',
    keyIngredients: 'Key Ingredients',
    howToUse: 'How to Use',
    customerReviews: 'Customer Reviews',

    myCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Discover our bridal vanity, attars, and luxury makeup to fill your bag.',
    shopNow: 'Shop Now',
    subtotal: 'Subtotal',
    discount: 'Discount',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'FREE',
    grandTotal: 'Grand Total',
    couponCode: 'Enter Coupon Code',
    applyCoupon: 'Apply',
    couponApplied: 'Coupon Applied!',
    proceedToCheckout: 'Proceed to Checkout',
    deliveryAddress: 'Delivery Address',
    changeAddress: 'Change',
    addAddress: 'Add New Address',
    fulfillmentType: 'Fulfillment Method',
    doorstepDelivery: 'Doorstep Delivery',
    storePickup: 'Store Pickup (Free)',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order & Pay',

    payUPI: 'UPI (GPay / PhonePe / Paytm / QR)',
    payUPIDesc: 'Instant zero-fee payment with your favorite UPI apps',
    payRazorpay: 'Razorpay VIP Gateway',
    payRazorpayDesc: 'Cards, NetBanking, Credit/Debit & Digital Wallets',
    payCOD: 'Cash on Delivery (COD)',
    payCODDesc: 'Pay via cash or UPI when your parcel reaches your door',
    verifyUPI: 'Verify & Pay',
    enterUPI: 'Enter UPI ID (e.g. name@okhdfcbank)',

    myOrders: 'My Orders',
    activeOrders: 'Active Orders',
    completedOrders: 'Past Orders',
    trackOrder: 'Track Shipment',
    orderStatusPlaced: 'Order Placed',
    orderStatusConfirmed: 'Order Confirmed',
    orderStatusPacked: 'Packed in Bespoke Box',
    orderStatusShipped: 'Shipped via Express',
    orderStatusOutForDelivery: 'Out for VIP Delivery',
    orderStatusDelivered: 'Delivered',
    orderStatusCancelled: 'Cancelled',
    cancelOrder: 'Cancel Order',
    returnOrder: 'Request Return / Exchange',
    reorder: 'Reorder Again',
    invoice: 'Download Tax Invoice',

    adminPanel: 'Sagunika Admin Panel',
    addProduct: 'Add New Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete',
    productName: 'Product Name / Title',
    productBrand: 'Brand Name',
    productCategory: 'Category',
    productPrice: 'Price (₹)',
    productDiscount: 'Discount (%)',
    productDescription: 'Product Description',
    productStock: 'Available Stock',
    productImages: 'Product Images',
    uploadFromGallery: 'Upload from Gallery',
    captureFromCamera: 'Take Photo with Camera',
    saveChanges: 'Save Changes',
    saveProduct: 'Publish Product',
    adminSubtitle: 'Manage inventory, catalog, multi-image uploads & orders',

    profileTitle: 'My Sagunika Account',
    editProfile: 'Edit Profile',
    savedAddresses: 'Saved Addresses',
    languageSettings: 'Language / भाषा',
    selectLanguage: 'Choose App Language',
    english: 'English (Default)',
    hindi: 'हिंदी (Hindi)',
    login: 'Log In / Register',
    register: 'Create VIP Account',
    logout: 'Sign Out',
    notifications: 'Notifications',
    fcmPush: 'Order Updates & Offers',
  },
  hi: {
    brandName: 'सगुनिका कॉस्मेटिक्स',
    brandTagline: 'सुंदरता जो आत्मविश्वास जगाए',
    brandSubtitle: 'शुद्ध 24K सोना, हर्बल अर्क और लग्जरी फॉर्मूलेशन',
    navHome: 'होम',
    navCategories: 'श्रेणियां',
    navGroom: 'ग्रूम',
    navWedding: 'शादी',
    navCart: 'कार्ट',
    navWishlist: 'विशलिस्ट',
    wishlist: 'विशलिस्ट',
    navProfile: 'प्रोफ़ाइल',
    navOrders: 'ऑर्डर्स',
    navAdmin: 'एडमिन',

    catMakeup: 'मेकअप',
    catSkincare: 'स्किनकेयर',
    catHaircare: 'हेयर केयर',
    catFragrance: 'सुगंध और इत्र',
    catBeautyTools: 'ब्यूटी टूल्स',
    catPersonalCare: 'पर्सनल केयर',
    catWedding: 'वेडिंग वॉल्ट',
    catGroom: 'रॉयल ग्रूम',
    catAll: 'सभी संग्रह',

    searchPlaceholder: 'लिपस्टिक, सीरम, इत्र, गोल्ड किट खोजें...',
    filterTitle: 'फ़िल्टर और छंटाई',
    sortBy: 'क्रमबद्ध करें',
    sortFeatured: 'विशेष चयन',
    sortPriceAsc: 'मूल्य: कम से अधिक',
    sortPriceDesc: 'मूल्य: अधिक से कम',
    sortPopularity: 'लोकप्रियता / सर्वाधिक बिकने वाला',
    sortNewest: 'नवीनतम उत्पाद',
    filterBrand: 'ब्रांड अनुसार फ़िल्टर',
    filterCategory: 'श्रेणी अनुसार फ़िल्टर',
    filterPrice: 'मूल्य दायरा',
    inStockOnly: 'केवल स्टॉक में उपलब्ध',
    resetFilters: 'रीसेट करें',
    applyFilters: 'फ़िल्टर लागू करें',
    resultsCount: 'उत्पाद मिले',

    addToCart: 'कार्ट में जोड़ें',
    addedToCart: 'कार्ट में जोड़ा गया ✓',
    buyNow: 'अभी खरीदें',
    outOfStock: 'स्टॉक समाप्त',
    inStock: 'स्टॉक में उपलब्ध',
    offPercent: 'छूट',
    quantity: 'मात्रा',
    selectShade: 'शेड / साइज़ चुनें',
    keyIngredients: 'मुख्य घटक',
    howToUse: 'उपयोग की विधि',
    customerReviews: 'ग्राहकों की समीक्षाएं',

    myCart: 'शॉपिंग कार्ट',
    emptyCart: 'आपकी कार्ट खाली है',
    emptyCartDesc: 'हमारी ब्राइडल वैनिटी, इत्र और लग्जरी मेकअप को कार्ट में जोड़ें।',
    shopNow: 'अभी खरीदारी करें',
    subtotal: 'उप-योग',
    discount: 'छूट बचत',
    deliveryFee: 'डिलीवरी शुल्क',
    freeDelivery: 'मुफ़्त',
    grandTotal: 'कुल देय राशि',
    couponCode: 'कूपन कोड दर्ज करें',
    applyCoupon: 'लागू करें',
    couponApplied: 'कूपन लागू हुआ!',
    proceedToCheckout: 'चेकआउट के लिए आगे बढ़ें',
    deliveryAddress: 'डिलीवरी का पता',
    changeAddress: 'बदलें',
    addAddress: 'नया पता जोड़ें',
    fulfillmentType: 'प्राप्ति का माध्यम',
    doorstepDelivery: 'घर पर डिलीवरी',
    storePickup: 'स्टोर से पिकअप (मुफ़्त)',
    paymentMethod: 'भुगतान का तरीका',
    placeOrder: 'ऑर्डर दें और भुगतान करें',

    payUPI: 'यूपीआई (गूगल पे / फोनपे / पेटीएम / क्यूआर)',
    payUPIDesc: 'बिना किसी अतिरिक्त शुल्क के तुरंत यूपीआई से भुगतान करें',
    payRazorpay: 'रेज़रपे वीआईपी गेटवे',
    payRazorpayDesc: 'क्रेडिट/डेबिट कार्ड, नेटबैंकिंग और वॉलेट्स',
    payCOD: 'कैश ऑन डिलीवरी (सीओडी)',
    payCODDesc: 'पार्सल मिलने पर नकद या यूपीआई द्वारा भुगतान करें',
    verifyUPI: 'सत्यापित करें और भुगतान करें',
    enterUPI: 'यूपीआई आईडी दर्ज करें (उदा. name@okhdfcbank)',

    myOrders: 'मेरे ऑर्डर्स',
    activeOrders: 'सक्रिय ऑर्डर्स',
    completedOrders: 'पिछले ऑर्डर्स',
    trackOrder: 'शिपमेंट ट्रैक करें',
    orderStatusPlaced: 'ऑर्डर प्राप्त हुआ',
    orderStatusConfirmed: 'ऑर्डर स्वीकृत',
    orderStatusPacked: 'शाही डिब्बे में पैक हुआ',
    orderStatusShipped: 'एक्सप्रेस कूरियर से रवाना',
    orderStatusOutForDelivery: 'डिलीवरी के लिए निकला',
    orderStatusDelivered: 'सफलतापूर्वक डिलीवर',
    orderStatusCancelled: 'रद्द किया गया',
    cancelOrder: 'ऑर्डर रद्द करें',
    returnOrder: 'वापसी / एक्सचेंज अनुरोध',
    reorder: 'पुनः ऑर्डर करें',
    invoice: 'टैक्स इनवॉइस डाउनलोड करें',

    adminPanel: 'सगुनिका एडमिन पैनल',
    addProduct: 'नया उत्पाद जोड़ें',
    editProduct: 'उत्पाद संपादित करें',
    deleteProduct: 'हटाएं',
    productName: 'उत्पाद का नाम / शीर्षक',
    productBrand: 'ब्रांड का नाम',
    productCategory: 'श्रेणी',
    productPrice: 'मूल्य (₹)',
    productDiscount: 'छूट (%)',
    productDescription: 'उत्पाद विवरण',
    productStock: 'उपलब्ध स्टॉक',
    productImages: 'उत्पाद छवियां (फ़ोटो)',
    uploadFromGallery: 'गैलरी से अपलोड करें',
    captureFromCamera: 'कैमरे से फ़ोटो लें',
    saveChanges: 'बदलाव सहेजें',
    saveProduct: 'उत्पाद प्रकाशित करें',
    adminSubtitle: 'इन्वेंटरी, उत्पाद कैटलॉग, फ़ोटो अपलोड और ऑर्डर्स प्रबंधित करें',

    profileTitle: 'मेरा सगुनिका खाता',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    savedAddresses: 'सहेजे गए पते',
    languageSettings: 'भाषा / Language',
    selectLanguage: 'ऐप की भाषा चुनें',
    english: 'English (अंग्रेजी)',
    hindi: 'हिंदी (Hindi)',
    login: 'लॉग इन / पंजीकरण',
    register: 'नया वीआईपी खाता बनाएं',
    logout: 'लॉग आउट',
    notifications: 'सूचनाएं',
    fcmPush: 'ऑर्डर अपडेट और विशेष ऑफर',
  },
};
