import React from 'react';
import { Link } from '@/i18n/routing';

interface BlogLayoutProps {
    children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F1ECE1] relative overflow-hidden font-sans">
            {/* Pegboard Overlay */}
            <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #18181B 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />

            <div className="container mx-auto px-4 py-24 max-w-5xl relative z-10">
                {children}
            </div>
        </div>
    );
}
