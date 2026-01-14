import { Upload, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface UploadAreaProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isProcessing?: boolean
}

export function UploadArea({ onUpload, isProcessing = false }: UploadAreaProps) {
  const t = useTranslations('Generator')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true)
    }
    onUpload(e)
  }

  // Reset uploading state when processing completes
  useEffect(() => {
    if (!isProcessing) {
      // Processing completed, reset uploading state
      setIsUploading(false)
    }
  }, [isProcessing])

  const isLoading = isUploading || isProcessing

  return (
    <div className='flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm border border-white shadow-2xl rounded-[32px] text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 ease-out max-w-lg mx-auto'>
      <div className='relative group'>
        <div className='absolute -inset-4 bg-[#3E2A1E]/5 rounded-full blur-xl group-hover:bg-[#3E2A1E]/10 transition-all duration-500' />
        <div className='relative inline-flex p-10 bg-white border border-[#D8CBB9] rounded-full shadow-lg mb-8 transition-transform duration-500 group-hover:scale-110'>
          <Upload size={48} className='text-[#3E2A1E]' />
        </div>
      </div>

      <h1 className='text-3xl font-black text-[#3E2A1E] mb-4 tracking-tighter uppercase'>{t('title')}</h1>
      <p className='text-[#5A4738] text-base leading-relaxed mb-10 max-w-[320px] font-medium'>
        {t('description')}
      </p>

      <div className='relative'>
        <label
          htmlFor='upload'
          className={`relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 bg-[#32B8A6] text-white text-[12px] font-black uppercase tracking-[0.2em] cursor-pointer shadow-[0_20px_40px_rgba(50,184,166,0.3)] hover:shadow-[0_25px_50px_rgba(50,184,166,0.4)] transform transition-all duration-500 rounded-2xl ${
            isLoading 
              ? 'opacity-75 cursor-wait scale-95' 
              : 'hover:scale-110 hover:rotate-3 hover:skew-x-12 active:scale-95'
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Upload size={16} />
                {t('getStarted')}
              </>
            )}
          </span>
        </label>
      </div>

      <input
        type='file'
        id='upload'
        hidden
        onChange={handleFileChange}
        accept='image/*'
        disabled={isLoading}
      />

      <div className='mt-12 flex items-center gap-6 opacity-30 text-[#3E2A1E]'>
        <div className='text-[10px] font-black uppercase tracking-widest'>JPG</div>
        <div className='w-1 h-1 bg-[#3E2A1E] rounded-full' />
        <div className='text-[10px] font-black uppercase tracking-widest'>PNG</div>
        <div className='w-1 h-1 bg-[#3E2A1E] rounded-full' />
        <div className='text-[10px] font-black uppercase tracking-widest'>WEBP</div>
      </div>
    </div>
  )
}
