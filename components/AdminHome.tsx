
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, CATEGORIES } from '../types';

interface AdminHomeProps {
  menu: MenuItem[];
}

const AdminHome: React.FC<AdminHomeProps> = ({ menu }) => {
  const navigate = useNavigate();
  const stats = {
    total: menu.length,
    popular: menu.filter(m => m.isPopular).length,
    categories: Object.values(CATEGORIES).length,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-stone-800 font-serif">Welcome, Manager</h1>
        <p className="text-stone-500 mt-2">Here is a quick overview of your restaurant's digital presence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-stone-500 uppercase tracking-widest text-xs font-bold mb-2">Total Dishes</p>
          <p className="text-5xl font-bold text-emerald-800">{stats.total}</p>
          <div className="mt-4 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-stone-500 uppercase tracking-widest text-xs font-bold mb-2">Featured Items</p>
          <p className="text-5xl font-bold text-amber-500">{stats.popular}</p>
          <div className="mt-4 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full" style={{ width: `${(stats.popular / stats.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-stone-500 uppercase tracking-widest text-xs font-bold mb-2">Active Categories</p>
          <p className="text-5xl font-bold text-stone-800">{stats.categories}</p>
          <div className="mt-4 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-stone-400 h-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      <div className="mb-8 mt-12">
        <h2 className="text-2xl font-bold text-stone-800 font-serif">Quick Actions</h2>
        <p className="text-stone-500 mt-1">Manage your restaurant operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {/* Manage Menu Card */}
        <button
          onClick={() => navigate('/admin/menu')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-left hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-emerald-800 transition-colors">Manage Menu</h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">Add items, prices, and descriptions.</p>
          <div className="flex items-center text-emerald-800 font-bold text-xs uppercase tracking-widest gap-2">
            <span>Edit Content</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* View Orders Card */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-left hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            📋
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-blue-800 transition-colors">All Orders</h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">View incoming and past orders.</p>
          <div className="flex items-center text-blue-800 font-bold text-xs uppercase tracking-widest gap-2">
            <span>View List</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Kitchen View Card */}
        <button
          onClick={() => navigate('/admin/kitchen')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-left hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            👨‍🍳
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-800 transition-colors">Kitchen Display</h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">Grid view for chefs and prep staff.</p>
          <div className="flex items-center text-amber-800 font-bold text-xs uppercase tracking-widest gap-2">
            <span>Open KDS</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Dispatch View Card */}
        <button
          onClick={() => navigate('/admin/dispatch')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-left hover:shadow-md hover:border-indigo-200 transition-all group"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            🛵
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-indigo-800 transition-colors">Dispatch View</h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">Manage pickups and deliveries.</p>
          <div className="flex items-center text-indigo-800 font-bold text-xs uppercase tracking-widest gap-2">
            <span>Open Dashboard</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Analytics Card */}
        <button
          onClick={() => navigate('/admin/analytics')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-left hover:shadow-md hover:border-emerald-200 transition-all group lg:col-span-full xl:col-span-1"
        >
          <div className="w-12 h-12 bg-stone-100 text-stone-800 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
            📈
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-emerald-800 transition-colors">Analytics</h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">Revenue, trends, and popular items.</p>
          <div className="flex items-center text-emerald-800 font-bold text-xs uppercase tracking-widest gap-2">
            <span>View Report</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
