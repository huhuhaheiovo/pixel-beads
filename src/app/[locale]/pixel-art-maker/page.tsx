import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Palette, Grid, Download, MousePointer2, Share2, Printer } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Pixel Art Maker | Free Online Pixel Art Drawing Tool",
        description: "The best free online pixel art maker. Draw pixel art, create game sprites, and design bead patterns. No login required. Export to PNG or PDF.",
        alternates: {
            canonical: `https://www.pixel-beads.com/${locale}/pixel-art-maker`,
            languages: {
                en: '/en/pixel-art-maker',
                zh: '/zh/pixel-art-maker',
                'x-default': 'https://www.pixel-beads.com/pixel-art-maker',
            },
        },
    };
}

export default async function PixelArtMakerPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Pixel Art Maker",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Online Pixel Editor",
            "Multiple Layer Support",
            "Animation Frames (coming soon)",
            "Palette Management"
        ]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0f0f13] overflow-hidden text-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#27272a] border border-[#3f3f46] mb-8">
                            <MousePointer2 className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Browser-Based Editor</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                            Pixel Art <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Maker & Editor</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            A powerful, free online tool for creating pixel art, game sprites, and bead patterns. Simple enough for beginners, powerful enough for pros.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/perler-bead-pattern-generator"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                            >
                                <Palette size={20} />
                                Start Drawing
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Highlights */}
                        <section className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto md:mx-0">
                                    <Grid size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#18181B]">Custom Canvas</h3>
                                <p className="text-[#71717A]">Choose any grid size from 8x8 icons to 100x100 scenes. Resizing is instant.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto md:mx-0">
                                    <Download size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#18181B]">Instant Export</h3>
                                <p className="text-[#71717A]">Download your work as high-resolution PNGs or printer-friendly PDFs with grid numbers.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto md:mx-0">
                                    <Share2 size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#18181B]">No Sign-up Needed</h3>
                                <p className="text-[#71717A]">Jump straight into creating. We store your session locally so you don't lose progress.</p>
                            </div>
                        </section>

                        {/* Guide Text */}
                        <section className="bg-slate-50 border border-slate-100 rounded-3xl p-10">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">What Can You Create?</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-[#18181B]">Game Sprites</h3>
                                    <p className="text-[#71717A] leading-relaxed">
                                        Perfect for indie game developers. Create characters, items, and environments. Our transparent background export makes it easy to import directly into engines like Unity or Godot.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-[#18181B]">Bead & Stitch Patterns</h3>
                                    <p className="text-[#71717A] leading-relaxed">
                                        Turn on the "Bead Mode" to see color codes for Perler, Hama, or Artkal beads. It's the easiest way to plan your physical crafts before buying supplies.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* SEO / Tool Description */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6">Why Use an Online Pixel Editor?</h2>
                            <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                <p className="mb-4">
                                    Traditional image editors like Photoshop can be overkill for pixel art. They blur pixels when resizing and handle anti-aliasing in ways that ruin the crisp pixel aesthetic.
                                </p>
                                <p>
                                    Our <strong>Pixel Art Maker</strong> is built specifically for this medium. It ensures every pixel stays sharp (nearest-neighbor interpolation), provides specialized tools like a "pixel-perfect" pencil, and handles strict color palettes to ensure your art looks authentic to the 8-bit and 16-bit eras.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </article>

            {/* CTA */}
            <section className="py-20 bg-[#18181B] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-8">Ready to create?</h2>
                    <Link
                        href="/perler-bead-pattern-generator"
                        className="inline-flex px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                        Launch Editor
                    </Link>
                </div>
            </section>
        </main>
    );
}
