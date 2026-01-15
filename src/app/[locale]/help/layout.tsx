import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQ' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? 'https://www.pixel-beads.com/help' : `https://www.pixel-beads.com/${locale}/help`,
            languages: {
                en: '/help',
                zh: '/zh/help',
                ja: '/ja/help',
                'x-default': 'https://www.pixel-beads.com/help',
            },
        },
    };
}

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
