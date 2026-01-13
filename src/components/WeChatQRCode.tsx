'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export function WeChatQRCode() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="h-24 w-24 rounded cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="微信赞赏"
        >
          <img
            src="/WeChat.webp"
            alt="微信赞赏"
            className="h-24 w-24 rounded"
            loading="lazy"
            decoding="async"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogTitle className="sr-only">微信赞赏二维码</DialogTitle>
        <div className="flex flex-col items-center py-4">
          <img
            src="/WeChat.webp"
            alt="微信赞赏二维码"
            width={300}
            height={300}
            className="w-[300px] h-[300px] object-contain"
            loading="lazy"
            decoding="async"
          />
          <p className="text-sm text-center text-zinc-600 mt-4 font-medium">微信赞赏</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
