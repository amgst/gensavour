import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { orderService } from '../services/orderService';

interface OrderCheckoutProps {
  cart: CartItem[];
  onClearCart: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const OrderCheckout: React.FC<OrderCheckoutProps> = ({ cart, onClearCart, onUpdateQuantity }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'pickup' as 'pickup' | 'delivery',
    address: '',
    notes: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.095; // 9.5% tax
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const id = await orderService.saveOrder({
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        type: formData.type,
        address: formData.type === 'delivery' ? formData.address : undefined,
        notes: formData.notes,
        items: cart,
        subtotal,
        tax,
        total,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      setOrderId(id);
      setIsSubmitted(true);
      onClearCart();
    } catch (error) {
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fadeIn">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-stone-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">System Updated!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Thank you for choosing GenSavor. Our intelligence-driven kitchen has received your request. Your order number is <span className="font-bold text-emerald-800">#{orderId.slice(0, 8).toUpperCase()}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/track?id=${orderId}`} className="inline-block bg-white border-2 border-emerald-800 text-emerald-800 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-all uppercase tracking-widest text-sm shadow-lg">
              Track Status
            </Link>
            <Link to="/" className="inline-block bg-emerald-800 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-900 transition-all uppercase tracking-widest text-sm shadow-lg">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">Your cart is empty</h2>
        <p className="text-stone-600 mb-8">Add some intelligence-driven dishes to get started.</p>
        <Link to="/menu" className="bg-emerald-800 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-900 transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 shadow-sm";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
      <h1 className="text-5xl font-bold mb-12 font-serif text-stone-900">Complete Your Order</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <div className="flex-grow lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-10 font-serif border-b border-stone-100 pb-4">Profile Details</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    placeholder="User Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Contact Link (Phone)</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClasses}
                    placeholder="(818) 555-0123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                  placeholder="name@nexus.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Fulfillment Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'pickup' })}
                    className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-sm ${formData.type === 'pickup' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-50 text-stone-400 border border-stone-200 hover:bg-stone-100'}`}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'delivery' })}
                    className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-sm ${formData.type === 'delivery' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-50 text-stone-400 border border-stone-200 hover:bg-stone-100'}`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              {formData.type === 'delivery' && (
                <div className="animate-slideDown">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Fulfillment Destination</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className={`${inputClasses} resize-none`}
                    placeholder="123 Pamir St, Valley City"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">System Directives (Notes)</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Allergies, door codes, or dietary logic."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-800 text-white py-5 rounded-2xl text-xl font-bold hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-900/20 mt-8 active:scale-[0.99] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : `Initialize Order • $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Summary Section */}
        <div className="lg:w-1/3">
          <div className="bg-stone-900 rounded-3xl p-8 text-white sticky top-24 shadow-2xl font-sans">
            <h3 className="text-xl font-bold mb-8 text-amber-400 border-b border-white/10 pb-4 uppercase tracking-wider">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4 animate-fadeIn">
                  <div className="flex-grow">
                    <p className="font-semibold text-base leading-tight text-white">{item.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-stone-300 font-bold min-w-[1ch] text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-amber-400 text-base">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex justify-between text-stone-400 text-sm font-medium">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400 text-sm font-medium">
                <span>Tax (9.5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 text-white">
                <span>Total</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <p className="mt-8 text-[9px] text-stone-500 text-center uppercase tracking-[0.2em] font-bold">
              Secure Neural Gateway • 256-bit Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
