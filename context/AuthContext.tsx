'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserAddress } from '@/lib/types';
import {
  supabase,
  fetchUserProfile,
  updateUserProfileInSupabase,
  fetchUserAddressesFromSupabase,
  saveUserAddressToSupabase,
  deleteUserAddressFromSupabase
} from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  addresses: UserAddress[];
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: { full_name: string; whatsapp: string; city: string; email: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  addAddress: (addressData: Omit<UserAddress, 'id' | 'user_id'>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Load user session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check local storage fallback user
    const savedUser = localStorage.getItem('kawaii_user_profile');
    const savedAddresses = localStorage.getItem('kawaii_user_addresses');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }

    // Check Supabase session if configured
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadSupabaseUserData(session.user.id, session.user.email || '');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadSupabaseUserData(session.user.id, session.user.email || '');
        } else {
          // Clear if logged out from Supabase
          if (!localStorage.getItem('kawaii_user_profile')) {
            setUser(null);
            setAddresses([]);
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loadSupabaseUserData = async (userId: string, email: string) => {
    const profile = await fetchUserProfile(userId);
    if (profile) {
      setUser(profile);
      localStorage.setItem('kawaii_user_profile', JSON.stringify(profile));
    } else {
      // Initialize default profile
      const newProf: UserProfile = {
        id: userId,
        email,
        full_name: email.split('@')[0],
        whatsapp: '',
        city: 'Manizales'
      };
      setUser(newProf);
      localStorage.setItem('kawaii_user_profile', JSON.stringify(newProf));
    }

    const userAddrs = await fetchUserAddressesFromSupabase(userId);
    setAddresses(userAddrs);
    localStorage.setItem('kawaii_user_addresses', JSON.stringify(userAddrs));
  };

  const login = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Por favor ingresa tu correo electrónico.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password || '123456'
        });

        if (error) {
          console.warn('Supabase auth login fallback used:', error.message);
        } else if (data.user) {
          await loadSupabaseUserData(data.user.id, data.user.email || cleanEmail);
          setIsAuthOpen(false);
          return { success: true, message: '¡Bienvenido(a) de nuevo! ✨' };
        }
      } catch (e) {
        console.warn('Supabase login exception:', e);
      }
    }

    // Fallback demo login
    const demoProfile: UserProfile = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0],
      whatsapp: '3001234567',
      city: 'Manizales'
    };

    setUser(demoProfile);
    localStorage.setItem('kawaii_user_profile', JSON.stringify(demoProfile));
    setIsAuthOpen(false);
    return { success: true, message: '¡Sesión iniciada con éxito! 💖' };
  };

  const signup = async (data: { full_name: string; whatsapp: string; city: string; email: string; password?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.full_name || !data.whatsapp) {
      return { success: false, message: 'Por favor completa todos los campos requeridos.' };
    }

    let userId = 'usr_' + Date.now();

    if (supabase) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password || '123456'
        });

        if (authData.user) {
          userId = authData.user.id;
        }
      } catch (e) {
        console.warn('Supabase signup exception, using fallback:', e);
      }
    }

    const newProfile: UserProfile = {
      id: userId,
      email: cleanEmail,
      full_name: data.full_name,
      whatsapp: data.whatsapp,
      city: data.city || 'Manizales'
    };

    // Save profile to Supabase if configured
    if (supabase && !userId.startsWith('usr_')) {
      await updateUserProfileInSupabase(userId, newProfile);
    }

    // Default primary address
    const defaultAddr: UserAddress = {
      id: 'addr_' + Date.now(),
      user_id: userId,
      label: 'Principal',
      recipient_name: data.full_name,
      recipient_phone: data.whatsapp,
      city: data.city || 'Manizales',
      address_line: '',
      is_default: true
    };

    setUser(newProfile);
    setAddresses([defaultAddr]);
    localStorage.setItem('kawaii_user_profile', JSON.stringify(newProfile));
    localStorage.setItem('kawaii_user_addresses', JSON.stringify([defaultAddr]));

    setIsAuthOpen(false);
    return { success: true, message: '¡Cuenta creada con éxito! Bienvenida(o) a Sweet Scoop 🎀' };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setAddresses([]);
    localStorage.removeItem('kawaii_user_profile');
    localStorage.removeItem('kawaii_user_addresses');
    setIsAccountOpen(false);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return false;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('kawaii_user_profile', JSON.stringify(updated));

    if (supabase && !user.id.startsWith('usr_')) {
      await updateUserProfileInSupabase(user.id, data);
    }
    return true;
  };

  const addAddress = async (addressData: Omit<UserAddress, 'id' | 'user_id'>) => {
    if (!user) return false;

    const newAddr: UserAddress = {
      id: 'addr_' + Date.now(),
      user_id: user.id,
      ...addressData,
      is_default: addresses.length === 0 ? true : addressData.is_default
    };

    // If setting default, unset others
    let updatedAddrs = [...addresses];
    if (newAddr.is_default) {
      updatedAddrs = updatedAddrs.map(a => ({ ...a, is_default: false }));
    }
    updatedAddrs.push(newAddr);

    setAddresses(updatedAddrs);
    localStorage.setItem('kawaii_user_addresses', JSON.stringify(updatedAddrs));

    if (supabase && !user.id.startsWith('usr_')) {
      await saveUserAddressToSupabase(newAddr);
    }
    return true;
  };

  const deleteAddress = async (addressId: string) => {
    const updated = addresses.filter(a => a.id !== addressId);
    setAddresses(updated);
    localStorage.setItem('kawaii_user_addresses', JSON.stringify(updated));

    if (supabase && user && !user.id.startsWith('usr_')) {
      await deleteUserAddressFromSupabase(addressId);
    }
    return true;
  };

  const setDefaultAddress = async (addressId: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === addressId
    }));
    setAddresses(updated);
    localStorage.setItem('kawaii_user_addresses', JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        isAuthOpen,
        setIsAuthOpen,
        isAccountOpen,
        setIsAccountOpen,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
