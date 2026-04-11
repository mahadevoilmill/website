import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Droplet, 
  Users, 
  MapPin, 
  Phone, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { supabase } from './supabaseClient';

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  tag?: string;
  image_url?: string;
  stock_quantity?: number;
}

interface Profile {
  full_name?: string;
  phone_number?: string;
  address_line?: string;
  city?: string;
  pincode?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authMessage, setAuthMessage] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        await fetchProfile(data.session.user.id);
      }
    };

    fetchProducts();
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Profile fetch error:', error);
      return;
    }

    setProfile(data || null);
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthMessage('');

    if (!authEmail || !authPassword) {
      setAuthMessage('Please enter both email and password.');
      return;
    }

    if (authMode === 'sign-up') {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) {
        setAuthMessage(error.message);
        return;
      }
      setAuthMessage('Check your email to confirm sign up.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage('Signed in successfully.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthMessage('Signed out successfully.');
  };

  const handleAddToCart = (product: Product) => {
    setCheckoutMessage('');
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      setCheckoutMessage('Please sign in to complete your order.');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutMessage('Your cart is empty. Add a product first.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutMessage('');

    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({ customer_id: user.id, total_amount: totalAmount })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setCartItems([]);
      setCheckoutMessage('Order placed successfully! We will contact you soon.');
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutMessage(error?.message || 'Unable to place order.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!user) {
      setAuthMessage('Sign in first to save profile details.');
      return;
    }

    const profilePayload = {
      id: user.id,
      full_name: profile?.full_name || null,
      phone_number: profile?.phone_number || null,
      address_line: profile?.address_line || null,
      city: profile?.city || null,
      pincode: profile?.pincode || null,
    };

    const { error } = await supabase.from('profiles').upsert(profilePayload);
    if (error) {
      setAuthMessage('Failed to save profile.');
      return;
    }

    setAuthMessage('Profile details saved successfully.');
  };

  const updateProfileField = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...(prev || {}), [field]: value }));
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
            <button className="nav-link" onClick={() => { }}>
              <ShoppingBag size={24} />
              {cartCount > 0 && <span style={{ marginLeft: '4px', background: 'var(--secondary-red)', color: 'white', borderRadius: '50%', padding: '0 6px', fontSize: '12px' }}>{cartCount}</span>}
            </button>
            <button className="nav-link mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'flex' }}>
              {isMenuOpen ? <X size={24} color="var(--primary-green)" /> : <Menu size={24} color="var(--primary-green)" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Pure Goodness in Every Drop</h1>
          <p>Experience the authentic taste of 100% pure, wood-pressed groundnut oil. Crafted using traditional methods, sourced from the finest seeds, and delivered with care directly to your doorstep.</p>
          <div className="hero-btns">
            <a href="#products" className="btn btn-primary">Shop Now</a>
            <a href="#process" className="btn btn-secondary">Learn Our Story</a>
          </div>
        </div>
      </section>

      {/* Stats - Parallax */}
      <section className="parallax-section" style={{ backgroundImage: "url('/assets/peanut-farm.jpg')" }}>
        <div className="parallax-overlay"></div>
        <div className="container parallax-content">
          <div className="section-title">
            <h2 style={{ color: 'var(--white)' }}>Trusted by Thousands</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Join our growing family of health-conscious customers</p>
          </div>
          <div className="process-grid">
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon"><Users size={40} color="var(--white)" /></div>
              <h2 style={{ fontSize: '2.8rem', margin: '10px 0', fontWeight: '800' }}>10k+</h2>
              <p>Happy Customers</p>
            </div>
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon"><MapPin size={40} color="var(--white)" /></div>
              <h2 style={{ fontSize: '2.8rem', margin: '10px 0', fontWeight: '800' }}>50+</h2>
              <p>Retail Outlets</p>
            </div>
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon"><ShieldCheck size={40} color="var(--white)" /></div>
              <h2 style={{ fontSize: '2.8rem', margin: '10px 0', fontWeight: '800' }}>100%</h2>
              <p>Pure & Natural</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Authentication */}
      <section className="auth-section">
        <div className="container auth-card">
          {!user ? (
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <div className="section-title">
                <h2>Customer Login</h2>
                <p>Sign in or create an account to place orders and save your delivery details.</p>
              </div>
              <div className="auth-input-group">
                <label>Email</label>
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="auth-input-group">
                <label>Password</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Enter strong password" required />
              </div>
              <div className="auth-actions">
                <button type="submit" className="btn btn-primary">{authMode === 'sign-in' ? 'Sign In' : 'Sign Up'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in')}>
                  {authMode === 'sign-in' ? 'Create account' : 'Already have account?'}
                </button>
              </div>
              {authMessage && <p className="auth-message">{authMessage}</p>}
            </form>
          ) : (
            <div className="profile-card">
              <div className="section-title">
                <h2>Welcome, {user.email}</h2>
                <p>Update your profile so we can deliver your order accurately.</p>
              </div>
              <div className="profile-grid">
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input type="text" value={profile?.full_name || ''} onChange={e => updateProfileField('full_name', e.target.value)} placeholder="Your full name" />
                </div>
                <div className="auth-input-group">
                  <label>Phone Number</label>
                  <input type="tel" value={profile?.phone_number || ''} onChange={e => updateProfileField('phone_number', e.target.value)} placeholder="Mobile number" />
                </div>
                <div className="auth-input-group">
                  <label>Address</label>
                  <input type="text" value={profile?.address_line || ''} onChange={e => updateProfileField('address_line', e.target.value)} placeholder="House, street, locality" />
                </div>
                <div className="auth-input-group">
                  <label>City</label>
                  <input type="text" value={profile?.city || ''} onChange={e => updateProfileField('city', e.target.value)} placeholder="City" />
                </div>
                <div className="auth-input-group">
                  <label>Pincode</label>
                  <input type="text" value={profile?.pincode || ''} onChange={e => updateProfileField('pincode', e.target.value)} placeholder="Pincode" />
                </div>
              </div>
              <div className="auth-actions">
                <button type="button" className="btn btn-primary" onClick={handleProfileSave}>Save Profile</button>
                <button type="button" className="btn btn-secondary" onClick={handleSignOut}>Sign Out</button>
              </div>
              {authMessage && <p className="auth-message">{authMessage}</p>}
            </div>
          )}
        </div>
      </section>

      {/* Products - Parallax */}
      <section id="products" className="parallax-section" style={{ backgroundImage: "url('/assets/peanut-oil-bottle.jpg')" }}>
        <div className="parallax-overlay" style={{ background: 'rgba(255, 255, 255, 0.92)' }}></div>
        <div className="container parallax-content" style={{ color: 'var(--text-main)' }}>
          <div className="section-title">
            <h2 style={{ color: 'var(--primary-green)' }}>Our Premium Collection</h2>
            <p>Carefully selected sizes for every household need</p>
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
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {cartItems.length > 0 && (
        <section className="cart-section">
          <div className="container">
            <div className="section-title" style={{ textAlign: 'left' }}>
              <h2>Shopping Cart</h2>
              <p>Review your items and complete the order when you're ready.</p>
            </div>
            <div className="cart-grid">
              <div className="cart-list">
                {cartItems.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div>
                      <strong>{item.product.name}</strong>
                      <p>{item.product.size} × {item.quantity}</p>
                    </div>
                    <div>
                      <span>₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary-card">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}</strong>
                </div>
                <button className="btn btn-primary" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Placing order...' : user ? 'Checkout Now' : 'Sign in to Checkout'}
                </button>
                {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process - Parallax Section */}
      <section id="process" className="parallax-section" style={{ backgroundImage: "url('/assets/peanut-process.jpg')" }}>
        <div className="parallax-overlay"></div>
        <div className="container parallax-content">
          <div className="section-title">
            <h2 style={{ color: 'var(--primary-gold)' }}>From Field to Kitchen</h2>
            <p style={{ color: 'var(--white)' }}>Our traditional wood-pressing journey</p>
          </div>
          <div className="process-grid">
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon">1</div>
              <h3 style={{ color: 'var(--white)' }}>Sourcing</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Premium peanuts directly from trusted farmers across Gujarat</p>
            </div>
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon">2</div>
              <h3 style={{ color: 'var(--white)' }}>Quality Check</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Rigorous inspection and cleaning of seeds</p>
            </div>
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon">3</div>
              <h3 style={{ color: 'var(--white)' }}>Wood Pressing</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Traditional cold-press method at low temperatures</p>
            </div>
            <div className="process-item" style={{ color: 'var(--white)' }}>
              <div className="process-icon">4</div>
              <h3 style={{ color: 'var(--white)' }}>Bottling</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Eco-friendly packaging with care and precision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison - Parallax Section */}
      <section className="parallax-section" style={{ backgroundImage: "url('/assets/peanut-kitchen.jpg')" }}>
        <div className="parallax-overlay" style={{ background: 'rgba(93, 58, 26, 0.85)' }}></div>
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
                <img src="/logo.jpeg" alt="Mahadev Oil Mill Logo" style={{ height: '50px', width: 'auto', borderRadius: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                <span style={{ marginLeft: '12px', fontSize: '20px', fontWeight: '800' }}>MAHADEV <span style={{ color: 'var(--primary-gold)' }}>OIL MILL</span></span>
              </div>
              <p>Traditional wood-pressed groundnut oil crafted with care. A family business rooted in quality, health, and heritage. Every drop carries the purity of nature.</p>
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
              <h3>Get in Touch</h3>
              <ul className="footer-links">
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--primary-gold)' }} />
                  <span>902, Nagardas Ni Khadki, Opp. Ramji Mandir, Vasad - 388306, Anand, Gujarat</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                  <Phone size={18} style={{ color: 'var(--primary-gold)' }} />
                  <span>+91 98799 44395<br/>+91 88497 35425</span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '30px', textAlign: 'center', fontSize: '13px', opacity: 0.5 }}>
            © 2026 Mahadev Oil Mill. Pure Quality, Timeless Tradition.
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
