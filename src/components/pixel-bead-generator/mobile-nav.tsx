import { Settings, Palette, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MobileNavProps {
    activeTab: 'settings' | 'palette' | 'export' | null
    onTabChange: (tab: 'settings' | 'palette' | 'export' | null) => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
    const t = useTranslations('Generator')

    const tabs = [
        { id: 'settings', label: t('settings'), icon: Settings },
        { id: 'palette', label: t('palette'), icon: Palette },
        { id: 'export', label: t('export'), icon: Download },
    ] as const

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#D8CBB9] pb-safe z-40">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(isActive ? null : tab.id)}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive ? 'text-[#3E2A1E]' : 'text-[#8F7E6F] hover:text-[#5A4738]'
                                }`}
                        >
                            <tab.icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
