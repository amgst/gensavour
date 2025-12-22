import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders((activeOrders) => {
            setOrders(activeOrders);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800';
            case 'preparing': return 'bg-blue-100 text-blue-800';
            case 'ready': return 'bg-emerald-100 text-emerald-800';
            case 'completed': return 'bg-stone-100 text-stone-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-stone-100 text-stone-800';
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-stone-500">Loading Orders...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn pb-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-stone-800 font-serif">Incoming Orders</h1>
                    <p className="text-stone-500 text-sm mt-1">Monitor kitchen flow and fulfillment.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-stone-900">#{order.id.slice(0, 8).toUpperCase()}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">{order.type}</span>
                                    </div>
                                    <p className="text-stone-500 text-sm">{new Date(order.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-emerald-900">${order.total.toFixed(2)}</p>
                                    <p className="text-xs text-stone-400 font-bold uppercase">{order.items.length} Items</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 rounded-xl p-4 mb-4 border border-stone-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-bold text-stone-700 mb-1">Customer</p>
                                        <p className="text-stone-600">{order.customerName}</p>
                                        <p className="text-stone-500 text-xs">{order.phone} • {order.email}</p>
                                    </div>
                                    {order.type === 'delivery' && (
                                        <div>
                                            <p className="font-bold text-stone-700 mb-1">Destination</p>
                                            <p className="text-stone-600">{order.address}</p>
                                        </div>
                                    )}
                                    {order.notes && (
                                        <div className="col-span-full mt-2 pt-2 border-t border-stone-200">
                                            <p className="font-bold text-stone-700 mb-1">Directives</p>
                                            <p className="text-stone-600 italic">"{order.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-50 last:border-0 pb-1 last:pb-0">
                                        <span className="text-stone-700"><span className="font-bold text-stone-900">{item.quantity}x</span> {item.name}</span>
                                        <span className="text-stone-400">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:w-48 flex flex-col justify-center gap-2 border-l border-stone-100 pl-0 md:pl-6">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Update Status</p>
                            <button
                                onClick={() => handleStatusChange(order.id, 'preparing')}
                                disabled={order.status === 'preparing'}
                                className="w-full py-2 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 font-bold text-xs uppercase hover:bg-blue-100 disabled:opacity-50"
                            >
                                Preparing
                            </button>
                            <button
                                onClick={() => handleStatusChange(order.id, 'ready')}
                                disabled={order.status === 'ready'}
                                className="w-full py-2 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase hover:bg-emerald-100 disabled:opacity-50"
                            >
                                Ready
                            </button>
                            <button
                                onClick={() => handleStatusChange(order.id, 'completed')}
                                disabled={order.status === 'completed'}
                                className="w-full py-2 rounded-lg border border-stone-200 bg-stone-100 text-stone-600 font-bold text-xs uppercase hover:bg-stone-200 disabled:opacity-50"
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 text-stone-400">
                        No active orders in the pipeline.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
