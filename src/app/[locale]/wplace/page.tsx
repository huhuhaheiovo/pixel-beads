import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Grid, Users, Flag, Shield, Sword } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Pixel Wars & r/place Canvas Tool | Plan Your Tile Strategy",
        description: "Dominate the canvas in the next r/place event or pixel war. Create templates, organize your community, and convert images into perfect pixel schematics.",
        alternates: {
            canonical: `https://www.pixel-beads.com/${locale}/wplace`,
            languages: {
                en: '/en/wplace',
                zh: '/zh/wplace',
                'x-default': 'https://www.pixel-beads.com/wplace',
            },
        },
    };
}

export default async function WPlacePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Pixel Wars Strategy Tool",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Image to Grid Conversion",
            "Coordinate Planning",
            "Template Overlay Generation"
        ]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#FF4500] overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white mb-8">
                        <Flag className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Community Event Ready</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-tight">
                        Win the Next <br />
                        <span className="text-white drop-shadow-md">Pixel War</span>
                    </h1>

                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                        Prepare your community for r/place and other canvas events. Convert your logo or art into a precise pixel template that anyone can follow.
                    </p>

                    <Link
                        href="/perler-bead-pattern-generator"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#FF4500] rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl transform hover:-translate-y-1"
                    >
                        <Grid size={20} />
                        Create Template
                    </Link>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Strategy Grid */}
                        <section className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Defend Territory</h3>
                                <p className="text-[#71717A]">Generate a clear reference image so your community knows exactly which pixel belongs where. Spot vandalism instantly.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                                    <Sword size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Coordinate Attacks</h3>
                                <p className="text-[#71717A]">Plan expansion with precise coordinates. Share grid-mapped images to direct your users to the new frontier.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#18181B]">Alliance Standards</h3>
                                <p className="text-[#71717A]">Standardize your art to ensure it fits with allies. Use our tool to resize and recolor your assets to match the canvas palette.</p>
                            </div>
                        </section>

                        {/* How to Prep */}
                        <section className="bg-[#18181B] text-white p-10 rounded-3xl">
                            <h2 className="text-3xl font-black tracking-tight mb-8">How to Prepare for r/place</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="text-4xl font-black text-[#FF4500]">01</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Design at 1:1 Scale</h3>
                                        <p className="text-gray-400">Don't use high-res images. Create your art where 1 pixel = 1 canvas tile. Our editor handles this perfectly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-4xl font-black text-[#FF4500]">02</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Quantize Colors</h3>
                                        <p className="text-gray-400">Canvas events usually have a limited palette (e.g., 16 or 32 colors). Use our tool to automatically snap your colors to the nearest match.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-4xl font-black text-[#FF4500]">03</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Distribute the Grid</h3>
                                        <p className="text-gray-400">Export your design with grid lines visible. Post this "blueprint" in your Discord or subreddit pins.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6">Start Planning Now</h2>
                            <Link
                                href="/pixel-art-maker"
                                className="inline-block px-12 py-4 bg-[#FF4500] text-white rounded-full font-black uppercase tracking-widest hover:bg-black transition-colors"
                            >
                                Open Pixel Editor
                            </Link>
                        </div>

                    </div>
                </div>
            </article>
        </main>
    );
}
