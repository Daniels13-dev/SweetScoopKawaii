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
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: orderData.userId || null,
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

    return { success: true, data };
  } catch (err) {
    console.error('Supabase save exception:', err);
    return { success: false, err };
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
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as UserProfile;
  } catch (e) {
    console.error('Fetch profile exception:', e);
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
