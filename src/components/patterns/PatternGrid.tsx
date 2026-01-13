'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { Pattern } from '@/lib/pattern-service'
import { useTranslations } from 'next-intl'
import { toSlug } from '@/lib/slug-utils'
import { CanvasPreview } from './CanvasPreview'
import { Button } from '@/components/ui/button'
import { Loader2, Eye } from 'lucide-react'
import { fetchPatternsAction } from '@/app/actions/patterns'

interface PatternGridProps {
  initialPatterns: Pattern[]
  total: number
  initialLimit: number
}

const PatternCard = React.memo(({ pattern }: { pattern: Pattern }) => {
  const t = useTranslations('Patterns')

  const patternName = useMemo(() => pattern.name || `Pattern ${pattern.id}`, [pattern.name, pattern.id])
  const altText = useMemo(() => {
    const sanitizedName = patternName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    return `perler bead pattern pixel art ${sanitizedName}`
  }, [patternName])
  const titleText = useMemo(() => `Perler Bead Pixel Art – ${patternName}`, [patternName])
  const slug = useMemo(() => toSlug(pattern.name, pattern.id), [pattern.name, pattern.id])

  return (
    <Link
      href={`/perler-bead-pattern/${slug}`}
      className="group block border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white"
      aria-label={`View ${patternName} perler bead pattern`}
    >
      <div
        className="aspect-square w-full bg-zinc-100 relative p-4 flex items-center justify-center"
        aria-label={altText}
        title={titleText}
      >
        <CanvasPreview
          pixels={pattern.pixels || []}
          width={pattern.gridSize.width}
          height={pattern.gridSize.height}
          maxSize={200}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {patternName}
        </h3>
        {pattern.message && (
          <p className="text-sm text-zinc-500 line-clamp-2">
            {pattern.message}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span>{pattern.gridSize.width}x{pattern.gridSize.height}</span>
            {pattern.viewCount !== undefined && pattern.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{pattern.viewCount.toLocaleString()}</span>
              </span>
            )}
          </div>
          <span className="font-medium text-zinc-900 border border-zinc-200 px-2 py-1 rounded">
            {t('viewDetails')}
          </span>
        </div>
      </div>
    </Link>
  )
})

PatternCard.displayName = 'PatternCard'

export function PatternGrid({ initialPatterns, total, initialLimit }: PatternGridProps) {
  const t = useTranslations('Patterns')
  const [patterns, setPatterns] = useState<Pattern[]>(initialPatterns)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(patterns.length < total)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = currentPage + 1
      const { data: newPatterns } = await fetchPatternsAction({ page: nextPage, limit: initialLimit })
      
      if (newPatterns.length > 0) {
        setPatterns(prev => [...prev, ...newPatterns])
        setCurrentPage(nextPage)
        setHasMore(patterns.length + newPatterns.length < total)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more patterns:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, initialLimit, isLoading, hasMore, patterns.length, total])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading') || 'Loading...'}
              </>
            ) : (
              t('loadMore') || 'Load More'
            )}
          </Button>
        </div>
      )}
    </>
  )
}
