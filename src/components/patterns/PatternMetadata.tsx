import { Pattern } from '@/lib/pattern-service'
import { getTranslations, getLocale } from 'next-intl/server'
import { Eye } from 'lucide-react'

interface PatternMetadataProps {
  pattern: Pattern
}

export async function PatternMetadata ({ pattern }: PatternMetadataProps) {
  const t = await getTranslations('Patterns')
  const locale = await getLocale()
  const patternName = pattern.name || `Pattern ${pattern.id}`

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black mb-4">{patternName}</h1>
      
      {/* Pattern Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 mb-4">
        {pattern.createdAt && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('createdAt')}:</span>
            <time dateTime={pattern.createdAt}>
              {new Date(pattern.createdAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        )}
        {pattern.author && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('patternAuthor')}:</span>
            <span>{pattern.author}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="font-medium">{t('patternSize')}:</span>
          <span>
            {pattern.gridSize.width} × {pattern.gridSize.height} {t('beads')}
          </span>
        </div>
        {pattern.viewCount !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span className="font-medium">{t('views')}:</span>
            <span>{pattern.viewCount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Pattern Description */}
      {pattern.description && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">{t('patternDescription')}</h2>
          <p className="text-zinc-600 leading-relaxed">{pattern.description}</p>
        </div>
      )}

      {/* Pattern Details Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('patternDetails') || 'Pattern Details'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-2">{t('patternSize')}</h3>
            <p className="text-zinc-600">
              {pattern.gridSize.width} × {pattern.gridSize.height} {t('beads')}
            </p>
          </div>
          {pattern.materials?.brand && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">{t('materialBrand') || 'Material Brand'}</h3>
              <p className="text-zinc-600">{pattern.materials.brand}</p>
            </div>
          )}
          {pattern.materials?.totalBeads && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">{t('totalBeads')}</h3>
              <p className="text-zinc-600">{pattern.materials.totalBeads.toLocaleString()} {t('beads')}</p>
            </div>
          )}
          {pattern.author && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">{t('patternAuthor')}</h3>
              <p className="text-zinc-600">{pattern.author}</p>
            </div>
          )}
        </div>
      </div>

      {/* Author Message */}
      {pattern.message && (
        <p className="text-zinc-500 italic">{pattern.message}</p>
      )}
    </div>
  )
}
