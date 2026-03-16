import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { usePrinter } from '../context/PrinterContext';

declare const ReceiptPrinterEncoder: any;

const KitchenDisplay: React.FC = () => {
    const { printer, connectedDevice } = usePrinter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [printAlert, setPrintAlert] = useState<{message: string, type: 'error' | 'warning'} | null>(null);
    const prevOrdersRef = React.useRef<Order[]>([]);
    const printedOrdersRef = React.useRef<Set<string>>(new Set());
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Auto-clear alerts after 5 seconds
    useEffect(() => {
        if (printAlert) {
            const timer = setTimeout(() => setPrintAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [printAlert]);

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

            // Check for NEW pending orders for Audio Alert & Auto-Print
            const previousPendingIds = prevOrdersRef.current
                .filter(o => o.status === 'pending')
                .map(o => o.id);

            const currentPending = kitchenOrders.filter(o => o.status === 'pending');

            const newOrders = currentPending.filter(o => !previousPendingIds.includes(o.id));

            if (newOrders.length > 0) {
                // Play sound for all new orders
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed):", e));
                }

                // Auto-print new orders if printer is connected
                if (connectedDevice) {
                    newOrders.forEach(order => {
                        if (!printedOrdersRef.current.has(order.id)) {
                            printOrder(order);
                            printedOrdersRef.current.add(order.id);
                        }
                    });
                }
            }

            setOrders(kitchenOrders);
            prevOrdersRef.current = kitchenOrders;
            setLoading(false);
        });

        return () => unsubscribe();
    }, [printer, connectedDevice]); // Re-subscribe when printer connects to potentially print pending orders

    const printOrder = async (order: Order) => {
        if (!printer || !printer.device) {
            console.warn('Printer not connected. Skipping auto-print for order:', order.id);
            setPrintAlert({
                message: `Printer is offline! Order #${order.id.slice(0, 4)} was not printed.`,
                type: 'warning'
            });
            return;
        }

        console.log('Printing order:', order.id);

        const encoder = new ReceiptPrinterEncoder({
            language: 'esc-pos',
        });

        let data = encoder
            .initialize()
            .text('GenSavor AI Cuisine')
            .newline()
            .text('================================')
            .newline()
            .text(`Order #${order.id.slice(0, 4)}`)
            .newline()
            .text(new Date(order.timestamp).toLocaleString())
            .newline()
            .text('--------------------------------')
            .newline();

        order.items.forEach(item => {
            const itemLine = `${item.quantity}x ${item.name}`;
            data = data.text(itemLine).newline();
        });

        if (order.notes) {
            data = data.newline().text('--------------------------------').newline().text(`Notes: ${order.notes}`).newline();
        }

        try {
            await printer.print(data.encode());
        } catch (error) {
            console.error('Failed to print:', error);
            setPrintAlert({
                message: `Failed to print Order #${order.id.slice(0, 4)}. Please check printer connection.`,
                type: 'error'
            });
        }
    };

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
        <div className="min-h-screen bg-stone-900 text-white p-6 relative">
            {/* Print Alert Toast */}
            {printAlert && (
                <div className={`fixed top-6 right-6 z-[100] max-w-sm w-full shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-slideIn ${
                    printAlert.type === 'error' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                    <div className="text-2xl">
                        {printAlert.type === 'error' ? '🚨' : '⚠️'}
                    </div>
                    <div className="flex-grow">
                        <p className="font-bold text-sm leading-tight">{printAlert.message}</p>
                    </div>
                    <button 
                        onClick={() => setPrintAlert(null)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold font-serif text-emerald-400">KITCHEN DISPLAY</h1>
                  {connectedDevice ? (
                    <p className="text-emerald-500 text-xs uppercase tracking-widest mt-1">
                      ● Printer Active: {connectedDevice.name}
                    </p>
                  ) : (
                    <p className="text-red-500 text-xs uppercase tracking-widest mt-1">
                      ○ Printer Disconnected
                    </p>
                  )}
                </div>
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

                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => printOrder(order)}
                                    className="flex-1 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                    title="Reprint Receipt"
                                >
                                    <span>🖨️ Print</span>
                                </button>
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => advanceOrder(order)}
                                        className="flex-[2] py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all"
                                    >
                                        Start Prep
                                    </button>
                                )}
                            </div>

                            {order.status !== 'pending' && (
                                <button
                                    onClick={() => advanceOrder(order)}
                                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all transform active:scale-[0.98] bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                                >
                                    Mark Ready
                                </button>
                            )}
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
