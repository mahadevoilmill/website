import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Droplet, 
  Users, 
  MapPin, 
  Phone, 
  Info,
  MessageCircle,
  Sprout,
  ShieldCheck,
  Package,
  ShoppingCart
} from 'lucide-react';
import { supabase } from './supabaseClient';

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  tag: string;
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('price', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = () => {
    setCartCount(c => c + 1);
    // Future: Logic to track individual items in cart state
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container nav">
          <div className="logo">
            <img src="/logo.jpeg" alt="Mahadev Oil Mill Logo" style={{ height: '50px', width: 'auto' }} />
            <span style={{ marginLeft: '10px' }}>MAHADEV <span style={{ color: 'var(--primary-gold)' }}>OIL MILL</span></span>
          </div>
          
          <ul className="nav-links">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#products" className="nav-link">Products</a></li>
            <li><a href="#process" className="nav-link">Our Process</a></li>
            <li><a href="#about" className="nav-link">About Us</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <button className="nav-link" onClick={() => addToCart()}>
              <ShoppingBag size={24} />
              {cartCount > 0 && <span style={{ marginLeft: '4px', background: 'var(--secondary-red)', color: 'white', borderRadius: '50%', padding: '0 6px', fontSize: '12px' }}>{cartCount}</span>}
            </button>
            <button className="nav-link mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="container hero-content">
          <h1>Traditional Purity for Your Modern Kitchen</h1>
          <p>Experience the authentic taste of 100% pure, wood-pressed groundnut oil. Sourced from the finest seeds, delivered directly to your doorstep.</p>
          <div className="hero-btns">
            <a href="#products" className="btn btn-primary">Shop Now</a>
            <a href="#process" className="btn btn-secondary">Our Story</a>
          </div>
        </div>
      </section>

      {/* Stats - Parallax */}
      <section className="parallax-section" style={{ backgroundImage: "url('/assets/stats.jpg')" }}>
        <div className="parallax-overlay" style={{ background: 'rgba(255, 255, 255, 0.85)' }}></div>
        <div className="container parallax-content" style={{ color: 'var(--text-main)' }}>
          <div className="process-grid">
            <div className="process-item">
              <Users size={40} color="var(--primary-green)" />
              <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>10k+</h2>
              <p>Happy Customers</p>
            </div>
            <div className="process-item">
              <MapPin size={40} color="var(--primary-green)" />
              <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>50+</h2>
              <p>Outlets</p>
            </div>
            <div className="process-item">
              <ShieldCheck size={40} color="var(--primary-green)" />
              <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>100%</h2>
              <p>Pure & Natural</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products - Parallax */}
      <section id="products" className="parallax-section" style={{ backgroundImage: "url('/assets/products.jpg')" }}>
        <div className="parallax-overlay" style={{ background: 'rgba(243, 244, 246, 0.9)' }}></div>
        <div className="container parallax-content" style={{ color: 'var(--text-main)' }}>
          <div className="section-title">
            <h2 style={{ color: 'var(--primary-green)' }}>Our Premium Products</h2>
            <p>Select the best size for your family's needs</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card" style={{ background: '#fff' }}>
                  <div className="product-img">
                    <Droplet size={80} color="var(--primary-gold)" />
                  </div>
                  <div className="product-info">
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                    <h3>{product.name}</h3>
                    <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Size: {product.size}</p>
                    <div className="product-price">₹{product.price}</div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => addToCart()}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process - Parallax Section */}
      <section id="process" className="parallax-section" style={{ backgroundImage: "url('/assets/process.jpg')" }}>
        <div className="parallax-overlay"></div>
        <div className="container parallax-content">
          <div className="section-title">
            <h2 style={{ color: 'var(--primary-gold)' }}>Desh Ki Mitti Se Kitchen Tak</h2>
            <p style={{ color: 'var(--white)' }}>The journey of our oil from fields to your food</p>
          </div>
          <div className="process-grid">
            <div className="process-item">
              <div className="process-icon" style={{ background: 'var(--white)' }}><Sprout size={32} /></div>
              <h3>Farming</h3>
              <p>Directly sourced from trusted farmers across Gujarat.</p>
            </div>
            <div className="process-item">
              <div className="process-icon" style={{ background: 'var(--white)' }}><Info size={32} /></div>
              <h3>Cleaning</h3>
              <p>Removing impurities through multiple quality checks.</p>
            </div>
            <div className="process-item">
              <div className="process-icon" style={{ background: 'var(--white)' }}><Droplet size={32} /></div>
              <h3>Pressing</h3>
              <p>Traditional wood pressing at low temperatures.</p>
            </div>
            <div className="process-item">
              <div className="process-icon" style={{ background: 'var(--white)' }}><Package size={32} /></div>
              <h3>Packing</h3>
              <p>Hygienic packing in eco-friendly containers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison - Parallax Section */}
      <section className="parallax-section" style={{ backgroundImage: "url('/assets/comparison.jpg')" }}>
        <div className="parallax-overlay" style={{ background: 'rgba(21, 128, 61, 0.8)' }}></div>
        <div className="container parallax-content">
          <div className="section-title">
            <h2 style={{ color: 'var(--white)' }}>Refined Oil vs Wood Pressed Oil</h2>
            <p style={{ color: 'var(--white)', opacity: 0.9 }}>Why choose Mahadev Oil Mill?</p>
          </div>
          <table className="comparison-table" style={{ background: 'var(--white)', color: 'var(--text-main)', borderRadius: '12px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <thead>
              <tr>
                <th style={{ background: 'var(--gray-light)', color: 'var(--text-main)' }}>Feature</th>
                <th style={{ background: 'var(--gray-light)', color: 'var(--text-main)' }}>Refined Oil</th>
                <th style={{ background: 'var(--primary-gold)', color: 'var(--text-main)', fontWeight: '800' }}>Mahadev Wood Pressed Oil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600' }}>Extraction Method</td>
                <td>High heat & Chemical extraction</td>
                <td style={{ color: 'var(--primary-green)', fontWeight: '700' }}>Traditional Wood Press (Lakadi Ghana)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Nutritional Value</td>
                <td>Lost during heating</td>
                <td style={{ color: 'var(--primary-green)', fontWeight: '700' }}>100% Retained</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Cholesterol</td>
                <td>Contains Trans Fats</td>
                <td style={{ color: 'var(--primary-green)', fontWeight: '700' }}>Zero Trans Fats</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Preservatives</td>
                <td>Harmful Additives Added</td>
                <td style={{ color: 'var(--primary-green)', fontWeight: '700' }}>Natural & Preservative Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{ color: 'var(--white)', marginBottom: '16px' }}>
                <img src="/logo.jpeg" alt="Mahadev Oil Mill Logo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
                <span style={{ marginLeft: '10px' }}>MAHADEV <span style={{ color: 'var(--primary-gold)' }}>OIL MILL</span></span>
              </div>
              <p style={{ opacity: 0.8 }}>Traditional Wood Pressed Groundnut Oil manufacturing unit based in Gujarat, committed to providing health and purity in every drop.</p>
            </div>
            <div>
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#process">Our Process</a></li>
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3>Contact Us</h3>
              <ul className="footer-links">
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={18} style={{ marginTop: '4px', flexShrink: 0 }} /> 902, Nagardas Ni Khadki, Opp. Ramji Mandir, Vasad - 388306 Ta & Di : Anand
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={18} /> +91 98799 44395 / 88497 35425
                </li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '14px', opacity: 0.6 }}>
            © 2026 Mahadev Oil Mill. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919879944395" className="whatsapp-float" target="_blank" rel="noreferrer">
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default App;
