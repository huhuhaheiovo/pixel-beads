'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'


interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSkip: () => void
  onSaveAndExport: (data: {
    name?: string
    author?: string
    public: boolean
    message?: string
  }) => void
  exportType: 'pdf' | 'image'
  loading?: boolean
}

export function ExportDialog({
  open,
  onOpenChange,
  onSkip,
  onSaveAndExport,
  exportType,
  loading = false
}: ExportDialogProps) {
  const t = useTranslations('Generator.exportDialog')
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [message, setMessage] = useState('')
  const [showNameError, setShowNameError] = useState(false)
  const [clickedAction, setClickedAction] = useState<'skip' | 'save' | null>(null)
// 添加一个独立的 loading 状态
  const [loadingImg, setLoadingImg] = useState(false)
  // Reset clickedAction when loading becomes false
  useEffect(() => {
    if (!loading) {
      setClickedAction(null)
    }
  }, [loading])

  const handleSaveAndExport = () => {
    if (loading) return
    const trimmedName = name.trim()
    if (!trimmedName) {
      setShowNameError(true)
      return // 名称不能为空，不执行保存
    }
    setShowNameError(false)
    setClickedAction('save')
    onSaveAndExport({
      name: trimmedName,
      author: author.trim() || undefined,
      public: isPublic,
      message: message.trim() || undefined
    })
  }

  const handleSkip = async () => {
    // if (loadingImg) return
    // setClickedAction('skip')
    // setLoadingImg(true)
    // // 让 UI 有时间更新显示 loading
    // await new Promise(resolve => setTimeout(resolve, 100))
    // try {
    //   onSkip() // 同步执行
    // } catch (error) {
    //   console.error('Skip failed:', error)
    // } finally {
    //   // 确保至少显示 300ms 的 loading 状态
    //   setTimeout(() => setLoadingImg(false), 300)
    // }
    if (loading) return
    setShowNameError(false)
    setClickedAction('save')
    onSaveAndExport({
      name: "",
      author: author.trim() || undefined,
      public: isPublic,
      message: message.trim() || undefined
    })

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#F7F1E1] border-[#D8CBB9] text-[#3E2A1E]">
        <DialogHeader>
          <DialogTitle className="text-[#3E2A1E]">{t('title')}</DialogTitle>
          <DialogDescription className="text-[#8F7E6F]">
            {exportType === 'pdf' ? t('descriptionPdf') : t('descriptionImage')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="pattern-name" className="text-[#5A4738]">
              {t('patternName')}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="pattern-name"
              placeholder={t('patternNamePlaceholder')}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (showNameError && e.target.value.trim()) {
                  setShowNameError(false)
                }
              }}
              required
              disabled={loading}
              className={`bg-white border-[#D8CBB9] text-[#3E2A1E] placeholder:text-[#8F7E6F] focus-visible:ring-[#32B8A6] ${showNameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {showNameError && (
              <p className="text-sm text-red-500 mt-1">
                {t('nameRequired')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-name" className="text-[#5A4738]">{t('authorName')}</Label>
            <Input
              id="author-name"
              placeholder={t('authorNamePlaceholder')}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={loading}
              className="bg-white border-[#D8CBB9] text-[#3E2A1E] placeholder:text-[#8F7E6F] focus-visible:ring-[#32B8A6]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
              disabled={loading}
              className="border-[#D8CBB9] data-[state=checked]:bg-[#32B8A6] data-[state=checked]:border-[#32B8A6] text-white"
            />
            <Label
              htmlFor="is-public"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#5A4738]"
            >
              {t('isPublic')}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#5A4738]">{t('message')}</Label>
            <Input
              id="message"
              placeholder={t('messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="bg-white border-[#D8CBB9] text-[#3E2A1E] placeholder:text-[#8F7E6F] focus-visible:ring-[#32B8A6]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1 border-[#D8CBB9] text-[#5A4738] hover:bg-[#F0EEE8] hover:text-[#3E2A1E]"
          >
            {loading && clickedAction === 'save' ? (
              <>
                <div className="w-4 h-4 border-2 border-[#5A4738] border-t-transparent animate-spin mr-2" />
                {t('processing') || 'Processing...'}
              </>
            ) : (
              t('skipAndDownload')
            )}
          </Button>
          <Button
            onClick={handleSaveAndExport}
            disabled={loading}
            className="w-full sm:w-auto order-1 sm:order-2
             bg-[#32B8A6] hover:bg-[#2AA38F]
             text-white hover:text-white"
          >
            {loading && clickedAction === 'save' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin mr-2" />
                {t('processing') || 'Saving...'}
              </>
            ) : (
              t('saveAndDownload')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

