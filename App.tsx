
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminHome from './components/AdminHome';
import AdminOrders from './components/AdminOrders';
import AdminAnalytics from './components/AdminAnalytics';
import KitchenDisplay from './components/KitchenDisplay';
import DispatchDisplay from './components/DispatchDisplay';
import OrderCheckout from './components/OrderCheckout';
import OrderTracker from './components/OrderTracker';
import { MenuItem, Category, CartItem, CATEGORIES } from './types';
import { INITIAL_MENU, SITE_INFO } from './constants';
import { menuService } from './services/menuService';

const HomePage: React.FC<{ menu: MenuItem[] }> = ({ menu }) => {
  const [activeTab, setActiveTab] = useState<Category>(CATEGORIES.ENTREES);
  const popularItems = menu.filter(item => item.isPopular).slice(0, 3);

  // Derive categories from menu if needed, or use a passed prop. For now, we can extract unique categories from the menu.
  // Using a Set to get unique categories from the menu, falling back to defaults if empty.
  const availableCategories = Array.from(new Set(menu.map(item => item.category)));
  const displayCategories = availableCategories.length > 0 ? availableCategories : Object.values(CATEGORIES);

  // Filter menu items for the highlights section (limit to 4 per category for home page)
  const highlightItems = menu.filter(item => item.category === activeTab).slice(0, 4);

  const galleryItems = [
    { url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop", title: "Authentic Traditions", span: "md:col-span-2 md:row-span-2" },
    { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop", title: "Vibrant Greens", span: "md:col-span-1 md:row-span-1" },
    { url: "https://images.unsplash.com/photo-1547928576-a4a33237ce35?q=80&w=1770&auto=format&fit=crop", title: "Hand-Pulled Dough", span: "md:col-span-1 md:row-span-2" },
    { url: "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=1854&auto=format&fit=crop", title: "The Silk Road Spices", span: "md:col-span-1 md:row-span-1" },
    { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop", title: "Open Flame Grilling", span: "md:col-span-2 md:row-span-1" },
    { url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1970&auto=format&fit=crop", title: "An Invitation to Stay", span: "md:col-span-1 md:row-span-1" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop"
            alt="Intelligence-Driven Cuisine"
            className="w-full h-full object-cover brightness-50 scale-105 animate-pulse-slow"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-8xl text-white font-bold mb-6 tracking-tight animate-fadeIn">
            Pure Digital <br /> <span className="text-amber-400 italic font-serif">Hospitality</span>
          </h1>
          <p className="text-base md:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-slideUp">
            Discover a mosaic of flavors refined by intelligence. Handcrafted with traditional essence and future-forward precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp delay-200">
            <Link to="/menu" className="bg-emerald-800 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-emerald-900 transition-all shadow-xl hover:-translate-y-1">
              View Our Menu
            </Link>
            <Link to="/contact" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all shadow-xl hover:-translate-y-1">
              Find Us
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-500">🥘</div>
              <h3 className="text-xl font-bold mb-3 font-serif">Computational Taste</h3>
              <p className="text-stone-500 text-sm leading-relaxed">Leveraging algorithmic refinement to balance ancient spices like saffron and cardamom with absolute precision.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-500">🤝</div>
              <h3 className="text-xl font-bold mb-3 font-serif">Seamless Experience</h3>
              <p className="text-stone-500 text-sm leading-relaxed">In our culture, the guest is paramount. We augment that warmth with seamless digital integration.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-500">🔥</div>
              <h3 className="text-xl font-bold mb-3 font-serif">Mastered Heat</h3>
              <p className="text-stone-500 text-sm leading-relaxed">Our meats are charbroiled over open flames, monitored for perfection to lock in moisture and smoky aromas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Chef's Recommendations</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {popularItems.map(item => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Signature
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-emerald-800 transition-colors">{item.name}</h3>
                <p className="text-stone-600 line-clamp-2 text-sm md:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-800/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">The Neural Palette</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">Menu Highlights</h2>

            <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-3 md:gap-4 mt-8 no-scrollbar">
              {displayCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${activeTab === cat
                    ? 'bg-amber-400 border-amber-400 text-stone-900'
                    : 'border-white/20 text-white hover:border-white/40'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            {highlightItems.map(item => (
              <div key={item.id} className="flex group border-b border-white/10 pb-8 md:pb-10">
                <div className="flex-grow">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg md:text-xl font-bold group-hover:text-amber-400 transition-colors font-serif pr-2">{item.name}</h4>
                    <span className="text-base md:text-lg font-serif text-amber-400 font-bold ml-auto whitespace-nowrap">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-stone-400 text-xs md:text-sm leading-relaxed pr-4 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link to="/menu" className="inline-block border-2 border-amber-400 text-amber-400 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-amber-400 hover:text-stone-900 transition-all uppercase tracking-widest text-xs md:text-sm">
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Gallery Grid */}
      <section className="py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-emerald-800 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">The Intelligence Journal</span>
              <h2 className="text-3xl md:text-6xl font-bold text-stone-900 font-serif leading-tight">Visualizing Our Heritage</h2>
            </div>
            <div className="text-stone-500 italic text-base md:text-lg pb-2 text-center md:text-right">
              Every detail is a data point of flavor.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
            {galleryItems.map((item, i) => (
              <div key={i} className={`relative overflow-hidden group rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-700 ${item.span}`}>
                <img
                  src={item.url}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="text-amber-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">GenSavor Collection</span>
                  <h4 className="text-white text-xl md:text-2xl font-serif transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catering Section */}
      <section className="py-24 bg-emerald-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Events & Celebrations</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">Bring the Feast to Your Table</h2>
              <p className="text-emerald-100 text-base md:text-lg mb-8 leading-relaxed">From intimate celebrations to grand corporate summits, GenSavor provides full-service catering that brings our intelligence-driven flavors to your venue.</p>
              <Link to="/contact" className="inline-block bg-white text-emerald-900 px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-amber-400 transition-all uppercase tracking-widest text-xs md:text-sm shadow-2xl">
                Enquire for Catering
              </Link>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-2xl" alt="Catering 1" />
                <img src="https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=2069&auto=format&fit=crop" className="rounded-2xl shadow-2xl mt-8" alt="Catering 2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Guest Experiences</h2>
            <div className="flex justify-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Sarah J.", text: "The Mantu is out of this world. It's the most authentic refined experience I've found in years." },
              { name: "Michael R.", text: "A truly hidden gem. The service is as precise as the flavors. Highly recommend the lamb chops!" },
              { name: "Elena K.", text: "Beautiful atmosphere and even better food. The rosewater pudding was the perfect end to our meal." }
            ].map((t, i) => (
              <div key={i} className="bg-stone-50 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 hover:shadow-xl transition-all duration-300">
                <p className="text-stone-600 italic mb-8 text-sm md:text-base leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-xs">{t.name[0]}</div>
                  <span className="font-bold text-stone-900 text-xs md:text-sm uppercase tracking-wider">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8 font-serif">A Legacy Refined</h2>
            <p className="text-stone-600 text-base md:text-lg mb-6 leading-relaxed">
              Founded in 2005, GenSavor remains a family-owned sanctuary for traditional culinary arts augmented by modern intelligence. We believe that food is a bridge between cultures and eras.
            </p>
            <p className="text-stone-600 text-base md:text-lg mb-8 leading-relaxed">
              From our slow-cooked lamb shanks to our fragrant basmati rice dishes, every ingredient is sourced with care and prepared using techniques passed down through generations, now refined by digital mastery.
            </p>
            <Link to="/about" className="inline-flex items-center text-emerald-800 font-bold hover:underline group">
              Learn more about our story <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" className="rounded-2xl shadow-lg mt-8 md:mt-12" alt="Kitchen" />
            <img src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1970&auto=format&fit=crop" className="rounded-2xl shadow-lg" alt="Interior" />
          </div>
        </div>
      </section>
    </div>
  );
};

interface MenuPageProps {
  menu: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cart: CartItem[];
}

const MenuPage: React.FC<MenuPageProps> = ({ menu, onAddToCart, cart }) => {
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES.ENTREES);

  // Derive categories from menu or use default
  const availableCategories = Array.from(new Set(menu.map(item => item.category)));
  const displayCategories = availableCategories.length > 0 ? availableCategories : Object.values(CATEGORIES);

  const getItemQuantity = (id: string) => {
    return cart.find(i => i.id === id)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 font-serif">Our Menu</h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg italic">
            "Taste the vibrant spices and authentic aromas through a modern lens."
          </p>
        </div>

        <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-3 md:gap-4 mb-12 md:mb-16 no-scrollbar">
          {displayCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                ? 'bg-emerald-800 text-white shadow-lg'
                : 'bg-white text-stone-500 hover:bg-stone-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
          {menu
            .filter(item => item.category === activeCategory)
            .map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 group relative">
                <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-stone-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors font-serif">
                      {item.name}
                      {item.isPopular && <span className="ml-2 text-[8px] md:text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-full align-middle font-sans uppercase">Popular</span>}
                    </h3>
                    <div className="hidden sm:block flex-grow border-b-2 border-dotted border-stone-200 mx-4"></div>
                    <span className="text-lg md:text-xl font-serif text-emerald-800 font-bold ml-auto">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-stone-500 text-xs md:text-sm leading-relaxed mb-4">{item.description}</p>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-all bg-emerald-50 px-4 py-2 rounded-full w-full sm:w-auto"
                  >
                    <span>+ Add to Order</span>
                    {getItemQuantity(item.id) > 0 && (
                      <span className="bg-amber-400 text-emerald-950 px-2 rounded-full text-[10px]">
                        {getItemQuantity(item.id)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          {menu.filter(item => item.category === activeCategory).length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-400 italic">
              No items in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactPage: React.FC = () => {
  const inputClasses = "w-full bg-stone-50 border-stone-200 border rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 shadow-sm text-stone-900 placeholder-stone-400";

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif">Get in Touch</h1>
            <p className="text-stone-600 text-base md:text-lg mb-12">
              For reservations, catering inquiries, or feedback, please reach out to us. Our system is ready to assist.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shrink-0">📍</div>
                <div>
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-wider font-serif">Location</h4>
                  <p className="text-stone-600 text-sm md:text-base">{SITE_INFO.address}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shrink-0">📞</div>
                <div>
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-wider font-serif">Phone</h4>
                  <p className="text-stone-600 text-sm md:text-base">{SITE_INFO.phone}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shrink-0">🕒</div>
                <div>
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-wider font-serif">Availability</h4>
                  <p className="text-stone-600 text-sm md:text-base">Mon - Fri: {SITE_INFO.hours.weekdays}</p>
                  <p className="text-stone-600 text-sm md:text-base">Sat - Sun: {SITE_INFO.hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-stone-100">
              <h3 className="text-2xl md:text-3xl font-bold mb-8 font-serif">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Name" className={inputClasses} />
                  <input type="email" placeholder="Email" className={inputClasses} />
                </div>
                <input type="text" placeholder="Subject" className={inputClasses} />
                <textarea placeholder="How can we help you?" rows={5} className={`${inputClasses} resize-none`}></textarea>
                <button type="button" className="w-full bg-emerald-800 text-white font-bold py-4 md:py-5 rounded-2xl hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] uppercase tracking-widest text-xs md:text-sm">Submit Query</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const remoteMenu = await menuService.initializeMenu();
        setMenu(remoteMenu);
      } catch (error) {
        console.error("Failed to load menu", error);
        // Fallback or error handling
      }
    };

    fetchMenu();

    const savedCart = sessionStorage.getItem('gensavor_cart');
    const authStatus = sessionStorage.getItem('gensavor_admin_auth');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (authStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('gensavor_cart', JSON.stringify(cart));
  }, [cart]);

  const handleUpdateMenu = async (updatedMenu: MenuItem[]) => {
    console.log("App: handleUpdateMenu called with items:", updatedMenu.length);
    try {
      setMenu(updatedMenu);
      console.log("App: Calling menuService.saveMenu");
      await menuService.saveMenu(updatedMenu);
      console.log("App: menuService.saveMenu completed");
    } catch (e) {
      console.error("App: Error in handleUpdateMenu", e);
      alert("Failed to save changes: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleClearCart = () => setCart([]);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('gensavor_admin_auth', 'true');
  };

  return (
    <Router>
      <Layout cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}>
        <Routes>
          <Route path="/" element={<HomePage menu={menu} />} />
          <Route path="/menu" element={<MenuPage menu={menu} cart={cart} onAddToCart={handleAddToCart} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<OrderCheckout cart={cart} onClearCart={handleClearCart} onUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/about" element={<div className="py-24 max-w-4xl mx-auto px-4"><h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-center md:text-left">Our Evolution</h1><p className="text-stone-600 text-base md:text-lg leading-relaxed text-center md:text-left">Welcome to GenSavor. Our journey began with a simple vision: to bring the authentic hospitality of our heritage into the modern age. We treat every guest as a data point in our story of excellence. Our kitchen is where tradition meets artificial intelligence, creating a sanctuary for those who appreciate the finer details of high-tech dining.</p></div>} />
          <Route path="/track" element={<OrderTracker />} />

          <Route
            path="/admin/login"
            element={isAdminLoggedIn ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />}
          />
          <Route
            path="/admin"
            element={isAdminLoggedIn ? <AdminHome menu={menu} /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/orders"
            element={isAdminLoggedIn ? <AdminOrders /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/kitchen"
            element={isAdminLoggedIn ? <KitchenDisplay /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/dispatch"
            element={isAdminLoggedIn ? <DispatchDisplay /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/analytics"
            element={isAdminLoggedIn ? <AdminAnalytics /> : <Navigate to="/admin/login" />}
          />
          <Route
            path="/admin/menu"
            element={isAdminLoggedIn ? <AdminDashboard menuItems={menu} onUpdateMenu={handleUpdateMenu} /> : <Navigate to="/admin/login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
