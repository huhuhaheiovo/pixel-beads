import { Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface UploadAreaProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadArea({ onUpload }: UploadAreaProps) {
  const t = useTranslations('Generator')

  return (
    <div className='flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm border border-white shadow-2xl rounded-[32px] text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 ease-out max-w-lg mx-auto'>
      <div className='relative group'>
        <div className='absolute -inset-4 bg-[#18181B]/5 rounded-full blur-xl group-hover:bg-[#18181B]/10 transition-all duration-500' />
        <div className='relative inline-flex p-10 bg-white border border-[#F4F4F5] rounded-full shadow-lg mb-8 transition-transform duration-500 group-hover:scale-110'>
          <Upload size={48} className='text-[#18181B]' />
        </div>
      </div>

      <h1 className='text-3xl font-black text-[#18181B] mb-4 tracking-tighter uppercase'>{t('title')}</h1>
      <p className='text-[#71717A] text-base leading-relaxed mb-10 max-w-[320px] font-medium'>
        {t('description')}
      </p>

      <div className='relative'>
        <label
          htmlFor='upload'
          className='inline-flex items-center gap-3 px-10 py-5 bg-[#18181B] text-white text-[12px] font-black uppercase tracking-[0.2em] cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl'
        >
          <Upload size={16} />
          {t('getStarted')}
        </label>
      </div>

      <input
        type='file'
        id='upload'
        hidden
        onChange={onUpload}
        accept='image/*'
      />

      <div className='mt-12 flex items-center gap-6 opacity-30'>
        <div className='text-[10px] font-black uppercase tracking-widest'>JPG</div>
        <div className='w-1 h-1 bg-black rounded-full' />
        <div className='text-[10px] font-black uppercase tracking-widest'>PNG</div>
        <div className='w-1 h-1 bg-black rounded-full' />
        <div className='text-[10px] font-black uppercase tracking-widest'>WEBP</div>
      </div>
    </div>
  )
}
