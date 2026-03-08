import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatform } from '../context/PlatformContext';
import { 
    Wifi, WifiOff, Shield, ShieldCheck, ShieldAlert, ChevronRight, 
    RefreshCw, Plus, AlertTriangle, CheckCircle2, X 
} from 'lucide-react';

const statusConfig = {
    connected: { label: 'Connected', textColor: '#16a34a', bgColor: '#e8faf0', Icon: Wifi },
    disconnected: { label: 'Disconnected', textColor: '#dc2626', bgColor: '#fef2f2', Icon: WifiOff },
};

const mtlsConfig = {
    verified: { label: 'mTLS Verified', icon: <ShieldCheck size={15} color="#16a34a" />, color: '#16a34a', bg: '#e8faf0' },
    expiring_soon: { label: 'Cert Expiring Soon', icon: <ShieldAlert size={15} color="#d97706" />, color: '#d97706', bg: '#fffbeb' },
    failed: { label: 'Auth Failed', icon: <ShieldAlert size={15} color="#dc2626" />, color: '#dc2626', bg: '#fef2f2' },
};

const typeColor: Record<string, string> = {
    Sensor: '#0071e3',
    Gateway: '#8b5cf6',
    Actuator: '#f59e0b',
};

const PulseDot = ({ color }: { color: string }) => (
    <div className="relative">
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

export default function Devices() {
    const { devices, theme, rotateCertificate, revokeDevice, provisionDevice } = usePlatform();
    const [mounted, setMounted] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [rotating, setRotating] = useState<string | null>(null);
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    
    // Provisioning Form State
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<'Sensor' | 'Gateway' | 'Actuator'>('Sensor');
    const [newIp, setNewIp] = useState('');
    const [newLoc, setNewLoc] = useState('');

    useEffect(() => { setMounted(true); }, []);

    const handleRotate = (id: string) => {
        setRotating(id);
        setTimeout(() => {
            rotateCertificate(id);
            setRotating(null);
        }, 1500);
    };

    const handleProvision = (e: React.FormEvent) => {
        e.preventDefault();
        provisionDevice({
            name: newName,
            type: newType,
            ip: newIp,
            location: newLoc
        });
        setShowProvisionModal(false);
        setNewName(''); setNewIp(''); setNewLoc('');
    };

    const connectedCount = devices.filter(d => d.status === 'connected').length;
    const warnings = devices.filter(d => d.mtlsStatus !== 'verified').length;

    return (
        <div
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
            className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1d1d1f]'}`}
        >
            <div className={`max-w-[820px] mx-auto px-4 md:px-8 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-[40px] font-semibold tracking-[-0.022em] leading-tight">IoT Devices</h1>
                        <p className={`text-[19px] tracking-[-0.01em] mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            {connectedCount} connected · Mutual TLS secured
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowProvisionModal(true)}
                        className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[15px] font-medium px-4 py-2.5 rounded-[12px] transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Provision Device
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-5 py-5 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <div className={`text-[13px] font-medium mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>Total Devices</div>
                        <div className="text-[32px] font-semibold tracking-tight">{devices.length}</div>
                    </div>
                    <div className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-5 py-5 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <div className={`flex items-center gap-1.5 text-[13px] font-medium mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            <CheckCircle2 size={13} color="#34c759" />
                            Connected
                        </div>
                        <div className="text-[32px] font-semibold tracking-tight text-[#34c759]">{connectedCount}</div>
                    </div>
                    <div className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-5 py-5 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <div className={`flex items-center gap-1.5 text-[13px] font-medium mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            <AlertTriangle size={13} color="#f59e0b" />
                            Cert Warnings
                        </div>
                        <div className={`text-[32px] font-semibold tracking-tight ${warnings > 0 ? 'text-[#f59e0b]' : ''}`}>{warnings}</div>
                    </div>
                </div>

                {/* Device List */}
                <div className={`rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                    {devices.map((device, i) => {
                        const conn = statusConfig[device.status as keyof typeof statusConfig];
                        const mtls = mtlsConfig[device.mtlsStatus as keyof typeof mtlsConfig];
                        const ConnIcon = conn.Icon;
                        const isOpen = selected === device.id;

                        return (
                            <div key={device.id}>
                                <div
                                    className={`px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#f9f9fb]'}`}
                                    onClick={() => setSelected(isOpen ? null : device.id)}
                                >
                                    {/* Status dot + icon */}
                                    <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center border flex-shrink-0 relative"
                                        style={{ backgroundColor: theme === 'dark' ? `${conn.textColor}11` : conn.bgColor, borderColor: `${conn.textColor}22` }}>
                                        <ConnIcon size={21} color={conn.textColor} strokeWidth={1.8} />
                                        {device.status === 'connected' && (
                                            <div className="absolute -top-1 -right-1">
                                                <PulseDot color="#34c759" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                            <span className="text-[17px] font-medium tracking-[-0.01em]">{device.name}</span>
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: typeColor[device.type] || '#64748b', backgroundColor: `${typeColor[device.type]}18` }}>
                                                {device.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[14px]">
                                            <span className={theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}>{device.ip}</span>
                                            <span className={theme === 'dark' ? 'text-white/30' : 'text-[#86868b]'}>·</span>
                                            <span className="flex items-center gap-1" style={{ color: mtls.color }}>
                                                {mtls.icon}
                                                {mtls.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0 hidden sm:block mr-3">
                                        <div className={`text-[13px] ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>Last heartbeat</div>
                                        <div className="text-[14px] font-medium">{device.lastHeartbeat}</div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className={`text-[#d2d2d7] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                    />
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`border-t px-5 py-5 ${theme === 'dark' ? 'bg-white/[0.02] border-white/10' : 'bg-[#f9f9fb] border-[#f5f5f7]'}`}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-5">
                                                    {[
                                                        { label: 'Device ID', value: device.id },
                                                        { label: 'Protocol', value: device.protocol },
                                                        { label: 'Cert Fingerprint', value: device.certFingerprint },
                                                        { label: 'Cert Expiry', value: device.certExpiry },
                                                        { label: 'Firmware', value: device.firmwareVersion },
                                                        { label: 'Location', value: device.location },
                                                    ].map(f => (
                                                        <div key={f.label}>
                                                            <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] mb-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>{f.label}</div>
                                                            <div className="text-[14px] font-mono truncate">{f.value}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {device.mtlsStatus !== 'verified' && (
                                                    <div className="flex items-center gap-2 text-[13px] font-medium px-4 py-3 rounded-[12px] mb-4"
                                                        style={{ backgroundColor: `${mtls.color}18`, color: mtls.color }}>
                                                        <Shield size={15} />
                                                        {device.mtlsStatus === 'expiring_soon'
                                                            ? `Certificate expires ${device.certExpiry} — rotate before expiry to avoid disconnection.`
                                                            : 'mTLS handshake failed. Device cannot communicate with broker. Re-provision to restore.'}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={() => handleRotate(device.id)}
                                                        className="flex items-center gap-2 text-[14px] font-medium text-[#0071e3] bg-[#0071e3]/10 hover:bg-[#0071e3]/20 px-4 py-2 rounded-[10px] transition-colors border border-blue-500/20"
                                                    >
                                                        <RefreshCw size={14} className={rotating === device.id ? 'animate-spin' : ''} />
                                                        Rotate Certificate
                                                    </button>
                                                    <button 
                                                        onClick={() => revokeDevice(device.id)}
                                                        className="text-[14px] font-medium text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 px-4 py-2 rounded-[10px] transition-colors border border-red-500/20"
                                                    >
                                                        Revoke Device
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {i < devices.length - 1 && <div className={`mx-5 border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#f5f5f7]'}`} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Provisioning Modal */}
            <AnimatePresence>
                {showProvisionModal && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setShowProvisionModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] z-[51] rounded-[24px] border border-black/[0.08] shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-[#1d1d1f]'}`}
                        >
                            <div className="px-6 py-6 border-b border-black/[0.04] flex items-center justify-between">
                                <h3 className="text-[20px] font-semibold tracking-tight">Provision Device</h3>
                                <button onClick={() => setShowProvisionModal(false)} className="text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleProvision} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#86868b] ml-1">Device Name</label>
                                    <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Smart Sensor Hub" className={`w-full px-4 py-3 rounded-[12px] border focus:ring-2 focus:ring-[#0071e3] focus:border-transparent outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-[#86868b] ml-1">Type</label>
                                        <select value={newType} onChange={e => setNewType(e.target.value as any)} className={`w-full px-3 py-3 rounded-[12px] border focus:ring-2 focus:ring-[#0071e3] focus:border-transparent outline-none transition-all ${theme === 'dark' ? 'bg-[#0f172a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            <option value="Sensor">Sensor</option>
                                            <option value="Gateway">Gateway</option>
                                            <option value="Actuator">Actuator</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-[#86868b] ml-1">IP Address</label>
                                        <input required value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="192.168.1.10" className={`w-full px-4 py-3 rounded-[12px] border focus:ring-2 focus:ring-[#0071e3] focus:border-transparent outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-[#86868b] ml-1">Location</label>
                                    <input required value={newLoc} onChange={e => setNewLoc(e.target.value)} placeholder="e.g. Server Room A" className={`w-full px-4 py-3 rounded-[12px] border focus:ring-2 focus:ring-[#0071e3] focus:border-transparent outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} />
                                </div>
                                <div className="pt-4 flex flex-col gap-3">
                                    <div className={`flex items-start gap-2 text-[12px] p-3 rounded-[12px] ${theme === 'dark' ? 'bg-[#0071e3]/10 text-white/70' : 'bg-blue-50/50 text-[#86868b]'}`}>
                                        <ShieldCheck size={14} className="text-[#0071e3] mt-0.5 flex-shrink-0" />
                                        <span>Provisioning will automatically generate an mTLS 1.3 certificate and sign it with the platform root CA.</span>
                                    </div>
                                    <button type="submit" className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-3.5 rounded-[12px] transition-all shadow-md active:scale-[0.98]">
                                        Generate & Register
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
