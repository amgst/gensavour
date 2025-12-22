
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_INFO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  cartCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount = 0 }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdminArea = location.pathname.startsWith('/admin');
  const authStatus = sessionStorage.getItem('gensavor_admin_auth') === 'true';

  const orderOnlinePath = cartCount > 0 ? '/checkout' : '/menu';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Track Order', path: '/track' },
    { name: 'Our Evolution', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex flex-col items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl md:text-2xl font-bold tracking-widest text-emerald-900 uppercase leading-none">{SITE_INFO.name}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-amber-600">{SITE_INFO.subName}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              {isAdminArea && authStatus ? (
                <>
                  <Link to="/admin" className="text-stone-700 hover:text-emerald-800 transition-colors text-sm font-semibold uppercase tracking-wider">Dashboard</Link>
                  <Link to="/admin/menu" className="text-stone-700 hover:text-emerald-800 transition-colors text-sm font-semibold uppercase tracking-wider">Control Menu</Link>
                  <Link to="/" className="text-stone-700 hover:text-emerald-800 transition-colors text-sm font-semibold uppercase tracking-wider">View Live Site</Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('gensavor_admin_auth');
                      window.location.href = '/';
                    }}
                    className="px-4 py-2 border border-emerald-800 text-emerald-800 rounded-md text-sm font-bold hover:bg-emerald-50 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {navLinks.map(link => (
                    <Link key={link.path} to={link.path} className="text-stone-700 hover:text-emerald-800 transition-colors text-sm font-semibold uppercase tracking-wider">{link.name}</Link>
                  ))}
                  <Link
                    to="/admin"
                    className={`text-sm font-bold uppercase tracking-wider transition-colors ${authStatus ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'}`}
                  >
                    {authStatus ? 'Dashboard' : 'Admin'}
                  </Link>

                  <Link
                    to={orderOnlinePath}
                    className="relative px-6 py-2 bg-emerald-800 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-md flex items-center gap-2"
                  >
                    Order Online
                    {cartCount > 0 && (
                      <span className="bg-amber-400 text-emerald-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Nav Button */}
            <div className="flex md:hidden items-center gap-4">
              {cartCount > 0 && (
                <Link to="/checkout" className="relative p-2 text-emerald-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute top-0 right-0 bg-amber-400 text-emerald-950 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">
                    {cartCount}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect border-b border-stone-200 animate-fadeIn">
            <div className="px-4 pt-4 pb-8 space-y-4 flex flex-col">
              {isAdminArea && authStatus ? (
                <>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-stone-700 uppercase tracking-widest border-b border-stone-100">Dashboard</Link>
                  <Link to="/admin/menu" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-stone-700 uppercase tracking-widest border-b border-stone-100">Control Menu</Link>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-stone-700 uppercase tracking-widest">Live Site</Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('gensavor_admin_auth');
                      window.location.href = '/';
                    }}
                    className="mt-4 px-6 py-3 bg-emerald-800 text-white rounded-xl text-sm font-bold uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {navLinks.map(link => (
                    <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-base font-semibold text-stone-700 uppercase tracking-widest border-b border-stone-100">{link.name}</Link>
                  ))}
                  <Link to={orderOnlinePath} onClick={() => setIsMobileMenuOpen(false)} className="mx-3 mt-4 px-6 py-4 bg-emerald-800 text-white rounded-2xl text-center font-bold uppercase tracking-widest shadow-xl">
                    Order Online ({cartCount})
                  </Link>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-xs text-stone-400 uppercase tracking-widest pt-4">Staff Portal</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-20">
        {children}
      </main>

      {!isAdminArea && (
        <footer className="bg-stone-900 text-stone-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 tracking-widest">{SITE_INFO.name}</h3>
              <p className="text-stone-400 mb-4 leading-relaxed">
                Bringing intelligence-driven flavors to the heart of the city. Join us for a future-forward culinary journey.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-amber-400 font-serif">Visit Us</h4>
              <p className="text-stone-400 mb-2">{SITE_INFO.address}</p>
              <p className="text-stone-400 mb-2">{SITE_INFO.phone}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-amber-400 font-serif">Availability</h4>
              <div className="text-stone-400">
                <p className="mb-2">Mon - Fri: {SITE_INFO.hours.weekdays}</p>
                <p className="mb-2">Sat - Sun: {SITE_INFO.hours.weekends}</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <p>© {new Date().getFullYear()} GenSavor Intelligence. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link to="/showcase" className="hover:text-emerald-600 transition-colors font-bold">Build a Site Like This</Link>
              <Link to="/admin/login" className="hover:underline opacity-50 hover:opacity-100 transition-opacity">Staff Portal</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
