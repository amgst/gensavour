import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';

const KitchenDisplay: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const prevOrdersRef = React.useRef<Order[]>([]);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

        // Subscribe to live updates
        const unsubscribe = orderService.subscribeToOrders((allOrders) => {
            const kitchenOrders = allOrders.filter(o =>
                o.status === 'pending' || o.status === 'preparing'
            );

            // Sort logic
            kitchenOrders.sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                }
                return a.status === 'pending' ? -1 : 1;
            });

            // Check for NEW pending orders for Audio Alert
            const previousPendingIds = prevOrdersRef.current
                .filter(o => o.status === 'pending')
                .map(o => o.id);

            const currentPending = kitchenOrders.filter(o => o.status === 'pending');

            const hasNewPending = currentPending.some(o => !previousPendingIds.includes(o.id));

            if (hasNewPending && audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed):", e));
            }

            setOrders(kitchenOrders);
            prevOrdersRef.current = kitchenOrders;
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const advanceOrder = async (order: Order) => {
        const newStatus: OrderStatus = order.status === 'pending' ? 'preparing' : 'ready';
        try {
            await orderService.updateOrderStatus(order.id, newStatus);
        } catch (error) {
            alert("Failed to update order");
        }
    };

    if (loading) return <div className="p-8 text-center text-2xl font-bold text-stone-400">Connecting to Kitchen...</div>;

    return (
        <div className="min-h-screen bg-stone-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold font-serif text-emerald-400">KITCHEN DISPLAY</h1>
                <div className="text-right">
                    <p className="text-sm text-stone-400 uppercase tracking-widest">Active Tickets</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.map(order => (
                    <div key={order.id} className={`rounded-xl border-t-8 p-6 flex flex-col h-full bg-stone-800 ${order.status === 'pending' ? 'border-amber-500 animate-pulse-slow' : 'border-blue-500'
                        }`}>
                        <div className="flex justify-between items-start mb-4 border-b border-stone-700 pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white">#{order.id.slice(0, 4)}</h3>
                                <p className="text-sm text-stone-400">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-500 text-stone-900' : 'bg-blue-500 text-white'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        {order.notes && (
                            <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg mb-4">
                                <p className="text-red-300 text-sm font-bold uppercase mb-1">Alert</p>
                                <p className="text-red-200 text-sm italic">"{order.notes}"</p>
                            </div>
                        )}

                        <div className="flex-grow space-y-3 mb-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start text-lg">
                                    <span className="font-bold text-emerald-400 w-8">{item.quantity}x</span>
                                    <span className="flex-grow text-stone-200 leading-tight">{item.name}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => advanceOrder(order)}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all transform active:scale-[0.98] ${order.status === 'pending'
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                }`}
                        >
                            {order.status === 'pending' ? 'Start Prep' : 'Mark Ready'}
                        </button>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-stone-700 rounded-3xl text-stone-500">
                        <p className="text-2xl font-bold mb-2">All Clear</p>
                        <p>Waiting for incoming orders...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenDisplay;
