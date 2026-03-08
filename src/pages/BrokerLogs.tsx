import { Activity, Terminal, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatform } from '../context/PlatformContext';

const BrokerLogs = () => {
    const { theme } = usePlatform();
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setMounted(true);
    }, []);

    const logs = [
        { id: 101, status: 'success', service: 'AUTH_SERVICE', message: 'User token validated successfully.', time: '14:23:01.002', node: 'us-east-1a' },
        { id: 102, status: 'warning', service: 'PAYMENT_GATEWAY', message: 'High latency detected in Stripe API response (450ms).', time: '14:22:15.891', node: 'eu-west-2c' },
        { id: 103, status: 'error', service: 'DATABASE_MAIN', message: 'Connection pool exhausted. Failed to acquire connection.', time: '14:20:05.111', node: 'us-east-1b' },
        { id: 104, status: 'success', service: 'WEBSOCKET_HUB', message: 'Client connection established. ID: wk_98xns2.', time: '14:18:32.444', node: 'us-west-1a' },
        { id: 105, status: 'success', service: 'USER_PREF_SYNC', message: 'Language preferences synchronized across devices.', time: '14:15:00.000', node: 'ap-south-1a' },
        { id: 106, status: 'warning', service: 'RATE_LIMITER', message: 'Client ID 192.168.1.1 approaching rate limit threshold (90%).', time: '14:10:12.777', node: 'us-east-1a' },
    ];

    const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.status === filter);

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'success': return <CheckCircle2 size={16} className="text-[#34c759]" />;
            case 'warning': return <AlertTriangle size={16} className="text-[#f59e0b]" />;
            case 'error': return <XCircle size={16} className="text-[#ef4444]" />;
            default: return <Terminal size={16} className={theme === 'dark' ? 'text-white/40' : 'text-[#64748b]'} />;
        }
    };

    return (
        <div 
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }} 
            className={`min-h-screen pt-24 pb-24 transition-colors duration-300 selection:bg-[#0071e3] selection:text-white ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}
        >
            
            <div className={`max-w-[1000px] mx-auto px-4 md:px-8 relative z-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-[12px] border flex items-center justify-center text-[#ff3b30] shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-white border-black/5'}`}>
                                <Activity size={24} />
                            </div>
                            <h1 className="text-[40px] font-semibold tracking-[-0.022em] leading-tight">
                                Broker Logs
                            </h1>
                        </div>
                        <p className={`text-[19px] tracking-[-0.01em] ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            Real-time system event stream and service diagnostics.
                        </p>
                    </div>

                    <div className={`mt-6 md:mt-0 flex p-1 rounded-[14px] ${theme === 'dark' ? 'bg-white/5' : 'bg-[#e3e3e6]'}`}>
                        {['all', 'error', 'warning', 'success'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-[10px] text-[15px] font-medium tracking-[-0.01em] transition-all capitalize ${
                                    filter === f 
                                    ? (theme === 'dark' ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                                    : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-[#86868b] hover:text-[#1d1d1f]')
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {[
                        { label: 'Total Events', value: '1,204', color: theme === 'dark' ? 'text-white' : 'text-[#1d1d1f]' },
                        { label: 'Error Rate', value: '0.05%', color: 'text-[#ef4444]' },
                        { label: 'System Health', value: 'Optimal', color: 'text-[#34c759]' }
                    ].map(stat => (
                        <div key={stat.label} className={`border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[20px] p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                            <div className={`text-[13px] font-medium uppercase tracking-[0.05em] mb-2 ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>{stat.label}</div>
                            <div className={`text-[36px] font-semibold tracking-tight ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Terminal Window */}
                <div className={`rounded-[20px] border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden font-mono text-[14px] ${theme === 'dark' ? 'bg-black/20' : 'bg-white'}`}>
                    <div className={`border-b border-black/[0.04] px-5 py-3 flex items-center justify-between ${theme === 'dark' ? 'bg-white/5' : 'bg-[#f5f5f7]'}`}>
                        <div className="flex gap-2">
                            <div className="w-[12px] h-[12px] rounded-full bg-[#ff3b30] border border-black/5"></div>
                            <div className="w-[12px] h-[12px] rounded-full bg-[#ff9500] border border-black/5"></div>
                            <div className="w-[12px] h-[12px] rounded-full bg-[#34c759] border border-black/5"></div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border border-black/5 ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-[#86868b]'}`}>
                            <Search size={14} />
                            <input type="text" placeholder="Filter logs..." className="bg-transparent border-none outline-none text-current placeholder-current opacity-60 w-[200px]" />
                        </div>
                    </div>
                    <div className="p-2 h-[400px] overflow-y-auto custom-scrollbar">
                        <AnimatePresence>
                            {filteredLogs.map((log) => (
                                <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-start gap-4 py-2.5 px-3 rounded-[10px] transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#f5f5f7]'}`}
                                >
                                    <div className={`${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'} whitespace-nowrap pt-0.5`}>{log.time}</div>
                                    <div className="pt-0.5">{getStatusIcon(log.status)}</div>
                                    <div className="flex-1">
                                        <span className={`font-semibold mr-3 ${
                                            log.status === 'success' ? 'text-[#34c759]' : 
                                            log.status === 'warning' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                                        }`}>[{log.service}]</span>
                                        <span className={`leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#475569]'}`}>{log.message}</span>
                                    </div>
                                    <div className={`whitespace-nowrap text-[12px] border border-black/5 px-2.5 py-1 rounded-md font-sans ${theme === 'dark' ? 'bg-white/10 text-white/40' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                                        {log.node}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Terminal Scrollbar CSS */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? '#334155' : '#d2d2d7'};
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${theme === 'dark' ? '#475569' : '#a1a1a6'};
                }
            `}</style>
        </div>
    );
};

export default BrokerLogs;
