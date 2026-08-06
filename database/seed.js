// Pure REST Seed Script for Supabase (no WebSocket requirement)
const SUPABASE_URL = 'https://hfnavigjiudilnpkkzeg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-tjCqfv-efuJnXLPAOI2Xg_B9neX6aw';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function runSeed() {
  console.log('🚀 Conectando a Supabase:', SUPABASE_URL);

  const testUserId = '00000000-0000-0000-0000-000000000001';

  // 1. Insert Profile
  console.log('👤 Insertando usuario de prueba...');
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: testUserId,
      email: 'camila.kawaii@sweetscoop.com',
      full_name: 'Camila Rodríguez',
      whatsapp: '3104494494',
      city: 'Manizales'
    })
  });

  const profileData = await profileRes.json();
  if (profileRes.ok) {
    console.log('✅ Perfil guardado con éxito en Supabase:', profileData);
  } else {
    console.warn('⚠️ Respuesta profiles:', profileData);
  }

  // 2. Insert Saved Address
  console.log('🏠 Insertando dirección guardada...');
  const addrRes = await fetch(`${SUPABASE_URL}/rest/v1/user_addresses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_id: testUserId,
      label: 'Casa Principal',
      recipient_name: 'Camila Rodríguez',
      recipient_phone: '3104494494',
      city: 'Manizales',
      address_line: 'Carrera 23 # 45-67, Apto 302, Barrio Palermo',
      notes: 'Dejar en portería si no responden',
      is_default: true
    })
  });

  const addrData = await addrRes.json();
  if (addrRes.ok) {
    console.log('✅ Dirección guardada con éxito:', addrData);
  } else {
    console.warn('⚠️ Respuesta user_addresses:', addrData);
  }

  // 3. Insert Test Order
  console.log('🛒 Insertando pedido de prueba...');
  const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_id: testUserId,
      customer_name: 'Camila Rodríguez',
      whatsapp: '3104494494',
      city: 'Manizales',
      address: 'Carrera 23 # 45-67, Apto 302, Barrio Palermo',
      notes: 'Empacar con moño rosado y tarjeta de cumpleaños 🎀',
      items: [
        {
          cartId: 'item_1',
          product: {
            id: 'kawaii-gran-cucharada',
            worldTitle: 'Mundo Kawaii 🎀',
            sizeName: 'Gran Cucharada',
            price: 50000
          },
          quantity: 1
        },
        {
          cartId: 'item_2',
          product: {
            id: 'beauty-cucharita',
            worldTitle: 'Beauty Glow 💖',
            sizeName: 'Cucharita Surpresa',
            price: 35000
          },
          quantity: 1
        }
      ],
      subtotal: 85000,
      discount_amount: 8500,
      total_amount: 76500,
      magic_surprise_unlocked: true,
      payment_method: 'nequi',
      coupon_code: 'MAGIC10',
      status: 'confirmado'
    })
  });

  const orderData = await orderRes.json();
  if (orderRes.ok) {
    console.log('🎉 ¡PEDIDO DE PRUEBA CREADO CON ÉXITO EN SUPABASE!', orderData);
  } else {
    console.error('❌ Error al insertar pedido:', orderData);
  }
}

runSeed();
