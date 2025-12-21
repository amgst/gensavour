
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock passcode for demonstration
    if (passcode === 'admin123' || passcode === 'gensavor') {
      onLogin();
    } else {
      setError('Invalid administrative passcode.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-stone-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-emerald-50 text-emerald-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 font-serif">Core Access</h2>
          <p className="text-stone-500 mt-2">Enter credentials to refine the culinary engine</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="passcode" className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">System Key</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 shadow-sm"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white font-bold py-4 rounded-xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
          >
            Authenticate
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-stone-400 uppercase tracking-widest">
          GenSavor AI Cuisine • Restricted Area
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
