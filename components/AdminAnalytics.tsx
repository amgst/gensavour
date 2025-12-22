import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

const AdminAnalytics: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const allOrders = await orderService.getOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

    // Metrics Calculation
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily Revenue (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyRevenue = last7Days.map(date => {
        const dayRevenue = orders
            .filter(o => o.timestamp.startsWith(date))
            .reduce((sum, o) => sum + o.total, 0);
        return { date, value: dayRevenue };
    });

    const maxRevenue = Math.max(...dailyRevenue.map(d => d.value), 100); // Avoid div by zero

    // Best Selling Items
    const itemCounts: Record<string, number> = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });

    const bestSellers = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn pb-24">
            <h1 className="text-4xl font-bold font-serif text-stone-900 mb-8">Performance Analytics</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg">
                    <p className="text-emerald-200 uppercase tracking-widest text-xs font-bold mb-2">Total Revenue</p>
                    <p className="text-4xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-2">Total Orders</p>
                    <p className="text-4xl font-bold text-stone-800">{totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-2">Completion Rate</p>
                    <p className="text-4xl font-bold text-stone-800">{totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0}%</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-2">My Order Value</p>
                    <p className="text-4xl font-bold text-amber-500">${averageOrderValue.toFixed(0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                    <h3 className="text-xl font-bold font-serif mb-8 text-stone-800">Weekly Revenue Trend</h3>
                    <div className="flex items-end justify-between h-64 gap-2">
                        {dailyRevenue.map((day) => (
                            <div key={day.date} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex items-end justify-center h-full bg-stone-50 rounded-t-xl overflow-hidden">
                                    <div
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-500 rounded-t-xl"
                                        style={{ height: `${(day.value / maxRevenue) * 100}%` }}
                                    ></div>
                                    <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] px-2 py-1 rounded">
                                        ${day.value}
                                    </div>
                                </div>
                                <span className="text-[10px] text-stone-400 mt-2 font-mono">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                    <h3 className="text-xl font-bold font-serif mb-8 text-stone-800">Top Selling Items</h3>
                    <div className="space-y-6">
                        {bestSellers.map(([name, count], idx) => (
                            <div key={name} className="flex items-center gap-4">
                                <span className="font-bold text-stone-300 w-6">0{idx + 1}</span>
                                <div className="flex-grow">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold text-stone-700">{name}</span>
                                        <span className="text-emerald-800 font-bold">{count} sold</span>
                                    </div>
                                    <div className="w-full bg-stone-50 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-amber-400 h-full rounded-full"
                                            style={{ width: `${(count / bestSellers[0][1]) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {bestSellers.length === 0 && <p className="text-stone-400">No sales data yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
