import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Star, Heart, Zap, Award, Sparkles, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Ultimate Guide to Fuse Beads | Patterns, Tips & Types",
        description: "Everything you need to know about Fuse Beads. Discover the best brands, sizes (Midi, Mini), ironing tips, and free patterns for your next pixel art project.",
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/fuse-beads' : `https://www.pixel-beads.com/${locale}/fuse-beads`,
            languages: {
                en: '/fuse-beads',
                zh: '/zh/fuse-beads',
                'x-default': 'https://www.pixel-beads.com/fuse-beads',
            },
        },
    };
}

export default async function FuseBeadsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Ultimate Guide to Fuse Beads: Everything You Need to Know",
        "image": [
            "https://www.pixel-beads.com/pallettes/pallette-1.png"
        ],
        "datePublished": "2024-01-01T08:00:00+08:00",
        "dateModified": new Date().toISOString(),
        "author": [{
            "@type": "Organization",
            "name": "PixelBeads Pattern Generator",
            "url": "https://www.pixel-beads.com"
        }]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-8">
                            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">The Complete Guide</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#18181B] mb-8 leading-tight">
                            The Ultimate Guide to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fuse Beads</span>
                        </h1>

                        <p className="text-xl text-[#71717A] max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            Everything you need to know about the pixel art craft phenomenon. From choosing the right brand to mastering the ironing process.
                        </p>

                        <Link
                            href="/perler-bead-pattern-generator"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#18181B] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                        >
                            <Sparkles size={20} />
                            Create Patterns Now
                        </Link>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/4"></div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-16">

                        {/* What are Fuse Beads */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                    <BookOpen size={20} />
                                </span>
                                What Are Fuse Beads?
                            </h2>
                            <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                <p className="mb-4">
                                    Fuse beads are small, heat-activated plastic beads that can be arranged on pegboards to create colorful patterns and pixel art designs. Once arranged, they are fused together using a household iron and parchment paper, creating a permanent, solid piece of art.
                                </p>
                                <p>
                                    Originally designed as a therapeutic craft for elderly patients, they have evolved into a beloved medium for pixel art enthusiasts, gamers, and crafters of all ages. You might know them by various brand names such as Perler Beads, Hama Beads, or Artkal Beads.
                                </p>
                            </div>
                        </section>

                        {/* Sizes */}
                        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">Understanding Bead Sizes</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Most Popular</div>
                                    <h3 className="text-xl font-black text-[#18181B] mb-2">Midi (5.0mm)</h3>
                                    <p className="text-[#71717A] text-sm">The standard size found in most craft stores. Perfect for beginners and children (5+).</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-2">For Detail</div>
                                    <h3 className="text-xl font-black text-[#18181B] mb-2">Mini (2.6mm)</h3>
                                    <p className="text-[#71717A] text-sm">Roughly half the size of Midi. Allows for intricate details and complex pixel art designs.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">For Toddlers</div>
                                    <h3 className="text-xl font-black text-[#18181B] mb-2">Maxi (10mm)</h3>
                                    <p className="text-[#71717A] text-sm">Large beads designed for small hands. Great for developing fine motor skills in younger kids (3+).</p>
                                </div>
                            </div>
                        </section>

                        {/* Top Brands */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Award size={20} />
                                </span>
                                Top Fuse Bead Brands
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#18181B] mb-2">Perler Beads</h3>
                                        <p className="text-[#71717A]">The most dominant brand in the US. Known for high consistency and a wide range of colors. They have a slightly lower melting point than some other brands.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#18181B] mb-2">Hama Beads</h3>
                                        <p className="text-[#71717A]">The original brand from Denmark, popular in Europe. They offer three distinct sizes (Mini, Midi, Maxi) and have a slightly softer finish when melted.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#18181B] mb-2">Artkal Beads</h3>
                                        <p className="text-[#71717A]">Known for their massive color palette (over 200 colors). They offer two types: 'S' (hard like Perler) and 'R' (flexible and durable), making them a favorite for advanced artists.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* How to Start */}
                        <section className="bg-[#18181B] text-white p-10 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black tracking-tight mb-6">Ready to Start Fusing?</h2>
                                <ol className="space-y-4 mb-8">
                                    <li className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                                        <p className="text-gray-300"><strong className="text-white">Choose a Pattern:</strong> Start with a simple design or use our generator.</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">2</span>
                                        <p className="text-gray-300"><strong className="text-white">Arrange Beads:</strong> Place beads on the pegboard following your pattern.</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">3</span>
                                        <p className="text-gray-300"><strong className="text-white">Iron It:</strong> Cover with ironing paper and heat until beads fuse.</p>
                                    </li>
                                </ol>
                                <Link
                                    href="/perler-bead-pattern-generator"
                                    className="inline-block px-8 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-blue-50 transition-colors"
                                >
                                    Make Your Own Pattern
                                </Link>
                            </div>

                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Internal Linking / Related */}
            <section className="py-20 border-t border-slate-100 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-12">Explore More Crafts</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/hama-beads" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-blue-600 hover:shadow-md transition-all font-bold">
                            Hama Beads Guide
                        </Link>
                        <Link href="/minecraft-pixel-art" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-green-600 hover:shadow-md transition-all font-bold">
                            Minecraft Pixel Art
                        </Link>
                        <Link href="/pindou-pattern-generator" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-purple-600 hover:shadow-md transition-all font-bold">
                            Image to Pixel
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
