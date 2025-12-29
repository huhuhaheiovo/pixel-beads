import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Star, Hexagon, Palette, History, Sparkles } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: "Hama Beads Guide | The Original Melting Bead Craft",
        description: "Explore the world of Hama Beads. Learn about Mini, Midi, and Maxi sizes, discover 3D project ideas, and see how they compare to Perler beads.",
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/hama-beads' : `https://www.pixel-beads.com/${locale}/hama-beads`,
            languages: {
                en: '/hama-beads',
                zh: '/zh/hama-beads',
                'x-default': 'https://www.pixel-beads.com/hama-beads',
            },
        },
    };
}

export default async function HamaBeadsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Hama Beads: The Original Melting Bead Craft",
        "image": [
            "https://www.pixel-beads.com/pallettes/pallette-2.png"
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
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-red-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 mb-8">
                            <Star className="w-4 h-4 text-red-600 fill-red-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-red-700">Established 1971</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#18181B] mb-8 leading-tight">
                            The Original <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Hama Beads</span>
                        </h1>

                        <p className="text-xl text-[#71717A] max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            Discover the Danish craft that started it all. From tiny Mini beads to chunky Maxis, Hama offers a world of creative possibilities.
                        </p>

                        <Link
                            href="/perler-bead-pattern-generator"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#18181B] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1"
                        >
                            <Sparkles size={20} />
                            Design Hama Patterns
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-16">

                        {/* Intro */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                    <History size={20} />
                                </span>
                                A Legacy of Creativity
                            </h2>
                            <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                <p className="mb-4">
                                    Hama Beads originated in Denmark in 1971. Malte Haaning, the company's founder, initially manufactured straws but soon discovered that the plastic scraps could be melted together to create art. This led to the invention of the "Midi" bead, followed by "Mini" and "Maxi" sizes.
                                </p>
                                <p>
                                    Unlike some other brands, Hama beads are known for a slightly softer finish when ironed, allowing for flexible, durable designs that are less prone to snapping.
                                </p>
                            </div>
                        </section>

                        {/* Sizes */}
                        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">The Three Hama Sizes</h2>
                            <div className="space-y-6">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xl shrink-0">M</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#18181B] mb-1">Hama Mini (2.5mm)</h3>
                                        <p className="text-[#71717A]">For the advanced artist. These tiny beads allow for photo-realistic details and can even be used to create jewelry. Recommended for ages 10+.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xl shrink-0">M</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#18181B] mb-1">Hama Midi (5.0mm)</h3>
                                        <p className="text-[#71717A]">The classic size. Universal standard for most pixel art projects. Compatible with Perler and other 5mm brands. Recommended for ages 5+.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-xl shrink-0">X</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#18181B] mb-1">Hama Maxi (10.0mm)</h3>
                                        <p className="text-[#71717A]">Developed for toddlers. These chunks are easy to grip and safe, preventing swallowing hazards. Recommended for ages 3+.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hama vs Perler */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Palette size={20} />
                                </span>
                                Hama vs. Perler Beads
                            </h2>
                            <div className="bg-white border-l-4 border-red-500 pl-6 py-2 mb-6">
                                <p className="text-lg font-medium text-[#18181B]">
                                    Can you mix them? <span className="text-red-600">Generally, No.</span>
                                </p>
                            </div>
                            <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                <p>
                                    While they look identical (in Midi size), they have different melting points.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-4">
                                    <li><strong>Perler:</strong> Harder plastic, higher melting point. Results in a stiff, rigid finish.</li>
                                    <li><strong>Hama:</strong> Softer plastic, lower melting point. Results in a flexible, slightly rubbery finish.</li>
                                </ul>
                                <p className="mt-4">
                                    Mixing them in one project can lead to uneven ironing—the Hama beads might melt flat before the Perler beads have even started to fuse.
                                </p>
                            </div>
                        </section>

                        {/* 3D Projects */}
                        <section className="bg-[#18181B] text-white p-10 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
                                    <Hexagon /> 3D Hama Projects
                                </h2>
                                <p className="text-gray-300 text-lg mb-8">
                                    Because Hama beads are slightly flexible, they are excellent for 3D construction involving "snap-fit" joints. You can create boxes, planters, and even action figures without glue!
                                </p>
                                <Link
                                    href="/perler-bead-pattern-generator"
                                    className="inline-block px-8 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-red-900 transition-colors"
                                >
                                    Try the 3D Planner
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Internal Linking */}
            <section className="py-20 border-t border-slate-100 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-12">More Pixel Art Resources</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/fuse-beads" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-blue-600 hover:shadow-md transition-all font-bold">
                            Ultimate Fuse Beads Guide
                        </Link>
                        <Link href="/pixel-art-maker" className="px-6 py-3 bg-white rounded-xl shadow-sm text-[#71717A] hover:text-purple-600 hover:shadow-md transition-all font-bold">
                            Online Pixel Art Maker
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
