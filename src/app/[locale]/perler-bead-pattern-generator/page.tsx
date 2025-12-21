import { PixelBeadGenerator } from '@/components/PixelBeadGenerator'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Header' });

    return {
        title: `Free Perler Bead Pattern Generator – Easy Pattern Download`,
        description:"Convert your photos into stunning pixel bead art patterns in seconds. Customizable grids, accurate color matching, and HD PDF/Image exports.",
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
