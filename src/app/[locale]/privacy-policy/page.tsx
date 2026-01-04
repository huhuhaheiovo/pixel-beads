import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });

    return {
        title: t('title'),
        description: t('intro'),
    };
}

export default async function PrivacyPolicyPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">{t('title')}</h1>
                <p className="text-sm font-bold text-[#71717A] mb-12 uppercase tracking-widest">{t('lastUpdated')}</p>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-[#3F3F46] leading-relaxed mb-12 italic">
                        {t('intro')}
                    </p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section1Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section1Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section2Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section2Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section3Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section3Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section4Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section4Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section5Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section5Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section6Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section6Content')}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#18181B]">{t('section7Title')}</h2>
                        <p className="text-[#3F3F46] leading-relaxed">{t('section7Content')}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
