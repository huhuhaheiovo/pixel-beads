import { Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface UploadAreaProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadArea({ onUpload }: UploadAreaProps) {
  const t = useTranslations('Generator')

  return (
    <div className="text-center animate-in fade-in zoom-in duration-500">
      <div className="inline-flex p-8 bg-white border border-[#E4E4E7] mb-6">
        <Upload size={48} className="text-[#E4E4E7]" />
      </div>
      <h1 className="text-xl font-bold mb-2">{t('title')}</h1>
      <p className="text-[#71717A] text-sm max-w-xs mx-auto">{t('description')}</p>
      <label
        htmlFor="upload"
        className="inline-block mt-8 px-8 py-4 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all"
      >
        {t('getStarted')}
      </label>
      <input
        type="file"
        id="upload"
        hidden
        onChange={onUpload}
        accept="image/*"
      />
    </div>
  )
}
