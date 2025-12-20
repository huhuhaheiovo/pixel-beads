import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ArrowRight, Ghost, Trees } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Showcase' });

    return {
        title: `${t('title')} | Perler Bead Art Gallery`,
        description: t('subtitle'),
        alternates: {
            canonical: `/${locale}/showcase`,
            languages: {
                en: '/en/showcase',
                zh: '/zh/showcase',
            },
        },
    };
}

export default function ShowcasePage() {
    const t = useTranslations('Showcase');

    const themes = [
        {
            id: 'halloween',
            title: t('halloween.title'),
            description: t('halloween.description'),
            icon: <Ghost size={32} className="text-orange-500" />,
            color: 'bg-orange-50',
            borderColor: 'hover:border-orange-500',
            link: '/showcase/halloween'
        },
        {
            id: 'christmas',
            title: t('christmas.title'),
            description: t('christmas.description'),
            icon: <Trees size={32} className="text-green-600" />,
            color: 'bg-green-50',
            borderColor: 'hover:border-green-600',
            link: '/showcase/christmas'
        }
    ];

    return (
        <main className="min-h-screen bg-white pb-24">
            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-[#FAFAFA] border-b border-[#E4E4E7]">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">{t('title')}</h1>
                    <p className="text-lg text-[#71717A] max-w-2xl mx-auto mb-8">{t('subtitle')}</p>
                    <div className="w-20 h-1.5 bg-[#18181B] mx-auto"></div>
                </div>
            </section>

            {/* Themes Grid */}
            <section className="container mx-auto px-4 py-24">
                <div className="text-center mb-12">
                    <h2 className="text-xl font-black uppercase tracking-[0.3em] text-[#18181B] mb-4">{t('exploreThemes')}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {themes.map((theme) => (
                        <Link
                            key={theme.id}
                            href={theme.link}
                            className={`group p-8 border-2 border-[#F4F4F5] rounded-3xl ${theme.color} ${theme.borderColor} transition-all flex flex-col items-center text-center`}
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                {theme.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{theme.title}</h3>
                            <p className="text-[#71717A] leading-relaxed mb-8">{theme.description}</p>
                            <span className="mt-auto inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                                {t('viewCollection')} <ArrowRight size={14} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* General Showcase Grid */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-xl font-black uppercase tracking-[0.3em] text-[#18181B] mb-4">Featured Works</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="group aspect-square bg-[#F4F4F5] rounded-2xl overflow-hidden relative border border-[#E4E4E7]">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-[#18181B]">
                                <span className="font-black text-4xl transform -rotate-12">PIXEL</span>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                                <h4 className="text-white font-bold uppercase tracking-tighter text-lg mb-4">Sample Work {i + 1}</h4>
                                <Link
                                    href="/generator"
                                    className="px-6 py-2 bg-white text-[#18181B] rounded-lg font-bold text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform"
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
