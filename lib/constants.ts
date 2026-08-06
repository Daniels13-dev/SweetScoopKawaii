import { ScoopProduct, PrizeOption } from './types';

export const WHATSAPP_PHONE = '573104494494';
export const WHATSAPP_DEFAULT_MSG = '¡Hola! Quiero manifestar mi suerte con un Scoop Kawaii 🎀💖✨';

export const SCOOP_PRODUCTS: ScoopProduct[] = [
  // MUNDO KAWAII - Papelería
  {
    id: 'kawaii-cucharita',
    worldId: 'kawaii',
    worldTitle: 'Mundo Kawaii',
    worldEmoji: '🎀',
    size: 'cucharita',
    sizeName: 'Cucharita Surpresa',
    price: 35000,
    itemsCountText: '✔ Más de 5 artículos sorpresa',
    minItems: 5,
    description: 'La dosis perfecta de ternura en papelería kawaii. Ideal para comenzar tu colección mágica.',
    includes: [
      'Stickers kawaii seleccionados',
      'Lapicero tinta gel con figura',
      'Washi Tape decorativo',
      'Mini notas adhesivas tiernas',
      'Accesorio kawaii sorpresa'
    ],
    badge: 'Ideal para comenzar',
    imageBgColor: 'bg-pink-100'
  },
  {
    id: 'kawaii-cucharada',
    worldId: 'kawaii',
    worldTitle: 'Mundo Kawaii',
    worldEmoji: '🎀',
    size: 'cucharada',
    sizeName: 'Gran Cucharada Kawaii',
    price: 50000,
    itemsCountText: '✨ Más de 10 artículos sorpresa',
    minItems: 10,
    description: '¡La experiencia completa! El doble de magia, variedad y alta probabilidad de productos premium.',
    includes: [
      'Stickers premium holographic',
      '2+ Lapiceros tinta gel de colección',
      'Rollos Washi tape variados',
      'Block de notas / libreta kawaii',
      'Llavero o plushie tierno',
      'Accesorios sorpresa de alta gama'
    ],
    badge: 'Mayor Valor • Más Popular 🔥',
    isPopular: true,
    imageBgColor: 'bg-purple-100'
  },

  // BEAUTY GLOW - Skin Care + Maquillaje
  {
    id: 'beauty-cucharita',
    worldId: 'beauty',
    worldTitle: 'Beauty Glow',
    worldEmoji: '💖',
    size: 'cucharita',
    sizeName: 'Cucharita Beauty',
    price: 35000,
    itemsCountText: '✔ Más de 5 artículos sorpresa',
    minItems: 5,
    description: 'Tu rutina de spa y brillo personal con productos de belleza super kawaii.',
    includes: [
      'Mascarilla hidratante facial',
      'Lip Gloss jugoso kawaii',
      'Parches para labios/ojos',
      'Espejo de bolsillo tierno',
      'Accesorio beauty sorpresa'
    ],
    badge: 'Frescura & Brillo',
    imageBgColor: 'bg-rose-100'
  },
  {
    id: 'beauty-cucharada',
    worldId: 'beauty',
    worldTitle: 'Beauty Glow',
    worldEmoji: '💖',
    size: 'cucharada',
    sizeName: 'Gran Cucharada Glow',
    price: 50000,
    itemsCountText: '✨ Más de 10 artículos sorpresa',
    minItems: 10,
    description: 'Mega set de cuidado facial y maquillaje kawaii con el doble de sorpresas y productos glow.',
    includes: [
      '2+ Mascarillas hidratantes premium',
      'Lip Gloss mágico que cambia de color',
      'Bálsamo labial tierno',
      'Tónico o sérum facial mini',
      'Scrunchie de seda kawaii',
      'Accesorios beauty & skincare extra'
    ],
    badge: 'Máximo Glow 🔥',
    isPopular: true,
    imageBgColor: 'bg-fuchsia-100'
  },

  // DULCERÍA NACIONAL
  {
    id: 'dulceria-cucharada',
    worldId: 'dulceria',
    worldTitle: 'Pequeñas Aventuras',
    worldEmoji: '🍬',
    size: 'cucharada_unica',
    sizeName: 'Cucharada Única Dulcería',
    price: 30000,
    itemsCountText: '✨ Mínimo 25 dulces nacionales',
    minItems: 25,
    description: 'Disfruta de una deliciosa selección de los mejores dulces y golosinas colombianas.',
    includes: [
      'Golosinas y gomitas colombianas variadas',
      'Chocolates y masmelos deliciosos',
      'Dulces acidulados y masticables',
      'Galletas y turrones tradicionales',
      'Combinación mágica de sabores nacionales'
    ],
    badge: 'Mínimo 25 Dulces 🍭',
    isPopular: true,
    imageBgColor: 'bg-amber-100'
  }
];

export const WHEEL_PRIZES: PrizeOption[] = [
  {
    id: 'p1',
    name: 'Sorpresa Mágica Extra 🎁',
    emoji: '🎁',
    code: 'SUPERMAGIA',
    discountPercent: 10,
    isMagicSurprise: true,
    color: '#FFB6C1'
  },
  {
    id: 'p2',
    name: '10% OFF en tu Scoop 💖',
    emoji: '💖',
    code: 'MAGIC10',
    discountPercent: 10,
    color: '#C084FC'
  },
  {
    id: 'p3',
    name: '10% OFF Especial ✨',
    emoji: '✨',
    code: 'KAWAII10',
    discountPercent: 10,
    color: '#BAE6FD'
  },
  {
    id: 'p4',
    name: '10% OFF Mágico 🌟',
    emoji: '🌟',
    code: 'DESTINO10',
    discountPercent: 10,
    color: '#FEF9C3'
  },
  {
    id: 'p5',
    name: 'Sticker Exclusivo Kawaii 🎀',
    emoji: '🎀',
    code: 'STICKERBONUS',
    discountPercent: 10,
    color: '#BBF7D0'
  }
];
