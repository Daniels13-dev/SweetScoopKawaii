// TypeScript Definitions for Sweet Scoop Kawaii

export type WorldId = 'kawaii' | 'beauty' | 'dulceria';
export type ScoopSize = 'cucharita' | 'cucharada' | 'cucharada_unica';

export interface ScoopProduct {
  id: string;
  worldId: WorldId;
  worldTitle: string;
  worldEmoji: string;
  size: ScoopSize;
  sizeName: string;
  price: number;
  itemsCountText: string;
  minItems: number;
  description: string;
  includes: string[];
  badge?: string;
  isPopular?: boolean;
  imageBgColor: string;
}

export type CharmRarity = 'comun' | 'raro' | 'legendario';

export interface Charm {
  id: string;
  worldId: WorldId;
  name: string;
  emoji: string;
  reward: string;
  rarity: CharmRarity;
  category: string;
  color?: string;
}

export interface CartItem {
  cartId: string;
  product: ScoopProduct;
  quantity: number;
  selectedCharms?: string[]; // IDs or names of favorite charms
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

export interface OrderPayload {
  userId?: string;
  customerName: string;
  whatsapp: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: 'nequi' | 'daviplata' | 'transferencia' | 'contraentrega';
  cartItems: CartItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  magicSurpriseUnlocked: boolean;
  couponCode?: string;
  preferredCharms?: string[]; // Nombres o IDs de dijes favoritos del cliente
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  whatsapp: string;
  city: string;
  avatar_url?: string;
  role?: 'user' | 'superadmin';
  created_at?: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  recipient_phone: string;
  city: string;
  address_line: string;
  notes?: string;
  is_default: boolean;
  created_at?: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  coupon_code: string;
  source_game: string;
  is_used: boolean;
  created_at?: string;
}

export interface GameResult {
  sessionId: string;
  gameName: 'atrapa_la_ternura' | 'ruleta_del_destino';
  score?: number;
  rewardClaimed?: string;
}

export interface PrizeOption {
  id: string;
  name: string;
  emoji: string;
  code: string;
  discountPercent: number;
  isMagicSurprise?: boolean;
  color: string;
}
