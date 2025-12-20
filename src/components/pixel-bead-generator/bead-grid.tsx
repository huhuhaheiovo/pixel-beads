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
}

export function BeadGrid ({
  matrix,
  gridWidth,
  cellSize,
  showGrid,
  showBeadCodes,
  colorById,
  onCellClick
}: BeadGridProps) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap: showGrid ? '1px' : '0px',
        backgroundColor: showGrid ? '#E4E4E7' : 'transparent',
        padding: showGrid ? '1px' : '0px'
      }}
    >
      {matrix.map((row, y) =>
        row.map((cellId, x) => {
          const color = colorById.get(cellId)
          const codeText = color?.code ?? ''
          const shouldShowText = showBeadCodes && !!codeText && cellSize >= 14
          return (
            <div
              key={`${x}-${y}`}
              className="cursor-crosshair transition-all hover:scale-110 hover:z-10 flex items-center justify-center overflow-hidden"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: color?.hex || 'transparent',
                color: getContrastTextColor(color?.hex),
                fontSize: `${Math.max(8, Math.floor(cellSize * 0.45))}px`,
                fontWeight: 800,
                lineHeight: 1,
                textShadow: color?.hex ? '0 1px 1px rgba(0,0,0,0.35)' : 'none',
                userSelect: 'none'
              }}
              onClick={() => onCellClick(x, y)}
              title={color ? `${color.name} (${color.code})` : 'Empty'}
            >
              {shouldShowText ? codeText : null}
            </div>
          )
        })
      )}
    </div>
  )
}

