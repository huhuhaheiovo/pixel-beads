import { useState, useCallback } from 'react'

const MAX_HISTORY = 50

export function useHistory () {
  const [history, setHistory] = useState<string[][][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const addToHistory = useCallback((newMatrix: string[][]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newMatrix)
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setHistoryIndex(prev => {
      const newLength = prev + 2
      if (newLength > MAX_HISTORY) {
        return MAX_HISTORY - 1
      }
      return newLength - 1
    })
  }, [historyIndex])

  const undo = useCallback(() => {
    setHistoryIndex(prev => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
  }, [])

  const redo = useCallback(() => {
    setHistoryIndex(prev => {
      if (prev < history.length - 1) {
        return prev + 1
      }
      return prev
    })
  }, [history.length])

  const resetHistory = useCallback((initialMatrix: string[][]) => {
    setHistory([initialMatrix])
    setHistoryIndex(0)
  }, [])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const currentMatrix = history[historyIndex] ?? []

  return {
    history,
    historyIndex,
    currentMatrix,
    addToHistory,
    undo,
    redo,
    resetHistory,
    canUndo,
    canRedo
  }
}

