import { Product, Address, Order, FCMNotification } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Wedding Collection
  {
    id: 'prod-w1',
    name: 'Royal Bridal Vanity Trousseau Set',
    brand: 'Sagunika Luxury',
    subtitle: 'Complete 18-Piece 24K Gold & Rose Velvet Bridal Kit',
    price: 8499,
    originalPrice: 12999,
    discountPercentage: 35,
    rating: 4.9,
    reviewCount: 342,
    category: 'wedding',
    collection: 'wedding',
    isFeatured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An opulent handcrafted bridal collection featuring 18 ceremonial essentials: velvet matte lipsticks, 24K gold radiance primer, waterproof HD foundation, and jewel-tone eye palette made for high-definition wedding photography.',
    keyIngredients: ['Pure 24K Gold Flakes', 'Bulgarian Rose Extract', 'Squalane', 'Vitamin E'],
    howToUse: 'Begin with the Gold Radiance Primer for a glass-skin base, followed by the HD bridal foundation and setting mist.',
    shadesOrSizes: ['Royal Ivory Set', 'Warm Golden Sand Set', 'Rich Amber Set'],
    stockQuantity: 18,
    tags: ['Wedding', 'Bridal', 'Luxury', 'Trousseau', 'Waterproof'],
    occasions: ['wedding', 'reception', 'sangeet']
  },
  {
    id: 'prod-w2',
    name: 'Eternal Sindoor & Alta Sacred Bridal Duo',
    brand: 'Sagunika Heritage',
    subtitle: 'Smudge-Proof, Mercury-Free Herbal Formulation',
    price: 1299,
    originalPrice: 1799,
    discountPercentage: 28,
    rating: 4.8,
    reviewCount: 512,
    category: 'wedding',
    collection: 'wedding',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Crafted with centuries-old floral dyes and sacred saffron, this 100% natural, mercury-free red sindoor and traditional ceremonial Alta provide long-lasting auspicious brilliance without skin irritation.',
    keyIngredients: ['Kashmiri Kesar (Saffron)', 'Kumkum Flower Extract', 'Rose Petal Water', 'Almond Oil'],
    howToUse: 'Apply the sindoor using the precision brass wand. Brush Alta along the foot contours and palm fingertips.',
    shadesOrSizes: ['Deep Vermillion Red', 'Auspicious Maroon'],
    stockQuantity: 45,
    tags: ['Wedding', 'Ceremonial', 'Herbal', 'Waterproof'],
    occasions: ['wedding', 'festive']
  },
  {
    id: 'prod-w3',
    name: '24K Rose Gold Luminous Illuminator',
    brand: 'Sagunika Couture',
    subtitle: 'Multi-use Liquid Strobe for Bridal Glass Glow',
    price: 2450,
    originalPrice: 3200,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 289,
    category: 'makeup',
    collection: 'wedding',
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A weightless, silk-infused liquid highlighter with micro-milled rose gold pearls that blend into cheekbones, collarbones, and temples for an otherworldly wedding luminescence.',
    keyIngredients: ['Rose Gold Micro-Pearls', 'Niacinamide 2%', 'Rosehip Seed Oil', 'Camellia Sinensis'],
    howToUse: 'Mix 2 drops with your liquid foundation or dab onto cheekbones and shoulders for radiant reflection.',
    shadesOrSizes: ['Rose Royale 30ml', 'Champagne Pearl 30ml'],
    stockQuantity: 24,
    tags: ['Highlighter', 'Wedding', 'Glow', 'Rose Gold'],
    occasions: ['wedding', 'reception', 'sangeet', 'party']
  },
  {
    id: 'prod-w4',
    name: 'Velvet Matte Bridal Kissproof Lip Wardrobe',
    brand: 'Sagunika Luxury',
    subtitle: '16-Hour Transfer-Resistant 4-Shade Festive Coffret',
    price: 2899,
    originalPrice: 3999,
    discountPercentage: 27,
    rating: 4.9,
    reviewCount: 420,
    category: 'makeup',
    collection: 'wedding',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Four iconic wedding shades curated for ceremonial rites: Vermillion Queen, Rose Petal Nude, Royal Plum, and Gulab Crimson. Enriched with shea butter for supreme comfort.',
    keyIngredients: ['Organic Shea Butter', 'Marula Oil', 'Hyaluronic Spheres'],
    howToUse: 'Define lip edges with the contour tip, then glide across lips in one single high-pigment swipe.',
    shadesOrSizes: ['Quad Vault (4 x 3.5g)'],
    stockQuantity: 32,
    tags: ['Lipstick', 'Wedding', 'Matte', 'Waterproof'],
    occasions: ['wedding', 'reception', 'party']
  },

  // Groom Collection
  {
    id: 'prod-g1',
    name: 'The Royal Groom Sovereign Care Trunk',
    brand: 'Sagunika Men',
    subtitle: '7-Piece Pre-Wedding Beard & Facial Grooming Suite',
    price: 5299,
    originalPrice: 7999,
    discountPercentage: 34,
    rating: 4.9,
    reviewCount: 198,
    category: 'groom',
    collection: 'groom',
    isFeatured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Designed exclusively for the modern groom before his wedding festivities. Contains Cedarwood & Oud Beard Elixir, Activated Volcanic Charcoal Detox Cleanser, Anti-Fatigue Eye Serum, Sandalwood Shaving Cream, and a boar-bristle brush.',
    keyIngredients: ['Atlas Cedarwood', 'Pure Oud Oil', 'Moroccan Argan Oil', 'Volcanic Ash'],
    howToUse: 'Follow the 3-step ritual: cleanse skin with volcanic detox, soothe with eye serum, and shape beard with Oud elixir.',
    shadesOrSizes: ['Luxury Wood Chest Edition', 'Travel Canvas Kit'],
    stockQuantity: 15,
    tags: ['Groom', 'Men Care', 'Beard', 'Luxury Kit', 'Wedding'],
    occasions: ['wedding', 'reception', 'sangeet']
  },
  {
    id: 'prod-g2',
    name: 'Imperial Oud & Ambergris Eau de Parfum',
    brand: 'Sagunika Fragrance',
    subtitle: 'Magnetic Royal Scent with 18-Hour Projection',
    price: 4699,
    originalPrice: 6200,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 388,
    category: 'fragrance',
    collection: 'groom',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An arresting fragrance opening with smoked cardamom and saffron, settling into a rich heart of Cambodian agarwood and ambergris. The ultimate olfactory signature for the royal groom.',
    keyIngredients: ['Cambodian Agarwood (Oud)', 'Black Cardamom', 'Ambergris', 'Smoked Vetiver'],
    howToUse: 'Spritz onto pulse points behind the ears, wrists, and collar of your sherwani/suit.',
    shadesOrSizes: ['100ml Eau De Parfum', '50ml Travel Flacon'],
    stockQuantity: 28,
    tags: ['Groom', 'Fragrance', 'Oud', 'Perfume'],
    occasions: ['wedding', 'reception', 'festive']
  },
  {
    id: 'prod-g3',
    name: 'Gentleman Matte Shave & Aftershave Balm',
    brand: 'Sagunika Men',
    subtitle: 'Sandalwood & Aloe Razor Bump Defense',
    price: 1450,
    originalPrice: 1950,
    discountPercentage: 26,
    rating: 4.7,
    reviewCount: 145,
    category: 'groom',
    collection: 'groom',
    images: [
      'https://images.unsplash.com/photo-1608248597359-563333346f00?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An alcohol-free, non-greasy calming lotion infused with Mysore sandalwood and cold-pressed aloe vera to cool razor burns, prevent ingrown hairs, and leave a refined matte complexion.',
    keyIngredients: ['Mysore Sandalwood Oil', 'Aloe Barbadensis', 'Allantoin', 'Centella Asiatica'],
    howToUse: 'Massage gently into freshly shaven face and neck until absorbed.',
    shadesOrSizes: ['150ml Pump Bottle'],
    stockQuantity: 40,
    tags: ['Groom', 'Shaving', 'Aftershave', 'Soothing'],
    occasions: ['wedding', 'daily']
  },

  // Skincare Essentials
  {
    id: 'prod-s1',
    name: 'Royal Damask Rose & Peptide Youth Nectar',
    brand: 'Sagunika Skin',
    subtitle: 'Intensive Firming & Barrier Repair Miracle Serum',
    price: 3199,
    originalPrice: 4200,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 610,
    category: 'skincare',
    collection: 'general',
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Distilled from wild damask rose petals harvested at dawn, this antioxidant-rich facial elixir boosts cellular regeneration, plums fine lines, and imparts undeniable luminous bounce.',
    keyIngredients: ['Pure Damask Rose Hydrosol', 'Copper Tripeptide-1', 'Hyaluronic Acid 3-Weight', 'Centella'],
    howToUse: 'Warm 3 to 4 drops between palms and press gently into clean face and décolletage day and night.',
    shadesOrSizes: ['30ml Pipette', '50ml Deluxe Flacon'],
    stockQuantity: 36,
    tags: ['Serum', 'Anti-Aging', 'Rose', 'Skincare'],
    occasions: ['daily', 'haldi', 'wedding']
  },
  {
    id: 'prod-s2',
    name: 'Kumkumadi Miraculous Radiant Night Oil',
    brand: 'Sagunika Ayurvedic',
    subtitle: 'Authentic 16-Herb Ayurvedic Complexion Elixir',
    price: 2650,
    originalPrice: 3499,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 472,
    category: 'ayurvedic',
    collection: 'general',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An ancient recipe enriched with Kashmiri saffron, red sandalwood, vetiver, and blue lotus. Evens skin tone, fades pigmentation, and creates an inner glow from deep cellular nutrition.',
    keyIngredients: ['Kashmiri Saffron (Kumkuma)', 'Raktachandan', 'Blue Lotus Petals', 'Goat Milk'],
    howToUse: 'Massage 3-4 drops upward onto damp cleansed face before sleep.',
    shadesOrSizes: ['25ml Royal Dropper'],
    stockQuantity: 29,
    tags: ['Ayurveda', 'Kumkumadi', 'Face Oil', 'Radiance'],
    occasions: ['daily', 'haldi', 'wedding']
  },
  {
    id: 'prod-s3',
    name: 'Silk Petal Hydrating Gel Crème',
    brand: 'Sagunika Skin',
    subtitle: '72-Hour Water-Burst Cloud Moisturizer',
    price: 1899,
    originalPrice: 2400,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 315,
    category: 'skincare',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An ultra-lightweight water gel that dissolves on contact to bathe parched skin in continuous moisture, leaving skin velvety soft with zero greasy residue.',
    keyIngredients: ['Silk Amino Acids', 'Micro-Hyaluronic Acid', 'Alpine Edelweiss'],
    howToUse: 'Smooth generously over face and neck morning and evening.',
    shadesOrSizes: ['50g Glass Jar', '100g Jumbo Tub'],
    stockQuantity: 52,
    tags: ['Moisturizer', 'Hydration', 'Gel Cream'],
    occasions: ['daily', 'haldi']
  },

  // Fragrance & Haircare
  {
    id: 'prod-f1',
    name: 'Kashmiri Rose & White Jasmine Extrait',
    brand: 'Sagunika Fragrance',
    subtitle: 'Pure Concentrated Perfume Nectar',
    price: 3999,
    originalPrice: 5200,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 220,
    category: 'fragrance',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An intoxicating bouquet of royal May roses hand-blended with night-blooming Indian Jasmine sambac and sensual white musk.',
    keyIngredients: ['Kashmiri Rose Absolute', 'Indian Jasmine Sambac', 'White Musk', 'Sandalwood Base'],
    howToUse: 'Dab on pulse points, neckline, and hair tips for an enchanting aura.',
    shadesOrSizes: ['50ml Crystal Bottle', '100ml Deluxe Edition'],
    stockQuantity: 21,
    tags: ['Perfume', 'Floral', 'Luxury', 'Rose'],
    occasions: ['wedding', 'reception', 'festive']
  },
  {
    id: 'prod-h1',
    name: 'Bhringraj & Onion Intensive Hair Spa Elixir',
    brand: 'Sagunika Haircare',
    subtitle: 'Traditional Scalp Root Strengthening Treatment',
    price: 1599,
    originalPrice: 2199,
    discountPercentage: 27,
    rating: 4.7,
    reviewCount: 395,
    category: 'haircare',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Clinically backed ayurvedic scalp therapy that reduces hair fall by 85%, stimulates dormant follicles, and provides silky salon-smooth density.',
    keyIngredients: ['Keshraj (Bhringraj)', 'Red Onion Seed Oil', 'Amla Extract', 'Hibiscus Petals'],
    howToUse: 'Warm the oil and massage into roots with circular motions. Leave for at least 1 hour or overnight before washing.',
    shadesOrSizes: ['200ml Glass Flask with Comb Applicator'],
    stockQuantity: 44,
    tags: ['Hair Oil', 'Hair Fall', 'Ayurvedic', 'Haircare'],
    occasions: ['daily', 'festive']
  },
  // Beauty Tools
  {
    id: 'prod-bt1',
    name: '24K Rose Gold Pro 12-Piece Sculpting Brush Suite',
    brand: 'Sagunika Tools',
    subtitle: 'Micro-Silk Vegan Bristles with Weighted Metallic Stems',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    rating: 4.9,
    reviewCount: 184,
    category: 'beauty_tools',
    collection: 'general',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An elite 12-piece ceremonial brush collection engineered with ultra-soft hypoallergenic nanofibers for streak-free foundation, seamless contouring, and luminous eyeshadow blending.',
    keyIngredients: ['Dermasafe Vegan Nanofibers', 'Anodized Rose Gold Ferrules', 'Sustainably Harvested Wood Handles'],
    howToUse: 'Use denser brushes for creams and liquid illuminators; fluffier brushes for powders and cheek blushes.',
    shadesOrSizes: ['12-Piece Deluxe Vault with Travel Roll', '6-Piece Essential Kit'],
    stockQuantity: 28,
    tags: ['Brushes', 'Beauty Tools', 'Professional', 'Vegan'],
    occasions: ['daily', 'wedding', 'reception']
  },
  {
    id: 'prod-bt2',
    name: 'Xiuyan Jade Vibrating Facial Roller & Gua Sha Duo',
    brand: 'Sagunika Tools',
    subtitle: '6,000 Sonic Vibrations / Min for Lymphatic Sculpting',
    price: 2199,
    originalPrice: 2999,
    discountPercentage: 26,
    rating: 4.8,
    reviewCount: 247,
    category: 'beauty_tools',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Authentic grade-A jade gemstone paired with micro-sonic pulse technology that visibly lifts cheekbones, reduces morning puffiness, and amplifies serum absorption.',
    keyIngredients: ['100% Genuine Certified Xiuyan Jade', 'Rechargeable Sonic Micro-Motor'],
    howToUse: 'Apply 3 drops of Kumkumadi oil. Glide roller upwards along jawline, cheekbones, and brow bone for 5 minutes.',
    shadesOrSizes: ['Imperial Emerald Jade', 'Rose Quartz Edition'],
    stockQuantity: 36,
    tags: ['Gua Sha', 'Jade Roller', 'Beauty Tools', 'Face Sculpt'],
    occasions: ['daily', 'wedding']
  },
  // Personal Care
  {
    id: 'prod-pc1',
    name: 'Sandalwood & Velvet Cashmere Body Soufflé',
    brand: 'Sagunika Bath & Body',
    subtitle: '24-Hour Deep Barrier Nourishment with Mysore Sandalwood',
    price: 1699,
    originalPrice: 2299,
    discountPercentage: 26,
    rating: 4.8,
    reviewCount: 310,
    category: 'personal_care',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A whipped, melt-into-skin body crème infused with authentic Mysore sandalwood oil, organic raw shea butter, and golden jojoba for satin softness and a delicate royal scent.',
    keyIngredients: ['Mysore Sandalwood Oil', 'Raw African Shea Butter', 'Golden Jojoba', 'Vitamin B5'],
    howToUse: 'Massage all over body immediately after bath or shower onto damp skin.',
    shadesOrSizes: ['250g Glass Jar', '500g Grand Jar'],
    stockQuantity: 40,
    tags: ['Body Butter', 'Personal Care', 'Moisturizer', 'Sandalwood'],
    occasions: ['daily', 'wedding', 'festive']
  },
  {
    id: 'prod-pc2',
    name: 'Himalayan Pink Salt & Wild Rose Polishing Body Scrub',
    brand: 'Sagunika Bath & Body',
    subtitle: 'Micro-Exfoliating Mineral Scrub with Essential Oils',
    price: 1399,
    originalPrice: 1899,
    discountPercentage: 26,
    rating: 4.7,
    reviewCount: 198,
    category: 'personal_care',
    collection: 'general',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Detoxifying Himalayan crystal salts suspended in sweet almond and wild rose oil that buffs away dullness, enhances blood circulation, and imparts an unmissable bridal radiance.',
    keyIngredients: ['Pure Himalayan Pink Salt Crystals', 'Wild Rose Essential Oil', 'Sweet Almond Oil'],
    howToUse: 'Gently buff onto damp skin in circular motions. Rinse with warm water.',
    shadesOrSizes: ['300g Luxury Tub'],
    stockQuantity: 32,
    tags: ['Body Scrub', 'Personal Care', 'Exfoliator', 'Rose'],
    occasions: ['daily', 'haldi', 'wedding']
  }
];

