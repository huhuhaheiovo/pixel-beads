import { fetchPatternsAction } from '@/app/actions/patterns';
import { PatternGrid } from '@/components/patterns/PatternGrid';
import { getTranslations } from 'next-intl/server';

export default async function PatternsPage() {
    const { data: patterns } = await fetchPatternsAction();
    const t = await getTranslations('Patterns');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2">{t('title')}</h1>
                <p className="text-zinc-500">{t('description')}</p>
            </div>

            <PatternGrid patterns={patterns} />
        </div>
    );
}
