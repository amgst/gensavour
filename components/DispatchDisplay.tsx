import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

const DispatchDisplay: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders((allOrders) => {
            const readyOrders = allOrders.filter(o => o.status === 'ready');
            setOrders(readyOrders);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const completeOrder = async (id: string) => {
        if (!window.confirm("Confirm order has been picked up/dispatched?")) return;
        try {
            await orderService.updateOrderStatus(id, 'completed');
        } catch (error) {
            alert("Failed to complete order");
        }
    };

    if (loading) return <div className="p-8 text-center text-2xl font-bold text-stone-500">Loading Dispatch...</div>;

    return (
        <div className="min-h-screen bg-stone-100 p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-serif text-emerald-900">DISPATCH & HANDOFF</h1>
                    <p className="text-stone-500 mt-1">Ready for Pickup / Delivery</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-stone-200">
                    <span className="text-stone-400 uppercase tracking-widest text-xs font-bold mr-3">Ready Count</span>
                    <span className="text-2xl font-bold text-emerald-800">{orders.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden flex flex-col">
                        <div className={`p-6 ${order.type === 'delivery' ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.type === 'delivery' ? 'bg-indigo-200 text-indigo-800' : 'bg-emerald-200 text-emerald-800'
                                    }`}>
                                    {order.type}
                                </span>
                                <span className="text-stone-500 font-mono font-bold">#{order.id.slice(0, 6)}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-1">{order.customerName}</h3>
                            <p className="text-sm font-bold text-stone-500">{order.phone}</p>

                            {order.type === 'delivery' && (
                                <div className="mt-4 bg-white/60 p-3 rounded-lg border border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Destination</p>
                                    <p className="text-indigo-900 font-medium leading-tight">{order.address}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-grow">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Order Items</h4>
                            <ul className="space-y-2 mb-6">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-sm">
                                        <span className="text-stone-800"><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 pt-0 mt-auto">
                            <button
                                onClick={() => completeOrder(order.id)}
                                className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shadow-lg"
                            >
                                {order.type === 'delivery' ? 'Dispatch Driver' : 'Confirm Pickup'}
                            </button>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full py-20 text-center text-stone-400">
                        <div className="text-6xl mb-4 opacity-20">👍</div>
                        <p className="text-xl font-bold">All Ready Orders Cleared</p>
                        <p>Kitchen is working on more...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DispatchDisplay;
