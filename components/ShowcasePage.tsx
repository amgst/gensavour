import React from 'react';
import { Link } from 'react-router-dom';

const ShowcasePage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen animate-fadeIn font-sans text-stone-900">
            {/* Hero Section */}
            <div className="relative bg-stone-900 text-white py-24 md:py-32 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">Restaurant OS v2.0</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 leading-tight">
                        The Future of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">GenSavor AI</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-stone-300 text-lg md:text-xl leading-relaxed mb-12">
                        A complete operating system for modern restaurants. From customer craving to kitchen completion, powered by real-time data and premium design.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <Link to="/contact" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/30">
                            Get This System
                        </Link>
                        <Link to="/admin/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all border border-white/20">
                            View Admin Demo
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Complete Digital Transformation</h2>
                    <p className="text-stone-500">Everything you need to run a high-efficiency kitchen.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Feature 1 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-emerald-800">📱</div>
                        <h3 className="text-xl font-bold mb-3">Smart Digital Menu</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Beautiful, responsive menu that works on any device. Easy category management and instant updates without reprints.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-amber-600">⚡</div>
                        <h3 className="text-xl font-bold mb-3">Real-Time KDS</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Replace paper tickets with a live Kitchen Display System. Instant "Ding" audio alerts for chefs when orders arrive.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-blue-600">🥡</div>
                        <h3 className="text-xl font-bold mb-3">Live Order Tracking</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Customers can track their meal status (Preparing → Ready) in real-time, reducing "Where is my food?" inquiries.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-purple-600">📊</div>
                        <h3 className="text-xl font-bold mb-3">Performance Analytics</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Track revenue, best-selling items, and peak hours. Make data-driven decisions to optimize your menu.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-rose-600">☁️</div>
                        <h3 className="text-xl font-bold mb-3">Cloud Persistence</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Reliable data storage using Google Firestore. Orders and menus are safe, secure, and accessible from anywhere.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-indigo-600">🎨</div>
                        <h3 className="text-xl font-bold mb-3">Premium Branding</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Custom aesthetics including "Glassmorphism" UI, smooth animations, and tailored typography to match your brand.
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-stone-50 py-24 border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-emerald-800 font-bold tracking-widest uppercase text-xs">Seamless Workflow</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 mt-2">How GenSavor Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Customer Scan', desc: 'Guests scan a QR code to access the smart menu instantly.' },
                            { step: '02', title: 'Smart Order', desc: 'They customize their meal and checkout securely online.' },
                            { step: '03', title: 'Kitchen Alert', desc: 'Chefs hear a ding and see the order appear on the KDS.' },
                            { step: '04', title: 'Live Update', desc: 'Customer tracking updates automatically as food is prepared.' }
                        ].map((item, i) => (
                            <div key={i} className="relative p-6 pt-12 bg-white rounded-3xl shadow-sm border border-stone-100 hover:-translate-y-2 transition-transform duration-300">
                                <span className="absolute -top-6 left-6 text-6xl font-bold text-stone-100 font-serif">{item.step}</span>
                                <h3 className="text-xl font-bold text-stone-900 mb-3 relative z-10">{item.title}</h3>
                                <p className="text-stone-500 text-sm relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Simple One-Time Pricing</h2>
                    <p className="text-stone-500">Pay once, own it forever. No monthly subscriptions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Starter */}
                    <div className="p-8 rounded-3xl border border-stone-200 bg-white">
                        <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs mb-4">Starter</h3>
                        <div className="text-4xl font-bold font-serif mb-6">$199<span className="text-lg text-stone-400 font-sans font-medium">/lifetime</span></div>
                        <ul className="space-y-4 mb-8 text-sm text-stone-600">
                            <li className="flex gap-2"><span>✓</span> Digital Menu</li>
                            <li className="flex gap-2"><span>✓</span> Admin Dashboard</li>
                            <li className="flex gap-2"><span>✓</span> 500 Orders/mo</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border-2 border-stone-900 font-bold hover:bg-stone-900 hover:text-white transition-all">Get Started</button>
                    </div>

                    {/* Pro */}
                    <div className="p-8 rounded-3xl border-2 border-emerald-500 bg-emerald-50 relative transform md:-translate-y-4 shadow-xl">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-widest">Best Value</div>
                        <h3 className="font-bold text-emerald-800 uppercase tracking-widest text-xs mb-4">Professional</h3>
                        <div className="text-4xl font-bold font-serif mb-6 text-emerald-900">$399<span className="text-lg text-emerald-700/60 font-sans font-medium">/lifetime</span></div>
                        <ul className="space-y-4 mb-8 text-sm text-emerald-900 font-medium">
                            <li className="flex gap-2"><span>✓</span> <strong>Real-Time KDS</strong></li>
                            <li className="flex gap-2"><span>✓</span> <strong>Audio Alerts</strong></li>
                            <li className="flex gap-2"><span>✓</span> Unlimited Orders</li>
                            <li className="flex gap-2"><span>✓</span> Analytics Suite</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-emerald-800 text-white font-bold hover:shadow-lg hover:bg-emerald-900 transition-all shadow-emerald-900/20">Upgrade Now</button>
                    </div>

                    {/* Enterprise */}
                    <div className="p-8 rounded-3xl border border-stone-200 bg-stone-900 text-white">
                        <h3 className="font-bold text-amber-400 uppercase tracking-widest text-xs mb-4">Enterprise</h3>
                        <div className="text-4xl font-bold font-serif mb-6">Custom</div>
                        <ul className="space-y-4 mb-8 text-sm text-stone-400">
                            <li className="flex gap-2"><span>✓</span> Multi-Location</li>
                            <li className="flex gap-2"><span>✓</span> Custom Branding</li>
                            <li className="flex gap-2"><span>✓</span> Dedicated Support</li>
                            <li className="flex gap-2"><span>✓</span> API Access</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white text-stone-900 font-bold hover:bg-amber-400 transition-all">Contact Sales</button>
                    </div>
                </div>
            </div>

            {/* Technical Specs / Trust */}
            <div className="bg-stone-900 py-20 border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-stone-400 uppercase tracking-widest text-xs font-bold mb-8">Built With Modern Stack</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-2xl font-bold text-white">React.js</span>
                        <span className="text-2xl font-bold text-white">TypeScript</span>
                        <span className="text-2xl font-bold text-white">Firebase</span>
                        <span className="text-2xl font-bold text-white">Tailwind CSS</span>
                        <span className="text-2xl font-bold text-white">Vite</span>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-emerald-900 py-24 text-center px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-serif mb-6">Ready to Digitalize Your Restaurant?</h2>
                <p className="text-emerald-200 text-lg mb-10">Get a custom platform built for your exact needs.</p>
                <Link to="/contact" className="bg-white text-emerald-900 px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl">
                    Contact Us Today
                </Link>
            </div>
        </div>
    );
};

export default ShowcasePage;
