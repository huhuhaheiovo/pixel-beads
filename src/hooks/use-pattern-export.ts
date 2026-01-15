'use client'

import { useCallback, useState } from 'react'
import { jsPDF } from 'jspdf'
import { toPng } from 'html-to-image'
import { getContrastTextColor } from '@/utils/color-utils'

export type BeadStyle = 'square' | 'round' | 'hollow'
export type GridSpacing = 'none' | 'small' | 'large'
export type CellSizeUnit = 'px' | '5mm' | '2.6mm'

export interface ExportColor {
    id: string
    code?: string | null
    name: string
    hex: string
}

export interface ExportStat extends ExportColor {
    count: number
}

interface UsePatternExportOptions {
    matrix: string[][]
    gridWidth: number
    selectedPalette: string
    colorById: Map<string, ExportColor> | Record<string, ExportColor>
    beadStats: ExportStat[]
    totalBeads: number
    beadStyle: BeadStyle
    gridSpacing: GridSpacing
    cellSizeUnit: CellSizeUnit
    cellSize: number
    exportRef: React.RefObject<HTMLDivElement | null>
    translations: {
        patternTitle: string
        generatedFor: string
        gridSize: string
        colorShoppingList: string
        beadsCount: string
        total: string
        savingPattern?: string
        generatingImage?: string
        downloading?: string
        statsTitle: string
    }
}

// 转换函数：用于导出（300 DPI）
const EXPORT_DPI = 300
const MM_TO_INCH = 25.4

function mmToPxForExport(mm: number): number {
    return (mm * EXPORT_DPI) / MM_TO_INCH
}

