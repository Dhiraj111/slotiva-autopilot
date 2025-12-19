import React, { useState, useEffect, useRef } from 'react';
import { MotiaStreamProvider, useStreamItem } from '@motiadev/stream-client-react';

// --- 1. ICONS & ASSETS (Copied from your HTML) ---
const Icons = {
    Layout: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
};

const SERVICES = {
    'haircut': { price: 200, material: 'gel', usage: 10, label: 'Haircut' },
    'shave': { price: 100, material: 'cream', usage: 15, label: 'Shaving' },
    'color': { price: 500, material: 'dye', usage: 25, label: 'Hair Color' },
    'spa': { price: 800, material: 'mask', usage: 1, label: 'Face Spa' }
};

// --- 2. SUB-COMPONENTS ---

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all shadow-xl">
        <div className={`absolute -right-6 -top-6 w-24 h-24 ${color.replace('text', 'bg')}/20 rounded-full blur-2xl group-hover:bg-opacity-30 transition-all`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
                <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
                <div className="flex items-center mt-3">
                     <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 shadow-inner mr-2 ${color}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                     </div>
                     <p className="text-slate-400 text-xs">
                        <span className={`${color} font-bold`}>+{change}%</span> this week
                    </p>
                </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl text-white shadow-lg border border-white/10">
                <Icon />
            </div>
        </div>
    </div>
);

const InventoryRow = ({ name, level, status }) => {
    let color = 'bg-emerald-500';
    if (level < 30) color = 'bg-red-500';
    else if (level < 60) color = 'bg-yellow-500';

    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0 group hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 shadow-lg border border-white/5">
                    <Icons.Box />
                </div>
                <div>
                    <h4 className="text-white font-medium">{name}</h4>
                    <p className="text-xs text-slate-500">Auto-restock enabled</p>
                </div>
            </div>
            <div className="flex-1 max-w-[200px] mx-8">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Level</span>
                    <span className="text-white font-mono">{level}%</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full shadow-inner border border-white/5 overflow-hidden p-[1px]">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000 relative overflow-hidden`} style={{ width: `${level}%` }}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                    </div>
                </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border-b-2 border-slate-950 text-slate-300 shadow-md">
                {status}
            </div>
        </div>
    );
};

