import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserAddress } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveOrderToSupabase(orderData: any) {
  if (!supabase) {
    console.warn('Supabase keys not configured in env. Order processed in fallback mode.');
    return { success: true, fallback: true };
  }

  try {
    // Validar si el userId es un UUID válido, de lo contrario enviar null (para usuarios fallback)
    const isValidUUID = orderData.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.userId);
    const validUserId = isValidUUID ? orderData.userId : null;

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: validUserId,
          customer_name: orderData.customerName,
          whatsapp: orderData.whatsapp,
          city: orderData.city,
          address: orderData.address,
          notes: orderData.notes || '',
          items: orderData.cartItems,
          subtotal: orderData.subtotal,
          discount_amount: orderData.discountAmount,
          total_amount: orderData.totalAmount,
          magic_surprise_unlocked: orderData.magicSurpriseUnlocked,
          payment_method: orderData.paymentMethod,
          coupon_code: orderData.couponCode || null
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting order to Supabase:', error);
      return { success: false, error };
    }

    // Enviar correo de confirmación (no bloqueante)
    try {
      if (orderData.email) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: orderData.email,
            subject: '¡Tu pedido Kawaii ha sido recibido! 🎀',
            type: 'order_created',
            data: {
              name: orderData.customerName,
              orderNumber: data[0].order_number,
              total: orderData.totalAmount,
              city: orderData.city
            }
          })
        });
      }
    } catch (e) {
      console.error('Error triggering email API:', e);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase save exception:', err);
    return { success: false, err };
  }
}

export async function fetchAllOrders() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Fetch all orders exception:', e);
    return [];
  }
}

export async function fetchUserOrders(userId: string, whatsapp?: string) {
  if (!supabase) return [];
  try {
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    
    let query = supabase.from('orders').select('*');
    
    if (isValidUUID && whatsapp) {
      // Buscar por ID (pedidos linkeados) o por WhatsApp (pedidos guest)
      query = query.or(`user_id.eq.${userId},whatsapp.eq.${whatsapp}`);
    } else if (isValidUUID) {
      // Solo ID
      query = query.eq('user_id', userId);
    } else if (whatsapp) {
      // Solo WhatsApp (fallback mode o invitados)
      query = query.eq('whatsapp', whatsapp);
    } else {
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Fetch user orders exception:', e);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!supabase) return { success: false };
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e) {
    console.error('Update order status exception:', e);
    return { success: false, error: e };
  }
}

// --- COUPON MANAGEMENT ---

export async function fetchAllCoupons() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Fetch coupons exception:', e);
    return [];
  }
}

export async function createCoupon(couponData: { code: string; discount_percent: number; max_usage: number; valid_until?: string }) {
  if (!supabase) return { success: false };
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert([couponData])
      .select();

    if (error) {
      console.error('Error creating coupon:', error);
      return { success: false, error };
    }
    return { success: true, data: data[0] };
  } catch (e) {
    console.error('Create coupon exception:', e);
    return { success: false, error: e };
  }
}

export async function toggleCouponStatus(couponId: string, active: boolean) {
  if (!supabase) return { success: false };
  try {
    const { error } = await supabase
      .from('coupons')
      .update({ active })
      .eq('id', couponId);

    if (error) {
      console.error('Error toggling coupon status:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e) {
    console.error('Toggle coupon status exception:', e);
    return { success: false, error: e };
  }
}

export async function validateCoupon(code: string) {
  if (!supabase) return { valid: false, message: 'Servicio no disponible' };
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (error || !data) {
      return { valid: false, message: 'Cupón no encontrado' };
    }

    if (!data.active) {
      return { valid: false, message: 'Este cupón está inactivo' };
    }

    if (data.max_usage && data.times_used >= data.max_usage) {
      return { valid: false, message: 'Este cupón ya alcanzó su límite de usos' };
    }

    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      return { valid: false, message: 'Este cupón ha expirado' };
    }

    return { valid: true, coupon: data };
  } catch (e) {
    return { valid: false, message: 'Error validando cupón' };
  }
}

export async function saveGameResultToSupabase(
  gameName: 'atrapa_la_ternura' | 'ruleta_del_destino',
  score: number,
  rewardClaimed: string
) {
  if (!supabase) {
    console.warn('Supabase game result fallback mode.');
    return { success: true, fallback: true };
  }

  try {
    const sessionId = typeof window !== 'undefined'
      ? localStorage.getItem('kawaii_session_id') || Math.random().toString(36).substring(2)
      : 'server_session';

    if (typeof window !== 'undefined') {
      localStorage.setItem('kawaii_session_id', sessionId);
    }

    const { data, error } = await supabase
      .from('game_results')
      .insert([
        {
          session_id: sessionId,
          game_name: gameName,
          score: score,
          reward_claimed: rewardClaimed
        }
      ]);

    if (error) console.error('Error saving game result:', error);
    return { success: !error };
  } catch (e) {
    console.error('Game result exception:', e);
    return { success: false };
  }
}

// User Profile Supabase Queries
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Profile fetch notice:', error.message);
      return null;
    }
    return data as UserProfile | null;
  } catch (e) {
    return null;
  }
}

export async function updateUserProfileInSupabase(userId: string, profileData: Partial<UserProfile>) {
  if (!supabase) return { success: false };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (e) {
    console.error('Update profile exception:', e);
    return { success: false, error: e };
  }
}

// User Saved Addresses Supabase Queries
export async function fetchUserAddressesFromSupabase(userId: string): Promise<UserAddress[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
    return (data || []) as UserAddress[];
  } catch (e) {
    console.error('Fetch addresses exception:', e);
    return [];
  }
}

export async function saveUserAddressToSupabase(addressData: Omit<UserAddress, 'id'>) {
  if (!supabase) return { success: false };
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert([addressData])
      .select();

    if (error) {
      console.error('Error saving address:', error);
      return { success: false, error };
    }
    return { success: true, data: data[0] };
  } catch (e) {
    console.error('Save address exception:', e);
    return { success: false, error: e };
  }
}

export async function deleteUserAddressFromSupabase(addressId: string) {
  if (!supabase) return { success: false };
  try {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);

    return { success: !error };
  } catch (e) {
    console.error('Delete address exception:', e);
    return { success: false };
  }
}
