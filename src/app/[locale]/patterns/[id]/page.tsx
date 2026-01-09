import type { Metadata } from 'next'
import { fetchPatternAction } from '@/app/actions/patterns';
import { PatternDetailView } from '@/components/patterns/PatternDetailView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, id } = await params
    const pattern = await fetchPatternAction(id)

    if (!pattern) {
        return {
            title: 'Pattern Not Found'
        }
    }

    const patternName = pattern.name || `Pattern ${pattern.id}`
    const title = `${patternName} Perler Bead Pattern`
    
    // Generate description with pattern details
    let description = pattern.description
    if (!description) {
        const sizeInfo = `${pattern.gridSize.width}×${pattern.gridSize.height}`
        const authorInfo = pattern.author ? ` by ${pattern.author}` : ''
        const brandInfo = pattern.materials?.brand ? ` for ${pattern.materials.brand}` : ''
        description = `Free ${sizeInfo} perler bead pattern${authorInfo}${brandInfo}. Download PDF guide and start creating!`
    }

    // Ensure description is within 160 characters
    if (description.length > 160) {
        description = description.substring(0, 157) + '...'
    }

    // Ensure title is within 60 characters
    const finalTitle = title.length > 60 ? title.substring(0, 57) + '...' : title

    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en' 
        ? `/patterns/${id}` 
        : `/${locale}/patterns/${id}`

    return {
        title: finalTitle,
        description,
        openGraph: {
            title: finalTitle,
            description,
            type: 'article',
            publishedTime: pattern.createdAt,
            authors: pattern.author ? [pattern.author] : undefined,
            url: `${baseUrl}${canonicalPath}`
        },
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
                en: `/patterns/${id}`,
                zh: `/zh/patterns/${id}`,
                'x-default': `${baseUrl}/patterns/${id}`
            }
        }
    }
}

export default async function PatternDetailPage({ params }: PageProps) {
    const { locale, id } = await params;
    const pattern = await fetchPatternAction(id);

    if (!pattern) {
        notFound();
    }

    // Generate structured data (JSON-LD)
    const patternName = pattern.name || `Pattern ${pattern.id}`
    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en' 
        ? `/patterns/${id}` 
        : `/${locale}/patterns/${id}`
    
    const structuredData: any = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: patternName,
        description: pattern.description || `A ${pattern.gridSize.width}×${pattern.gridSize.height} perler bead pattern`,
        dateCreated: pattern.createdAt,
        width: {
            '@type': 'QuantitativeValue',
            value: pattern.gridSize.width,
            unitText: 'beads'
        },
        height: {
            '@type': 'QuantitativeValue',
            value: pattern.gridSize.height,
            unitText: 'beads'
        },
        url: `${baseUrl}${canonicalPath}`,
        material: pattern.materials?.brand || 'Perler'
    }

    if (pattern.author) {
        structuredData.author = {
            '@type': 'Person',
            name: pattern.author
        }
    }

    if (pattern.materials?.totalBeads) {
        structuredData.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: '5',
            ratingCount: '1'
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <PatternDetailView pattern={pattern} />
        </>
    )
}
