import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { useUser } from '../context/UserContext';

const OrderTracker: React.FC = () => {
    const { user } = useUser();
    const [searchId, setSearchId] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [foundOrders, setFoundOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [historyIds, setHistoryIds] = useState<string[]>([]);

    // Fetch user orders if logged in
    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user) {
                setLoading(true);
                try {
                    const orders = await orderService.getOrdersByUser(user.uid);
                    setFoundOrders(orders);
                } catch (err) {
                    console.error("Failed to fetch user orders", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserOrders();
    }, [user]);

    // Effect to handle subscription whenever activeId changes
    useEffect(() => {
        setHistoryIds(orderService.getOrderHistory());
        if (!activeId) return;

        const unsubscribe = orderService.subscribeToOrder(activeId, (updatedOrder) => {
            if (updatedOrder) {
                setOrder(updatedOrder);
                setError('');
            } else {
                setOrder(null);
                setError('Order not found. Please check your ID.');
                setActiveId(null);
            }
        });

        return () => unsubscribe();
    }, [activeId]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setError('');
        setFoundOrders([]);

        try {
            // Check if it's a phone number or ID
            if (/^\d{10,}$/.test(searchId.replace(/\D/g, ''))) {
                const orders = await orderService.getOrdersByPhone(searchId.replace(/\D/g, ''));
                if (orders.length > 0) {
                    setFoundOrders(orders);
                } else {
                    setError('No orders found for this phone number.');
                }
            } else {
                setActiveId(searchId.toUpperCase());
            }
        } catch (err) {
            setError('Failed to search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2 font-serif">Track Your Order</h2>
                        <p className="text-stone-500">Enter your Order ID or phone number to see the status.</p>
                    </div>

                    {!activeId && (
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Order ID or Phone Number"
                                className="flex-grow bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all text-lg"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-800 text-white font-bold py-4 px-8 rounded-2xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/10 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Active Order Details */}
                    {activeId && order && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="flex justify-between items-center border-b border-stone-100 pb-6">
                                <div>
                                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Order ID</h3>
                                    <p className="text-xl font-bold text-stone-800 font-mono">#{activeId}</p>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={() => {
                                            setActiveId(null);
                                            setOrder(null);
                                        }}
                                        className="text-emerald-800 font-bold text-sm hover:underline"
                                    >
                                        ← Search Another
                                    </button>
                                </div>
                            </div>

                            {/* Status Stepper */}
                            <div className="grid grid-cols-4 gap-2 relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -translate-y-1/2 -z-10"></div>
                                {['pending', 'preparing', 'ready', 'completed'].map((status, idx) => {
                                    const isActive = order.status === status;
                                    const isDone = ['pending', 'preparing', 'ready', 'completed'].indexOf(order.status) >= idx;

                                    return (
                                        <div key={status} className="flex flex-col items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all duration-500 ${
                                                isActive ? 'bg-emerald-600 text-white scale-110 ring-8 ring-emerald-50' : 
                                                isDone ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-50 text-stone-300'
                                            }`}>
                                                {status === 'pending' && '📝'}
                                                {status === 'preparing' && '👨‍🍳'}
                                                {status === 'ready' && '🛍️'}
                                                {status === 'completed' && '✅'}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${
                                                isActive ? 'text-emerald-800' : 'text-stone-400'
                                            }`}>
                                                {status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-stone-50 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500">Customer</span>
                                    <span className="font-bold text-stone-800">{order.customerName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500">Placed At</span>
                                    <span className="font-bold text-stone-800">{new Date(order.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-stone-200">
                                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Items</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-stone-600">{item.quantity}x {item.name}</span>
                                                <span className="font-medium text-stone-800">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center">
                                        <span className="font-bold text-stone-800">Total</span>
                                        <span className="text-lg font-bold text-emerald-800">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order History (localStorage) */}
                    {!activeId && !foundOrders.length && historyIds.length > 0 && (
                        <div className="mt-10 border-t border-stone-100 pt-8">
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Recent Browsing History
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {historyIds.map(id => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveId(id)}
                                        className="bg-stone-50 hover:bg-emerald-50 border border-stone-100 hover:border-emerald-200 text-stone-600 hover:text-emerald-800 p-3 rounded-xl text-xs font-mono font-bold transition-all text-center uppercase tracking-widest shadow-sm hover:shadow-md"
                                    >
                                        #{id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Found Orders List (Phone or User Search Results) */}
                    {!activeId && foundOrders.length > 0 && (
                        <div className="mt-10 border-t border-stone-100 pt-8 animate-fadeIn">
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {user ? 'My Account Orders' : 'Orders Found'}
                            </h3>
                            <div className="space-y-3">
                                {foundOrders.map(o => (
                                    <button
                                        key={o.id}
                                        onClick={() => setActiveId(o.id)}
                                        className="w-full flex items-center justify-between bg-stone-50 hover:bg-emerald-50 border border-stone-100 hover:border-emerald-200 p-4 rounded-2xl transition-all group"
                                    >
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600 transition-colors">#{o.id}</p>
                                            <p className="text-sm font-bold text-stone-800">{new Date(o.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                                o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {o.status}
                                            </span>
                                            <span className="text-emerald-800 group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {!user && (
                                <button
                                    onClick={() => setFoundOrders([])}
                                    className="mt-6 w-full text-center text-xs text-stone-400 hover:text-stone-600 font-bold uppercase tracking-widest"
                                >
                                    Clear Search Results
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;
