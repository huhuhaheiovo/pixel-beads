'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { ArrowRight, Loader2 } from 'lucide-react'

interface StartButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'dark'
  showIcon?: boolean
}

export function StartButton({ 
  href, 
  children, 
  className = '', 
  variant = 'primary',
  showIcon = true 
}: StartButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 当组件卸载时，清除 loading 状态
  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // 使用 setTimeout 确保 loading 状态可见
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  const baseStyles = {
    primary: 'group w-full sm:w-auto px-12 py-6 bg-[#EF4444] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 shadow-[0_10px_20px_-10px_rgba(239,68,68,0.5)] flex items-center justify-center gap-3',
    secondary: 'group inline-flex px-10 py-5 bg-white border-4 border-[#18181B] text-[#18181B] rounded-2xl font-black uppercase tracking-widest hover:bg-[#18181B] hover:text-white transition-all shadow-[8px_8px_0px_#EF4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-3',
    dark: 'group inline-flex px-16 py-8 bg-white text-[#18181B] rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-yellow-400 transition-all transform hover:scale-110 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3'
  }

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={`${baseStyles[variant]} ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {children} 
            {showIcon && <ArrowRight size={22} className='group-hover:translate-x-1 transition-transform' />}
          </>
        )}
      </a>
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 transition-opacity">
          <div className="flex flex-col items-center gap-6 w-72 p-8 bg-white shadow-2xl rounded-2xl border border-[#D8CBB9]">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-[#F7F1E1] rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#3E2A1E] rounded-full animate-spin" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1E]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  )
}
