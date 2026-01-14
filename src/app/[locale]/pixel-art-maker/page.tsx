import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Palette, Grid, Download, MousePointer2, Share2, Printer } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PixelArtMaker' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/pixel-art-maker' : `https://www.pixel-beads.com/${locale}/pixel-art-maker`,
            languages: {
                en: '/pixel-art-maker',
                zh: '/zh/pixel-art-maker',
                ja: '/ja/pixel-art-maker',
                'x-default': 'https://www.pixel-beads.com/pixel-art-maker',
            },
        },
    };
}

export default async function PixelArtMakerPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PixelArtMaker' });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": t('structuredDataName'),
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            t('structuredDataFeature1'),
            t('structuredDataFeature2'),
            t('structuredDataFeature3'),
            t('structuredDataFeature4')
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
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">{t('heroBadge')}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                            {t('heroTitle1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('heroTitle2')}</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                            {t('heroDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/perler-bead-pattern-generator"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                            >
                                <Palette size={20} />
                                {t('ctaStartDrawing')}
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
                                <h3 className="text-xl font-bold text-[#18181B]">{t('feature1Title')}</h3>
                                <p className="text-[#71717A]">{t('feature1Desc')}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto md:mx-0">
                                    <Download size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#18181B]">{t('feature2Title')}</h3>
                                <p className="text-[#71717A]">{t('feature2Desc')}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto md:mx-0">
                                    <Share2 size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#18181B]">{t('feature3Title')}</h3>
                                <p className="text-[#71717A]">{t('feature3Desc')}</p>
                            </div>
                        </section>

                        {/* Guide Text */}
                        <section className="bg-slate-50 border border-slate-100 rounded-3xl p-10">
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-8">{t('sectionWhatCanYouCreate')}</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-[#18181B]">{t('gameSpritesTitle')}</h3>
                                    <p className="text-[#71717A] leading-relaxed">
                                        {t('gameSpritesDesc')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-[#18181B]">{t('beadStitchTitle')}</h3>
                                    <p className="text-[#71717A] leading-relaxed">
                                        {t('beadStitchDesc')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* SEO / Tool Description */}
                        <section>
                            <h2 className="text-3xl font-black tracking-tight text-[#18181B] mb-6">{t('sectionWhyUseTitle')}</h2>
                            <div className="prose prose-lg text-[#71717A] leading-relaxed">
                                <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('whyUsePara1') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('whyUsePara2') }} />
                            </div>
                        </section>

                    </div>
                </div>
            </article>

            {/* CTA */}
            <section className="py-20 bg-[#18181B] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-8">{t('ctaReadyTitle')}</h2>
                    <Link
                        href="/perler-bead-pattern-generator"
                        className="inline-flex px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                        {t('ctaLaunchEditor')}
                    </Link>
                </div>
            </section>
        </main>
    );
}
