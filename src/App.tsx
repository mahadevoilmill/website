import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate
} from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Droplet, 
  MapPin, 
  Phone, 
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Star,
  Award,
  Leaf,
  Truck,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Verified
} from 'lucide-react';
import { supabase } from './supabaseClient';

// --- Interfaces ---
interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  description?: string;
  tag?: string;
  image_url?: string;
  stock_quantity?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// --- Constants ---
const fallbackProducts: Product[] = [
  { id: 'fallback-1', name: 'Cold Pressed Peanut Oil', size: '1 Litre', price: 210, tag: 'Bestseller', description: '100% pure, wood-pressed groundnut oil for healthy daily cooking.', image_url: '/assets/Peanut oil.jpg' },
  { id: 'fallback-2', name: 'Cold Pressed Peanut Oil', size: '1 kg', price: 280, description: 'Premium quality peanut oil in 1kg packing.', image_url: '/assets/peanut-oil-bottle.jpg' },
  { id: 'fallback-3', name: 'Cold Pressed Peanut Oil', size: '5 Litre', price: 980, tag: 'Value Pack', description: 'Economy pack for large families.', image_url: '/assets/products.jpg' },
  { id: 'fallback-4', name: 'Cold Pressed Peanut Oil', size: '5 kg', price: 1400, description: 'Bulk quantity for regular kitchen use.', image_url: '/assets/peanut-oil-bottle.jpg' },
  { id: 'fallback-5', name: 'Cold Pressed Peanut Oil', size: '15 Litre', price: 2850, tag: 'Bulk Save', description: 'Ideal for commercial kitchens.', image_url: '/assets/products.jpg' },
  { id: 'fallback-6', name: 'Cold Pressed Peanut Oil', size: '15 kg', price: 3400, description: 'Large 15kg pack for maximum savings.', image_url: '/assets/Peanut oil.jpg' },
];

// --- Sub-components ---

