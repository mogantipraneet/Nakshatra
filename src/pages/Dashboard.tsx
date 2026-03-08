import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import {
    Wifi, ShieldCheck, ShieldAlert, Activity,
    ArrowUpRight, ArrowDownRight, AlertTriangle,
    ChevronRight, RefreshCw, Shield
} from 'lucide-react';

// --- Components ---
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 80, h = 32;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min + 1)) * h;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="opacity-80">
            <polyline
                points={pts}
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const PulseDot = ({ color }: { color: string }) => (
    <div className="relative flex-shrink-0">
        <div className="w-2 h-2 rounded-full absolute" style={{ backgroundColor: color, opacity: 0.6 }}>
            <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
        <div className="w-2 h-2 rounded-full relative" style={{ backgroundColor: color }} />
    </div>
);

// --- Static Values (to be kept for sparklines etc) ---
const SPARKLINE_DATA = [40, 60, 55, 80, 72, 90, 88];

export default function Dashboard() {
    const { devices, theme, refreshData, lastRefreshed, warningsCount } = usePlatform();
    const [mounted, setMounted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    useEffect(() => { setMounted(true); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        refreshData();
        setTimeout(() => setRefreshing(false), 900);
    };

    const connectedCount = devices.filter(d => d.status === 'connected').length;
    const activePercent = Math.round((connectedCount / devices.length) * 100);

    const statCards = [
        { label: 'Total Devices', value: String(devices.length), change: '+1 this week', up: true, color: '#0071e3', sparkData: [2, 3, 3, 4, 4, 5, 5] },
        { label: 'Active Connections', value: String(connectedCount), change: `${activePercent}% of fleet`, up: true, color: '#34c759', sparkData: [3, 3, 4, 3, 4, 4, 4] },
        { label: 'Cert Warnings', value: String(warningsCount), change: warningsCount > 0 ? 'Action required' : 'System healthy', up: warningsCount === 0, color: '#f59e0b', sparkData: [0, 0, 1, 1, 2, 2, 2] },
        { label: 'Broker Events (24h)', value: '1,204', change: '+18% vs yesterday', up: true, color: '#8b5cf6', sparkData: SPARKLINE_DATA },
    ];

    return (
        <div
            className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1d1d1f]'}`}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
        >
            <div className={`max-w-[960px] mx-auto px-4 md:px-8 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <p className={`text-[15px] tracking-[-0.01em] mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>{dateStr}</p>
                        <h1 className="text-[40px] font-semibold tracking-[-0.022em] leading-tight">
                            {getGreeting()}, Admin 👋
                        </h1>
                        <p className={`text-[19px] tracking-[-0.01em] mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            Your IoT security platform is <span className="text-[#34c759] font-medium">operational</span>.
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex flex-col items-end gap-0.5 text-right"
                    >
                        <div className={`flex items-center gap-2 text-[14px] font-medium border border-black/[0.06] px-4 py-2.5 rounded-[12px] transition-colors shadow-sm disabled:opacity-60 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-[#f5f5f7] text-[#64748b]'}`}>
                            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                            {refreshing ? 'Refreshing…' : 'Refresh'}
                        </div>
                        <span className={`text-[11px] ${theme === 'dark' ? 'text-white/40' : 'text-[#a1a1a6]'}`}>
                            Updated {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </button>
                </motion.div>

                {/* Stat Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {statCards.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.08 + i * 0.05 }}
                            className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between gap-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}
                        >
                            <div>
                                <div className={`text-[13px] font-medium mb-2 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>{s.label}</div>
                                <div className="text-[34px] font-semibold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className={`flex items-center gap-1 text-[12px] font-medium ${s.up ? 'text-[#34c759]' : 'text-[#f59e0b]'}`}>
                                    {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                    {s.change}
                                </div>
                                <Sparkline data={s.sparkData} color={s.color} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Device Status + Activity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Device Health */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.18 }}
                        className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}
                    >
                        <div className={`px-5 pt-5 pb-3 flex items-center justify-between border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#f5f5f7]'}`}>
                            <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Device Health</h2>
                            <Link to="/devices" className="flex items-center gap-1 text-[13px] text-[#0071e3] font-medium hover:opacity-80 transition-opacity">
                                View All <ChevronRight size={13} />
                            </Link>
                        </div>

                        {/* Mini progress ring */}
                        <div className={`flex items-center gap-5 px-5 py-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#f5f5f7]'}`}>
                            <svg width="60" height="60" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" fill="none" stroke={theme === 'dark' ? '#334155' : '#f0f0f5'} strokeWidth="7" />
                                <circle
                                    cx="30" cy="30" r="24"
                                    fill="none" stroke="#34c759" strokeWidth="7"
                                    strokeDasharray={`${(connectedCount / devices.length) * 150.8} 150.8`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 30 30)"
                                />
                            </svg>
                            <div>
                                <div className="text-[28px] font-semibold tracking-tight leading-none mb-0.5">{connectedCount}/{devices.length}</div>
                                <div className={`text-[14px] ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>Devices online</div>
                            </div>
                            <div className="ml-auto flex flex-col gap-1.5 text-[13px]">
                                <div className="flex items-center gap-2 text-[#34c759]"><span className="w-2 h-2 rounded-full bg-[#34c759]" />{connectedCount} Connected</div>
                                <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}><span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white/20' : 'bg-[#d2d2d7]'}`} />{devices.length - connectedCount} Offline</div>
                            </div>
                        </div>

                        <div className={`divide-y ${theme === 'dark' ? 'divide-white/10' : 'divide-[#f5f5f7]'}`}>
                            {devices.slice(0, 5).map(device => {
                                const isOn = device.status === 'connected';
                                const mtlsOk = device.mtlsStatus === 'verified';
                                return (
                                    <div key={device.id} className="px-5 py-3 flex items-center gap-3">
                                        {isOn ? <PulseDot color="#34c759" /> : <div className={`w-2 h-2 rounded-full flex-shrink-0 ${theme === 'dark' ? 'bg-white/20' : 'bg-[#d2d2d7]'}`} />}
                                        <span className="flex-1 text-[15px] truncate">{device.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            {mtlsOk
                                                ? <ShieldCheck size={14} color="#34c759" />
                                                : <ShieldAlert size={14} color={device.mtlsStatus === 'failed' ? '#ef4444' : '#f59e0b'} />
                                            }
                                            <span className={`text-[12px] font-medium ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>{device.lastHeartbeat}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.22 }}
                        className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}
                    >
                        <div className={`px-5 pt-5 pb-3 flex items-center justify-between border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#f5f5f7]'}`}>
                            <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Recent Activity</h2>
                            <Link to="/notifications" className="flex items-center gap-1 text-[13px] text-[#0071e3] font-medium hover:opacity-80 transition-opacity">
                                View All <ChevronRight size={13} />
                            </Link>
                        </div>

                        <div className={`divide-y ${theme === 'dark' ? 'divide-white/10' : 'divide-[#f5f5f7]'}`}>
                            {/* In a real app we'd map context activity, using a placeholder for now */}
                            {[1, 2, 3, 4, 5].map(id => (
                                <div key={id} className={`px-5 py-3.5 flex items-start gap-3 transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#f9f9fb]'}`}>
                                    <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-50 text-[#0071e3]">
                                        <Activity size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-medium mb-0.5 truncate">Security Audit Event</div>
                                        <div className={`text-[13px] truncate ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>mTLS Handshake verified for Device #{id}</div>
                                    </div>
                                    <div className={`text-[12px] font-medium flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-[#a1a1a6]'}`}>{id}m ago</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.28 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
                >
                    {[
                        { label: 'IoT Devices', desc: 'Manage connected devices', to: '/devices', color: '#0071e3', icon: <Wifi size={22} /> },
                        { label: 'Certificates', desc: 'Bulk mTLS management', to: '/certificates', color: '#0071e3', icon: <Shield size={22} /> },
                        { label: 'Broker Logs', desc: 'Real-time system events', to: '/broker-logs', color: '#8b5cf6', icon: <Activity size={22} /> },
                        { label: 'Notifications', desc: 'Alerts & account activity', to: '/notifications', color: '#f59e0b', icon: <AlertTriangle size={22} /> },
                    ].map(card => (
                        <Link key={card.label} to={card.to} style={{ textDecoration: 'none' }}>
                            <div className={`rounded-[20px] border border-black/[0.04] p-5 flex items-center gap-4 transition-all cursor-pointer group shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-white'}`}>
                                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${card.color}18`, color: card.color }}>
                                    {card.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[16px] font-semibold mb-0.5">{card.label}</div>
                                    <div className={`text-[13px] truncate ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>{card.desc}</div>
                                </div>
                                <ChevronRight size={18} className="text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors flex-shrink-0" />
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
