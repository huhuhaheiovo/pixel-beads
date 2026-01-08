'use client'

import React from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { Hammer, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { MobileNav } from '@/components/MobileNav'

export function Header() {
    const t = useTranslations('Header')
    const pathname = usePathname()
    const locale = useLocale()
    const isGenerator = pathname === '/perler-bead-pattern-generator'

    return (
        <header className='sticky top-0 z-50 w-full bg-[#3E2A1E]/95 backdrop-blur-md border-b border-[#543A2A] shadow-lg'>
            <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
                <Link href='/' className='flex items-center gap-2'>
                    <Image
                        src='/web-app-manifest-192x192.png'
                        alt='拼豆艺术'
                        width={32}
                        height={32}
                        className='w-8 h-8 rounded'
                    />
                    <span className='font-black text-sm uppercase tracking-tighter text-[#F7F1E1]'>拼豆艺术</span>
                </Link>

                <div className='flex items-center gap-4'>
                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-4'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href='/'
                                            className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-50 ${pathname === '/' ? 'text-[#32B8A6] bg-white/5' : 'text-[#F7F1E1] hover:text-[#32B8A6] hover:bg-white/5 bg-transparent'}`}
                                        >
                                            {t('home')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href='/perler-bead-pattern-generator'
                                            className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-50 ${pathname === '/perler-bead-pattern-generator' ? 'text-[#32B8A6] bg-white/5' : 'text-[#F7F1E1] hover:text-[#32B8A6] hover:bg-white/5 bg-transparent'}`}
                                        >
                                            {t('generator')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href='/showcase'
                                            className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-50 ${pathname.startsWith('/showcase') ? 'text-[#32B8A6] bg-white/5' : 'text-[#F7F1E1] hover:text-[#32B8A6] hover:bg-white/5 bg-transparent'}`}
                                        >
                                            {t('showcase')}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenu>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href='/patterns'
                                                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:pointer-events-none disabled:opacity-50 ${pathname.startsWith('/patterns') ? 'text-[#32B8A6] bg-white/5' : 'text-[#F7F1E1] hover:text-[#32B8A6] hover:bg-white/5 bg-transparent'}`}
                                                >
                                                    {t('patterns')}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1] hover:text-[#32B8A6] data-[state=open]:text-[#32B8A6] bg-transparent hover:bg-white/5 focus:bg-white/5 data-[state=open]:bg-white/5'>
                                        {t('tools')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#3E2A1E] border border-[#543A2A]'>
                                            <ListItem href='/perler-bead-pattern-generator' title={t('fusePatternTool')}>
                                                {t('fusePatternToolDesc')}
                                            </ListItem>
                                            <ListItem href='/pixel-art-maker' title={t('pixelArtMaker')}>
                                                {t('pixelArtMakerDesc')}
                                            </ListItem>
                                            <ListItem href='/image-to-pixel' title={t('imageToPixel')}>
                                                {t('imageToPixelDesc')}
                                            </ListItem>
                                            <ListItem href='/minecraft-pixel-art' title={t('minecraftGuide')}>
                                                {t('minecraftGuideDesc')}
                                            </ListItem>
                                            <ListItem href='/wplace' title={t('rplaceTool')}>
                                                {t('rplaceToolDesc')}
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-[10px] font-bold uppercase tracking-widest text-[#F7F1E1] hover:text-[#32B8A6] data-[state=open]:text-[#32B8A6] bg-transparent hover:bg-white/5 focus:bg-white/5 data-[state=open]:bg-white/5'>
                                        {t('guides')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-[#3E2A1E] border border-[#543A2A]'>
                                            <ListItem href='/fuse-beads' title={t('fuseBeadsGuide')}>
                                                {t('fuseBeadsGuideDesc')}
                                            </ListItem>
                                            <ListItem href='/hama-beads' title={t('hamaBeads')}>
                                                {t('hamaBeadsDesc')}
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>


                            </NavigationMenuList>
                        </NavigationMenu>



                        <Link
                            href='/perler-bead-pattern-generator'
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isGenerator ? 'bg-[#32B8A6] text-[#3E2A1E] shadow-lg hover:bg-[#2AA695]' : 'border border-[#F7F1E1]/30 text-[#F7F1E1] hover:border-[#32B8A6] hover:text-[#32B8A6] bg-transparent'}`}
                        >
                            <Hammer size={12} />
                            <span className='hidden sm:inline'>{t('generator')}</span>
                        </Link>

                        <div className='flex items-center border border-[#F7F1E1]/20 rounded-full px-2 py-1 gap-1 bg-white/5'>
                            <Globe size={10} className='text-[#F7F1E1]/70 ml-1' />
                            <Link
                                href={pathname}
                                locale='en'
                                className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'en' ? 'bg-[#32B8A6] text-[#3E2A1E] shadow-sm' : 'text-[#F7F1E1]/70 hover:bg-white/10 hover:text-[#F7F1E1]'}`}
                            >
                                EN
                            </Link>
                            <Link
                                href={pathname}
                                locale='zh'
                                className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'zh' ? 'bg-[#32B8A6] text-[#3E2A1E] shadow-sm' : 'text-[#F7F1E1]/70 hover:bg-white/10 hover:text-[#F7F1E1]'}`}
                            >
                                ZH
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href as string}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 group',
                        className
                    )}
                    {...props}
                >
                    <div className='text-sm font-bold leading-none text-[#F7F1E1] group-hover:text-[#32B8A6]'>{title}</div>
                    <p className='line-clamp-2 text-xs leading-snug text-[#F7F1E1]/70 mt-1 font-medium group-hover:text-[#F7F1E1]/90'>
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = 'ListItem'
