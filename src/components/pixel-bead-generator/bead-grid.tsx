import { memo } from 'react'
import { BeadColor } from '@/lib/beadData'
import { getContrastTextColor } from '@/utils/color-utils'

interface BeadGridProps {
  matrix: string[][]
  gridWidth: number
  cellSize: number
  showGrid: boolean
  showBeadCodes: boolean
  colorById: Map<string, BeadColor>
  onCellClick: (x: number, y: number) => void
  zoom?: number
  beadStyle: 'square' | 'round' | 'hollow'
  gridSpacing: 'none' | 'small' | 'large'
}

const BeadCell = memo(({
  x,
  y,
  colorId,
  color,
  effectiveSize,
  isHollow,
  isRound,
  showBeadCodes,
  onCellClick
}: {
  x: number
  y: number
  colorId: string
  color: BeadColor | undefined
  effectiveSize: number
  isHollow: boolean
  isRound: boolean
  showBeadCodes: boolean
  onCellClick: (x: number, y: number) => void
}) => {
  const codeText = color?.code ?? ''
  const MIN_SIZE_FOR_TEXT = 8

  let displayContent: string | null = null
  if (showBeadCodes && color) {
    if (effectiveSize >= MIN_SIZE_FOR_TEXT && codeText) {
      displayContent = codeText
    }
  }

  const fontSize = displayContent
    ? effectiveSize < 12
      ? Math.max(6, Math.floor(effectiveSize * 0.5))
      : Math.max(8, Math.floor(effectiveSize * 0.45))
    : 0

  const cellLabel = color
    ? `${color.name}${color.code ? ` (${color.code})` : ''} at position ${x + 1}, ${y + 1}`
    : `Empty cell at position ${x + 1}, ${y + 1}`

  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={cellLabel}
      className="cursor-crosshair transition-all hover:scale-110 hover:z-10 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#3E2A1E] focus:ring-offset-1"
      style={{
        width: `${effectiveSize}px`,
        height: `${effectiveSize}px`,
        backgroundColor: isHollow ? 'transparent' : (color?.hex || 'transparent'),
        borderColor: isHollow ? (color?.hex || 'transparent') : 'transparent',
        borderWidth: isHollow ? `${Math.max(2, effectiveSize * 0.25)}px` : '0px',
        borderStyle: isHollow ? 'solid' : 'none',
        borderRadius: isRound ? '50%' : '0%',
        color: getContrastTextColor(color?.hex),
        fontSize: `${fontSize}px`,
        fontWeight: 800,
        lineHeight: 1,
        textShadow: color?.hex ? '0 1px 1px rgba(0,0,0,0.35)' : 'none',
        userSelect: 'none'
      }}
      onClick={() => onCellClick(x, y)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onCellClick(x, y)
        }
      }}
      title={color ? `${color.name}${color.code ? ` (${color.code})` : ''}` : 'Empty'}
    >
      {displayContent}
    </div>
  )
})
BeadCell.displayName = 'BeadCell'

function BeadGridComponent({
  matrix,
  gridWidth,
  cellSize,
  showGrid,
  showBeadCodes,
  colorById,
  onCellClick,
  zoom = 1,
  beadStyle = 'square',
  gridSpacing = 'small'
}: BeadGridProps) {
  const effectiveSize = cellSize * zoom

  const gapSize = gridSpacing === 'none' ? '0px' : gridSpacing === 'small' ? '1px' : '3px'
  const isRound = beadStyle === 'round' || beadStyle === 'hollow'
  const isHollow = beadStyle === 'hollow'

  return (
    <div
      className="grid"
      role="grid"
      aria-label="Bead pattern grid"
      style={{
        gridTemplateColumns: `repeat(${gridWidth}, ${effectiveSize}px)`,
        gridAutoRows: `${effectiveSize}px`,
        gap: gapSize,
        backgroundColor: showGrid && gridSpacing !== 'none' ? '#D8CBB9' : 'transparent',
        padding: showGrid && gridSpacing !== 'none' ? '1px' : '0px'
      }}
    >
      {matrix.map((row, y) =>
        row.map((cellId, x) => (
          <BeadCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            colorId={cellId}
            color={colorById.get(cellId)}
            effectiveSize={effectiveSize}
            isHollow={isHollow}
            isRound={isRound}
            showBeadCodes={showBeadCodes}
            onCellClick={onCellClick}
          />
        ))
      )}
    </div>
  )
}

export const BeadGrid = memo(BeadGridComponent)

