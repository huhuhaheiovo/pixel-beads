export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-yellow-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-yellow-400 rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-[#18181B] animate-pulse">
                Loading...
            </p>
        </div>
    )
}
