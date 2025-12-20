import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Flame, Gamepad2, Dog, Zap, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'CoolDesigns' });

    return {
        title: `${t('title')} | Pixel Bead Patterns`,
        description: t('subtitle'),
        keywords: ['cool perler bead designs', 'perler bead patterns', 'pixel art ideas', 'bead art inspiration'],
        alternates: {
            canonical: `/${locale}/cool-perler-bead-designs`,
            languages: {
                en: '/en/cool-perler-bead-designs',
                zh: '/zh/cool-perler-bead-designs',
            },
        },
    };
}

export default function CoolDesignsPage() {
    const t = useTranslations('CoolDesigns');

    const categories = [
        { name: t('cat_gaming'), icon: <Gamepad2 className="text-blue-500" />, items: 124 },
        { name: t('cat_animals'), icon: <Dog className="text-orange-500" />, items: 86 },
        { name: t('cat_icons'), icon: <Zap className="text-yellow-500" />, items: 210 }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* SEO Hero */}
            <section className="pt-24 pb-20 bg-gradient-to-b from-[#FAFAFA] to-white border-b border-[#E4E4E7]">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 animate-pulse">
                        <Flame size={12} /> Hot & Trending
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-[#71717A] max-w-3xl mx-auto mb-12 leading-relaxed">
                        {t('subtitle')}
                    </p>
                    <Link
                        href="/generator"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#18181B] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-black/10"
                    >
                        {t('cta_create')} <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Content Section 1: Trending */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">{t('h2_trending')}</h2>
                        <p className="text-[#71717A]">Our most popular patterns requested by the community this month. Each design is optimized for standard perler bead plates.</p>
                    </div>
                    <Link href="/showcase" className="text-sm font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] flex items-center gap-2">
                        Browse all <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="group aspect-square bg-[#F4F4F5] rounded-[2rem] overflow-hidden relative border border-[#E4E4E7] hover:border-[#18181B] transition-all">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 bg-[#18181B]">
                                <span className="font-black text-6xl transform -rotate-12">COOL</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                                <p className="text-white font-black uppercase tracking-tighter text-xl">Design #{i + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Content Section 2: Categories */}
            <section className="py-24 bg-[#18181B] text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-16 text-center">{t('h2_categories')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {categories.map((cat, i) => (
                            <div key={i} className="p-10 border border-white/10 rounded-3xl hover:bg-white/5 transition-colors group">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{cat.name}</h3>
                                <p className="text-white/40 text-sm uppercase tracking-widest font-bold">{cat.items} PATTERNS</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 container mx-auto px-4 text-center">
                <div className="bg-[#FAFAFA] border-2 border-dashed border-[#E4E4E7] p-16 rounded-[3rem]">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8">Ready to start?</h2>
                    <p className="text-[#71717A] mb-12 max-w-xl mx-auto">Upload any image and we'll turn it into a high-quality perler bead pattern automatically.</p>
                    <Link
                        href="/generator"
                        className="inline-flex items-center gap-3 px-12 py-5 bg-[#18181B] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        Go to Generator
                    </Link>
                </div>
            </section>
        </main>
    );
}
