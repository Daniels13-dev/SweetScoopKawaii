'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { OrdersDashboard } from '@/components/admin/OrdersDashboard';
import { AdminStats } from '@/components/admin/AdminStats';
import { CouponsManagement } from '@/components/admin/CouponsManagement';
import { ShieldAlert, Loader2, LogOut, LayoutDashboard, Package, Ticket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

type Tab = 'stats' | 'orders' | 'coupons';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  useEffect(() => {
    // Give AuthContext a moment to load from localStorage on first render
    const timeout = setTimeout(() => {
      if (user === null) {
        router.push('/');
      } else if (user.role !== 'superadmin') {
        router.push('/');
      } else {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-pink-50/20 items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="mt-4 font-bold text-pink-800">Verificando credenciales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 sm:pt-32">
        <div className="mb-8 border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Panel Administrativo</h1>
              <p className="text-sm font-medium text-slate-500">
                Gestión de pedidos e inventario de Sweet Scoop Kawaii
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'stats'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Gestión de Pedidos
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'coupons'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Cupones Mágicos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'orders' && <OrdersDashboard />}
        {activeTab === 'coupons' && <CouponsManagement />}
      </main>
    </div>
  );
}
