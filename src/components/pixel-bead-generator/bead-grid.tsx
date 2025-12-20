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
          const MIN_SIZE_FOR_TEXT = 8 // px - match minimum cell size in settings
          
          let displayContent: string | null = null
          if (showBeadCodes && color) {
            if (cellSize >= MIN_SIZE_FOR_TEXT && codeText) {
              // Large enough for text
              displayContent = codeText
            }
          }
          
          // Calculate font size based on cell size
          // For small cells (8-12px): use smaller font, for larger cells: scale proportionally
          const fontSize = displayContent
            ? cellSize < 12
              ? Math.max(6, Math.floor(cellSize * 0.5)) // Smaller font for very small cells
              : Math.max(8, Math.floor(cellSize * 0.45)) // Normal scaling for larger cells
            : 0
          
          return (
            <div
              key={`${x}-${y}`}
              className="cursor-crosshair transition-all hover:scale-110 hover:z-10 flex items-center justify-center overflow-hidden"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: color?.hex || 'transparent',
                color: getContrastTextColor(color?.hex),
                fontSize: `${fontSize}px`,
                fontWeight: 800,
                lineHeight: 1,
                textShadow: color?.hex ? '0 1px 1px rgba(0,0,0,0.35)' : 'none',
                userSelect: 'none'
              }}
              onClick={() => onCellClick(x, y)}
              title={color ? `${color.name} (${color.code})` : 'Empty'}
            >
              {displayContent}
            </div>
          )
        })
      )}
    </div>
  )
}

