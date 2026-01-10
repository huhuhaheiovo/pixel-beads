import type { Metadata } from 'next'
import { fetchPatternAction } from '@/app/actions/patterns';
import { PatternDetailView } from '@/components/patterns/PatternDetailView';
import { notFound } from 'next/navigation';
import { parseSlugToId, toSlug } from '@/lib/slug-utils';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params
    const id = parseSlugToId(slug)
    const pattern = await fetchPatternAction(id)

    if (!pattern) {
        return {
            title: 'Pattern Not Found'
        }
    }

    const patternName = pattern.name || `Pattern ${pattern.id}`
    const sizeInfo = `${pattern.gridSize.width}×${pattern.gridSize.height}`
    const brandInfo = pattern.materials?.brand ? ` ${pattern.materials.brand}` : ''
    
    // Generate optimized title (40-60 characters)
    // Try different title formats to ensure optimal length
    let title = `${patternName} - ${sizeInfo}${brandInfo} Perler Bead Pattern`
    
    // If title is too short, try with "Free" prefix
    if (title.length < 40) {
        const titleWithFree = `${patternName} - Free ${sizeInfo}${brandInfo} Perler Bead Pattern & PDF Guide`
        if (titleWithFree.length >= 40 && titleWithFree.length <= 60) {
            title = titleWithFree
        } else if (titleWithFree.length < 40) {
            // If still too short, try with "Download" prefix
            const titleWithDownload = `Download ${patternName} - ${sizeInfo}${brandInfo} Perler Bead Pattern PDF`
            if (titleWithDownload.length >= 40) {
                title = titleWithDownload
            } else {
                // Last resort: add more descriptive text
                title = `${patternName} - Free ${sizeInfo}${brandInfo} Perler Bead Pattern Template & Guide`
            }
        } else {
            // titleWithFree is too long, keep original and pad it
            title = `${patternName} - ${sizeInfo}${brandInfo} Perler Bead Pattern Template`
        }
    }
    
    // Ensure title is within 60 characters (truncate if needed)
    let finalTitle = title.length > 60 ? title.substring(0, 57) + '...' : title
    
    // If final title is still too short, pad it (shouldn't happen, but safety check)
    if (finalTitle.length < 40 && finalTitle.length > 0) {
        const padding = ' - Free Perler Bead Pattern'
        const paddedTitle = finalTitle + padding
        finalTitle = paddedTitle.length > 60 ? paddedTitle.substring(0, 57) + '...' : paddedTitle
    }
    
    // Generate description with pattern details
    let description = pattern.description
    if (!description) {
        const authorInfo = pattern.author ? ` by ${pattern.author}` : ''
        description = `Free ${sizeInfo} perler bead pattern${authorInfo}${brandInfo}. Download PDF guide and start creating!`
    }

    // Ensure description is within 160 characters
    if (description.length > 160) {
        description = description.substring(0, 157) + '...'
    }

    // Generate slug for canonical URL
    const canonicalSlug = toSlug(pattern.name, pattern.id)
    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en' 
        ? `/perler-bead-pattern/${canonicalSlug}` 
        : `/${locale}/perler-bead-pattern/${canonicalSlug}`

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
                en: `/perler-bead-pattern/${canonicalSlug}`,
                zh: `/zh/perler-bead-pattern/${canonicalSlug}`,
                'x-default': `${baseUrl}/perler-bead-pattern/${canonicalSlug}`
            }
        }
    }
}

export default async function PatternDetailPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const id = parseSlugToId(slug);
    const pattern = await fetchPatternAction(id);

    if (!pattern) {
        notFound();
    }

    // Generate slug for structured data URL
    const canonicalSlug = toSlug(pattern.name, pattern.id)
    const patternName = pattern.name || `Pattern ${pattern.id}`
    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en' 
        ? `/perler-bead-pattern/${canonicalSlug}` 
        : `/${locale}/perler-bead-pattern/${canonicalSlug}`
    
    // Ensure dateCreated is in ISO 8601 format
    let dateCreated = pattern.createdAt
    if (dateCreated && !dateCreated.includes('T')) {
        // If it's just a date, ensure it's properly formatted
        dateCreated = new Date(dateCreated).toISOString()
    }

    const structuredData: any = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: patternName,
        description: pattern.description || `A ${pattern.gridSize.width}×${pattern.gridSize.height} perler bead pattern`,
        dateCreated: dateCreated || new Date().toISOString(),
        width: {
            '@type': 'QuantitativeValue',
            value: Number(pattern.gridSize.width),
            unitText: 'beads'
        },
        height: {
            '@type': 'QuantitativeValue',
            value: Number(pattern.gridSize.height),
            unitText: 'beads'
        },
        url: `${baseUrl}${canonicalPath}`
    }

    // Add material only if it exists and is a valid string
    if (pattern.materials?.brand) {
        structuredData.material = String(pattern.materials.brand)
    }

    if (pattern.author) {
        structuredData.author = {
            '@type': 'Person',
            name: String(pattern.author)
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
