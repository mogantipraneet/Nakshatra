import React, { createContext, useContext, useState } from 'react';

export type DeviceStatus = 'connected' | 'disconnected';
export type MTLSStatus = 'verified' | 'expiring_soon' | 'failed';

export interface Device {
    id: string;
    name: string;
    type: 'Sensor' | 'Gateway' | 'Actuator';
    ip: string;
    status: DeviceStatus;
    mtlsStatus: MTLSStatus;
    certExpiry: string;
    certFingerprint: string;
    lastHeartbeat: string;
    firmwareVersion: string;
    protocol: string;
    location: string;
}

interface PlatformContextType {
    devices: Device[];
    theme: string;
    toggleTheme: () => void;
    refreshData: () => void;
    lastRefreshed: Date;
    provisionDevice: (device: Partial<Device>) => void;
    rotateCertificate: (deviceId: string) => void;
    revokeDevice: (deviceId: string) => void;
    warningsCount: number;
}

const INITIAL_DEVICES: Device[] = [
    {
        id: 'iot_a1b2c3',
        name: 'Temperature Sensor #14',
        type: 'Sensor',
        ip: '192.168.10.14',
        status: 'connected',
        mtlsStatus: 'verified',
        certExpiry: 'Mar 12, 2026',
        certFingerprint: 'SHA256:3A:F1:9C...B2:04',
        lastHeartbeat: '2s ago',
        firmwareVersion: 'v2.4.1',
        protocol: 'MQTT over TLS 1.3',
        location: 'Server Room A',
    },
    {
        id: 'iot_d4e5f6',
        name: 'Smart Gateway Node',
        type: 'Gateway',
        ip: '192.168.10.1',
        status: 'connected',
        mtlsStatus: 'verified',
        certExpiry: 'Jun 30, 2025',
        certFingerprint: 'SHA256:7D:A2:5E...C9:12',
        lastHeartbeat: '1s ago',
        firmwareVersion: 'v3.1.0',
        protocol: 'HTTPS/TLS 1.3',
        location: 'Network Closet',
    },
    {
        id: 'iot_g7h8i9',
        name: 'Motion Detector #3',
        type: 'Sensor',
        ip: '192.168.10.23',
        status: 'connected',
        mtlsStatus: 'expiring_soon',
        certExpiry: 'Mar 15, 2025',
        certFingerprint: 'SHA256:1B:CC:88...A4:31',
        lastHeartbeat: '5s ago',
        firmwareVersion: 'v2.3.7',
        protocol: 'MQTT over TLS 1.3',
        location: 'Entrance Hall',
    },
    {
        id: 'iot_j1k2l3',
        name: 'HVAC Controller',
        type: 'Actuator',
        ip: '192.168.10.55',
        status: 'disconnected',
        mtlsStatus: 'failed',
        certExpiry: 'Jan 01, 2025',
        certFingerprint: 'SHA256:9F:3B:D1...E7:00',
        lastHeartbeat: '14 min ago',
        firmwareVersion: 'v1.9.2',
        protocol: 'CoAP over DTLS',
        location: 'Rooftop',
    },
    {
        id: 'iot_m4n5o6',
        name: 'Humidity Sensor #7',
        type: 'Sensor',
        ip: '192.168.10.31',
        status: 'connected',
        mtlsStatus: 'verified',
        certExpiry: 'Dec 20, 2025',
        certFingerprint: 'SHA256:2C:5F:BA...F1:88',
        lastHeartbeat: '3s ago',
        firmwareVersion: 'v2.4.1',
        protocol: 'MQTT over TLS 1.3',
        location: 'Lab Room B',
    },
];

const HEARTBEATS = ['Just now', '1s ago', '2s ago', '3s ago', '5s ago', '8s ago', '12s ago'];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
    const theme = 'light';
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const toggleTheme = () => {};

    const refreshData = () => {
        setDevices(prev => prev.map(d => ({
            ...d,
            lastHeartbeat: d.status === 'connected' 
                ? HEARTBEATS[Math.floor(Math.random() * HEARTBEATS.length)]
                : d.lastHeartbeat
        })));
        setLastRefreshed(new Date());
    };

    const provisionDevice = (newDevice: Partial<Device>) => {
        const fullDevice: Device = {
            id: `iot_${Math.random().toString(36).substr(2, 6)}`,
            name: newDevice.name || 'New Device',
            type: newDevice.type || 'Sensor',
            ip: newDevice.ip || '0.0.0.0',
            status: 'connected',
            mtlsStatus: 'verified',
            certExpiry: 'Mar 08, 2027',
            certFingerprint: `SHA256:${Math.random().toString(16).substr(2, 2).toUpperCase()}:...`,
            lastHeartbeat: 'Just now',
            firmwareVersion: 'v1.0.0',
            protocol: 'MQTT over TLS 1.3',
            location: newDevice.location || 'Unknown',
        };
        setDevices(prev => [...prev, fullDevice]);
    };

    const rotateCertificate = (deviceId: string) => {
        setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, mtlsStatus: 'verified', certExpiry: 'Mar 08, 2027' } : d));
    };

    const revokeDevice = (deviceId: string) => {
        setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'disconnected', mtlsStatus: 'failed' } : d));
    };

    const warningsCount = devices.filter(d => d.mtlsStatus !== 'verified').length;

    return (
        <PlatformContext.Provider value={{
            devices, theme, toggleTheme, refreshData, lastRefreshed,
            provisionDevice, rotateCertificate, revokeDevice, warningsCount
        }}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => {
    const context = useContext(PlatformContext);
    if (!context) throw new Error('usePlatform must be used within a PlatformProvider');
    return context;
};