const LoginScreen = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('owner');
    const [ownerCode, setOwnerCode] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [error, setError] = useState('');

    const handleOwnerSubmit = (e) => {
        e.preventDefault();
        if (ownerCode === 'admin123') {
            onLogin({ role: 'owner', name: 'Admin' });
        } else {
            setError('Invalid Access Code');
            setTimeout(() => setError(''), 2000);
        }
    };

    const handleCustomerSubmit = (e) => {
        e.preventDefault();
        if (customerName.trim() && customerPhone.trim()) {
            onLogin({ role: 'customer', name: customerName, phone: customerPhone });
        } else {
            setError('Please fill in all details');
            setTimeout(() => setError(''), 2000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative p-4 bg-[#020617] overflow-hidden">
             {/* 3D Background Elements */}
             <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
             <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>

            <div className="w-full max-w-md p-8 rounded-3xl relative z-10 shadow-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10">
                <div className="text-center mb-8 relative">
                    <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
                        <Icons.Sparkles className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2 drop-shadow-md">SLOTIVA</h1>
                    <p className="text-slate-400">Autopilot Management System</p>
                </div>

                <div className="flex bg-slate-950/50 p-1.5 rounded-2xl mb-8 shadow-inner border border-white/5">
                    <button 
                        onClick={() => { setActiveTab('owner'); setError(''); }}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'owner' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Icons.Shield size={16}/> Owner
                    </button>
                    <button 
                        onClick={() => { setActiveTab('customer'); setError(''); }}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'customer' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Icons.User size={16} /> Customer
                    </button>
                </div>

                {activeTab === 'owner' && (
                    <form onSubmit={handleOwnerSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 tracking-wider">ACCESS CODE</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-slate-500"><Icons.Lock size={18} /></div>
                                <input 
                                    type="password" 
                                    value={ownerCode}
                                    onChange={(e) => setOwnerCode(e.target.value)}
                                    className="w-full bg-slate-950/50 rounded-xl pl-12 pr-4 py-3.5 text-white border border-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Try: admin123"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl border-t border-white/20 shadow-lg">
                            Access Dashboard
                        </button>
                    </form>
                )}

                {activeTab === 'customer' && (
                    <form onSubmit={handleCustomerSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 tracking-wider">YOUR NAME</label>
                            <input 
                                type="text" 
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full bg-slate-950/50 rounded-xl px-4 py-3.5 text-white border border-white/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g., Raj"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 tracking-wider">PHONE NUMBER</label>
                            <input 
                                type="tel" 
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full bg-slate-950/50 rounded-xl px-4 py-3.5 text-white border border-white/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl border-t border-white/20 shadow-lg">
                            Start Chatting
                        </button>
                    </form>
                )}

                {error && (
                    <div className="absolute -bottom-12 left-0 w-full text-center text-red-400 text-sm font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 3. MAIN APP LOGIC WITH MOTIA STREAMS ---

const AppContent = () => {
    const [user, setUser] = useState(null); 
    
    // --- REAL-TIME DATA CONNECTION ---
    // Connects to the Motia Backend to get Shared State
    const { data: serverState } = useStreamItem({
        streamName: 'salonState',
        groupId: 'global',
        id: 'main-branch'
    });

    // Fallback values while data loads
    const revenue = serverState?.revenue || 12500;
    const appointments = serverState?.appointments || 24;
    const inventory = serverState?.inventory || { gel: 85, cream: 40, dye: 90, mask: 70 };
    const recentActivity = serverState?.recentActivity || [];
    
    // Local State (Chat History & AI)
    const [chatMessages, setChatMessages] = useState([]); 
    const [chatInput, setChatInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);
    const [insightLoading, setInsightLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, user]);

    const handleLogin = (userData) => {
        setUser(userData);
        if (userData.role === 'customer') {
            setChatMessages([
                { sender: 'ai', text: `Hello ${userData.name}! Welcome to SLOTIVA. I can help you book instantly.` }
            ]);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setAiInsight(null); 
    };

    // --- GEMINI AI HELPER ---
    const callGemini = async (prompt, systemInstruction = "") => {
        const apiKey = process.env.API_KEY; // Make sure to set this in your .env file
        if (!apiKey) {
            console.warn("No API key found.");
            return "Gemini API Key is missing. Please check code.";
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] }
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response from AI.";
        } catch (error) {
            return "Sorry, I'm having trouble connecting right now.";
        }
    };

    // --- REAL-TIME BOOKING TRIGGER ---
    const triggerBooking = async (serviceKey) => {
        try {
            // This calls the Motia Backend Step we created
            await fetch('http://127.0.0.1:3000/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceKey: serviceKey,
                    customerName: user?.name || 'Guest'
                })
            });
            // We do NOT update state manually. Motia Streams will update it automatically!
        } catch (e) {
            console.error("Booking failed", e);
        }
    };

    const generateOwnerInsight = async () => {
        setInsightLoading(true);
        const systemPrompt = "You are a business analyst. Give a short, motivational summary and 1 tip based on data. Under 50 words.";
        const dataPrompt = JSON.stringify({ revenue, appointments, inventory_levels: inventory });
        
        const insight = await callGemini(dataPrompt, systemPrompt);
        setAiInsight(insight);
        setInsightLoading(false);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userText = chatInput;
        setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setChatInput("");
        setIsTyping(true);

        const systemPrompt = `You are a receptionist for SLOTIVA. 
        User: ${user?.name}.
        Prices: Haircut (200), Shave (100), Color (500), Spa (800).
        Rules:
        1. Brief & Polite.
        2. If user confirms a booking, end response with [BOOK:SERVICE_KEY]. 
        Keys: haircut, shave, color, spa.
        Example: "Done! See you then. [BOOK:shave]"
        `;

        try {
            const aiResponse = await callGemini(userText, systemPrompt);
            let displayText = aiResponse;
            
            // Check for hidden booking tag
            const tagMatch = aiResponse.match(/\[BOOK:(.*?)\]/);
            if (tagMatch) {
                const serviceKey = tagMatch[1].trim();
                displayText = aiResponse.replace(/\[BOOK:.*?\]/, '').trim();
                triggerBooking(serviceKey); // <--- This updates the backend!
            }

            setChatMessages(prev => [...prev, { sender: 'ai', text: displayText }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { sender: 'ai', text: "Connection error." }]);
        } finally {
            setIsTyping(false);
        }
    };

    // --- RENDER ---

    if (!user) return <LoginScreen onLogin={handleLogin} />;

    return (
        <div className="flex flex-col h-screen font-sans text-slate-200 relative overflow-hidden bg-[#020617]">
             {/* Background */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                 <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-50"></div>
                 <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] opacity-50"></div>
            </div>

            <div className="fixed top-6 right-6 z-50">
                <button onClick={handleLogout} className="bg-slate-900/80 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10 shadow-xl flex items-center gap-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all">
                    <Icons.LogOut size={14} /> Logout
                </button>
            </div>

            <div className={`relative z-10 h-full ${user.role === 'owner' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                {user.role === 'owner' ? (
                    // --- OWNER DASHBOARD ---
                    <div className="p-8 max-w-7xl mx-auto min-h-full">
                        <header className="flex justify-between items-end mb-10 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Owner Mode</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                                <p className="text-slate-400">Welcome back, {user.name}.</p>
                            </div>
                            <button onClick={generateOwnerInsight} disabled={insightLoading} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/25">
                                {insightLoading ? 'Analyzing...' : 'AI Analysis'}
                            </button>
                        </header>
                        
                        {aiInsight && (
                            <div className="mb-10 bg-slate-900/50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                                <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase flex items-center gap-2"><Icons.Sparkles size={16}/> Gemini Insight</h4>
                                <p className="text-white leading-relaxed">{aiInsight}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                            <StatCard title="Total Revenue" value={`₹${revenue.toLocaleString()}`} change="12" icon={Icons.TrendingUp} color="text-emerald-500" />
                            <StatCard title="Appointments" value={appointments} change="8" icon={Icons.Users} color="text-blue-500" />
                            <StatCard title="Inventory Alerts" value={Object.values(inventory).filter(v => v < 50).length} change="0" icon={Icons.Box} color="text-orange-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">Inventory Levels</h3>
                                <div className="space-y-4">
                                    <InventoryRow name="Hair Gel (Premium)" level={inventory.gel} status="In Stock" />
                                    <InventoryRow name="Shaving Cream" level={inventory.cream} status={inventory.cream < 50 ? "Low Stock" : "In Stock"} />
                                    <InventoryRow name="Hair Dye (Black)" level={inventory.dye} status="In Stock" />
                                    <InventoryRow name="Face Mask" level={inventory.mask} status="In Stock" />
                                </div>
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 h-[500px] flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-6">Live Feed</h3>
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                    {recentActivity.map((act) => (
                                        <div key={act.id} className="flex items-start gap-4 text-sm p-4 rounded-xl bg-slate-950/50 border border-white/5">
                                            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><Icons.Message size={16} /></div>
                                            <div>
                                                <p className="text-slate-200 font-medium">{act.text}</p>
                                                <span className="text-xs text-slate-500 font-mono mt-1 block">{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- CUSTOMER VIEW ---
                    <div className="h-full flex flex-col max-w-md mx-auto bg-slate-950 border-x border-white/5 shadow-2xl relative">
                        <div className="p-6 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 z-10 shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg relative">
                                <Icons.Message />
                                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700">
                                    <div className="text-orange-400 w-3 h-3"><Icons.Sparkles /></div>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-lg">Salon Assistant</h2>
                                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> AI Online
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-5 py-3.5 text-sm shadow-xl backdrop-blur-sm rounded-2xl ${
                                        msg.sender === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                                            : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="p-4 bg-slate-900/80 border-t border-white/5 backdrop-blur-lg">
                             <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                <button onClick={() => setChatInput("I want to book a Haircut")} className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 border border-white/5 shadow-md">✂️ Book Haircut</button>
                                <button onClick={() => setChatInput("What is the price for Spa?")} className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 border border-white/5 shadow-md">🧖 Spa Price</button>
                            </div>

                            <form onSubmit={handleChatSubmit} className="relative group">
                                <input 
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask AI Assistant..."
                                    className="w-full bg-slate-950/50 rounded-2xl pl-6 pr-14 py-4 text-sm text-white border border-white/10 focus:border-blue-500 outline-none transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all shadow-lg">
                                    <Icons.Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- ROOT WRAPPER ---
// This provides the Motia Connection Context to the entire App
export default function App() {
    return (
        <MotiaStreamProvider address="ws://127.0.0.1:3000">
            <AppContent />
        </MotiaStreamProvider>
    );
}