'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { fetchAllCoupons, createCoupon, toggleCouponStatus } from '@/lib/supabase/client';

export function CouponsManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_percent: 10,
    max_usage: 100
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const data = await fetchAllCoupons();
    setCoupons(data);
    setLoading(false);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const res = await createCoupon({
      code: newCoupon.code.toUpperCase().trim(),
      discount_percent: newCoupon.discount_percent,
      max_usage: newCoupon.max_usage
    });

    if (res.success) {
      setNewCoupon({ code: '', discount_percent: 10, max_usage: 100 });
      await loadCoupons();
    } else {
      alert('Error al crear el cupón (Asegúrate de que el código no exista).');
    }
    setIsCreating(false);
  };

  const handleToggleStatus = async (couponId: string, currentStatus: boolean) => {
    await toggleCouponStatus(couponId, !currentStatus);
    await loadCoupons();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-600" />
          Crear Nuevo Cupón
        </h3>
        
        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Código</label>
            <input
              type="text"
              required
              value={newCoupon.code}
              onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none uppercase font-black"
              placeholder="EJ: VERANO20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">% Descuento</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={newCoupon.discount_percent}
              onChange={e => setNewCoupon({ ...newCoupon, discount_percent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Límite de Usos</label>
            <input
              type="number"
              required
              min="1"
              value={newCoupon.max_usage}
              onChange={e => setNewCoupon({ ...newCoupon, max_usage: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creando...' : 'Guardar Cupón'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-black">Código</th>
              <th className="p-4 font-black">Descuento</th>
              <th className="p-4 font-black">Usos</th>
              <th className="p-4 font-black">Estado</th>
              <th className="p-4 font-black text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-500" />
                    <span className="font-black text-slate-800">{coupon.code}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-pink-600">{coupon.discount_percent}% OFF</span>
                </td>
                <td className="p-4 text-sm text-slate-600 font-medium">
                  {coupon.times_used} / {coupon.max_usage}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${
                    coupon.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {coupon.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(coupon.id, coupon.active)}
                    className={`p-2 rounded-xl border ${
                      coupon.active 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    } transition-colors`}
                    title={coupon.active ? 'Desactivar' : 'Activar'}
                  >
                    {coupon.active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                  No hay cupones creados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