export function usePatternExport({
    matrix,
    gridWidth,
    selectedPalette,
    colorById,
    beadStats,
    totalBeads,
    beadStyle,
    gridSpacing,
    cellSizeUnit,
    cellSize,
    exportRef,
    translations
}: UsePatternExportOptions) {
    const [isExportingImage, setIsExportingImage] = useState(false)
    const [isExportingPDF, setIsExportingPDF] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)

    const getColor = (id: string): ExportColor | undefined => {
        if (colorById instanceof Map) {
            return colorById.get(id)
        }
        return colorById[id]
    }

    const exportToPDF = useCallback(async () => {
        if (!matrix.length) return
        setIsExportingPDF(true)

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 20
            const headerHeight = 35
            const availableWidth = pageWidth - margin * 2
            const availableHeight = pageHeight - headerHeight - margin

            // 根据单位计算 PDF 中的单元格大小（mm）
            let pdfCellSize: number
            if (cellSizeUnit === '5mm') {
                // 5mm 拼豆，PDF中直接使用5mm
                pdfCellSize = 5
            } else if (cellSizeUnit === '2.6mm') {
                // 2.6mm 拼豆，PDF中直接使用2.6mm
                pdfCellSize = 2.6
            } else {
                // px 单位，使用原有逻辑
                const baseCellSize = cellSize || 18
                pdfCellSize = baseCellSize * 0.264583
            }

            // 计算间距（mm）
            const gapSize = gridSpacing === 'none' ? 0 : gridSpacing === 'small' ? 0.264583 : 0.79375
            const cellSizeWithGap = pdfCellSize + gapSize

            const colsPerPage = Math.max(1, Math.floor(availableWidth / cellSizeWithGap))
            const rowsPerPage = Math.max(1, Math.floor(availableHeight / cellSizeWithGap))
            const colChunks = Math.max(1, Math.ceil(gridWidth / colsPerPage))
            const rowChunks = Math.max(1, Math.ceil(matrix.length / rowsPerPage))
            const totalMainPages = colChunks * rowChunks

            const counts: Record<string, number> = {}
            matrix.flat().forEach(id => {
                if (id) counts[id] = (counts[id] || 0) + 1
            })

            const statsStartY = 35
            const statsLineHeight = 14
            const statsAvailableHeight = pageHeight - statsStartY - margin
            const statsItemsPerPage = Math.max(1, Math.floor(statsAvailableHeight / statsLineHeight))
            const statsEntries = Object.keys(counts).length
            const statsPages = Math.max(1, Math.ceil(statsEntries / statsItemsPerPage))

            const totalPages = totalMainPages + statsPages
            let currentPage = 1

            const drawPageNumber = () => {
                doc.setFontSize(9)
                doc.setTextColor(80)
                doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - margin / 2, { align: 'right' })
            }

            const drawWatermark = () => {
                doc.setFontSize(8)
                doc.setTextColor(200, 200, 200)
                doc.text('https://www.pixel-beads.com/', margin, pageHeight - margin / 2, { align: 'left' })
            }

            const drawHeader = () => {
                doc.setFontSize(22)
                doc.setTextColor(0)
                doc.text(translations.patternTitle, margin, 20)
                doc.setFontSize(10)
                doc.setTextColor(100)
                doc.text(`${translations.generatedFor} ${selectedPalette} Beads | ${translations.gridSize}: ${gridWidth}x${matrix.length}`, margin, 26)
            }

            const MIN_CELL_SIZE_FOR_TEXT = 2

            for (let rowChunk = 0; rowChunk < rowChunks; rowChunk++) {
                for (let colChunk = 0; colChunk < colChunks; colChunk++) {
                    const rowStart = rowChunk * rowsPerPage
                    const colStart = colChunk * colsPerPage
                    const rowEnd = Math.min(rowStart + rowsPerPage, matrix.length)
                    const colEnd = Math.min(colStart + colsPerPage, gridWidth)

                    drawHeader()

                    for (let y = rowStart; y < rowEnd; y++) {
                        const row = matrix[y]
                        for (let x = colStart; x < colEnd; x++) {
                            const cellId = row?.[x]
                            const color = getColor(cellId)
                            const cellX = margin + (x - colStart) * cellSizeWithGap
                            const cellY = headerHeight + (y - rowStart) * cellSizeWithGap

                            if (color) {
                                const centerX = cellX + pdfCellSize / 2
                                const centerY = cellY + pdfCellSize / 2
                                const radius = pdfCellSize / 2

                                if (beadStyle === 'square') {
                                    doc.setFillColor(color.hex)
                                    doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'F')
                                } else if (beadStyle === 'round') {
                                    doc.setFillColor(color.hex)
                                    doc.circle(centerX, centerY, radius, 'F')
                                } else if (beadStyle === 'hollow') {
                                    doc.setDrawColor(color.hex)
                                    doc.setLineWidth(pdfCellSize * 0.25)
                                    doc.circle(centerX, centerY, radius, 'S')
                                }

                                const textColor = getContrastTextColor(color.hex)
                                const isWhite = textColor === '#FFFFFF'
                                if (pdfCellSize >= MIN_CELL_SIZE_FOR_TEXT && color.code) {
                                    doc.setTextColor(isWhite ? 255 : 0)
                                    const fontSize = pdfCellSize < 3
                                        ? Math.max(4, pdfCellSize * 0.35) * 0.7
                                        : Math.max(6, pdfCellSize * 0.4) * 0.7
                                    doc.setFontSize(fontSize)
                                    const textX = cellX + pdfCellSize / 2
                                    const textY = cellY + pdfCellSize / 2
                                    doc.text(color.code, textX, textY, { align: 'center', baseline: 'middle' })
                                }
                            }
                            if (beadStyle === 'square') {
                                doc.setDrawColor(230)
                                doc.setLineWidth(0.1)
                                doc.rect(cellX, cellY, pdfCellSize, pdfCellSize, 'S')
                            }
                        }
                    }

                    drawPageNumber()
                    drawWatermark()
                    if (rowChunk !== rowChunks - 1 || colChunk !== colChunks - 1) {
                        doc.addPage()
                        currentPage += 1
                    }
                }
            }

            if (statsPages > 0) {
                doc.addPage()
                currentPage += 1
                doc.setTextColor(0)
                doc.setFontSize(18)
                doc.text(translations.colorShoppingList, margin, 20)

                let yPos = statsStartY
                beadStats.forEach((color, index) => {
                    if (index > 0 && yPos + statsLineHeight > pageHeight - margin) {
                        drawPageNumber()
                        drawWatermark()
                        doc.addPage()
                        currentPage += 1
                        doc.setTextColor(0)
                        doc.setFontSize(18)
                        doc.text(translations.colorShoppingList, margin, 20)
                        yPos = statsStartY
                    }

                    doc.setFillColor(color.hex)
                    doc.rect(margin, yPos, 10, 10, 'F')
                    doc.setDrawColor(200)
                    doc.rect(margin, yPos, 10, 10, 'S')

                    doc.setFontSize(10)
                    doc.setTextColor(0)
                    const textX = margin + 15
                    const codeText = color.code ? ` (${color.code})` : ''
                    doc.text(`${color.name}${codeText}`, textX, yPos + 3)

                    const hexText = `Hex: ${color.hex.toUpperCase()}`
                    doc.setFontSize(9)
                    doc.setTextColor(80)
                    doc.text(hexText, textX, yPos + 7)

                    doc.setFontSize(10)
                    doc.setTextColor(0)
                    doc.text(`${color.count} ${translations.beadsCount}`, pageWidth - margin - 20, yPos + 5, { align: 'right' })

                    yPos += statsLineHeight
                })
            }

            drawPageNumber()
            drawWatermark()
            doc.save(`pixel-bead-pattern-${Date.now()}.pdf`)
        } catch (error) {
            console.error('Failed to export PDF:', error)
        } finally {
            setIsExportingPDF(false)
        }
    }, [matrix, gridWidth, selectedPalette, colorById, beadStats, beadStyle, gridSpacing, cellSizeUnit, cellSize, translations])

    const exportToImage = useCallback(async (options?: { skipSaveProgress?: boolean }) => {
        // 详细的前置检查和日志
        if (!exportRef.current) {
            console.error('Export failed: exportRef.current is null')
            return
        }
        
        if (!matrix.length) {
            console.error('Export failed: matrix is empty')
            return
        }

        setIsExportingImage(true)
        if (!options?.skipSaveProgress) {
            setExportProgress(10)
        }

        const progressInterval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 95) return prev
                return prev + 5
            })
        }, 200)

        try {
            const dataUrl = await toPng(exportRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 3,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            })

            clearInterval(progressInterval)
            setExportProgress(100)

            await new Promise<void>(resolve => {
                setTimeout(() => {
                    try {
                        const link = document.createElement('a')
                        link.download = `pixel-bead-pattern-${Date.now()}.png`
                        link.href = dataUrl
                        link.style.display = 'none'
                        
                        document.body.appendChild(link)
                        link.click()
                        
                        setTimeout(() => {
                            if (document.body.contains(link)) {
                                document.body.removeChild(link)
                            }
                        }, 100)
                        
                        setIsExportingImage(false)
                        setExportProgress(0)
                        resolve()
                    } catch (downloadError) {
                        console.error('Failed to trigger download:', downloadError)
                        
                        try {
                            window.open(dataUrl, '_blank')
                        } catch (openError) {
                            console.error('Failed to open image in new window:', openError)
                        }
                        setIsExportingImage(false)
                        setExportProgress(0)
                        resolve()
                    }
                }, 300)
            })
        } catch (error) {
            console.error('Failed to export image:', error)
            clearInterval(progressInterval)
            setIsExportingImage(false)
            setExportProgress(0)
        }
    }, [matrix.length, exportRef])

    return {
        exportToPDF,
        exportToImage,
        isExportingImage,
        isExportingPDF,
        setIsExportingImage, // Keep returning these for manual control if needed in parent
        setExportProgress,
        exportProgress
    }
}
