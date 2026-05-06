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
  Leaf,
  Truck,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Verified,
  Heart,
  Search,
  User,
  GitCompare,
  ChevronDown
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
  category?: string;
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
  { id: 'fallback-1', name: 'Cold Pressed Groundnut Oil', size: '1 Litre', price: 210, tag: 'Bestseller', category: 'Groundnut', description: '100% pure, cold pressed groundnut oil for healthy daily cooking.', image_url: '/assets/Peanut oil.jpg' },
  { id: 'fallback-2', name: 'Cold Pressed Groundnut Oil', size: '1 kg', price: 280, category: 'Groundnut', description: 'Premium quality groundnut oil in 1kg packing.', image_url: '/assets/peanut-oil-bottle.jpg' },
  { id: 'fallback-3', name: 'Cold Pressed Groundnut Oil', size: '5 Litre', price: 1050, category: 'Groundnut', description: 'Premium cold pressed groundnut oil in 5L pack.', image_url: 'https://dmdecibmnmnquppjnzjo.supabase.co/storage/v1/object/public/product/5%20Kg.png' },
  { id: 'fallback-4', name: 'Cold Pressed Groundnut Oil', size: '5 kg', price: 1400, category: 'Groundnut', description: 'Bulk quantity for regular kitchen use.', image_url: 'https://dmdecibmnmnquppjnzjo.supabase.co/storage/v1/object/public/product/5%20Kg.png' },
  { id: 'fallback-5', name: 'Cold Pressed Groundnut Oil', size: '15 Litre', price: 2850, tag: 'Bulk Save', category: 'Groundnut', description: 'Ideal for commercial kitchens.', image_url: '/assets/products.jpg' },
  { id: 'fallback-6', name: 'Cold Pressed Groundnut Oil', size: '15 kg', price: 3400, category: 'Groundnut', description: 'Large 15kg pack for maximum savings.', image_url: '/assets/Peanut oil.jpg' },
];

// --- Sub-components ---

const TopBar: React.FC = () => (
  <div className="bg-slate-50 border-b border-gray-200 py-3 hidden md:block">
    <div className="container mx-auto px-4 flex justify-between items-center text-sm font-bold text-slate-600">
      <div className="flex items-center space-x-8">
        <a href="tel:+919879944395" className="flex items-center space-x-2 hover:text-mill-green transition-colors">
          <Phone size={16} className="text-mill-gold" />
          <span>+91 98799 44395</span>
        </a>
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-mill-gold" />
          <div className="flex items-center space-x-1 cursor-pointer hover:text-mill-green text-sm">
            <span>Vasad, Gujarat</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <Link to="/track" className="hover:text-mill-green">Track Order</Link>
        <Link to="/support" className="hover:text-mill-green">Customer Support</Link>
      </div>
    </div>
  </div>
);

