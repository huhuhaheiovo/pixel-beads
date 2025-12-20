import { Upload } from 'lucide-react'

interface UploadAreaProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadArea ({ onUpload }: UploadAreaProps) {
  return (
    <div className="text-center animate-in fade-in zoom-in duration-500">
      <div className="inline-flex p-8 bg-white border border-[#E4E4E7] mb-6">
        <Upload size={48} className="text-[#E4E4E7]" />
      </div>
      <h1 className="text-xl font-bold mb-2">Pixel Bead Generator</h1>
      <p className="text-[#71717A] text-sm max-w-xs mx-auto">Upload an image to transform it into a professional bead pattern.</p>
      <label
        htmlFor="upload"
        className="inline-block mt-8 px-8 py-4 bg-[#18181B] text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all"
      >
        Get Started
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

