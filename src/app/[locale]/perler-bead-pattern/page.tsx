import type { Metadata } from 'next'
import { fetchPatternsAction } from '@/app/actions/patterns';
import { PatternGrid } from '@/components/patterns/PatternGrid';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Patterns' })

    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en' 
        ? '/perler-bead-pattern' 
        : `/${locale}/perler-bead-pattern`

    return {
        title: t('seoTitle'),
        description: t('seoDescription'),
        openGraph: {
            title: t('seoTitle'),
            description: t('seoDescription'),
            type: 'website',
            url: `${baseUrl}${canonicalPath}`
        },
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
                en: '/perler-bead-pattern',
                zh: '/zh/perler-bead-pattern',
                'x-default': `${baseUrl}/perler-bead-pattern`
            }
        }
    }
}

export default async function PatternsPage({ params }: PageProps) {
    const { locale } = await params
    const { data: patterns } = await fetchPatternsAction();
    const t = await getTranslations({ locale, namespace: 'Patterns' });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2">{t('h1Title')}</h1>
                <p className="text-zinc-500 text-lg leading-relaxed">
                    {t('description')} {t('descriptionExtended')}
                </p>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{t('h2Popular')}</h2>
                <PatternGrid patterns={patterns} />
            </section>

            <section className="mt-16 pt-12 border-t border-zinc-200">
                <h2 className="text-2xl font-bold mb-4">{t('h2TurnIntoArt')}</h2>
                <p className="text-zinc-600 mb-6 leading-relaxed">
                    {t('ctaDescription')}
                </p>
                <Link
                    href="/perler-bead-pattern-generator"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E2A1E] text-white rounded-xl font-bold hover:bg-[#5A3E2B] transition-colors"
                >
                    {t('ctaButton')}
                    <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
}
