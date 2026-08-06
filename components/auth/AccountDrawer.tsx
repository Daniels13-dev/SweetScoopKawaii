'use client';

import React, { useState } from 'react';
import { X, User, MapPin, Phone, Mail, Plus, Trash2, CheckCircle2, LogOut, Sparkles, Heart, Save, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function AccountDrawer() {
  const {
    user,
    addresses,
    isAccountOpen,
    setIsAccountOpen,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  // Edit Profile state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [city, setCity] = useState(user?.city || 'Manizales');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Casa');
  const [addrRecipient, setAddrRecipient] = useState(user?.full_name || '');
  const [addrPhone, setAddrPhone] = useState(user?.whatsapp || '');
  const [addrCity, setAddrCity] = useState(user?.city || 'Manizales');
  const [addrLine, setAddrLine] = useState('');
  const [addrNotes, setAddrNotes] = useState('');

  if (!isAccountOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      whatsapp,
      city
    });
    setProfileSavedMsg('¡Datos actualizados con éxito! ✨');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    await addAddress({
      label: addrLabel,
      recipient_name: addrRecipient || user.full_name,
      recipient_phone: addrPhone || user.whatsapp,
      city: addrCity || user.city,
      address_line: addrLine,
      notes: addrNotes,
      is_default: addresses.length === 0
    });

    setAddrLine('');
    setAddrNotes('');
    setShowAddAddress(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAccountOpen(false)}
          className="absolute inset-0 bg-pink-950/40 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-pink-200"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-100 border-b border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-500 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-white">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-pink-950 flex items-center gap-1.5">
                    <span>{user.full_name}</span>
                    <Sparkles className="w-4 h-4 text-pink-500" />
                  </h3>
                  <p className="text-xs font-semibold text-pink-700">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAccountOpen(false)}
                className="p-2 rounded-full text-pink-500 hover:bg-pink-200/50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-pink-200 bg-pink-50/50 p-2 gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-pink-600 shadow-sm border border-pink-200'
                    : 'text-pink-900/70 hover:text-pink-950'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Mis Datos</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-white text-pink-600 shadow-sm border border-pink-200'
                    : 'text-pink-900/70 hover:text-pink-950'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Direcciones ({addresses.length})</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: EDIT PROFILE */}
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {profileSavedMsg && (
                    <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-2xl border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{profileSavedMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-pink-950 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-pink-950 mb-1">
                      WhatsApp para Pedidos
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-pink-950 mb-1">
                      Ciudad Predeterminada
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios de Mi Perfil</span>
                  </button>
                </form>
              )}

              {/* TAB 2: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-pink-950 text-sm">
                      Tus Direcciones de Entrega
                    </h4>
                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs flex items-center gap-1 hover:bg-pink-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddAddress ? 'Cancelar' : 'Agregar'}</span>
                    </button>
                  </div>

                  {/* Add New Address Form */}
                  {showAddAddress && (
                    <form onSubmit={handleAddAddressSubmit} className="bg-pink-50/80 p-4 rounded-3xl border border-pink-200 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-pink-900 mb-1">Etiqueta</label>
                          <select
                            value={addrLabel}
                            onChange={e => setAddrLabel(e.target.value)}
                            className="w-full p-2 text-xs font-bold rounded-xl border border-pink-200 bg-white"
                          >
                            <option value="Casa">Casa 🏠</option>
                            <option value="Oficina">Oficina 🏢</option>
                            <option value="Universidad">Universidad 🎓</option>
                            <option value="Otra">Otra 📌</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-pink-900 mb-1">Ciudad</label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={e => setAddrCity(e.target.value)}
                            className="w-full p-2 text-xs rounded-xl border border-pink-200 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-pink-900 mb-1">Dirección de Entrega *</label>
                        <input
                          type="text"
                          required
                          placeholder="Carrera 23 # 45-67, Apto 302..."
                          value={addrLine}
                          onChange={e => setAddrLine(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-pink-600 text-white font-extrabold text-xs shadow-sm hover:bg-pink-700 transition-colors"
                      >
                        Guardar Dirección 🏠
                      </button>
                    </form>
                  )}

                  {/* List of Saved Addresses */}
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 bg-pink-50/50 rounded-3xl border border-pink-100 space-y-2">
                      <Home className="w-8 h-8 text-pink-300 mx-auto" />
                      <p className="text-xs text-pink-800 font-semibold">
                        Aún no tienes direcciones guardadas.
                      </p>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="text-xs font-bold text-pink-600 underline"
                      >
                        Agregar mi primera dirección
                      </button>
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-3xl border transition-all ${
                          addr.is_default
                            ? 'bg-pink-50/90 border-pink-300 shadow-sm'
                            : 'bg-white border-pink-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-pink-950 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                                {addr.label}
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Predeterminada ✨
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-extrabold text-pink-900 pt-1">
                              {addr.address_line}
                            </p>
                            <p className="text-[11px] font-semibold text-pink-700">
                              {addr.city} • Recibe: {addr.recipient_name} ({addr.recipient_phone})
                            </p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="p-1 text-pink-400 hover:text-pink-600"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {!addr.is_default && (
                              <button
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-[10px] font-bold text-pink-600 hover:underline"
                              >
                                Usar principal
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                </div>
              )}

            </div>

            {/* Footer / Logout */}
            <div className="p-6 bg-pink-50/60 border-t border-pink-200">
              <button
                onClick={logout}
                className="w-full py-3 rounded-full bg-white text-pink-700 border border-pink-200 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
