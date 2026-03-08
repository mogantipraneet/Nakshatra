import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatform } from '../context/PlatformContext';
import { 
    ShieldCheck, ShieldAlert, RefreshCw, 
    FileText, Search, Download, Trash2
} from 'lucide-react';

export default function Certificates() {
    const { devices, theme, rotateCertificate } = usePlatform();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
    const [isBulkRotating, setIsBulkRotating] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const filteredCerts = devices.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.certFingerprint.includes(searchQuery)
    );

    const toggleSelect = (id: string) => {
        setSelectedCerts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedCerts.length === filteredCerts.length) setSelectedCerts([]);
        else setSelectedCerts(filteredCerts.map(d => d.id));
    };

    const handleBulkRotate = () => {
        setIsBulkRotating(true);
        setTimeout(() => {
            selectedCerts.forEach(id => rotateCertificate(id));
            setSelectedCerts([]);
            setIsBulkRotating(false);
        }, 2000);
    };

    return (
        <div
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
            className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#1d1d1f]'}`}
        >
            <div className={`max-w-[1000px] mx-auto px-4 md:px-8 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-[40px] font-semibold tracking-[-0.022em] leading-tight flex items-center gap-4">
                            Certificates
                            <div className="text-[14px] bg-[#0071e3]/10 text-[#0071e3] px-3 py-1 rounded-full border border-blue-500/20">
                                mTLS 1.3
                            </div>
                        </h1>
                        <p className={`text-[19px] tracking-[-0.01em] mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                            Secure mutual authentication & rotation
                        </p>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedCerts.length > 0 && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-[24px] border shadow-2xl flex items-center gap-6 ${theme === 'dark' ? 'bg-[#1e293b] border-white/10' : 'bg-white border-black/5'}`}
                        >
                            <span className="text-[15px] font-medium whitespace-nowrap">
                                <span className="text-[#0071e3] font-bold">{selectedCerts.length}</span> certificates selected
                            </span>
                            <div className="h-6 w-px bg-black/10 mx-2" />
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleBulkRotate}
                                    disabled={isBulkRotating}
                                    className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium transition-all shadow-sm disabled:opacity-50"
                                >
                                    <RefreshCw size={15} className={isBulkRotating ? 'animate-spin' : ''} />
                                    {isBulkRotating ? 'Rotating…' : 'Bulk Rotate'}
                                </button>
                                <button className="flex items-center gap-2 bg-[#ef4444]/10 text-[#ef4444] px-5 py-2.5 rounded-[12px] text-[14px] font-medium transition-all hover:bg-[#ef4444]/20 border border-red-500/10">
                                    <Trash2 size={15} />
                                    Revoke
                                </button>
                                <button onClick={() => setSelectedCerts([])} className={`text-[14px] font-medium px-2 py-2 hover:bg-black/5 rounded-lg ${theme === 'dark' ? 'text-white/60' : 'text-[#86868b]'}`}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter / Search Bar */}
                <div className={`mb-6 p-2 rounded-[20px] flex items-center gap-3 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/[0.04]'}`}>
                    <div className="flex-1 flex items-center gap-3 px-4">
                        <Search size={18} className="text-[#86868b]" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by device name or fingerprint..." 
                            className="bg-transparent border-none outline-none w-full text-[15px] py-2"
                        />
                    </div>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#f5f5f7]'}`}>
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Cert Table */}
                <div className={`rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b text-[13px] font-semibold tracking-wider uppercase ${theme === 'dark' ? 'border-white/10 text-white/40' : 'border-[#f5f5f7] text-[#86868b]'}`}>
                                <th className="px-6 py-4 w-12">
                                    <input 
                                        type="checkbox" 
                                        onChange={selectAll} 
                                        checked={selectedCerts.length === filteredCerts.length && filteredCerts.length > 0}
                                        className="w-4 h-4 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                                    />
                                </th>
                                <th className="px-6 py-4">Device / Identity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Fingerprint</th>
                                <th className="px-6 py-4">Expiry Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/10' : 'divide-[#f5f5f7]'}`}>
                            {filteredCerts.map(cert => {
                                const isExpired = cert.mtlsStatus === 'failed';
                                const isWarning = cert.mtlsStatus === 'expiring_soon';
                                return (
                                    <tr key={cert.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-[#f9f9fb]'}`}>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedCerts.includes(cert.id)}
                                                onChange={() => toggleSelect(cert.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0071e3]">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-[15px] font-semibold">{cert.name}</div>
                                                    <div className={`text-[12px] ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>{cert.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {isExpired ? <ShieldAlert size={14} color="#ef4444" /> : isWarning ? <ShieldAlert size={14} color="#f59e0b" /> : <ShieldCheck size={14} color="#34c759" />}
                                                <span className={`text-[13px] font-medium ${isExpired ? 'text-[#ef4444]' : isWarning ? 'text-[#f59e0b]' : 'text-[#34c759]'}`}>
                                                    {isExpired ? 'Revoked' : isWarning ? 'Critical' : 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[12px] text-[#86868b]">
                                            {cert.certFingerprint.substring(0, 16)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-[14px] font-medium ${isWarning ? 'text-[#f59e0b]' : ''}`}>{cert.certExpiry}</div>
                                            <div className={`text-[11px] ${theme === 'dark' ? 'text-white/40' : 'text-[#86868b]'}`}>Auto-rotate enabled</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => rotateCertificate(cert.id)}
                                                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'} text-[#0071e3]`}
                                                title="Rotate Certificate"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