const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <TopBar />
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden">
              <img src="/logo.jpeg" alt="Mahadev Oil Mill" className="w-full h-full object-contain" />
            </div>
            <div className="ml-4 hidden lg:block text-left">
              <h1 className="leading-none">
                <span className="text-3xl md:text-4xl font-black text-mill-green tracking-tighter block">MAHADEV</span>
                <span className="text-[12px] md:text-sm text-mill-gold uppercase tracking-[0.5em] font-black mt-1 block">Oil Mill</span>
              </h1>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search for pure cold pressed oils..." 
                className="w-full bg-gray-100 border-none rounded-full py-4 px-8 pl-14 focus:ring-2 focus:ring-mill-green/20 focus:bg-white transition-all duration-300 font-bold text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mill-green transition-colors" size={20} />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-mill-green text-white p-2.5 rounded-full hover:bg-mill-gold transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <button className="p-3 text-slate-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block relative">
              <GitCompare size={24} />
              <span className="absolute top-1 right-1 w-5 h-5 bg-mill-gold text-white text-[10px] font-black rounded-full flex items-center justify-center">0</span>
            </button>
            <Link to="/login" className="p-3 text-slate-600 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-2">
              <User size={24} />
              <span className="hidden lg:inline text-sm font-black uppercase tracking-widest">Login</span>
            </Link>
            <Link to="/cart" className="relative p-3.5 bg-mill-green text-white rounded-full hover:bg-mill-gold transition-all duration-300 group shadow-lg shadow-mill-green/20">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-red text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-3 text-slate-600 hover:bg-gray-100 rounded-full">
              <Menu size={24} />
            </button>
          </div>
        </div>

        <nav className="bg-white border-t border-gray-50 hidden lg:block">
          <div className="container mx-auto px-4 flex items-center space-x-12 h-14">
            <Link to="/" className="text-[13px] font-black uppercase tracking-widest text-mill-green hover:text-mill-gold transition-colors border-b-2 border-mill-green h-full flex items-center">Home</Link>
            <a href="/#products" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">Shop</a>
            <a href="/#process" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">Our Process</a>
            <a href="/#about" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">About Us</a>
            <a href="/#contact" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">Contact</a>
            <div className="flex-1"></div>
            <Link to="/bulk" className="text-[12px] font-black uppercase tracking-widest text-white bg-mill-gold px-6 py-2 rounded-full hover:bg-mill-green transition-all shadow-sm">Buy Bulk Tins (15kg)</Link>
          </div>
        </nav>
      </div>

      <div className={`fixed inset-0 bg-white z-[60] flex flex-col transition-all duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10" />
            <span className="ml-3 font-black text-mill-green">MAHADEV</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-10 px-6 space-y-6 text-left">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Home</Link>
          <a href="/#products" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Shop</a>
          <a href="/#process" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Our Process</a>
          <a href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">About Us</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Contact</a>
        </div>
      </div>
    </header>
  );
};

const CategorySection: React.FC = () => {
  const categories = [
    { name: 'Groundnut Oil', image: 'https://dmdecibmnmnquppjnzjo.supabase.co/storage/v1/object/public/product/5%20Kg.png', count: '6 Products' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-14">
          <span className="text-mill-gold font-black uppercase tracking-widest text-sm mb-3 block">Premium Collection</span>
          <h2 className="text-5xl font-black text-mill-green tracking-tight">Shop by Category</h2>
        </div>
        <div className="flex justify-center">
          {categories.map((cat, i) => (
            <div key={i} className="group cursor-pointer max-w-md w-full">
              <div className="relative h-[500px] rounded-[50px] overflow-hidden mb-5 shadow-2xl bg-slate-50 border border-gray-100 flex items-center justify-center p-16 transition-all duration-700 hover:shadow-mill-green/10">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-12 left-0 right-0 text-center z-10">
                  <h3 className="text-4xl font-black leading-none mb-4 text-mill-green">{cat.name}</h3>
                  <div className="inline-block px-8 py-2.5 bg-mill-green text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {cat.count}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustBar: React.FC = () => (
  <div className="bg-mill-green py-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="flex items-center space-x-6 text-white bg-white/5 px-10 py-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="p-4 bg-white/10 rounded-2xl">
            <ShieldAlert size={36} className="text-mill-gold" />
          </div>
          <div className="text-left">
            <h4 className="text-xl font-black uppercase tracking-widest leading-none mb-2">FSSAI Certified</h4>
            <p className="text-sm font-bold text-white/50 uppercase tracking-tighter">100% Safe & Pure</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-white bg-white/5 px-10 py-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="p-4 bg-white/10 rounded-2xl">
            <Verified size={36} className="text-mill-gold" />
          </div>
          <div className="text-left">
            <h4 className="text-xl font-black uppercase tracking-widest leading-none mb-2">Lab Tested</h4>
            <p className="text-sm font-bold text-white/50 uppercase tracking-tighter">Chemical Free</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Home: React.FC<{ 
  products: Product[], 
  loading: boolean, 
  cartMessage: string,
  handleAddToCart: (p: Product) => void
}> = ({ products, loading, cartMessage, handleAddToCart }) => (
  <div className="animate-fade-up">
    {/* Hero */}
    <section id="home" className="relative h-[75vh] flex items-center bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 h-full">
        <div className="z-10 text-left pt-12 lg:pt-0">
          <h1 className="text-6xl md:text-8xl font-black text-mill-green leading-[1.1] tracking-tighter mb-10">
            Purity You Can <br/>
            <span className="text-mill-gold">Trust & Taste.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-xl font-bold leading-relaxed">
            Experience the essence of tradition with our 100% pure cold pressed oils. No chemicals, no heat, just pure goodness.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#products" className="bg-mill-green text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-mill-gold transition-all shadow-xl shadow-mill-green/20 text-base">Shop Now</a>
            <a href="#about" className="bg-white border-2 border-mill-green text-mill-green px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-mill-green hover:text-white transition-all text-base">Our Story</a>
          </div>
        </div>
        <div className="relative h-full hidden lg:flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-mill-gold/5 rounded-full blur-3xl"></div>
          <img src="/assets/process.jpg" alt="Oil Mill" className="relative z-10 h-[85%] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.2)]" />
        </div>
      </div>
    </section>

    <TrustBar />
    <CategorySection />

    {/* Products Section */}
    <section id="products" className="py-28 bg-slate-50">
      <div className="container mx-auto px-4 text-left">
        <div className="flex justify-between items-end mb-20">
          <div>
            <span className="text-mill-gold font-black uppercase tracking-widest text-sm mb-3 block">Our Collection</span>
            <h2 className="text-5xl md:text-7xl font-black text-mill-green tracking-tighter">Best Sellers</h2>
          </div>
          <div className="flex space-x-3">
             <button className="p-4 bg-white rounded-full shadow-sm hover:bg-mill-green hover:text-white transition-all"><ChevronRight size={24} className="rotate-180" /></button>
             <button className="p-4 bg-white rounded-full shadow-sm hover:bg-mill-green hover:text-white transition-all"><ChevronRight size={24} /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-16 h-16 border-[6px] border-mill-green/10 border-t-mill-green rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-3 transition-all duration-500 group">
                <div className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-slate-50">
                  <img src={product.image_url || '/assets/products.jpg'} alt={product.name} className="w-full h-full object-contain p-10 group-hover:scale-110 transition-transform duration-700" />
                  {product.tag && (
                    <span className="absolute top-6 right-6 bg-mill-gold text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {product.tag}
                    </span>
                  )}
                  <button className="absolute bottom-6 right-6 p-4 bg-white text-mill-green rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Heart size={22} />
                  </button>
                </div>
                
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[12px] font-black text-mill-gold uppercase tracking-[0.2em] mb-2">{product.category}</p>
                      <h3 className="text-2xl font-black text-mill-green leading-none">{product.name}</h3>
                    </div>
                    <div className="text-sm font-black text-slate-400">{product.size}</div>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-mill-gold fill-mill-gold" />)}
                    <span className="text-[12px] font-bold text-slate-400 ml-1.5">(4.8)</span>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-gray-50">
                    <div>
                      <span className="text-base text-slate-400 line-through mr-3 font-bold">₹{Math.round(product.price * 1.2)}</span>
                      <span className="text-3xl font-black text-mill-green tracking-tighter">₹{product.price}</span>
                    </div>
                    <button onClick={() => handleAddToCart(product)} className="bg-mill-green text-white p-4 rounded-2xl hover:bg-mill-gold transition-all">
                      <ShoppingBag size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>


    {/* From Field to Kitchen - Traditional Journey */}
    <section id="process" className="py-40 container mx-auto px-4 overflow-hidden">
      <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-up">
        <span className="text-mill-gold font-black uppercase tracking-[0.4em] text-xs mb-6 block">From Field to Kitchen</span>
        <h2 className="text-5xl md:text-8xl font-black text-mill-green tracking-tighter mb-8 leading-none">Traditional cold-pressing journey</h2>
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
                  <th className="p-12 text-4xl font-black uppercase tracking-widest text-black bg-mill-gold shadow-2xl text-center">Cold Pressed Oil</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Extraction Method", r: "High heat & Chemicals", m: "Traditional Cold Press" },
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

    {/* Why Choose Us - Educational Section */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-left">
          <div>
            <span className="text-mill-gold font-black uppercase tracking-widest text-sm mb-5 block">The Pure Choice</span>
            <h2 className="text-4xl md:text-6xl font-black text-mill-green tracking-tighter mb-8 leading-tight">Why Our Cold Pressed <br/> Oils are Better?</h2>
            <div className="space-y-8">
              {[
                { title: "Preserved Nutrients", desc: "Unlike refined oils extracted at high heat, our cold pressed method keeps vitamins and minerals intact." },
                { title: "No Harmful Chemicals", desc: "We use zero solvents or preservatives. What you get is 100% natural seed extract." },
                { title: "Heart Healthy", desc: "Our oils are naturally cholesterol-free and contain essential fatty acids for a healthy heart." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-8">
                  <div className="w-16 h-16 bg-mill-gold/10 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle className="text-mill-gold" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-mill-green mb-3">{item.title}</h4>
                    <p className="text-lg text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[80px] overflow-hidden shadow-2xl">
              <img src="/assets/peanut-process.jpg" alt="Process" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-mill-green p-12 rounded-[50px] shadow-2xl hidden md:block text-left">
              <p className="text-white font-black text-5xl mb-3">24/7</p>
              <p className="text-white/60 font-bold uppercase tracking-widest text-[12px]">Quality Monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* About Section */}
    <section id="about" className="py-40 container mx-auto px-4">
      <div className="section-glass p-16 md:p-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mill-gold/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-6xl font-black text-mill-green mb-10 tracking-tighter uppercase tracking-widest">About Us</h2>
            <p className="text-slate-500 font-bold text-2xl italic opacity-70 leading-relaxed">"Purity is not just a standard, it's our promise."</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {[
              { comment: "The aroma of this cold pressed oil is truly authentic. It has completely transformed the taste of our traditional Gujarati dishes. Best in class quality!" },
              { comment: "We have been using Mahadev Oil for over a year now. The purity and consistency are unmatched. Highly recommended for any health-conscious family." }
            ].map((t, i) => (
              <div key={i} className="p-16 bg-white/40 backdrop-blur-md rounded-[60px] border border-white/60 shadow-xl group hover:bg-white/60 transition-all duration-500 text-left">
                <div className="flex space-x-2 mb-10">
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} className="text-mill-gold fill-mill-gold" />)}
                </div>
                <p className="text-3xl font-bold text-mill-green italic mb-12 leading-relaxed group-hover:scale-[1.02] transition-transform">"{t.comment}"</p>
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 bg-mill-green rounded-[28px] flex items-center justify-center text-white font-black text-3xl shadow-lg ring-4 ring-white/50">
                    <Heart size={32} className="fill-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-mill-green leading-none mb-1">Trusted by Families</h4>
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Review</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {cartMessage && (
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-mill-green text-white px-12 py-6 rounded-[40px] shadow-2xl flex items-center space-x-6 border-[8px] border-white/20 animate-fade-up backdrop-blur-xl">
        <CheckCircle size={36} className="text-emerald-400" />
        <span className="font-black uppercase tracking-[0.2em] text-sm font-black">{cartMessage}</span>
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
        <p className="text-2xl text-slate-500 font-bold mb-12 opacity-70">Pure goodness is just a few clicks away.</p>
        <Link to="/" className="btn-primary text-xl px-12 uppercase tracking-widest font-black">Return to Mill</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 animate-fade-up">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-4 text-slate-400 hover:text-mill-green transition-all mb-16 group">
        <div className="p-4 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg ring-1 ring-white/50 group-hover:scale-110 transition-transform">
          <ArrowLeft size={28} />
        </div>
        <span className="font-black uppercase tracking-[0.3em] text-[12px]">Continue Shopping</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-7 space-y-10">
          <h2 className="text-5xl font-black text-mill-green mb-14 flex items-center space-x-8">
            <span>Your Bag</span>
            <span className="text-xl bg-mill-gold text-white px-6 py-2 rounded-full shadow-lg font-black">{cartItems.length}</span>
          </h2>
          
          {cartItems.map(item => (
            <div key={item.product.id} className="bg-white/40 backdrop-blur-xl p-10 rounded-[60px] shadow-xl border border-white/60 flex flex-col sm:flex-row items-center gap-12 group hover:bg-white/60 transition-all duration-500">
              <div className="w-40 h-40 bg-white rounded-[40px] overflow-hidden shadow-2xl ring-4 ring-white group-hover:rotate-3 transition-transform">
                <img src={item.product.image_url || '/assets/products.jpg'} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-3xl font-black text-mill-green mb-3 tracking-tight">{item.product.name}</h3>
                <span className="text-sm font-black text-mill-gold uppercase tracking-[0.3em]">{item.product.size}</span>
                <div className="mt-8 flex items-center justify-center sm:justify-start space-x-8">
                  <div className="flex items-center space-x-6 bg-white/80 p-3 rounded-[24px] shadow-inner ring-1 ring-black/5">
                    <button onClick={() => updateCartQuantity(item.product.id, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"><Minus size={20} /></button>
                    <span className="w-10 text-center font-black text-2xl text-mill-green">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product.id, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"><Plus size={20} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-secondary-red transition-all p-4 hover:scale-110"><Trash2 size={28} /></button>
                </div>
              </div>
              <div className="text-4xl font-black text-mill-green tracking-tighter">₹{item.product.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 section-glass p-14 shadow-2xl sticky top-32 text-left">
          <h3 className="text-4xl font-black text-mill-green mb-12 tracking-tight uppercase tracking-widest">Delivery Info</h3>
          
          <div className="space-y-8 mb-14">
            <input type="text" placeholder="Full Name" className="form-input text-lg py-5" value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} />
            <input type="tel" placeholder="Phone Number" className="form-input text-lg py-5" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} />
            <input type="text" placeholder="Complete Address" className="form-input text-lg py-5" value={guestInfo.address} onChange={e => setGuestInfo({...guestInfo, address: e.target.value})} />
            <div className="grid grid-cols-2 gap-8">
              <input type="text" placeholder="City" className="form-input text-lg py-5" value={guestInfo.city} onChange={e => setGuestInfo({...guestInfo, city: e.target.value})} />
              <input type="text" placeholder="Pincode" className="form-input text-lg py-5" value={guestInfo.pincode} onChange={e => setGuestInfo({...guestInfo, pincode: e.target.value})} />
            </div>
          </div>
          
          <div className="border-t-4 border-dashed border-mill-green/5 pt-12 space-y-6 mb-12">
            <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
              <span>Cart Total</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
              <span>Shipping</span>
              <span className="text-emerald-500 font-black">Free of Cost</span>
            </div>
            <div className="flex justify-between items-center pt-8">
              <span className="text-3xl font-black text-mill-green">Grand Total</span>
              <span className="text-5xl font-black text-mill-green tracking-tighter">₹{total}</span>
            </div>
          </div>

          <button className="btn-primary w-full py-7 text-2xl tracking-[0.2em] uppercase font-black rounded-[30px]" onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          
          {checkoutMessage && (
            <div className={`mt-10 p-6 rounded-3xl text-center text-sm font-black uppercase tracking-[0.3em] backdrop-blur-md ${checkoutMessage.includes('Success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-secondary-red'}`}>
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
    <div className="w-48 h-48 bg-emerald-50 rounded-[50px] flex items-center justify-center text-emerald-500 mb-12 shadow-2xl ring-8 ring-white">
      <CheckCircle size={100} />
    </div>
    <h2 className="text-7xl md:text-9xl font-black text-mill-green mb-10 tracking-tighter">Payment Received!</h2>
    <p className="text-3xl text-slate-500 font-bold max-w-3xl mb-20 leading-relaxed opacity-80">
      Your journey to healthy cooking begins. We've confirmed your order and will dispatch your pure cold pressed oil within 24 hours.
    </p>
    <Link to="/" className="btn-primary text-2xl px-16 py-6 uppercase tracking-widest font-black">Back to Shop</Link>
  </div>
);

// --- Footer ---

const Footer: React.FC = () => (
  <footer id="contact" className="bg-[#0f2a1f] pt-32 pb-16 text-white mt-20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 text-left">
        <div>
          <div className="flex items-center space-x-5 mb-10">
            <img src="/logo.jpeg" alt="Logo" className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl" />
            <h1 className="leading-none">
              <span className="text-4xl font-black tracking-tighter block text-white">MAHADEV</span>
              <span className="text-[12px] text-mill-gold uppercase tracking-[0.4em] font-black mt-1 block">Oil Mill</span>
            </h1>
          </div>
          <p className="text-white/50 font-bold text-base leading-relaxed mb-10">
            Bringing back the traditional purity of cold pressed oils to every kitchen. Experience health in every drop.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-mill-gold transition-colors"><MessageCircle size={22} /></a>
            <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-mill-gold transition-colors"><Heart size={22} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-mill-gold mb-10">Contact Us</h4>
          <ul className="space-y-6 text-white/60 font-bold text-base">
            <li className="flex items-start space-x-4">
              <MapPin size={20} className="text-mill-gold shrink-0 mt-1" />
              <span>902, NAGARDAS NI KHADKI, NR. RAMJI MANDIR, VASAD 388306 TA & DI : ANAND</span>
            </li>
            <li className="flex items-center space-x-4">
              <Phone size={20} className="text-mill-gold shrink-0" />
              <span>+91 98799 44395</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-mill-gold mb-10">Customer Service</h4>
          <ul className="space-y-5 text-white/60 font-bold text-base">
            <li><Link to="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-mill-gold mb-10">Newsletter</h4>
          <p className="text-white/50 font-bold text-sm mb-8">Subscribe to get special offers and pure health tips.</p>
          <div className="flex">
            <input type="email" placeholder="Your Email" className="bg-white/5 border-none rounded-l-2xl py-4 px-6 text-base focus:ring-1 focus:ring-mill-gold w-full" />
            <button className="bg-mill-gold text-white px-6 rounded-r-2xl hover:bg-white hover:text-mill-green transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest">© 2026 Mahadev Oil Mill. All rights reserved.</p>
        <div className="flex items-center space-x-10">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-5 opacity-30" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 opacity-30" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 opacity-30" />
        </div>
      </div>
    </div>
  </footer>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-32 flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 w-full max-w-xl text-left">
        <h2 className="text-5xl font-black text-mill-green mb-4 tracking-tighter">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-slate-500 font-bold mb-10 text-lg">
          {isSignUp ? 'Join the Mahadev Oil Mill family.' : 'Sign in to access your orders and profile.'}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-mill-green uppercase tracking-widest mb-3">Email Address</label>
            <input 
              type="email" 
              className="form-input text-lg py-5" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-black text-mill-green uppercase tracking-widest mb-3">Password</label>
            <input 
              type="password" 
              className="form-input text-lg py-5" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full py-6 text-xl tracking-widest uppercase font-black rounded-[25px] mt-4"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-2xl text-center text-sm font-black uppercase tracking-widest ${message.includes('Check your email') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-secondary-red'}`}>
            {message}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-mill-green font-black uppercase tracking-widest text-sm hover:text-mill-gold transition-colors"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
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


  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = 1;
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
        description: 'Traditional Cold Pressed Oil',
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
              products={products} loading={loading} cartMessage={cartMessage}
              handleAddToCart={handleAddToCart}
            />} />
            <Route path="/cart" element={<Cart 
              cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart}
              guestInfo={guestInfo} setGuestInfo={setGuestInfo} handleCheckout={handleCheckout}
              checkoutLoading={checkoutLoading} checkoutMessage={checkoutMessage}
            />} />
            <Route path="/login" element={<Login />} />
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
