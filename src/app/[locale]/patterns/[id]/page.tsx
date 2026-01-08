
import { fetchPatternAction } from '@/app/actions/patterns';
import { PatternDetailView } from '@/components/patterns/PatternDetailView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PatternDetailPage({ params }: PageProps) {
    const { id } = await params;
    const pattern = await fetchPatternAction(id);

    if (!pattern) {
        notFound();
    }

    return <PatternDetailView pattern={pattern} />;
}
