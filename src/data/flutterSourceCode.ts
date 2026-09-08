export interface FlutterCodeFile {
  filename: string;
  category: 'config' | 'services' | 'screens' | 'models' | 'theme';
  code: string;
  description: string;
}

export const FLUTTER_PROJECT_FILES: FlutterCodeFile[] = [
  {
    filename: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter dependencies including Firebase Auth, Firestore, Storage, Messaging, and Google Sign-In',
    code: `name: sagunika_cosmetic
description: "Sagunika Cosmetic - Beauty That Inspires Confidence. Complete Flutter Android E-Commerce App."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Firebase Suite
  firebase_core: ^3.6.0
  firebase_auth: ^5.3.1
  cloud_firestore: ^5.4.4
  firebase_storage: ^12.3.2
  firebase_messaging: ^15.1.3
  flutter_local_notifications: ^17.2.3

  # Authentication
  google_sign_in: ^6.2.1

  # State Management & Architecture
  provider: ^6.1.2

  # UI & Styling
  google_fonts: ^6.2.1
  cached_network_image: ^3.4.1
  flutter_svg: ^2.0.10+1
  smooth_page_indicator: ^1.2.0+3
  intl: ^0.19.0
  flutter_staggered_animations: ^1.1.1
  badges: ^3.1.2
  lottie: ^3.1.2
  shimmer: ^3.0.0

  # Native & Utilities
  image_picker: ^1.1.2
  uuid: ^4.5.1
  shared_preferences: ^2.3.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`
  },
  {
    filename: 'android/app/src/main/AndroidManifest.xml',
    category: 'config',
    description: 'Android manifest configuration with permissions, FCM, and Google Sign In intent filters',
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sagunika.cosmetics">

    <!-- Permissions required for E-Commerce, Firebase & FCM -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!-- Image picker for Admin product uploads -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>

    <application
        android:label="Sagunika Cosmetic"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>

        <!-- Firebase Cloud Messaging Service -->
        <service
            android:name="io.flutter.plugins.firebase.messaging.FlutterFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service>

        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    filename: 'lib/constants/theme.dart',
    category: 'theme',
    description: 'Luxury color palette: Pure White, Rose Gold, and Royal Purple with Material 3 typography',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SagunikaColors {
  // Primary Palette
  static const Color pureWhite = Color(0xFFFFFFFF);
  static const Color softWhite = Color(0xFFFAF8F9);
  static const Color surfaceWarm = Color(0xFFFDF7F8);

  // Rose Gold Accents
  static const Color roseGold = Color(0xFFB76E79);
  static const Color roseGoldLight = Color(0xFFE8B4B8);
  static const Color roseGoldDark = Color(0xFF8C4A5A);
  static const Color champagne = Color(0xFFE8D5C4);

  // Royal Purple Accents
  static const Color royalPurple = Color(0xFF4A154B);
  static const Color purpleDeep = Color(0xFF2D0C34);
  static const Color purpleGlow = Color(0xFF67226B);
  static const Color lavenderMist = Color(0xFFF3EAF4);

  // Neutral & Functional
  static const Color textDark = Color(0xFF1E1E24);
  static const Color textMuted = Color(0xFF757585);
  static const Color borderLight = Color(0xFFEFE8ED);
  static const Color successGreen = Color(0xFF2E7D32);
  static const Color goldStar = Color(0xFFFFB300);
}

class SagunikaTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: SagunikaColors.royalPurple,
      scaffoldBackgroundColor: SagunikaColors.softWhite,
      colorScheme: const ColorScheme.light(
        primary: SagunikaColors.royalPurple,
        secondary: SagunikaColors.roseGold,
        surface: SagunikaColors.pureWhite,
        error: Color(0xFFBA1A1A),
        onPrimary: Colors.white,
        onSecondary: Colors.white,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: SagunikaColors.royalPurple,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: SagunikaColors.purpleDeep,
        ),
        titleLarge: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: SagunikaColors.textDark,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 15,
          color: SagunikaColors.textDark,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 13,
          color: SagunikaColors.textMuted,
        ),
      ),
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: SagunikaColors.pureWhite,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        iconTheme: const IconThemeData(color: SagunikaColors.royalPurple),
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: SagunikaColors.royalPurple,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: SagunikaColors.royalPurple,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
        ),
      ),
    );
  }
}
`
  },
  {
    filename: 'lib/services/firebase_auth_service.dart',
    category: 'services',
    description: 'Firebase Authentication service managing Phone OTP verification and Google Sign-In',
    code: `import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<User?> get authStateChanges => _auth.authStateChanges();
  User? get currentUser => _auth.currentUser;

  // 1. Phone OTP Verification
  Future<void> sendOtp({
    required String phoneNumber,
    required Function(String verificationId, int? resendToken) onCodeSent,
    required Function(FirebaseAuthException e) onVerificationFailed,
    required Function(PhoneAuthCredential credential) onVerificationCompleted,
    required Function(String verificationId) onCodeAutoRetrievalTimeout,
  }) async {
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: onVerificationCompleted,
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: onCodeAutoRetrievalTimeout,
      timeout: const Duration(seconds: 60),
    );
  }

  Future<UserCredential> verifyOtpAndSignIn({
    required String verificationId,
    required String smsCode,
  }) async {
    PhoneAuthCredential credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    UserCredential userCredential = await _auth.signInWithCredential(credential);
    await _syncUserToFirestore(userCredential.user);
    return userCredential;
  }

  // 2. Google Login
  Future<UserCredential?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // Cancelled

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      await _syncUserToFirestore(userCredential.user);
      return userCredential;
    } catch (e) {
      rethrow;
    }
  }

  // 3. User Document Sync in Firestore
  Future<void> _syncUserToFirestore(User? user) async {
    if (user == null) return;
    final docRef = _firestore.collection('users').doc(user.uid);
    final doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set({
        'uid': user.uid,
        'name': user.displayName ?? 'Sagunika Guest',
        'email': user.email ?? '',
        'phone': user.phoneNumber ?? '',
        'role': 'customer', // Strict: customers cannot add products
        'createdAt': FieldValue.serverTimestamp(),
        'savedAddresses': [],
      });
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
`
  },
  {
    filename: 'lib/services/firestore_service.dart',
    category: 'services',
    description: 'Cloud Firestore database interactions for products, wedding/groom collections, orders, and cart',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/product_model.dart';
import '../models/order_model.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream all products
  Stream<List<Product>> getProducts() {
    return _firestore
        .collection('products')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  // Fetch Wedding Collection
  Stream<List<Product>> getWeddingCollection() {
    return _firestore
        .collection('products')
        .where('collection', isEqualTo: 'wedding')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  // Fetch Groom Collection
  Stream<List<Product>> getGroomCollection() {
    return _firestore
        .collection('products')
        .where('collection', isEqualTo: 'groom')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Product.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  // Only Admin can add products!
  Future<void> addProductAsAdmin({
    required String adminUid,
    required Product product,
  }) async {
    // 1. Verify user role is admin
    final userDoc = await _firestore.collection('users').doc(adminUid).get();
    if (!userDoc.exists || userDoc.data()?['role'] != 'admin') {
      throw FirebaseException(
        plugin: 'cloud_firestore',
        code: 'permission-denied',
        message: 'Only store admins can upload cosmetic products.',
      );
    }

    // 2. Insert into Firestore
    await _firestore.collection('products').add(product.toMap());
  }

  // Create Customer Order
  Future<String> createOrder(OrderModel order) async {
    final docRef = await _firestore.collection('orders').add(order.toMap());
    return docRef.id;
  }

  // Stream User Orders
  Stream<List<OrderModel>> getUserOrders(String userId) {
    return _firestore
        .collection('orders')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => OrderModel.fromFirestore(d.data(), d.id))
            .toList());
  }
}
`
  },
  {
    filename: 'lib/services/fcm_service.dart',
    category: 'services',
    description: 'Firebase Cloud Messaging integration for push notifications and wedding promotional updates',
    code: `import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FCMService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifs = FlutterLocalNotificationsPlugin();

  Future<void> initFCM(String userId) async {
    // 1. Request Notification Permissions
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // 2. Retrieve device token and store in user document
      String? token = await _fcm.getToken();
      if (token != null) {
        await FirebaseFirestore.instance.collection('users').doc(userId).update({
          'fcmToken': token,
          'tokenUpdatedAt': FieldValue.serverTimestamp(),
        });
      }

      // 3. Foreground message listener
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        _showForegroundNotification(message);
      });

      // 4. Subscribe to Bridal and Groom promotional topics
      await _fcm.subscribeToTopic('bridal_wedding_offers');
      await _fcm.subscribeToTopic('groom_collection_updates');
    }
  }

  void _showForegroundNotification(RemoteMessage message) {
    final notification = message.notification;
    if (notification != null) {
      _localNotifs.show(
        notification.hashCode,
        notification.title,
        notification.body,
        const NotificationDetails(
          android: AndroidNotificationDetails(
            'sagunika_high_importance',
            'Sagunika Cosmetic Notifications',
            importance: Importance.max,
            priority: Priority.high,
            icon: '@mipmap/ic_launcher',
          ),
        ),
      );
    }
  }
}
`
  },
  {
    filename: 'lib/main.dart',
    category: 'screens',
    description: 'Application entry point initializing Firebase and MultiProvider with Sagunika theme',
    code: `import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'constants/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/product_provider.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const SagunikaCosmeticApp());
}

class SagunikaCosmeticApp extends StatelessWidget {
  const SagunikaCosmeticApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()..initData()),
      ],
      child: MaterialApp(
        title: 'Sagunika Cosmetic',
        debugShowCheckedModeBanner: false,
        theme: SagunikaTheme.lightTheme,
        home: const SplashScreen(),
      ),
    );
  }
}
`
  },
  {
    filename: 'lib/screens/home_screen.dart',
    category: 'screens',
    description: 'Luxury home screen with promotional banners, quick collection buttons, and product grids',
    code: `import 'package:flutter/material.dart';
import '../constants/theme.dart';
import 'wedding_collection_screen.dart';
import 'groom_collection_screen.dart';
import '../widgets/product_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            const Text(
              'SAGUNIKA',
              style: TextStyle(
                fontFamily: 'Playfair',
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                fontSize: 18,
                color: SagunikaColors.royalPurple,
              ),
            ),
            Text(
              'Beauty That Inspires Confidence',
              style: TextStyle(
                fontSize: 10,
                letterSpacing: 0.5,
                color: SagunikaColors.roseGoldDark,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Promotional Banner
            Container(
              margin: const EdgeInsets.all(16),
              height: 180,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [SagunikaColors.purpleDeep, SagunikaColors.royalPurple],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    left: 20,
                    top: 28,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: SagunikaColors.roseGold,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text('THE BRIDAL VAULT', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(height: 8),
                        const Text('Royal Wedding Collection', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        const Text('Handcrafted 24K Rose Gold Sets', style: TextStyle(color: SagunikaColors.champagne, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Quick Collections: Wedding & Groom
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const WeddingCollectionScreen())),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: SagunikaColors.surfaceWarm,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: SagunikaColors.roseGoldLight),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: SagunikaColors.roseGold),
                            SizedBox(width: 8),
                            Text('Wedding Collection', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const GroomCollectionScreen())),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: SagunikaColors.lavenderMist,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: SagunikaColors.royalPurple.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.shield_outlined, color: SagunikaColors.royalPurple),
                            SizedBox(width: 8),
                            Text('Groom Collection', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  }
];
