-- Database Schema for Sweet Scoop Kawaii (Supabase PostgreSQL)

-- 1. Profiles Table (Auth Users Profile)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT DEFAULT 'Manizales',
  avatar_url TEXT,
  role TEXT DEFAULT 'user'
);

-- 2. User Addresses Table (Saved Shipping Addresses)
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT DEFAULT 'Principal', -- 'Casa', 'Oficina', etc.
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address_line TEXT NOT NULL,
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  order_number SERIAL UNIQUE,
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  magic_surprise_unlocked BOOLEAN DEFAULT FALSE,
  payment_method TEXT NOT NULL,
  coupon_code TEXT,
  status TEXT DEFAULT 'pendiente' -- pendiente, confirmado, enviado, entregado
);

-- 4. User Rewards / Claimed Coupons
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  coupon_code TEXT NOT NULL,
  source_game TEXT NOT NULL, -- 'atrapa_la_ternura' or 'ruleta_del_destino'
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ
);

-- 5. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INT NOT NULL DEFAULT 10,
  max_usage INT DEFAULT 1000,
  current_usage INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

-- Insert Default Coupons
INSERT INTO public.coupons (code, discount_percent, max_usage, active)
VALUES 
  ('MAGIC10', 10, 1000, true),
  ('DESTINO10', 10, 500, true),
  ('KAWAII10', 10, 1000, true)
ON CONFLICT (code) DO NOTHING;

-- 6. Game Results Table
CREATE TABLE IF NOT EXISTS public.game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL,
  game_name TEXT NOT NULL, -- 'atrapa_la_ternura' or 'ruleta_del_destino'
  score INT DEFAULT 0,
  reward_claimed TEXT,
  ip_address TEXT
);

-- 7. Spin Wheel Prizes Table
CREATE TABLE IF NOT EXISTS public.prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  code TEXT,
  discount_percent INT DEFAULT 10,
  is_magic_surprise BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE
);

-- Insert Default Spin Wheel Prizes
INSERT INTO public.prizes (name, code, discount_percent, is_magic_surprise)
VALUES
  ('Sorpresa Mágica Extra 🎁', 'SUPERMAGIA', 10, true),
  ('10% OFF en tu Scoop 💖', 'MAGIC10', 10, false),
  ('10% OFF Especial ✨', 'KAWAII10', 10, false),
  ('10% OFF Mágico 🌟', 'DESTINO10', 10, false),
  ('Sticker Exclusivo Kawaii 🎀', 'STICKERBONUS', 10, false)
ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profile select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Allow public insert to user_addresses" ON public.user_addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public user_addresses select" ON public.user_addresses FOR SELECT USING (true);
CREATE POLICY "Users can manage own addresses" ON public.user_addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin');
CREATE POLICY "Superadmin can update orders" ON public.orders FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin');
CREATE POLICY "Users can view own rewards" ON public.user_rewards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow public select on active coupons" ON public.coupons FOR SELECT USING (active = true);
CREATE POLICY "Allow public insert to game_results" ON public.game_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on active prizes" ON public.prizes FOR SELECT USING (active = true);