export const CATEGORIES_DATA = [
  {
    id: 'makeup',
    title: 'Makeup',
    subtitle: 'Kissproof Matte, Foundation & Illuminators',
    itemCount: 42,
    icon: 'Sparkles',
    color: 'from-rose-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'skincare',
    title: 'Skincare',
    subtitle: 'Youth Nectars, Saffron Oils & Crèmes',
    itemCount: 36,
    icon: 'Droplets',
    color: 'from-rose-600 to-amber-600',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'haircare',
    title: 'Hair Care',
    subtitle: 'Root Therapy, Hair Oils & Spa Restoratives',
    itemCount: 28,
    icon: 'HeartHandshake',
    color: 'from-purple-700 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fragrance',
    title: 'Fragrance',
    subtitle: 'Imperial Oud, Bulgarian Rose & Attars',
    itemCount: 22,
    icon: 'Feather',
    color: 'from-purple-900 to-fuchsia-800',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'beauty_tools',
    title: 'Beauty Tools',
    subtitle: 'Sculpting Brushes, Jade Rollers & Blenders',
    itemCount: 18,
    icon: 'Crown',
    color: 'from-amber-600 to-rose-500',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'personal_care',
    title: 'Personal Care',
    subtitle: 'Body Soufflés, Mineral Scrubs & Bath Luxury',
    itemCount: 25,
    icon: 'Leaf',
    color: 'from-emerald-700 to-teal-800',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'wedding',
    title: 'Wedding Vault',
    subtitle: 'Bridal Trousseau & Ceremonial Vanity',
    itemCount: 24,
    icon: 'Sparkles',
    color: 'from-amber-600 to-rose-600',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'groom',
    title: 'Royal Groom',
    subtitle: 'Gentleman Grooming & Beard Care',
    itemCount: 18,
    icon: 'Crown',
    color: 'from-purple-900 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Ananya Sharma',
    phone: '+91 98765 43210',
    street: 'Flat 402, Royal Palms Heights, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Ananya Sharma (Work)',
    phone: '+91 98765 43210',
    street: 'Cyber Tower 3, Floor 6, Viman Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    isDefault: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SG-904218',
    createdAt: '24 Oct 2026',
    status: 'shipped',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Royal Bridal Vanity Set
        quantity: 1,
        selectedShadeOrSize: 'Royal Ivory Set'
      },
      {
        product: INITIAL_PRODUCTS[2], // 24K Rose Gold Illuminator
        quantity: 1,
        selectedShadeOrSize: 'Rose Royale 30ml'
      }
    ],
    subtotal: 10949,
    discount: 1500,
    deliveryFee: 0,
    total: 9449,
    deliveryType: 'delivery',
    distanceKm: 3.2,
    shippingAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    trackingSteps: [
      {
        title: 'Order Confirmed',
        date: '24 Oct, 10:15 AM',
        completed: true,
        current: false,
        description: 'Payment authorized via UPI. Order registered at Sagunika Studio.'
      },
      {
        title: 'Handcrafted & Packed with Care',
        date: '24 Oct, 03:30 PM',
        completed: true,
        current: false,
        description: 'Packed in signature rose gold gift box with velvet ribbon.'
      },
      {
        title: 'Dispatched via BlueDart Air VIP',
        date: '25 Oct, 08:45 AM',
        completed: true,
        current: true,
        description: 'AWB #7728190342. In transit to Pune Hub.'
      },
      {
        title: 'Out for Delivery',
        date: '26 Oct (Expected)',
        completed: false,
        current: false,
        description: 'Delivery associate assigned for doorstep verification.'
      },
      {
        title: 'Delivered',
        date: '26 Oct (Expected)',
        completed: false,
        current: false,
        description: 'Enjoy your Sagunika luxury radiance!'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'SG-881203',
    createdAt: '12 Oct 2026',
    status: 'delivered',
    items: [
      {
        product: INITIAL_PRODUCTS[4], // The Royal Groom Trunk
        quantity: 1,
        selectedShadeOrSize: 'Luxury Wood Chest Edition'
      }
    ],
    subtotal: 5299,
    discount: 500,
    deliveryFee: 0,
    total: 4799,
    deliveryType: 'delivery',
    distanceKm: 2.1,
    shippingAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'card',
    paymentStatus: 'paid',
    estimatedDelivery: 'Delivered on 14 Oct',
    trackingSteps: [
      {
        title: 'Order Confirmed',
        date: '12 Oct, 11:00 AM',
        completed: true,
        current: false,
        description: 'Payment processed successfully.'
      },
      {
        title: 'Packed',
        date: '12 Oct, 04:00 PM',
        completed: true,
        current: false,
        description: 'Dispatched in discreet wooden trunk packaging.'
      },
      {
        title: 'Shipped',
        date: '13 Oct, 09:00 AM',
        completed: true,
        current: false,
        description: 'In transit via express logistics.'
      },
      {
        title: 'Delivered',
        date: '14 Oct, 02:20 PM',
        completed: true,
        current: false,
        description: 'Package handed over to Ananya Sharma.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: FCMNotification[] = [
  {
    id: 'notif-1',
    title: '✨ Royal Bridal Week is Live!',
    body: 'Flat 35% off on our limited edition Wedding Vanity & Sindoor Trousseau. Beauty That Inspires Confidence.',
    timestamp: '10m ago',
    read: false,
    type: 'promotion',
    targetScreen: 'wedding'
  },
  {
    id: 'notif-2',
    title: '📦 Order #SG-904218 Shipped',
    body: 'Your Sagunika Bridal Vanity Box is flying to Pune! Expected delivery tomorrow.',
    timestamp: '2h ago',
    read: false,
    type: 'order',
    targetScreen: 'orders'
  },
  {
    id: 'notif-3',
    title: '👑 Groom Collection Restocked',
    body: 'The Imperial Oud & Ambergris Eau de Parfum is back in stock. Order before wedding season rush.',
    timestamp: '1d ago',
    read: true,
    type: 'promotion',
    targetScreen: 'groom'
  }
];
