export type DesignThemeId = 'nordic-minimal' | 'studio-atelier' | 'fjord-modern';

export interface DesignTheme {
  id: DesignThemeId;
  name: string;
  subtitle: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgBase: string;
  bgCard: string;
  textPrimary: string;
  textMuted: string;
  borderSubtle: string;
  badgeStyle: string;
  heroVibe: string;
}

export type GalleryCategory =
  | 'all'
  | 'aquarell'
  | 'lettering'
  | 'schilder'
  | 'karten'
  | 'wandbilder';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  dimensions: string;
  technique: string;
  year: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  story: string;
  tags: string[];
  priceChf?: number;
  inShop?: boolean;
  featured?: boolean;
}

export type ShopCategory =
  | 'all'
  | 'originale'
  | 'kunstdrucke'
  | 'karten-sets'
  | 'holztafeln'
  | 'workshops'
  | 'gutscheine';

export interface ProductVariant {
  id: string;
  name: string;
  priceExtraChf: number;
}

export interface ShopProduct {
  id: string;
  title: string;
  category: ShopCategory;
  categoryLabel: string;
  priceChf: number;
  originalPriceChf?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  galleryImages: string[];
  badge?: string;
  description: string;
  material: string;
  format: string;
  shippingInfo: string;
  inStock: boolean;
  allowsCustomization?: boolean;
  customizationPlaceholder?: string;
  variants?: ProductVariant[];
  featured?: boolean;
}

export interface CartItem {
  cartId: string;
  product: ShopProduct;
  quantity: number;
  selectedVariant?: ProductVariant;
  customText?: string;
  frameOption?: 'none' | 'oak' | 'black' | 'white';
}

export interface StudioVideo {
  id: string;
  title: string;
  duration: string;
  videoUrl: string; // url or data URL
  posterUrl: string;
  category: 'timelapse' | 'process' | 'workshop' | 'lettering';
  description: string;
  uploadedAt: string;
  isCustomUpload?: boolean;
}

export interface GeneratedArtIdea {
  title: string;
  subTitle: string;
  description: string;
  technique: string;
  colorPalette: { name: string; hex: string }[];
  letteringSuggestion: string;
  fontStyleAdvice: string;
  framingRecommendation: string;
  canvasVisual: {
    backgroundGradient: string;
    brushMotif: string;
    accentColor: string;
  };
  estimatedCreationTime: string;
  recommendedPriceChf: string;
}

export interface LetteringQuote {
  text: string;
  author: string;
  styleVibe: string;
}

export interface CustomerTestimonial {
  id: string;
  author: string;
  location: string;
  avatarUrl: string;
  rating: number;
  date: string;
  projectType: string;
  comment: string;
  verifiedBuyer: boolean;
  artworkPhotoUrl?: string;
}
