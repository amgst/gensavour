
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

      <div className="bg-emerald-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 font-serif">Ready to update the menu?</h2>
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
            Add new seasonal specials, adjust prices, or use Gemini AI to write compelling descriptions that will delight your customers.
          </p>
          <button
            onClick={() => navigate('/admin/menu')}
            className="bg-amber-400 text-emerald-950 font-bold px-8 py-4 rounded-xl hover:bg-amber-300 transition-all shadow-lg"
          >
            Manage Menu Content
          </button>
        </div>
        <div className="w-64 h-64 bg-emerald-800/50 rounded-full flex items-center justify-center text-8xl grayscale opacity-50">
          🥘
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
