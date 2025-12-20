import { PixelBeadGenerator } from '@/components/PixelBeadGenerator'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Header' });

    return {
        title: `${t('generator')} | Perler Bead Pattern Generator`,
        alternates: {
            canonical: `/${locale}/generator`,
            languages: {
                en: '/en/generator',
                zh: '/zh/generator',
            },
        },
    };
}

export default function GeneratorPage() {
    return (
        <main className="min-h-screen bg-white">
            <PixelBeadGenerator />
        </main>
    )
}
