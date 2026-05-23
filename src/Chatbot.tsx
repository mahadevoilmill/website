import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Settings, Save, RefreshCw, UserCheck, Mail, Phone as PhoneIcon, MessageSquare, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from './supabaseClient';

interface Message {
  id?: string | number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  image_url?: string;
}

interface OrderData {
  product_id: string;
  product_name: string;
  product_price: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface ChatConfig {
  welcome_message: string;
  bot_name: string;
  response_price: string;
  response_delivery: string;
  response_purity: string;
  response_contact: string;
  response_location: string;
  response_fallback: string;
  extra_questions: { question: string; answer: string }[];
}

interface Lead {
  id: string;
  name: string;
  email: string;
  mobile: string;
  last_message: string;
  created_at: string;
  session_id?: string;
}

interface Order {
  id: string;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  guest_city: string;
  guest_pincode: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const defaultConfig: ChatConfig = {
  welcome_message: "Namaste! 🙏 Welcome to Mahadev Oil Mill. How can I help you today?",
  bot_name: "Mill Assistant",
  response_price: "Our Cold Pressed Groundnut Oil prices are: \n• 1 Litre: ₹270\n• 5 Litre: ₹1300\n• 15 Litre: ₹3500\nAll oils are 100% pure and traditional cold pressed! 🌿",
  response_delivery: "We provide fast delivery across India. Shipping is FREE for most orders! You can track your order using the 'Track Order' link in the menu.",
  response_purity: "At Mahadev Oil Mill, we use traditional cold pressing. No heat, no chemicals, no preservatives. 100% pure goodness! 🌿",
  response_contact: "You can reach us at +91 98799 44395. Or click the green WhatsApp button to chat with Rakesh directly!",
  response_location: "We are located in Vasad, Gujarat. Our address is 902, Nagardas ni Khadki, Near Ramji Mandir, Vasad 388306.",
  response_fallback: "I'm not sure I understand that. Would you like to check our products, delivery info, or talk to a human on WhatsApp?",
  extra_questions: []
};

export const ChatbotAdmin: React.FC = () => {
  const [config, setConfig] = useState<ChatConfig>(defaultConfig);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // History Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchLeads();
    fetchOrders();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('chatbot_config').select('key, value');
      if (error) throw error;
      if (data) {
        const newConfig = { ...defaultConfig };
        data.forEach((item: any) => {
          if (item.key in newConfig) {
            if (item.key === 'extra_questions') {
              try {
                newConfig.extra_questions = JSON.parse(item.value);
              } catch (e) {
                newConfig.extra_questions = [];
              }
            } else {
              (newConfig as any)[item.key] = item.value;
            }
          }
        });
        setConfig(newConfig);
      }
    } catch (err: any) {
      console.error('Error fetching chatbot config:', err);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('chatbot_leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchHistory = async (sessionId: string) => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setHistory((data || []).map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sender as 'user' | 'bot',
        timestamp: new Date(m.created_at)
      })));
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openHistory = (lead: Lead) => {
    if (!lead.session_id) return;
    setSelectedLead(lead);
    fetchHistory(lead.session_id);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        updated_at: new Date()
      }));

      const { error } = await supabase.from('chatbot_config').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
      setMessage('Settings saved successfully! ✨');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && leads.length === 0) return <div className="p-8 text-center font-bold text-slate-400">Loading admin panel...</div>;

  return (
    <div className="space-y-12 max-w-6xl mx-auto my-12">
      {/* Config Form */}
      <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-left">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-mill-green/10 text-mill-green rounded-2xl">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-mill-green tracking-tighter">Chatbot Configuration</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Update bot responses dynamically</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-mill-gold uppercase tracking-[0.3em] mb-4">Identity & Welcome</h3>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Bot Name</label>
              <input 
                type="text" 
                className="form-input text-base py-4" 
                value={config.bot_name}
                onChange={e => setConfig({...config, bot_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Welcome Message</label>
              <textarea 
                className="form-input text-base py-4 h-32" 
                value={config.welcome_message}
                onChange={e => setConfig({...config, welcome_message: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-mill-gold uppercase tracking-[0.3em] mb-4">Specific Responses</h3>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Price Inquiries</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_price}
                onChange={e => setConfig({...config, response_price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Delivery Inquiries</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_delivery}
                onChange={e => setConfig({...config, response_delivery: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Purity/Quality Inquiries</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_purity}
                onChange={e => setConfig({...config, response_purity: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Contact Details</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_contact}
                onChange={e => setConfig({...config, response_contact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Store Location</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_location}
                onChange={e => setConfig({...config, response_location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-mill-green uppercase tracking-widest mb-2">Fallback (No Match)</label>
              <textarea 
                className="form-input text-sm py-3 h-20" 
                value={config.response_fallback}
                onChange={e => setConfig({...config, response_fallback: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 pt-8 border-t border-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-mill-gold uppercase tracking-[0.3em]">Extra Questions & Custom Responses</h3>
              <button 
                type="button"
                onClick={() => setConfig({
                  ...config, 
                  extra_questions: [...config.extra_questions, { question: '', answer: '' }]
                })}
                className="flex items-center space-x-2 text-mill-green hover:text-mill-gold transition-colors font-black uppercase tracking-widest text-[10px]"
              >
                <Plus size={14} />
                <span>Add New Question</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {config.extra_questions.map((q, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">User Question / Keywords</label>
                      <input 
                        type="text"
                        placeholder="e.g. shipping time, shelf life"
                        className="form-input text-sm py-3"
                        value={q.question}
                        onChange={e => {
                          const newExtras = [...config.extra_questions];
                          newExtras[idx].question = e.target.value;
                          setConfig({...config, extra_questions: newExtras});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bot Response</label>
                      <textarea 
                        placeholder="What should the bot say?"
                        className="form-input text-sm py-3 h-20"
                        value={q.answer}
                        onChange={e => {
                          const newExtras = [...config.extra_questions];
                          newExtras[idx].answer = e.target.value;
                          setConfig({...config, extra_questions: newExtras});
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newExtras = config.extra_questions.filter((_, i) => i !== idx);
                      setConfig({...config, extra_questions: newExtras});
                    }}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end md:self-start"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {config.extra_questions.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No extra questions added yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 pt-8 border-t border-gray-50 flex items-center justify-between">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-mill-green text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-mill-gold transition-all shadow-xl flex items-center space-x-3 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
              <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
            </button>
            
            {message && (
              <div className={`px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest ${message.includes('Error') ? 'bg-red-50 text-secondary-red' : 'bg-emerald-50 text-emerald-600'}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-left overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-mill-green/10 text-mill-green rounded-2xl">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-mill-green tracking-tighter">Chatbot Orders</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Recent purchases via bot</p>
            </div>
          </div>
          <button onClick={fetchOrders} className="p-3 text-slate-400 hover:text-mill-green transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Details</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Address</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 align-top whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-400">{new Date(order.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="py-6 align-top">
                    <div className="space-y-1">
                      <p className="text-base font-black text-mill-green">{order.guest_name}</p>
                      <p className="text-xs font-bold text-slate-500">{order.guest_phone}</p>
                    </div>
                  </td>
                  <td className="py-6 align-top">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 align-top max-w-xs">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      {order.guest_address}, {order.guest_city} - {order.guest_pincode}
                    </p>
                  </td>
                  <td className="py-6 align-top">
                    <span className="text-base font-black text-mill-gold">₹{order.total_amount}</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">No orders received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-left overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-mill-gold/10 text-mill-gold rounded-2xl">
              <UserCheck size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-mill-green tracking-tighter">Recent Leads</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Collected via Chatbot</p>
            </div>
          </div>
          <button onClick={fetchLeads} className="p-3 text-slate-400 hover:text-mill-green transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Inquiry</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 align-top whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="py-6 align-top">
                    <span className="text-base font-black text-mill-green">{lead.name || 'Anonymous'}</span>
                  </td>
                  <td className="py-6 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
                        <Mail size={14} className="text-mill-gold" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
                        <PhoneIcon size={14} className="text-mill-gold" />
                        <span>{lead.mobile}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 align-top max-w-xs">
                    <p className="text-xs font-bold text-slate-500 italic line-clamp-2 leading-relaxed">
                      "{lead.last_message || 'No message recorded'}"
                    </p>
                  </td>
                  <td className="py-6 align-top">
                    {lead.session_id ? (
                      <button 
                        onClick={() => openHistory(lead)}
                        className="flex items-center space-x-2 bg-slate-100 hover:bg-mill-gold hover:text-white px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                      >
                        <MessageSquare size={14} />
                        <span>View Chat</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic">No history</span>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">No leads collected yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col h-[80vh] overflow-hidden border border-white/20 animate-fade-up">
            <div className="p-8 bg-mill-green text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight leading-none">{selectedLead.name || 'Customer Chat'}</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">{selectedLead.mobile}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
              {loadingHistory ? (
                <div className="flex justify-center items-center h-full">
                  <RefreshCw className="animate-spin text-mill-gold" size={40} />
                </div>
              ) : (
                history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-mill-green text-white rounded-2xl rounded-tr-none' : 'bg-white text-slate-600 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none'} p-5 font-bold text-sm`}>
                      {msg.text}
                      <div className={`text-[10px] mt-2 opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-8 bg-white border-t border-gray-100 text-center shrink-0">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">End of Conversation History</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ChatConfig>(defaultConfig);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(() => {
    return localStorage.getItem('mahadev_lead_captured') === 'true';
  });
  const [leadData, setLeadData] = useState({ name: '', email: '', mobile: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadError, setLeadError] = useState('');
  
  // Order Flow State
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderStep, setOrderStep] = useState(0); // 0: Select Product, 1: Address, 2: Confirm
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    product_id: '',
    product_name: '',
    product_price: 0,
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // Session ID for history tracking
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('mahadev_chat_sid');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('mahadev_chat_sid', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConfig();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('price', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products for chatbot:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0 && !isTyping) {
      const initialMsg = {
        id: Date.now(),
        text: config.welcome_message,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages([initialMsg]);
      logMessage(initialMsg.text, 'bot');
    }
  }, [config]);

  const logMessage = async (text: string, sender: 'user' | 'bot') => {
    try {
      await supabase.from('chatbot_messages').insert({
        session_id: sessionId,
        sender,
        text
      });
    } catch (err) {
      console.error('Error logging message:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('chatbot_config').select('key, value');
      if (error) throw error;
      if (data && data.length > 0) {
        const newConfig = { ...defaultConfig };
        data.forEach((item: any) => {
          if (item.key in newConfig) {
            if (item.key === 'extra_questions') {
              try {
                newConfig.extra_questions = JSON.parse(item.value);
              } catch (e) {
                newConfig.extra_questions = [];
              }
            } else {
              (newConfig as any)[item.key] = item.value;
            }
          }
        });
        setConfig(newConfig);
      }
    } catch (err) {
      console.error('Error fetching chatbot config:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLeadForm]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      const { error } = await supabase.from('orders').insert({
        guest_name: orderData.name,
        guest_phone: orderData.phone,
        guest_address: orderData.address,
        guest_city: orderData.city,
        guest_pincode: orderData.pincode,
        total_amount: orderData.product_price,
        status: 'pending'
      });

      if (error) throw error;

      setShowOrderForm(false);
      setOrderStep(0);
      
      const botResponse = `Thank you for your order, ${orderData.name}! 🙏 We have received your request for ${orderData.product_name}. Our team will contact you shortly for payment and delivery details.`;
      const finalBotMsg: Message = {
        id: Date.now(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, finalBotMsg]);
      logMessage(botResponse, 'bot');
    } catch (err: any) {
      console.error('Error saving order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    if (text === "PLACE_ORDER_NOW") {
      setShowOrderForm(true);
      setOrderStep(0);
      return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInputValue('');
    logMessage(text, 'user');
    setIsTyping(true);

    const userMessageCount = newMessages.filter(m => m.sender === 'user').length;
    
    setTimeout(() => {
      let botResponse = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("rate")) {
        botResponse = config.response_price;
      } else if (lowerText.includes("delivery") || lowerText.includes("shipping")) {
        botResponse = config.response_delivery;
      } else if (lowerText.includes("pure") || lowerText.includes("quality") || lowerText.includes("natural")) {
        botResponse = config.response_purity;
      } else if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("whatsapp")) {
        botResponse = config.response_contact;
      } else if (lowerText.includes("location") || lowerText.includes("where") || lowerText.includes("address")) {
        botResponse = config.response_location;
      } else if (lowerText.includes("order") || lowerText.includes("buy") || lowerText.includes("purchase")) {
        botResponse = "I can help you with that! Would you like to place an order now? Click the 'Place Order' button below.";
      } else {
        // Check extra questions
        const matchedExtra = config.extra_questions.find(q => 
          lowerText.includes(q.question.toLowerCase()) && q.question.trim() !== ""
        );
        
        if (matchedExtra) {
          botResponse = matchedExtra.answer;
        } else {
          botResponse = config.response_fallback;
        }
      }

      const newBotMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
      logMessage(botResponse, 'bot');
      setIsTyping(false);

      if (!leadCaptured && userMessageCount >= 1) {
        setTimeout(() => setShowLeadForm(true), 1500);
      }
    }, 1000);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.mobile || !leadData.email) return;

    setIsSubmittingLead(true);
    setLeadError('');
    try {
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop()?.text || '';
      
      const { error } = await supabase.from('chatbot_leads').insert({
        name: leadData.name,
        email: leadData.email,
        mobile: leadData.mobile,
        last_message: lastUserMessage,
        session_id: sessionId
      });

      if (error) throw error;

      setLeadCaptured(true);
      localStorage.setItem('mahadev_lead_captured', 'true');
      setShowLeadForm(false);
      
      const botResponse = `Thank you, ${leadData.name || 'friend'}! 🙏 Our team will contact you soon on ${leadData.mobile}.`;
      const finalBotMsg: Message = {
        id: Date.now(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, finalBotMsg]);
      logMessage(botResponse, 'bot');
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setLeadError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const quickActions = [
    { label: "Place Order", query: "PLACE_ORDER_NOW" },
    { label: "Product Prices", query: "What are the prices?" },
    { label: "Delivery Info", query: "Tell me about delivery" },
    { label: "Contact Us", query: "How to contact you?" }
  ];

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-mill-green text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center fixed bottom-28 right-6 z-[110] border-4 border-white animate-bounce"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col z-[120] overflow-hidden border border-gray-100 animate-fade-up">
          <div className="bg-mill-green p-6 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="font-black text-lg leading-none">{config.bot_name}</h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Online Now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] flex items-end space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-mill-gold text-white' : 'bg-white text-mill-green shadow-sm'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-[20px] text-sm font-bold leading-relaxed ${msg.sender === 'user' ? 'bg-mill-green text-white rounded-tr-none' : 'bg-white text-slate-600 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                    {msg.text}
                    <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 flex space-x-1">
                  <div className="w-2 h-2 bg-mill-green/30 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-mill-green/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-mill-green/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            {showOrderForm && (
              <div className="bg-white p-6 rounded-[24px] shadow-lg border-2 border-mill-green/20 animate-fade-up">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-black text-mill-green uppercase tracking-widest">Order Now</h4>
                  <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                </div>

                {orderStep === 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-bold mb-4">Select a product to order:</p>
                    {loadingProducts ? (
                      <div className="flex justify-center p-4"><RefreshCw className="animate-spin text-mill-gold" /></div>
                    ) : (
                      products.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            setOrderData({...orderData, product_id: p.id, product_name: `${p.name} (${p.size})`, product_price: p.price});
                            setOrderStep(1);
                          }}
                          className="w-full text-left p-4 bg-slate-50 hover:bg-mill-green hover:text-white rounded-2xl transition-all group"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-black">{p.name}</p>
                              <p className="text-[10px] font-bold opacity-60 uppercase">{p.size}</p>
                            </div>
                            <p className="font-black text-mill-gold group-hover:text-white">₹{p.price}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {orderStep === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); setOrderStep(2); }} className="space-y-3">
                    <p className="text-xs text-slate-500 font-bold mb-4">Delivery Details:</p>
                    <input 
                      type="text" placeholder="Full Name" required 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-green/20"
                      value={orderData.name} onChange={e => setOrderData({...orderData, name: e.target.value})}
                    />
                    <input 
                      type="tel" placeholder="Mobile Number" required 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-green/20"
                      value={orderData.phone} onChange={e => setOrderData({...orderData, phone: e.target.value})}
                    />
                    <textarea 
                      placeholder="Full Address" required 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-green/20 h-20"
                      value={orderData.address} onChange={e => setOrderData({...orderData, address: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" placeholder="City" required 
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-green/20"
                        value={orderData.city} onChange={e => setOrderData({...orderData, city: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Pincode" required 
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-green/20"
                        value={orderData.pincode} onChange={e => setOrderData({...orderData, pincode: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="w-full bg-mill-green text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-mill-gold transition-all">
                      Next Step
                    </button>
                  </form>
                )}

                {orderStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</p>
                      <p className="text-sm font-black text-mill-green">{orderData.product_name}</p>
                      <p className="text-lg font-black text-mill-gold">Total: ₹{orderData.product_price}</p>
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500">{orderData.name} | {orderData.phone}</p>
                        <p className="text-[10px] font-bold text-slate-500 truncate">{orderData.address}, {orderData.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setOrderStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                        Back
                      </button>
                      <button 
                        onClick={handleOrderSubmit}
                        disabled={isSubmittingOrder}
                        className="flex-2 bg-mill-gold text-white py-3 px-6 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-mill-green transition-all disabled:opacity-50"
                      >
                        {isSubmittingOrder ? 'Placing...' : 'Confirm Order'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {showLeadForm && !showOrderForm && (
              <div className="bg-white p-6 rounded-[24px] shadow-lg border-2 border-mill-gold/20 animate-fade-up">
                <h4 className="text-sm font-black text-mill-green uppercase tracking-widest mb-4">Request a Callback</h4>
                <p className="text-xs text-slate-500 font-bold mb-6">Leave your details and our team will get in touch with you shortly.</p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-gold/20"
                    value={leadData.name}
                    onChange={e => setLeadData({...leadData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email ID" 
                    required 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-gold/20"
                    value={leadData.email}
                    onChange={e => setLeadData({...leadData, email: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    required 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-mill-gold/20"
                    value={leadData.mobile}
                    onChange={e => setLeadData({...leadData, mobile: e.target.value})}
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmittingLead}
                    className="w-full bg-mill-gold text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-mill-green transition-all disabled:opacity-50"
                  >
                    {isSubmittingLead ? 'Submitting...' : 'Submit Details'}
                  </button>
                  {leadError && (
                    <div className="mt-4 p-3 bg-red-50 text-secondary-red text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
                      {leadError}
                    </div>
                  )}
                </form>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-gray-50 shrink-0">
            {messages.length < 5 && !showLeadForm && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quickActions.map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="px-4 py-2 bg-slate-100 hover:bg-mill-gold hover:text-white text-slate-600 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <input 
                type="text" 
                placeholder={showLeadForm ? "Please fill the form above..." : "Ask me something..."}
                value={inputValue}
                disabled={showLeadForm}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-100 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-mill-green/20 transition-all disabled:opacity-50"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || showLeadForm}
                className="w-12 h-12 bg-mill-green text-white rounded-2xl flex items-center justify-center hover:bg-mill-gold transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
