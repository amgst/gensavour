import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order } from '../types';

const OrderTracker: React.FC = () => {
    const location = useLocation();
    const [searchMode, setSearchMode] = useState<'id' | 'phone'>('id');
    const [inputId, setInputId] = useState('');
    const [activeId, setActiveId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [foundOrders, setFoundOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Effect to handle subscription whenever activeId changes
    React.useEffect(() => {
        if (!activeId) return;

        setLoading(true);
        setError('');
        setOrder(null);
        setFoundOrders([]); // Clear search results when viewing an order

        const unsubscribe = orderService.subscribeToOrder(activeId, (updatedOrder) => {
            setLoading(false);
            if (updatedOrder) {
                setOrder(updatedOrder);
            } else {
                setError('Order not found. Please check your ID.');
                setOrder(null);
            }
        });

        return () => unsubscribe();
    }, [activeId]);

    // Check URL params on mount
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get('id');
        if (idParam) {
            setInputId(idParam);
            setActiveId(idParam);
        }
    }, [location]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!inputId.trim()) return;

        if (searchMode === 'id') {
            // If searching by ID, just set activeId to trigger subscription
            setActiveId(inputId.trim());
        } else {
            // Search by Phone
            setLoading(true);
            setOrder(null);
            setActiveId('');
            try {
                const results = await orderService.getOrdersByPhone(inputId.trim());
                if (results.length === 0) {
                    setError('No active orders found for this phone number.');
                    setFoundOrders([]);
                } else {
                    setFoundOrders(results);
                }
            } catch (err) {
                setError('Failed to search orders. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'preparing', 'ready', 'completed'];
        return steps.indexOf(status);
    };

    const currentStep = order ? getStatusStep(order.status) : -1;

    return (
        <div className="min-h-screen bg-stone-50 py-24 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-stone-900">Track Your Order</h1>
                    <p className="text-stone-600">Enter your Order ID or Phone Number to see live updates.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-stone-100">
                    {/* Search Mode Tabs */}
                    <div className="flex bg-stone-100 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => { setSearchMode('id'); setInputId(''); setError(''); setFoundOrders([]); }}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${searchMode === 'id' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            By Order ID
                        </button>
                        <button
                            onClick={() => { setSearchMode('phone'); setInputId(''); setError(''); setFoundOrders([]); }}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${searchMode === 'phone' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            By Phone
                        </button>
                    </div>

                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <input
                            type={searchMode === 'phone' ? "tel" : "text"}
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                            placeholder={searchMode === 'phone' ? "(555) 000-0000" : "Enter Order ID (e.g. 7X2...)"}
                            className="flex-grow bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-stone-800 uppercase tracking-widest"
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputId}
                            className="bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-lg shadow-emerald-900/20"
                        >
                            {loading ? 'Searching...' : (searchMode === 'phone' ? 'Find Orders' : 'Track')}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Found Orders List (Phone Search Results) */}
                    {foundOrders.length > 0 && (
                        <div className="mt-8 space-y-4 animate-slideDown">
                            <h3 className="font-bold text-stone-900 uppercase tracking-widest text-xs border-b border-stone-100 pb-2">Found {foundOrders.length} Orders</h3>
                            {foundOrders.map(found => (
                                <div key={found.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-emerald-200 transition-colors">
                                    <div>
                                        <div className="font-bold text-stone-900">
                                            {found.publicId ? `#${found.publicId}` : 'Order'}
                                            <span className={`ml-3 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${found.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    found.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'
                                                }`}>
                                                {found.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-stone-500 mt-1">
                                            {new Date(found.timestamp).toLocaleDateString()} • ${found.total.toFixed(2)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveId(found.publicId || found.id)}
                                        className="text-emerald-800 font-bold text-sm hover:underline uppercase tracking-wide"
                                    >
                                        Track &rarr;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {order && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 animate-fadeIn">
                        <div className="bg-emerald-900 p-8 text-center">
                            <p className="text-emerald-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">Order Status</p>
                            <h2 className="text-3xl font-bold text-white mb-1">
                                {order.status === 'completed' ? 'Enjoy your meal!' :
                                    order.status === 'ready' ? 'Ready for Pickup!' :
                                        order.status === 'preparing' ? 'Chef is Cooking...' : 'Order Received'}
                            </h2>
                            <p className="text-emerald-200/60 font-mono text-sm mt-4">ID: {order.publicId || order.id}</p>
                        </div>

                        <div className="p-8 md:p-12">
                            {/* Stepper */}
                            <div className="relative flex justify-between mb-12">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -translate-y-1/2 z-0"></div>
                                <div className={`absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-out`} style={{ width: `${(currentStep / 3) * 100}%` }}></div>

                                {['Pending', 'Preparing', 'Ready', 'Completed'].map((step, idx) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${idx <= currentStep ? 'bg-emerald-500 border-emerald-500 scale-125' : 'bg-white border-stone-200'
                                            }`}></div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-500 ${idx <= currentStep ? 'text-emerald-800' : 'text-stone-300'
                                            }`}>{step}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-stone-100 pt-8">
                                <h3 className="font-bold text-stone-800 uppercase tracking-widest text-xs mb-4">Order Details</h3>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-stone-600"><span className="font-bold text-stone-900">{item.quantity}x</span> {item.name}</span>
                                        <span className="text-stone-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 border-t border-stone-100 mt-4 text-lg font-bold text-emerald-900">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracker;
