import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ArrowLeft, Ghost } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('halloween.title')} | Free Perler Bead Patterns`,
        description: t('halloween.description'),
        alternates: {
            canonical: `/${locale}/showcase/halloween`,
            languages: {
                en: '/en/showcase/halloween',
                zh: '/zh/showcase/halloween',
            },
        },
    };
}

export default function HalloweenShowcase() {
    const t = useTranslations('Showcase');

    const items = [
        t('halloween.items.item1'),
        t('halloween.items.item2'),
        t('halloween.items.item3'),
        t('halloween.items.item4'),
        t('halloween.items.item5'),
        t('halloween.items.item6')
    ];

    return (
        <main className="min-h-screen bg-white pb-24">
            {/* Header */}
            <section className="pt-20 pb-16 bg-orange-50 border-b border-orange-200">
                <div className="container mx-auto px-4">
                    <Link href="/showcase" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717A] hover:text-[#18181B] mb-8 transition-colors">
                        <ArrowLeft size={14} /> Back to Gallery
                    </Link>
                    <div className="text-center">
                        <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
                            <Ghost size={32} className="text-orange-500" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-orange-950">{t('halloween.title')}</h1>
                        <p className="text-lg text-orange-900/70 max-w-2xl mx-auto">{t('halloween.description')}</p>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, i) => (
                        <div key={i} className="group bg-white border-2 border-[#F4F4F5] rounded-3xl overflow-hidden hover:border-orange-500 transition-all shadow-sm hover:shadow-xl">
                            <div className="aspect-[4/3] bg-orange-100 flex items-center justify-center relative overflow-hidden">
                                <span className="text-orange-500/10 font-black text-8xl absolute transform -rotate-12">BOO!</span>
                                <div className="p-12 relative z-10">
                                    <div className="w-full aspect-square bg-orange-500 rounded-full opacity-20 blur-2xl absolute inset-0"></div>
                                    <div className="grid grid-cols-4 gap-1 opacity-40">
                                        {Array.from({ length: 16 }).map((_, j) => (
                                            <div key={j} className="w-4 h-4 rounded-full bg-orange-600" style={{ opacity: Math.random() }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">{item}</h3>
                                <Link
                                    href="/generator"
                                    className="inline-flex items-center justify-center w-full py-4 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-orange-600 transition-all"
                                >
                                    {t('cta')}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
