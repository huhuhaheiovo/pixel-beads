import { PixelBeadGenerator } from '@/components/PixelBeadGenerator'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Header' });

    return {
        title: `Free Perler Bead Pattern Generator – Easy Pattern Download`,
        description: "Convert your photos into stunning pixel bead art patterns in seconds. Customizable grids, accurate color matching, and HD PDF/Image exports.",
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/perler-bead-pattern-generator' : `https://www.pixel-beads.com/${locale}/perler-bead-pattern-generator`,
            languages: {
                en: '/perler-bead-pattern-generator',
                zh: '/zh/perler-bead-pattern-generator',
                'x-default': 'https://www.pixel-beads.com/perler-bead-pattern-generator',
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
