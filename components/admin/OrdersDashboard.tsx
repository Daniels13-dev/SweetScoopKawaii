'use client';

import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus, fetchUserProfile } from '@/lib/supabase/client';
import { Loader2, Package, Search, Clock, MapPin, Truck, CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { OrderPayload } from '@/lib/types';

interface OrderRow {
  id: string;
  user_id?: string;
  created_at: string;
  order_number: number;
  customer_name: string;
  whatsapp: string;
  city: string;
  address: string;
  notes: string;
  items: any[];
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  magic_surprise_unlocked: boolean;
  payment_method: string;
  coupon_code: string;
  status: string;
}

export function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      // Intentar enviar email (no bloqueante)
      const order = orders.find(o => o.id === orderId);
      if (order && order.user_id) {
        try {
          // Obtener email del perfil (idealmente esto debería estar en el backend o en la tabla orders)
          const profileInfo = await fetchUserProfile(order.user_id);
          if (profileInfo && profileInfo.email) {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: profileInfo.email,
                subject: `Tu pedido #${order.order_number} ha sido actualizado ✨`,
                type: 'order_updated',
                data: {
                  orderNumber: order.order_number,
                  status: newStatus
                }
              })
            });
          }
        } catch (e) {
          console.error('Error triggering update email:', e);
        }
      }
    } else {
      alert('Error al actualizar el estado del pedido');
    }
    setStatusUpdating(null);
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toString().includes(searchTerm) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente': return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pendiente</span>;
      case 'confirmado': return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 w-fit"><Package className="w-3 h-3"/> Confirmado</span>;
      case 'enviado': return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Enviado</span>;
      case 'entregado': return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Entregado</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por #pedido, cliente o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
        <div className="text-sm font-semibold text-slate-500">
          Total: {orders.length} pedidos
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-slate-100">
        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500 flex flex-col items-center">
            <Package className="w-10 h-10 text-slate-300 mb-3" />
            <p className="font-semibold">No se encontraron pedidos</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="flex flex-col">
              
              {/* Row Header */}
              <div 
                className="p-4 sm:px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 font-black border border-purple-100">
                    #{order.order_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{order.customer_name}</h3>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="font-black text-slate-900">{formatCurrency(order.total_amount)}</p>
                    <div className="mt-1">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                    {expandedId === order.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Detalles del Cliente</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                      <p><span className="font-semibold text-slate-600">WhatsApp:</span> <a href={`https://wa.me/57${order.whatsapp}`} target="_blank" className="text-purple-600 font-bold hover:underline">{order.whatsapp}</a></p>
                      <p><span className="font-semibold text-slate-600">Ciudad:</span> {order.city}</p>
                      <p><span className="font-semibold text-slate-600">Dirección:</span> {order.address}</p>
                      {order.notes && (
                        <div className="mt-2 p-2 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-xs">
                          <strong className="block mb-1">Notas del cliente:</strong>
                          {order.notes}
                        </div>
                      )}
                    </div>

                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Estado del Pedido</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm flex flex-col gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={statusUpdating === order.id}
                        className="w-full p-2.5 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-purple-500"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado (Pagado/Aprobado)</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      {statusUpdating === order.id && <span className="text-xs text-purple-500 animate-pulse font-semibold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Actualizando...</span>}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Resumen de Compra</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      
                      <div className="space-y-3 mb-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="text-2xl">{item.product.worldEmoji}</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-sm text-slate-900">{item.product.worldTitle} - {item.product.sizeName}</h5>
                              <p className="text-xs text-slate-500">Cant: {item.quantity} x {formatCurrency(item.product.price)}</p>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">
                              {formatCurrency(item.product.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Descuento ({order.coupon_code})</span>
                            <span>-{formatCurrency(order.discount_amount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-900 font-black text-base pt-2">
                          <span>Total</span>
                          <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
                        <p className="text-xs font-semibold text-slate-600">Método de pago: <span className="uppercase text-purple-700">{order.payment_method}</span></p>
                        {order.magic_surprise_unlocked && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">
                            <AlertCircle className="w-3.5 h-3.5"/> Incluye Sorpresa Mágica (Ruleta)
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
