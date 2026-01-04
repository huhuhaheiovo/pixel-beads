import React from 'react';
import { Link } from '@/i18n/routing';

interface BlogLayoutProps {
    children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                {children}
            </div>
        </div>
    );
}
