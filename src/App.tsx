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
  ChevronDown,
  ChevronUp
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
      <div className="flex items-center space-x-6">
        <a href="tel:+919879944395" className="flex items-center space-x-2 hover:text-mill-green transition-colors">
          <Phone size={16} className="text-mill-gold" />
          <span className="text-xs">Rakesh: +91 98799 44395</span>
        </a>
        <a href="tel:+918849735425" className="flex items-center space-x-2 hover:text-mill-green transition-colors">
          <Phone size={16} className="text-mill-gold" />
          <span className="text-xs">Nimesh: +91 88497 35425</span>
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

const Header: React.FC<{ cartCount: number, wishlistCount: number, isAdmin?: boolean, handleLogout?: () => void }> = ({ cartCount, wishlistCount, isAdmin, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <TopBar />
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden">
              <img src="/logo.png" alt="Mahadev Oil Mill" className="w-full h-full object-contain" />
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
            <Link to="/wishlist" className="p-3 text-slate-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block relative">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-mill-gold text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {isAdmin ? (
              <button onClick={handleLogout} className="p-3 text-secondary-red hover:bg-red-50 rounded-full transition-colors flex items-center space-x-2">
                <User size={24} />
                <span className="hidden lg:inline text-sm font-black uppercase tracking-widest">Logout</span>
              </button>
            ) : (
              <Link to="/login" className="p-3 text-slate-600 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-2">
                <User size={24} />
                <span className="hidden lg:inline text-sm font-black uppercase tracking-widest">Login</span>
              </Link>
            )}
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
            <a href="/#gallery" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">Gallery</a>
            <Link to="/faq" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">FAQ</Link>
            <a href="/#contact" className="text-[13px] font-black uppercase tracking-widest text-slate-600 hover:text-mill-gold transition-colors h-full flex items-center">Contact</a>
            <div className="flex-1"></div>
            <Link to="/bulk" className="text-[12px] font-black uppercase tracking-widest text-white bg-mill-gold px-6 py-2 rounded-full hover:bg-mill-green transition-all shadow-sm">Buy Bulk Tins (15kg)</Link>
          </div>
        </nav>
      </div>

      <div className={`fixed inset-0 bg-white z-[60] flex flex-col transition-all duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
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
          <a href="/#gallery" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Gallery</a>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">FAQ</Link>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-mill-green">Contact</a>
        </div>
      </div>
    </header>
  );
};

const Gallery: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const [items, setItems] = useState<{url: string, type: 'image' | 'video'}[]>(() => {
    const saved = localStorage.getItem('mahadev_gallery');
    return saved ? JSON.parse(saved) : [
      { url: '/assets/peanut-farm.jpg', type: 'image' },
      { url: '/assets/peanut-kitchen.jpg', type: 'image' },
      { url: '/assets/hero-video.mp4', type: 'video' },
      { url: '/assets/peanut-process.jpg', type: 'image' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mahadev_gallery', JSON.stringify(items));
  }, [items]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setItems(prev => [...prev, { url, type }]);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-left">
          <div>
            <span className="text-mill-gold font-black uppercase tracking-widest text-sm mb-3 block">Visual Journey</span>
            <h2 className="text-5xl font-black text-mill-green tracking-tight">Our Gallery</h2>
          </div>
          
          {isAdmin && (
            <label className="cursor-pointer bg-mill-green text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-mill-gold transition-all shadow-lg flex items-center space-x-3">
              <Plus size={20} />
              <span>Add Photo / Video</span>
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} />
            </label>
          )}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item, i) => (
            <div key={i} className="relative group rounded-[30px] overflow-hidden shadow-xl break-inside-avoid animate-fade-up">
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <img 
                  src={item.url} 
                  alt="Gallery" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Search size={24} />
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
  handleAddToCart: (p: Product) => void,
  wishlist: string[],
  toggleWishlist: (id: string) => void,
  isAdmin?: boolean
}> = ({ products, loading, cartMessage, handleAddToCart, wishlist, toggleWishlist, isAdmin }) => (
  <div className="animate-fade-up">
    {/* Hero - Split Screen Partition Layout */}
    <section id="home" className="relative min-h-screen flex flex-col lg:flex-row items-stretch bg-white overflow-hidden">
      {/* Left Side: Content (The "Write" Portion) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 z-10">
        <div className="max-w-2xl text-left">
          <div className="inline-block px-6 py-2 bg-mill-gold/10 text-mill-gold rounded-full mb-8 text-xs font-black uppercase tracking-[0.4em] animate-fade-up">
            Pure Traditional Heritage
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black text-mill-green leading-[0.9] tracking-tighter mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            PURE <br/>
            <span className="text-mill-gold text-5xl md:text-7xl lg:text-[6rem] block mt-4">COLD PRESSED.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 font-bold leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
            100% Natural Cold Pressed Groundnut Oil. <br/> 
            No Chemicals, No Heat. Experience the purity in every drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <a href="#products" className="bg-mill-green text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mill-gold transition-all shadow-xl shadow-mill-green/20 text-center">Shop Now</a>
            <a href="#about" className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:border-mill-green hover:text-mill-green transition-all text-center">Our Story</a>
          </div>
        </div>
      </div>

      {/* Right Side: Video Portion */}
      <div className="flex-1 relative min-h-[50vh] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-mill-green">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
            <img src="/assets/peanut-hero.jpg" alt="Fallback" className="w-full h-full object-cover" />
          </video>
          {/* Subtle gradient overlay on video side */}
          <div className="absolute inset-0 bg-gradient-to-r from-white lg:from-transparent to-transparent opacity-20"></div>
        </div>
        
        {/* Floating Stat or Label for Video side */}
        <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hidden md:block">
          <p className="text-white font-black text-4xl mb-1">100%</p>
          <p className="text-white/60 text-xs font-black uppercase tracking-widest">Natural Extraction</p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block animate-bounce">
        <div className="w-1 h-12 bg-gradient-to-b from-mill-gold to-transparent rounded-full"></div>
      </div>
    </section>

    <TrustBar />
    <Gallery isAdmin={isAdmin} />

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
                    <div className="flex items-center space-x-2">
                      <button onClick={() => toggleWishlist(product.id)} className={`p-4 rounded-2xl transition-all ${wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-red-400 hover:bg-red-50'}`}>
                        <Heart size={22} className={wishlist.includes(product.id) ? 'fill-red-500' : ''} />
                      </button>
                      <button onClick={() => handleAddToCart(product)} className="bg-mill-green text-white p-4 rounded-2xl hover:bg-mill-gold transition-all">
                        <ShoppingBag size={24} />
                      </button>
                    </div>
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
              { comment: "The aroma of this cold pressed oil is truly authentic. It has completely transformed the taste of our Gujarati dishes. Best in class quality!" },
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

    {/* FAQ & Contact Buttons */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/faq" className="bg-mill-green text-white px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-mill-gold transition-all shadow-xl shadow-mill-green/20 text-base flex items-center space-x-4">
            <span>FAQs</span>
            <ChevronRight size={24} />
          </Link>
          <a href="#contact" className="bg-white border-2 border-mill-green text-mill-green px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-mill-green hover:text-white transition-all text-base flex items-center space-x-4">
            <span>Contact Us</span>
            <ChevronRight size={24} />
          </a>
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
        <Link to="/" className="btn-primary text-xl px-12 uppercase tracking-widest font-black">Return to Home</Link>
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

          <div className="bg-white p-8 rounded-[40px] border-2 border-mill-green/10 mb-10 text-center shadow-xl">
            <span className="text-[10px] font-black text-mill-gold uppercase tracking-[0.3em] block mb-6">Scan to Pay Direct</span>
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-3xl shadow-inner border border-gray-100">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=rakesh.thakkar1-1@okicici&pn=Mahadev Oil Mill&am=${total}&cu=INR`)}`}
                  alt="Payment QR Code"
                  className="w-48 h-48 md:w-56 md:h-56"
                />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-mill-green">rakesh.thakkar1-1@okicici</p>
                <p className="text-sm font-bold text-slate-400">Scan this QR or use the UPI ID above</p>
              </div>
              <a 
                href={`upi://pay?pa=rakesh.thakkar1-1@okicici&pn=Mahadev%20Oil%20Mill&am=${total}&cu=INR`}
                className="w-full bg-slate-50 border-2 border-mill-green text-mill-green py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 hover:bg-mill-green hover:text-white transition-all"
              >
                <span>Pay with UPI Apps</span>
              </a>
            </div>
          </div>

          <button className="btn-primary w-full py-7 text-2xl tracking-[0.2em] uppercase font-black rounded-[30px] flex items-center justify-center space-x-4" onClick={handleCheckout} disabled={checkoutLoading}>
            <ShoppingBag size={24} />
            <span>{checkoutLoading ? 'Processing...' : 'Place Order Now'}</span>
          </button>
          
          <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase text-center leading-relaxed">
            By clicking "Place Order", your order will be recorded and <br/> we will contact you on WhatsApp for confirmation.
          </p>
          
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

const Privacy: React.FC = () => (
  <div className="container mx-auto px-4 py-20 animate-fade-up max-w-4xl">
    <h1 className="text-5xl md:text-6xl font-black text-mill-green tracking-tighter mb-4">Privacy Policy</h1>
    <p className="text-slate-500 font-bold mb-12">
      Mahadev Oil Mill, Vasad respects your privacy. This Privacy Policy outlines the manner your data is collected. You are advised to please read the Privacy Policy carefully. By accessing the services provided by mahadevoils.com you agree to the collection and use of your data by mahadevoils.com in the manner provided in this Privacy Policy.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      If you have questions or concerns regarding this statement, you can email us at:<br />
      <a href="mailto:mahadevoilmill13@gmail.com" className="text-mill-green underline">mahadevoilmill13@gmail.com</a>
    </p>
    <p className="text-slate-500 font-bold mb-12">
      The Policy does not apply to the procedures and practices followed by entities that are not managed, owned, or controlled by Mahadev Oil Mill, Vasad or to the people that are not engaged, employed, or managed by Mahadev Oil Mill, Vasad.
    </p>

    <Section title="Information that may be collected from you">
      <p>mahadevoils.com collects the details provided by you on registration together with information we learn about you from your use of our service and your visits to our website and other websites accessible from them.</p>
      <p className="mt-4">Kindly note that mahadevoils.com accepts orders in COD (Cash on Delivery) only.</p>
      <p className="mt-4">We may collect additional information in connection with your participation in any promotions or contests offered by us and information you provide when giving us feedback or completing profile forms.</p>
      <p className="mt-4">We also monitor customer traffic patterns and website use, which enables us to improve the service we provide. We will collect only such information as is necessary and relevant to provide you with the services available on the website.</p>
      <p className="mt-4 font-black text-mill-green">Information collected may include:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-500 font-bold">
        <li>Computer-identification information</li>
        <li>IP address</li>
        <li>Browser and device details</li>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing and shipping address</li>
        <li>PIN/ZIP code</li>
        <li>Shopping preferences and activity</li>
      </ul>
    </Section>

    <Section title="How We Collect Information">
      <p>We collect information when you:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-500 font-bold">
        <li>Register on our website</li>
        <li>Place an order</li>
        <li>Subscribe to updates or newsletters</li>
        <li>Participate in contests or surveys</li>
        <li>Contact customer support</li>
        <li>Browse our website</li>
      </ul>
    </Section>

    <Section title="Use of Information">
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-500 font-bold">
        <li>Process and deliver orders</li>
        <li>Improve customer experience</li>
        <li>Send order updates and notifications</li>
        <li>Inform you about offers and new products</li>
        <li>Maintain website security and prevent fraud</li>
      </ul>
    </Section>

    <Section title="Sharing of Information">
      <p>We do not rent, sell, or share your personal information with third parties except trusted service partners involved in website operation, shipping, or legal compliance.</p>
      <p className="mt-4">Information may be disclosed if required by law or to protect the rights and safety of Mahadev Oil Mill, Vasad and its users.</p>
    </Section>

    <Section title="Cookies">
      <p>Our website uses cookies to improve website functionality, remember user preferences, maintain secure sessions, and analyze website traffic.</p>
      <p className="mt-4">You may disable cookies in your browser settings, though some website features may not work properly.</p>
    </Section>

    <Section title="Data Security">
      <p>We follow generally accepted industry standards to protect your personal information. However, no method of internet transmission or electronic storage is completely secure.</p>
    </Section>

    <Section title="Account Closure">
      <p>You may request account closure by emailing us from your registered email ID with the subject:</p>
      <p className="mt-2 font-black text-mill-green italic">"Please close my mahadevoils.com account"</p>
      <p className="mt-2">Access to your account will be disabled within 2 working days.</p>
    </Section>

    <Section title="Third-Party Links">
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites.</p>
    </Section>

    <Section title="Policy Updates">
      <p>Mahadev Oil Mill, Vasad reserves the right to update or modify this Privacy Policy at any time. Changes will become effective immediately upon posting on the website.</p>
    </Section>

    <Section title="Contact Information">
      <p className="font-black text-mill-green">Mahadev Oil Mill, Vasad</p>
      <p>mahadevoils.com</p>
      <p>Email: <a href="mailto:mahadevoilmill13@gmail.com" className="text-mill-green underline">mahadevoilmill13@gmail.com</a></p>
    </Section>
  </div>
);

const faqs = [
  { q: "Which type of peanuts are used in Mahadev Oils?", a: "We use premium-quality groundnuts carefully selected from trusted farms to ensure purity, freshness, and rich taste." },
  { q: "When are the peanuts harvested?", a: "Groundnuts are generally harvested during the peak farming season to maintain freshness and nutritional value." },
  { q: "When is the best time to store Mahadev Oils?", a: "Store the oil in a cool, dry place away from direct sunlight to maintain freshness and quality for a longer period." },
  { q: "What is the shelf life of Mahadev Oils?", a: "Mahadev Oils products generally have a shelf life of 9 to 12 months when stored properly." },
  { q: "Is Mahadev Oils cold-pressed?", a: "Yes, our oils are prepared using traditional cold-pressed methods to preserve natural nutrients, aroma, and taste." },
  { q: "Is Mahadev Oils wood-pressed?", a: "No, Mahadev Oils are not wood-pressed. We specialize in pure cold-pressed oils made using hygienic and modern extraction methods." },
  { q: "Do you offer wholesale pricing?", a: "Yes, we offer wholesale pricing for bulk orders and distributors. Please contact our support team for details." },
  { q: "What are the delivery charges?", a: "Delivery charges may vary depending on the order quantity and delivery location. Shipping details are shown during checkout." },
  { q: "Is Mahadev Oils refined?", a: "No, Mahadev Oils are unrefined and processed naturally without harmful chemicals." },
  { q: "What Makes Mahadev Oils Special?", a: "Mahadev Oils is: Cold-Pressed, Unrefined, Chemical-Free, Cholesterol-Free, Preservative-Free, Free from Mixing with Other Oils, 100% Pure, 100% Natural, 100% Original." },
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-20 animate-fade-up max-w-4xl">
      <h1 className="text-5xl md:text-6xl font-black text-mill-green tracking-tighter mb-4">FAQs</h1>
      <p className="text-slate-500 font-bold text-lg mb-12">Check out these FAQs to know everything about Mahadev Oils, our sourcing practices, and more!</p>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-black text-mill-green pr-4">{faq.q}</span>
              <ChevronDown size={24} className={`text-mill-green shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96' : 'max-h-0'}`}>
              <div className="px-6 pb-6 text-slate-500 font-bold leading-relaxed">{faq.a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-black text-mill-green tracking-tight mb-4 uppercase">{title}</h2>
    <div className="text-slate-500 font-bold leading-relaxed">{children}</div>
  </div>
);

const Returns: React.FC = () => (
  <div className="container mx-auto px-4 py-20 animate-fade-up max-w-4xl">
    <h1 className="text-5xl md:text-6xl font-black text-mill-green tracking-tighter mb-4">Return & Exchange Policy</h1>
    <p className="text-slate-500 font-bold mb-12">
      We are responsible for what we sell. mahadevoilmill.com offers a simple and easy 15-day return policy. You can conveniently return or exchange any item within 15 days from the date of delivery through our third-party distributors.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      Please do not accept any order if the seal is broken or unsealed at the time of delivery.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      All returned items must be unused and unopened for hygiene and safety reasons, and returned with original packaging and labels intact. Items without original labels or packaging will not be accepted.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      All items purchased from mahadevoilmill.com can be returned for a full refund within 24 hours from the date of delivery (as recorded by the shipping provider). The amount will be refunded to customers through third-party distributors.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      Once we receive the returned products, a quality check will be performed by our quality team. This is subject to the return meeting the following requirements:
    </p>
    <ul className="list-disc pl-6 mb-12 space-y-1 text-slate-500 font-bold">
      <li>The items should be unused and unopened.</li>
      <li>The product should be returned with original packaging and labels intact.</li>
      <li>The items should be returned within 15 days from the delivery date.</li>
    </ul>
    <p className="text-slate-500 font-bold mb-12">
      Any returned item received by us that does not meet the above-mentioned conditions will not be accepted and will be returned to the customer at their expense. No refund will be issued in such cases.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      A notification regarding the status of the return will be sent to the customer within 48–72 working hours from the date of receiving the items.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      In cases where reverse pick-up is not available, customers will need to self-ship the items.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      Please ensure that the items being returned are packed securely to prevent any loss or damage during transit. For all self-shipped returns, please use a reliable courier service.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      We do not offer exchanges for orders placed outside India. If you require a different size or variant, please return the unwanted item for a refund and place a new order.
    </p>
    <p className="text-slate-500 font-bold mb-12">
      The customer will receive a cash refund through bank transfer into their account by third-party distributors.
    </p>

    <Section title="The Return Process">
      <p className="font-black text-mill-green mb-2">Online Return / Exchange</p>
      <p className="mb-4">You can return or exchange an item online at mahadevoilmill.com by following the steps below.</p>

      <p className="font-black text-mill-green mb-2">For Registered Users</p>
      <ol className="list-decimal pl-6 mb-4 space-y-1">
        <li>Log in to the "My Account" section at mahadevoilmill.com.</li>
        <li>Choose the order that needs modification.</li>
        <li>Select the product to return or exchange and fill in the required details.</li>
        <li>Proceed with the return or exchange request.</li>
      </ol>

      <p className="font-black text-mill-green mb-2">For Guest Users</p>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Click on "Order Return" from the footer menu at mahadevoilmill.com.</li>
        <li>Choose the order that needs modification.</li>
        <li>Select the product to return or exchange and fill in the required details.</li>
        <li>Proceed with the return or exchange request.</li>
      </ol>
    </Section>

    <Section title="Customer Support">
      <p className="mb-4">
        For any queries, you can contact our customer care team by phone <strong>9898280209</strong> (09:30 am to 7:00 pm IST) or email <a href="mailto:mahadevoilmill13@gmail.com" className="text-mill-green underline">mahadevoilmill13@gmail.com</a>.
      </p>
      <p className="font-black text-mill-green mb-2">Please keep the following information ready before contacting customer support:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Order Number / Registered E-Mail ID</li>
        <li>Product Name</li>
        <li>Pick-Up Address</li>
      </ul>
      <p className="mb-4">To process a return or exchange successfully, please re-pack the items with all original packaging and labels that were shipped with the order.</p>
      <p className="mb-4">Make sure the Return Form is completely filled and placed inside the package.</p>
      <p className="mb-4">
        Return Form is an easy-to-fill form included in the shipment parcel along with your order. If you have misplaced the return form, you may request a new copy from customer support.
      </p>
      <p className="font-black text-mill-green mb-2">Please mention the following details clearly on the package:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Order Number</li>
        <li>Product Name</li>
        <li>Return Reference Number</li>
      </ul>
    </Section>

    <Section title="Credit Returns">
      <p>The customer will receive a cash refund through bank transfer into their account.</p>
    </Section>

    <Section title="Terms & Conditions">
      <p>This Return Policy applies to all items purchased directly from mahadevoilmill.com. The policy is subject to change without prior notice. Please visit mahadevoilmill.com regularly for the latest updates and policy information.</p>
    </Section>
  </div>
);

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
            <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl" />
            <h1 className="leading-none">
              <span className="text-4xl font-black tracking-tighter block text-white">MAHADEV</span>
              <span className="text-[12px] text-mill-gold uppercase tracking-[0.4em] font-black mt-1 block">Oil Mill</span>
            </h1>
          </div>
          <p className="text-white/50 font-bold text-base leading-relaxed mb-10">
            Bringing back the traditional purity of cold pressed oils to every kitchen. Experience health in every drop.
          </p>
          <div className="flex space-x-6">
            <a href="https://facebook.com/mahadevoilmill" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-mill-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com/mahadevoilmill" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-mill-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
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
              <div className="flex flex-col">
                <a href="tel:+919879944395" className="hover:text-white transition-colors">Rakesh: +91 98799 44395</a>
                <a href="tel:+918849735425" className="hover:text-white transition-colors">Nimesh: +91 88497 35425</a>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <Phone size={20} className="text-mill-gold shrink-0" />
              <span>Customer Care: +91 98982 80209</span>
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
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
      } else if (isSignUp) {
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
      <div className="bg-white p-10 md:p-12 rounded-[50px] shadow-2xl border border-gray-100 w-full max-w-xl text-left">
        
        {/* Tabs */}
        {!isForgotPassword && (
          <div className="flex bg-slate-100 p-2 rounded-3xl mb-12">
            <button 
              onClick={() => { setActiveTab('customer'); setIsSignUp(false); }}
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'customer' ? 'bg-white text-mill-green shadow-sm' : 'text-slate-400 hover:text-mill-green'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setIsSignUp(false); }}
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'admin' ? 'bg-white text-mill-green shadow-sm' : 'text-slate-400 hover:text-mill-green'}`}
            >
              Admin
            </button>
          </div>
        )}

        <h2 className="text-5xl font-black text-mill-green mb-4 tracking-tighter">
          {isForgotPassword ? 'Reset Password' : (activeTab === 'admin' ? 'Admin Access' : (isSignUp ? 'Join Us' : 'Welcome Back'))}
        </h2>
        <p className="text-slate-500 font-bold mb-10 text-lg">
          {isForgotPassword 
            ? 'Enter your email to receive a reset link.' 
            : (activeTab === 'admin' 
                ? (isSignUp ? 'Register as a mill administrator.' : 'Access management tools and gallery control.')
                : (isSignUp ? 'Create an account to track your orders.' : 'Sign in to access your profile.'))}
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
          
          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-black text-mill-green uppercase tracking-widest">Password</label>
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-mill-gold hover:text-mill-green transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                className="form-input text-lg py-5" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isForgotPassword}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary w-full py-6 text-xl tracking-widest uppercase font-black rounded-[25px] mt-4"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Secure Login'))}
          </button>

          {isForgotPassword && (
            <button 
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-center text-sm font-black text-slate-400 uppercase tracking-widest hover:text-mill-green transition-colors mt-4"
            >
              Back to Login
            </button>
          )}
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-2xl text-center text-sm font-black uppercase tracking-widest ${message.includes('link') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-secondary-red'}`}>
            {message}
          </div>
        )}

        {!isForgotPassword && (
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-mill-green font-black uppercase tracking-widest text-sm hover:text-mill-gold transition-colors"
            >
              {isSignUp ? 'Already have an account? Login' : `Don't have an ${activeTab} account? Sign Up`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mahadev_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mahadev_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mahadev_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mahadev_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // SET YOUR ADMIN EMAIL HERE
      const adminEmail = 'rakesh.thakkar1-1@okicici'; // or your login email
      setIsAdmin(currentUser?.email === adminEmail || currentUser?.email === 'admin@mahadevoilmill.com');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
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
        guest_address: guestInfo.address, guest_city: guestInfo.city, guest_pincode: guestInfo.pincode, status: 'pending_payment'
      }).select('id').single();
      if (error) throw error;

      // Create WhatsApp message
      const itemsList = cartItems.map(item => `${item.product.name} (${item.product.size}) x${item.quantity}`).join('%0A');
      const message = `New Order Placed!%0A%0A*Customer:* ${guestInfo.name}%0A*Phone:* ${guestInfo.phone}%0A*Items:*%0A${itemsList}%0A%0A*Total:* ₹${total}%0A*Address:* ${guestInfo.address}, ${guestInfo.city} - ${guestInfo.pincode}`;
      
      setCartItems([]);
      window.location.href = `https://wa.me/919879944395?text=${message}`;
    } catch (err: any) { setCheckoutMessage(err.message); } finally { setCheckoutLoading(false); }
  };

  return (
    <Router>
      <div className="min-h-screen bg-transparent flex flex-col">
        <Header cartCount={cartCount} wishlistCount={wishlist.length} isAdmin={isAdmin} handleLogout={handleLogout} />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home 
              products={products} loading={loading} cartMessage={cartMessage}
              handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist}
              isAdmin={isAdmin}
            />} />
            <Route path="/cart" element={<Cart 
              cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart}
              guestInfo={guestInfo} setGuestInfo={setGuestInfo} handleCheckout={handleCheckout}
              checkoutLoading={checkoutLoading} checkoutMessage={checkoutMessage}
            />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success" element={<Success />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </main>
        <Footer />
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center space-y-3">
          {showScrollTop && (
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-14 h-14 bg-white text-mill-green rounded-full shadow-lg hover:bg-mill-green hover:text-white transition-all flex items-center justify-center border border-gray-100">
              <ChevronUp size={24} />
            </button>
          )}
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="w-14 h-14 bg-white text-mill-green rounded-full shadow-lg hover:bg-mill-green hover:text-white transition-all flex items-center justify-center border border-gray-100">
            <ChevronDown size={24} />
          </button>
          <a href="https://facebook.com/mahadevoilmill" target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#1877F2] text-white rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://instagram.com/mahadevoilmill" target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#E4405F] text-white rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://wa.me/919879944395" className="bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)] px-6 py-3 space-x-3" target="_blank" rel="noreferrer">
            <MessageCircle size={24} />
            <span className="font-black text-sm whitespace-nowrap">Order / ઓર્ડેર માટે</span>
          </a>
        </div>
      </div>
    </Router>
  );
};

export default App;
