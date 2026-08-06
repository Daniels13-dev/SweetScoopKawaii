import confetti from 'canvas-confetti';
import { CartItem, AppliedCoupon } from './types';
import { WHATSAPP_PHONE, WHATSAPP_DEFAULT_MSG } from './constants';

// Format numbers as Colombian Pesos format ($35.000)
export function formatCurrency(amount: number): string {
  return '$' + new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(amount);
}

// Trigger cute pastel confetti burst
export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FF69B4', '#FF1493', '#FFB6C1']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#C084FC', '#E9D5FF', '#9333EA']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FEF9C3', '#FDE047', '#38BDF8']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#FFD1DC', '#BAE6FD', '#DCFCE7']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FF69B4', '#C084FC']
  });
}

// Calculate totals and discounts
export function calculateCartTotals(items: CartItem[], coupon: AppliedCoupon | null) {
  const totalScoopsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const magicSurpriseUnlocked = totalScoopsCount >= 2;

  let discountAmount = 0;
  if (coupon && coupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    totalScoopsCount,
    subtotal,
    discountAmount,
    finalTotal,
    magicSurpriseUnlocked
  };
}

// Build WhatsApp Direct Message
export interface OrderFormData {
  customerName: string;
  whatsapp: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: string;
}

export function buildWhatsAppOrderLink(
  formData: OrderFormData,
  items: CartItem[],
  totals: ReturnType<typeof calculateCartTotals>,
  coupon: AppliedCoupon | null
): string {
  const RIBBON = '\u{1F380}';
  const HEART = '\u{1F496}';
  const SPARKLES = '\u{2728}';
  const USER = '\u{1F464}';
  const PHONE = '\u{1F4F1}';
  const PIN = '\u{1F4CD}';
  const HOUSE = '\u{1F3E0}';
  const MEMO = '\u{1F4DD}';
  const CARD = '\u{1F4B3}';
  const PACKAGE = '\u{1F4E6}';
  const GIFT = '\u{1F381}';
  const BULB = '\u{1F4A1}';
  const TRUCK = '\u{1F69A}';
  const PARTY = '\u{1F389}';
  const TICKET = '\u{1F3AB}';
  const MONEY = '\u{1F4B0}';
  const FLOWER = '\u{1F338}';
  const STAR = '\u{2B50}';

  const itemsText = items.map((item, idx) => {
    return `${idx + 1}. *${item.product.worldTitle}* (${item.product.sizeName}) x${item.quantity} - ${formatCurrency(item.product.price * item.quantity)}`;
  }).join('\n');

  const bonusText = totals.magicSurpriseUnlocked
    ? `${SPARKLES} *¡SORPRESA MÁGICA INCLUIDA GRATIS!* ${GIFT} (Por comprar 2 o más scoops)`
    : `${BULB} _Tip: Agrega 1 scoop más para ganar una Sorpresa Mágica gratis_`;

  const shippingText = `${TRUCK} Envíos a todo el país desde Manizales, Caldas`;

  const discountText = coupon && totals.discountAmount > 0
    ? `\n${TICKET} *Cupón Aplicado:* ${coupon.code} (-${formatCurrency(totals.discountAmount)})`
    : '';

  const PUSHPIN = '\u{1F4D2}';
  const depositAmount = 20000;
  const remainingBalance = Math.max(0, totals.finalTotal - depositAmount);

  const depositDetailsText = `\n📌 *MODALIDAD DE TURNO Y PAGO:*
• *Abono para Separar Turno:* ${formatCurrency(depositAmount)} (No reembolsable, 100% redimible en el pago total).
• *Saldo Restante a Pagar (tras ver tu video):* ${formatCurrency(remainingBalance)}`;

  const message = `¡Hola Sweet Scoop Kawaii! ${RIBBON}${HEART}${SPARKLES}
Quiero manifestar mi suerte y realizar mi pedido mágico:

${USER} *Cliente:* ${formData.customerName}
${PHONE} *WhatsApp:* ${formData.whatsapp}
${PIN} *Ciudad:* ${formData.city}
${HOUSE} *Dirección:* ${formData.address}
${formData.notes ? `${MEMO} *Notas:* ${formData.notes}\n` : ''}${CARD} *Método de Pago:* ${formData.paymentMethod.toUpperCase()}

${PACKAGE} *DETALLE DE MI SCOOP:*
${itemsText}
${depositDetailsText}

${bonusText}
${shippingText}
${discountText}

${MONEY} *VALOR TOTAL PRODUCTO:* *${formatCurrency(totals.finalTotal)}*

¡Quedo atento(a) para realizar mi abono de $20.000 y agendar mi video! ${FLOWER}${STAR}`;

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppQuickCartLink(
  items: CartItem[],
  totals: ReturnType<typeof calculateCartTotals>,
  coupon: AppliedCoupon | null
): string {
  if (items.length === 0) {
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(WHATSAPP_DEFAULT_MSG)}`;
  }

  const RIBBON = '\u{1F380}';
  const HEART = '\u{1F496}';
  const SPARKLES = '\u{2728}';
  const PACKAGE = '\u{1F4E6}';
  const GIFT = '\u{1F381}';
  const TRUCK = '\u{1F69A}';
  const TICKET = '\u{1F3AB}';
  const MONEY = '\u{1F4B0}';

  const itemsText = items.map((item, idx) => {
    return `${idx + 1}. *${item.product.worldTitle}* (${item.product.sizeName}) x${item.quantity} - ${formatCurrency(item.product.price * item.quantity)}`;
  }).join('\n');

  const bonusText = totals.magicSurpriseUnlocked
    ? `\n${SPARKLES} *¡Sorpresa Mágica Incluida GRATIS!* ${GIFT}`
    : '';

  const shippingText = `\n${TRUCK} Envíos desde Manizales a todo el país`;

  const discountText = coupon && totals.discountAmount > 0
    ? `\n${TICKET} *Cupón Aplicado:* ${coupon.code} (-${formatCurrency(totals.discountAmount)})`
    : '';

  const message = `¡Hola Sweet Scoop Kawaii! ${RIBBON}${HEART}${SPARKLES}
Quiero consultar y agendar mi pedido con lo que tengo en mi carrito:

${PACKAGE} *MI CARRITO SELECCIONADO:*
${itemsText}
${bonusText}${shippingText}${discountText}

📌 *Abono para separar turno:* $20.000 COP
${MONEY} *VALOR TOTAL PRODUCTO:* *${formatCurrency(totals.finalTotal)}*

¡Quedo atento(a) para enviar mis datos y realizar el abono! 🌸⭐`;

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

