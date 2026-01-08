'use client'

import { useState } from 'react'
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
}

export function ExportDialog({
  open,
  onOpenChange,
  onSkip,
  onSaveAndExport,
  exportType
}: ExportDialogProps) {
  const t = useTranslations('Generator.exportDialog')
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [message, setMessage] = useState('')
  const [showNameError, setShowNameError] = useState(false)

  const handleSaveAndExport = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setShowNameError(true)
      return // 名称不能为空，不执行保存
    }
    setShowNameError(false)
    onSaveAndExport({
      name: trimmedName,
      author: author.trim() || undefined,
      public: isPublic,
      message: message.trim() || undefined
    })
    // Reset form
    setName('')
    setAuthor('')
    setIsPublic(true)
    setMessage('')
    setShowNameError(false)
  }

  const handleSkip = () => {
    onSkip()
    // Reset form
    setName('')
    setAuthor('')
    setIsPublic(true)
    setMessage('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {exportType === 'pdf' ? t('descriptionPdf') : t('descriptionImage')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="pattern-name">
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
              className={showNameError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {showNameError && (
              <p className="text-sm text-red-500 mt-1">
                {t('nameRequired')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-name">{t('authorName')}</Label>
            <Input
              id="author-name"
              placeholder={t('authorNamePlaceholder')}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
            />
            <Label
              htmlFor="is-public"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('isPublic')}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('message')}</Label>
            <Input
              id="message"
              placeholder={t('messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t('skipAndDownload')}
          </Button>
          <Button
              onClick={handleSaveAndExport}
              className="w-full sm:w-auto order-1 sm:order-2
             bg-[#18181B] hover:bg-black
             text-white hover:text-white"
          >
            {t('saveAndDownload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

