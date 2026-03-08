import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { 
    Search, Bell, ArrowRight, User, Settings, LogOut, 
    Menu, X, Cpu, Activity, Shield 
} from 'lucide-react';

interface HeaderProps {
}

export default function Header({}: HeaderProps) {
    const { theme, warningsCount, devices } = usePlatform();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const [isNotificationsHovered, setIsNotificationsHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const notifications = [
        { id: 1, title: 'mTLS Warning', desc: 'Cert expiring in 2 days for Device #4', time: '2m ago', urgent: true },
        { id: 2, title: 'New Device', desc: 'Temperature Sensor #14 joined', time: '1h ago', urgent: false },
        { id: 3, title: 'System Update', desc: 'Nakshatra OS v2.4.0 is available', time: '5h ago', urgent: false },
    ];



    const filteredDevices = searchQuery
        ? devices.filter(d => 
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.ip.includes(searchQuery)
          ).slice(0, 5)
        : [];

    const navLinks = [
        { name: 'Overview', path: '/', icon: <Activity size={18} /> },
        { name: 'Devices', path: '/devices', icon: <Cpu size={18} /> },
        { name: 'Certificates', path: '/certificates', icon: <Shield size={18} /> },
        { name: 'Broker Logs', path: '/broker-logs', icon: <Activity size={18} /> },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 backdrop-blur-md border-b flex items-center px-4 md:px-8 ${theme === 'dark' ? 'bg-[#0f172a]/80 border-white/10 text-white' : 'bg-white/80 border-black/5 text-[#1d1d1f]'}`}
            >
                {/* Logo & Home Redirect */}
                <Link 
                    to="/"
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <img
                        src="/logo.png"
                        alt="Nakshatra"
                        style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
                        className="w-10 h-10 object-contain transition-all group-hover:scale-110"
                    />
                    <span className="font-bold text-[18px] tracking-tight uppercase hidden lg:block">
                        Nakshatra
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-1 ml-8">
                    {navLinks.map(link => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`px-3 py-1.5 rounded-full text-[14px] font-medium transition-colors ${location.pathname === link.path 
                                ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-[#0071e3]' 
                                : theme === 'dark' ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03]'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className="flex-1 max-w-[400px] ml-4 md:ml-12 relative hidden sm:block">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${isSearchFocused ? 'bg-transparent border-[#0071e3] ring-4 ring-blue-500/10' : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-transparent'}`}>
                        <Search size={16} className={theme === 'dark' ? 'text-white/40' : 'text-black/40'} />
                        <input
                            type="text"
                            placeholder="Search devices or IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="bg-transparent border-none outline-none text-[14px] w-full"
                        />
                    </div>
                    
                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchQuery && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className={`absolute top-12 left-0 right-0 p-2 rounded-[16px] border shadow-2xl z-[60] ${theme === 'dark' ? 'bg-[#1e293b] border-white/10' : 'bg-white border-black/5'}`}
                            >
                                {filteredDevices.length > 0 ? (
                                    filteredDevices.map(d => (
                                        <Link key={d.id} to="/devices" onClick={() => setSearchQuery('')} className={`flex items-center gap-3 p-2 rounded-[10px] transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0071e3]">
                                                <Cpu size={14} />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-medium">{d.name}</div>
                                                <div className={`text-[12px] ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>{d.ip}</div>
                                            </div>
                                            <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-[13px] text-[#86868b]">No devices found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Actions */}
                <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">


                    {/* Notifications */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsNotificationsHovered(true)}
                        onMouseLeave={() => setIsNotificationsHovered(false)}
                    >
                        <Link to="/notifications" className="relative p-2 rounded-full hover:bg-black/5 transition-colors block">
                            <Bell size={20} />
                            {warningsCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                            )}
                        </Link>

                        {/* Notifications Peek Dropdown */}
                        <AnimatePresence>
                            {isNotificationsHovered && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className={`absolute top-10 right-0 w-80 p-2 rounded-[20px] border shadow-2xl z-[60] ${theme === 'dark' ? 'bg-[#1e293b] border-white/10' : 'bg-white border-black/5'}`}
                                >
                                    <div className="px-4 py-3 border-b border-black/[0.03] flex items-center justify-between">
                                        <div className="text-[15px] font-semibold">Notifications</div>
                                        {warningsCount > 0 && <span className="text-[11px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-medium">{warningsCount} New</span>}
                                    </div>
                                    <div className="py-2">
                                        {notifications.map(n => (
                                            <Link key={n.id} to="/notifications" className={`flex gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.urgent ? 'bg-red-500' : 'bg-blue-500'}`} />
                                                <div>
                                                    <div className="text-[13px] font-medium leading-tight mb-1">{n.title}</div>
                                                    <div className={`text-[12px] leading-tight mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>{n.desc}</div>
                                                    <div className={`text-[11px] ${theme === 'dark' ? 'text-white/40' : 'text-[#a1a1a6]'}`}>{n.time}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to="/notifications" className="block text-center py-2.5 text-[13px] font-medium text-[#0071e3] hover:bg-[#0071e3]/5 rounded-b-xl border-t border-black/[0.03]">
                                        View All Activity
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Button */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsProfileHovered(true)}
                        onMouseLeave={() => setIsProfileHovered(false)}
                    >
                        <Link to="/profile">
                            <button className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${theme === 'dark' ? 'bg-white/10 border-white/20 hover:border-white/40' : 'bg-slate-100 border-black/5 hover:border-black/10'}`}>
                                <User size={18} />
                            </button>
                        </Link>

                        {/* Hover Peek Dropdown */}
                        <AnimatePresence>
                            {isProfileHovered && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className={`absolute top-10 right-0 w-48 p-2 rounded-[16px] border shadow-2xl z-[60] ${theme === 'dark' ? 'bg-[#1e293b] border-white/10' : 'bg-white border-black/5'}`}
                                >
                                    <div className="p-3 border-b mb-1 border-black/[0.03]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0071e3]">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-semibold">Admin User</div>
                                                <div className="text-[12px] text-[#86868b]">admin@nakshatra.io</div>
                                            </div>
                                        </div>
                                        <div className={`text-[11px] px-2 py-1 rounded-md inline-block ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-[#86868b]'}`}>Enterprise Security Plan</div>
                                    </div>
                                    <Link to="/profile" className={`flex items-center gap-2 p-2.5 rounded-[12px] text-[13px] font-medium ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                        <Settings size={14} className="text-[#86868b]" /> Profile Settings
                                    </Link>

                                    <button 
                                        onClick={() => { window.location.assign('/'); }}
                                        className={`w-full flex items-center gap-2 p-2.5 rounded-[12px] text-[13px] font-semibold text-red-500 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-red-50'}`}
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button 
                        className="p-2 rounded-full sm:hidden hover:bg-black/5"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className={`fixed top-16 left-0 right-0 border-b z-40 sm:hidden ${theme === 'dark' ? 'bg-[#0f172a] border-white/10' : 'bg-white border-black/5'}`}
                    >
                        <div className="p-4 flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Link 
                                    key={link.name} to={link.path} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${location.pathname === link.path ? 'bg-[#0071e3] text-white' : 'hover:bg-black/5'}`}
                                >
                                    {link.icon} {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </>
    );
}