const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden group-hover:scale-110 transition-all duration-500">
            <img src="/logo.jpeg" alt="Mahadev Oil Mill" className="w-full h-full object-contain" />
          </div>
          <div className="ml-6 flex items-center">
            <h1 className="text-2xl md:text-3xl font-[1000] tracking-tight whitespace-nowrap">
              <span className="text-mill-green">MAHADEV</span>
              <span className="text-mill-gold ml-3 font-black text-lg md:text-xl uppercase tracking-[0.2em]">Oil Mill</span>
            </h1>
          </div>
        </Link>
        
        <nav className={`fixed inset-0 bg-white/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-10 transition-all duration-700 lg:static lg:bg-transparent lg:flex-row lg:space-y-0 lg:space-x-12 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="lg:hidden absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-mill-green">
            <X size={28} />
          </button>
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors">Home</Link>
          <a href="/#products" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors">Products</a>
          <a href="/#process" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors">Our Process</a>
          <a href="/#about" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors">About Us</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-4 bg-mill-green/5 rounded-2xl text-mill-green hover:bg-mill-green hover:text-white transition-all duration-500 group">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-red text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-4 bg-mill-green/5 rounded-2xl text-mill-green">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

const TrustBar: React.FC = () => (
  <div className="container mx-auto px-4 relative z-10 -mt-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {[
        { icon: Award, label: "Lab Tested Purity", color: "text-mill-green", bg: "bg-emerald-50/80" },
        { icon: Leaf, label: "100% Organic", color: "text-mill-gold", bg: "bg-amber-50/80" },
        { icon: Droplet, label: "Traditional Press", color: "text-orange-600", bg: "bg-orange-50/80" },
        { icon: Truck, label: "Fast Shipping", color: "text-sky-600", bg: "bg-sky-50/80" }
      ].map((item, i) => (
        <div key={i} className="group bg-white/70 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl border border-white/80 flex flex-col items-center text-center space-y-5 hover:bg-white/95 hover:-translate-y-3 transition-all duration-700 ring-1 ring-black/5">
          <div className={`w-20 h-20 ${item.bg} rounded-[30px] flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-white`}>
            <item.icon size={36} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center space-x-1.5">
              <Verified size={12} className="text-emerald-500 fill-emerald-50" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verified</span>
            </div>
            <h4 className="text-sm font-black text-mill-green uppercase tracking-widest block leading-tight">{item.label}</h4>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Home: React.FC<{ 
  products: Product[], 
  loading: boolean, 
  productMessage: string,
  cartMessage: string,
  productQuantities: Record<string, number>,
  handleQuantityChange: (id: string, q: number) => void,
  handleAddToCart: (p: Product) => void
}> = ({ products, loading, productMessage, cartMessage, productQuantities, handleQuantityChange, handleAddToCart }) => (
  <div className="animate-fade-up">
    {/* Hero */}
    <section id="home" className="relative h-[85vh] flex items-center overflow-hidden rounded-b-[80px] bg-transparent">
      <div className="absolute inset-0 opacity-10 grayscale pointer-events-none scale-110">
        <img src="/assets/peanut-farm.jpg" alt="Groundnut Oil" className="w-full h-full object-cover" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <div className="inline-flex items-center space-x-3 px-6 py-2 bg-mill-gold/10 text-mill-gold rounded-full mb-8 ring-1 ring-mill-gold/20 backdrop-blur-md">
            <div className="w-2 h-2 bg-mill-gold rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Traditional Heritage Mill</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-mill-green leading-[1.1] tracking-tight mb-8">
            Pure Goodness <br/>
            <span className="text-mill-gold">in Every Drop.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-xl font-bold leading-relaxed opacity-80">
            Experience the purest heritage groundnut oil, crafted with the patience of wood-pressing and the precision of cold extraction.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <a href="#products" className="btn-primary group flex items-center justify-center space-x-4">
              <span className="text-lg font-black uppercase tracking-widest">Shop Now</span>
              <ShoppingBag size={22} className="group-hover:rotate-12 transition-transform" />
            </a>
            <a href="#process" className="btn-secondary text-lg font-black uppercase tracking-widest">Our Story</a>
          </div>
        </div>
      </div>
    </section>

    <TrustBar />

    {/* Products Section */}
    <section id="products" className="py-40 container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-24">
        <span className="text-mill-gold font-black uppercase tracking-widest text-xs mb-4 block">Fresh from the Mill</span>
        <h2 className="text-5xl md:text-7xl font-black text-mill-green tracking-tighter">Premium Collection</h2>
        <div className="h-2 w-24 bg-mill-gold mx-auto mt-8 rounded-full shadow-lg shadow-mill-gold/20"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 border-[6px] border-mill-green/10 border-t-mill-green rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map(product => (
            <div key={product.id} className="card-premium group">
              <div className="relative h-80 rounded-[30px] overflow-hidden mb-8 bg-gray-50 ring-1 ring-gray-100 shadow-inner">
                <img src={product.image_url || '/assets/products.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1s]" />
                {product.tag && (
                  <span className="absolute top-6 right-6 bg-mill-green text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl backdrop-blur-md ring-1 ring-white/20">
                    {product.tag}
                  </span>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-mill-green leading-none">{product.name}</h3>
                  <div className="px-4 py-1.5 bg-mill-gold/10 text-mill-gold rounded-full text-[10px] font-black uppercase tracking-widest">{product.size}</div>
                </div>
                <p className="text-slate-500 font-bold text-sm leading-relaxed opacity-80">{product.description}</p>
                
                <div className="pt-6 flex items-center justify-between border-t border-gray-50">
                  <div className="text-4xl font-black text-mill-green tracking-tighter">₹{product.price}</div>
                  <div className="flex items-center space-x-3 bg-gray-100/50 p-2 rounded-2xl">
                    <button onClick={() => handleQuantityChange(product.id, (productQuantities[product.id] || 1) - 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center font-black text-mill-green">{productQuantities[product.id] ?? 1}</span>
                    <button onClick={() => handleQuantityChange(product.id, (productQuantities[product.id] || 1) + 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Plus size={14} /></button>
                  </div>
                </div>
                
                <button onClick={() => handleAddToCart(product)} className="btn-primary w-full flex items-center justify-center space-x-3 py-5 rounded-[22px]">
                  <ShoppingBag size={20} />
                  <span className="text-lg font-black uppercase tracking-widest">Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* From Field to Kitchen - Traditional Journey */}
    <section id="process" className="py-40 container mx-auto px-4 overflow-hidden">
      <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-up">
        <span className="text-mill-gold font-black uppercase tracking-[0.4em] text-xs mb-6 block">From Field to Kitchen</span>
        <h2 className="text-5xl md:text-8xl font-black text-mill-green tracking-tighter mb-8 leading-none">Traditional wood-pressing journey</h2>
        <p className="text-slate-500 font-bold text-xl opacity-70">Experience the sacred art of cold pressing where we prioritize your health over high-speed production.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { id: "1", title: "Sourcing", desc: "Premium peanuts directly from trusted farmers across Gujarat", icon: Leaf, color: "from-emerald-400 to-mill-green" },
          { id: "2", title: "Quality Check", desc: "Rigorous inspection and cleaning of seeds", icon: ShieldAlert, color: "from-amber-400 to-mill-gold" },
          { id: "3", title: "Cold Pressing", desc: "Traditional cold-press method at low temperatures", icon: Droplet, color: "from-orange-400 to-orange-600" },
          { id: "4", title: "Bottling", desc: "Eco-friendly packaging with care and precision", icon: Truck, color: "from-sky-400 to-sky-600" }
        ].map((step, i) => (
          <div key={i} className="group relative p-12 bg-white/60 backdrop-blur-xl rounded-[50px] border border-white/60 shadow-xl transition-all duration-700 hover:bg-white/80 hover:-translate-y-4 hover:shadow-2xl">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-bl-[100px] transition-opacity duration-700`}></div>
            <div className={`w-20 h-20 mb-10 rounded-[28px] bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <step.icon size={36} />
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className={`text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity bg-clip-text text-transparent bg-gradient-to-br ${step.color}`}>{step.id}</span>
              <h3 className="text-2xl font-black text-mill-green tracking-tight">{step.title}</h3>
            </div>
            <p className="text-slate-500 font-bold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{step.desc}</p>
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
               <ChevronRight className="text-mill-gold" size={24} />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Comparison Section - Ultra High Impact Redesign */}
    <section className="parallax-bg min-h-[100vh] flex items-center py-40 my-20" style={{ backgroundImage: "url('/assets/peanut-kitchen.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-mill-green/95 via-mill-green/90 to-mill-green/95 backdrop-blur-md"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-24 animate-fade-up">
          <span className="text-mill-gold font-black uppercase tracking-[0.4em] text-xs mb-6 block">The Cold-Pressed Difference</span>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">Refined Oil vs <span className="text-mill-gold">Cold Pressed</span></h2>
          <p className="text-emerald-100 text-3xl font-black italic opacity-80">Why Choose Mahadev Oil Mill?</p>
        </div>

        <div className="overflow-x-auto pb-10">
          <div className="min-w-[1000px] bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden border-[12px] border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-white/10">
                  <th className="p-12 text-2xl font-black uppercase tracking-widest text-white/50 border-r border-white/5">Feature</th>
                  <th className="p-12 text-2xl font-black uppercase tracking-widest text-red-500 bg-red-500/5 border-r border-white/5 text-center">Refined Oil</th>
                  <th className="p-12 text-4xl font-black uppercase tracking-widest text-black bg-mill-gold shadow-2xl text-center">Mahadev Advantage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Extraction Method", r: "High heat & Chemicals", m: "Traditional Wood Press" },
                  { f: "Nutritional Value", r: "Lost during heating", m: "100% Nutrients Retained" },
                  { f: "Cholesterol Level", r: "Contains Trans Fats", m: "Zero Trans Fats" },
                  { f: "Preservatives", r: "Harmful Additives", m: "Pure & Chemical Free" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-all duration-300">
                    <td className="p-12 text-3xl font-black text-mill-green border-r border-gray-100">{row.f}</td>
                    <td className="p-12 text-xl font-bold text-red-400 italic bg-red-50/20 border-r border-gray-100 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <X className="text-red-500/30" size={32} />
                        <span className="line-through decoration-red-500/40 uppercase tracking-tighter">{row.r}</span>
                      </div>
                    </td>
                    <td className="p-12 bg-mill-gold/5">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-mill-green rounded-[30px] flex items-center justify-center text-white shadow-2xl scale-110 group-hover:rotate-12 transition-all duration-500 border-4 border-white">
                          <CheckCircle size={40} />
                        </div>
                        <span className="text-3xl font-black text-black uppercase tracking-tight">{row.m}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    {/* About Section */}
    <section id="about" className="py-40 container mx-auto px-4">
      <div className="section-glass p-16 md:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mill-gold/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl font-black text-mill-green mb-6 tracking-tighter uppercase tracking-widest">Trusted by Families</h2>
            <p className="text-slate-500 font-bold text-lg italic opacity-70">"Purity is not just a standard, it's our promise."</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              { name: "Rajesh Patel", location: "Anand", comment: "The aroma takes me back to my childhood. Truly authentic wood-pressed oil. Best in class quality." },
              { name: "Sneha Shah", location: "Vadodara", comment: "Using it for 6 months now. Consistent quality and excellent packaging. Highly recommended." }
            ].map((t, i) => (
              <div key={i} className="p-12 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 shadow-xl group hover:bg-white/60 transition-all duration-500">
                <div className="flex space-x-1 mb-8">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-mill-gold fill-mill-gold" />)}
                </div>
                <p className="text-2xl font-bold text-mill-green italic mb-10 leading-relaxed group-hover:scale-[1.02] transition-transform">"{t.comment}"</p>
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-mill-green rounded-[22px] flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white/50">{t.name[0]}</div>
                  <div>
                    <h4 className="text-xl font-black text-mill-green leading-none">{t.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {cartMessage && (
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-mill-green text-white px-10 py-5 rounded-[30px] shadow-2xl flex items-center space-x-4 border-[6px] border-white/20 animate-fade-up backdrop-blur-xl">
        <CheckCircle size={28} className="text-emerald-400" />
        <span className="font-black uppercase tracking-[0.2em] text-xs font-black">{cartMessage}</span>
      </div>
    )}
  </div>
);

const Cart: React.FC<{
  cartItems: CartItem[],
  updateCartQuantity: (id: string, d: number) => void,
  removeFromCart: (id: string) => void,
  guestInfo: any,
  setGuestInfo: (i: any) => void,
  handleCheckout: () => void,
  checkoutLoading: boolean,
  checkoutMessage: string
}> = ({ cartItems, updateCartQuantity, removeFromCart, guestInfo, setGuestInfo, handleCheckout, checkoutLoading, checkoutMessage }) => {
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-up">
        <div className="w-40 h-40 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-200 mb-10 shadow-2xl ring-1 ring-white/50 border border-white/60">
          <ShoppingBag size={80} />
        </div>
        <h2 className="text-5xl font-black text-mill-green mb-6 tracking-tighter uppercase tracking-[0.1em]">Bag is empty</h2>
        <p className="text-xl text-slate-500 font-bold mb-12 opacity-70">Pure goodness is just a few clicks away.</p>
        <Link to="/" className="btn-primary text-xl px-12 uppercase tracking-widest font-black">Return to Mill</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 animate-fade-up">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-3 text-slate-400 hover:text-mill-green transition-all mb-16 group">
        <div className="p-3 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg ring-1 ring-white/50 group-hover:scale-110 transition-transform">
          <ArrowLeft size={24} />
        </div>
        <span className="font-black uppercase tracking-[0.3em] text-[10px]">Continue Shopping</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-4xl font-black text-mill-green mb-12 flex items-center space-x-6">
            <span>Your Bag</span>
            <span className="text-lg bg-mill-gold text-white px-5 py-1.5 rounded-full shadow-lg font-black">{cartItems.length}</span>
          </h2>
          
          {cartItems.map(item => (
            <div key={item.product.id} className="bg-white/40 backdrop-blur-xl p-8 rounded-[45px] shadow-xl border border-white/60 flex flex-col sm:flex-row items-center gap-10 group hover:bg-white/60 transition-all duration-500">
              <div className="w-32 h-32 bg-white rounded-[30px] overflow-hidden shadow-2xl ring-4 ring-white group-hover:rotate-3 transition-transform">
                <img src={item.product.image_url || '/assets/products.jpg'} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-black text-mill-green mb-2 tracking-tight">{item.product.name}</h3>
                <span className="text-[10px] font-black text-mill-gold uppercase tracking-[0.3em]">{item.product.size}</span>
                <div className="mt-6 flex items-center justify-center sm:justify-start space-x-6">
                  <div className="flex items-center space-x-4 bg-white/80 p-2 rounded-[18px] shadow-inner ring-1 ring-black/5">
                    <button onClick={() => updateCartQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"><Minus size={16} /></button>
                    <span className="w-8 text-center font-black text-xl text-mill-green">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-secondary-red transition-all p-3 hover:scale-110"><Trash2 size={24} /></button>
                </div>
              </div>
              <div className="text-3xl font-black text-mill-green tracking-tighter">₹{item.product.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 section-glass p-12 shadow-2xl sticky top-32 text-left">
          <h3 className="text-3xl font-black text-mill-green mb-10 tracking-tight uppercase tracking-widest">Delivery Info</h3>
          
          <div className="space-y-6 mb-12">
            <input type="text" placeholder="Full Name" className="form-input" value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} />
            <input type="tel" placeholder="Phone Number" className="form-input" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} />
            <input type="text" placeholder="Complete Address" className="form-input" value={guestInfo.address} onChange={e => setGuestInfo({...guestInfo, address: e.target.value})} />
            <div className="grid grid-cols-2 gap-6">
              <input type="text" placeholder="City" className="form-input" value={guestInfo.city} onChange={e => setGuestInfo({...guestInfo, city: e.target.value})} />
              <input type="text" placeholder="Pincode" className="form-input" value={guestInfo.pincode} onChange={e => setGuestInfo({...guestInfo, pincode: e.target.value})} />
            </div>
          </div>
          
          <div className="border-t-4 border-dashed border-mill-green/5 pt-10 space-y-5 mb-10">
            <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <span>Cart Total</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <span>Shipping</span>
              <span className="text-emerald-500">Free of Cost</span>
            </div>
            <div className="flex justify-between items-center pt-6">
              <span className="text-2xl font-black text-mill-green">Grand Total</span>
              <span className="text-4xl font-black text-mill-green tracking-tighter">₹{total}</span>
            </div>
          </div>

          <button className="btn-primary w-full py-6 text-xl tracking-[0.2em] uppercase font-black rounded-[25px]" onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          
          {checkoutMessage && (
            <div className={`mt-8 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md ${checkoutMessage.includes('Success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-secondary-red'}`}>
              {checkoutMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Success: React.FC = () => (
  <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-up">
    <div className="w-40 h-40 bg-emerald-50 rounded-[40px] flex items-center justify-center text-emerald-500 mb-10 shadow-2xl ring-8 ring-white">
      <CheckCircle size={80} />
    </div>
    <h2 className="text-6xl md:text-8xl font-black text-mill-green mb-8 tracking-tighter">Payment Received!</h2>
    <p className="text-2xl text-slate-500 font-bold max-w-2xl mb-16 leading-relaxed opacity-80">
      Your journey to healthy cooking begins. We've confirmed your order and will dispatch your pure wood-pressed oil within 24 hours.
    </p>
    <Link to="/" className="btn-primary text-xl px-12 uppercase tracking-widest font-black">Back to Shop</Link>
  </div>
);

// --- Footer ---

const Footer: React.FC = () => (
  <footer id="contact" className="bg-mill-green pt-40 pb-16 rounded-t-[100px] text-white overflow-hidden relative mt-20">
    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
      <img src="/assets/peanut-hero.jpg" alt="" className="w-full h-full object-cover grayscale" />
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32 text-left">
        <div className="md:col-span-5">
          <div className="flex items-center space-x-6 mb-12">
            <div className="w-20 h-20 bg-white rounded-[25px] p-2 shadow-2xl ring-8 ring-white/5">
              <img src="/logo.jpeg" alt="Mahadev Oil Mill" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none">MAHADEV</h1>
              <span className="text-[10px] font-black text-mill-gold uppercase tracking-[0.4em]">TRADITIONAL MILL</span>
            </div>
          </div>
          <p className="text-emerald-50/60 font-bold text-xl leading-relaxed max-w-md">
            Purity is our legacy. We are dedicated to providing your family with the healthiest, wood-pressed oils just as nature intended.
          </p>
        </div>
        
        <div className="md:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mill-gold mb-12">Quick Links</h4>
          <ul className="grid grid-cols-1 gap-4 font-black text-lg">
            <li><a href="/#home" className="text-white/60 hover:text-white transition-all hover:pl-2 flex items-center space-x-2"><span>Home</span></a></li>
            <li><a href="/#products" className="text-white/60 hover:text-white transition-all hover:pl-2 flex items-center space-x-2"><span>Products</span></a></li>
            <li><a href="/#process" className="text-white/60 hover:text-white transition-all hover:pl-2 flex items-center space-x-2"><span>Our Process</span></a></li>
            <li><a href="/#about" className="text-white/60 hover:text-white transition-all hover:pl-2 flex items-center space-x-2"><span>About Us</span></a></li>
            <li><a href="/#contact" className="text-white/60 hover:text-white transition-all hover:pl-2 flex items-center space-x-2"><span>Contact</span></a></li>
          </ul>
        </div>
        
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-mill-gold mb-12">Visit Our Mill</h4>
          <ul className="space-y-8 text-white/70 font-bold">
            <li className="flex items-start space-x-6 group">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-mill-gold transition-colors text-mill-gold group-hover:text-white shadow-xl"><MapPin size={24} /></div>
              <span className="text-xl leading-snug">902, Nagardas Ni Khadki, Vasad, Gujarat - 388306</span>
            </li>
            <li className="flex items-center space-x-6 group">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-mill-gold transition-colors text-mill-gold group-hover:text-white shadow-xl"><Phone size={24} /></div>
              <span className="text-xl">+91 98799 44395</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 Mahadev Oil Mill • Pure Heritage</p>
        <div className="flex space-x-12">
          <a href="https://wa.me/919879944395" className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center hover:bg-[#25d366] transition-all hover:scale-110 text-white shadow-2xl shadow-green-500/20"><MessageCircle size={28} /></a>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('price', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) setProducts(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities(prev => ({ ...prev, [productId]: Math.max(1, quantity) }));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = productQuantities[product.id] ?? 1;
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setCartMessage(`${product.name} Added! 🛒`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const handleCheckout = async () => {
    if (!guestInfo.name || !guestInfo.phone || !guestInfo.address) {
      setCheckoutMessage('Please fill all delivery details.');
      return;
    }
    setCheckoutLoading(true);
    try {
      const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const { data: order, error } = await supabase.from('orders').insert({
        customer_id: user?.id || null, total_amount: total, guest_name: guestInfo.name, guest_phone: guestInfo.phone,
        guest_address: guestInfo.address, guest_city: guestInfo.city, guest_pincode: guestInfo.pincode, status: 'pending'
      }).select('id').single();
      if (error) throw error;

      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', amount: total * 100, currency: 'INR', name: 'Mahadev Oil Mill',
        description: 'Traditional Wood Pressed Oil',
        image: '/logo.jpeg',
        handler: async (res: any) => {
          await supabase.from('orders').update({ status: 'paid', payment_id: res.razorpay_payment_id }).eq('id', order.id);
          setCartItems([]);
          window.location.href = '/success';
        },
        prefill: { name: guestInfo.name, contact: guestInfo.phone }, theme: { color: '#1b4332' }
      };
      new window.Razorpay(options).open();
    } catch (err: any) { setCheckoutMessage(err.message); } finally { setCheckoutLoading(false); }
  };

  return (
    <Router>
      <div className="min-h-screen bg-transparent flex flex-col">
        <Header cartCount={cartCount} />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home 
              products={products} loading={loading} productMessage="" cartMessage={cartMessage}
              productQuantities={productQuantities} handleQuantityChange={handleQuantityChange} handleAddToCart={handleAddToCart}
            />} />
            <Route path="/cart" element={<Cart 
              cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart}
              guestInfo={guestInfo} setGuestInfo={setGuestInfo} handleCheckout={handleCheckout}
              checkoutLoading={checkoutLoading} checkoutMessage={checkoutMessage}
            />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
        <a href="https://wa.me/919879944395" className="whatsapp-float shadow-emerald-200/50" target="_blank" rel="noreferrer">
          <MessageCircle size={32} />
        </a>
      </div>
    </Router>
  );
};

export default App;
