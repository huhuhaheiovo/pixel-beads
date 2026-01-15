import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'AboutUs' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/about' : `https://www.pixel-beads.com/${locale}/about`,
            languages: {
                en: '/about',
                zh: '/zh/about',
                ja: '/ja/about',
                'x-default': 'https://www.pixel-beads.com/about',
            },
        },
    };
}

export default async function AboutUsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'AboutUs' });

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">{t('title')}</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-[#3F3F46] leading-relaxed mb-12 italic">
                        {t('intro')}
                    </p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('storyTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('storyContent')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('teamTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('teamContent')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('missionTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('missionContent')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('visionTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('visionContent')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('whyTitle')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed mb-4">{t('whyContent')}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
