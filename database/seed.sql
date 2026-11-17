-- Seed Script para insertar 1 Usuario de prueba y 1 Pedido de prueba en Supabase
-- Copia y ejecuta este script en el SQL Editor de tu proyecto en Supabase

-- 1. Insertar usuario de autenticación de prueba en auth.users (Satisface la clave foránea)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'camila.kawaii@sweetscoop.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Camila Rodríguez"}',
  FALSE,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insertar 1 Perfil de prueba en public.profiles
INSERT INTO public.profiles (id, email, full_name, whatsapp, city)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'camila.kawaii@sweetscoop.com',
  'Camila Rodríguez',
  '3104494494',
  'Manizales'
)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 3. Insertar 1 Dirección guardada de prueba en public.user_addresses
INSERT INTO public.user_addresses (user_id, label, recipient_name, recipient_phone, city, address_line, notes, is_default)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Casa Principal 🏠',
  'Camila Rodríguez',
  '3104494494',
  'Manizales',
  'Carrera 23 # 45-67, Apto 302, Barrio Palermo',
  'Dejar en portería si no responden el timbre',
  true
);

-- 4. Insertar 1 Pedido de prueba en public.orders
INSERT INTO public.orders (
  user_id,
  customer_name,
  whatsapp,
  city,
  address,
  notes,
  items,
  subtotal,
  discount_amount,
  total_amount,
  magic_surprise_unlocked,
  payment_method,
  coupon_code,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Camila Rodríguez',
  '3104494494',
  'Manizales',
  'Carrera 23 # 45-67, Apto 302, Barrio Palermo',
  'Empacar con moño rosado y tarjeta de cumpleaños 🎀',
  '[
    {
      "cartId": "item_1",
      "product": {
        "id": "kawaii-gran-cucharada",
        "worldTitle": "Mundo Kawaii 🎀",
        "sizeName": "Gran Cucharada",
        "price": 50000
      },
      "quantity": 1
    },
    {
      "cartId": "item_2",
      "product": {
        "id": "beauty-cucharita",
        "worldTitle": "Beauty Glow 💖",
        "sizeName": "Cucharita Surpresa",
        "price": 35000
      },
      "quantity": 1
    }
  ]'::jsonb,
  85000,
  8500,
  76500,
  true,
  'nequi',
  'MAGIC10',
  'confirmado'
);
