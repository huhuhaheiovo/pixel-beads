'use client'

import React from 'react'
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
        <header className='sticky top-0 z-50 w-full border-b border-[#E4E4E7] bg-white/80 backdrop-blur-md'>
            <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
                <Link href='/' className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-[#18181B] rounded flex items-center justify-center'>
                        <div className='w-4 h-4 bg-white rounded-full grid grid-cols-2 gap-0.5 p-0.5'>
                            <div className='bg-red-400 rounded-full' />
                            <div className='bg-blue-400 rounded-full' />
                            <div className='bg-yellow-400 rounded-full' />
                            <div className='bg-green-400 rounded-full' />
                        </div>
                    </div>
                    <span className='font-black text-sm uppercase tracking-tighter'>PixelBeads</span>
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
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${pathname === '/' ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
                                                {t('home')}
                                            </span>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-[10px] font-bold uppercase tracking-widest text-[#71717A]'>
                                        {t('tools')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white'>
                                            <ListItem href='/pixel-art-maker' title={t('pixelArtMaker')}>
                                                {t('pixelArtMakerDesc')}
                                            </ListItem>
                                            <ListItem href='/image-to-pixel' title={t('imageToPixel')}>
                                                {t('imageToPixelDesc')}
                                            </ListItem>
                                            <ListItem href='/minecraft-pixel-art' title={t('minecraftGuide')}>
                                                {t('minecraftGuideDesc')}
                                            </ListItem>
                                            <ListItem href='/perler-bead-pattern-generator' title={t('fusePatternTool')}>
                                                {t('fusePatternToolDesc')}
                                            </ListItem>
                                            <ListItem href='/wplace' title={t('rplaceTool')}>
                                                {t('rplaceToolDesc')}
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className='text-[10px] font-bold uppercase tracking-widest text-[#71717A]'>
                                        {t('guides')}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white'>
                                            <ListItem href='/fuse-beads' title={t('fuseBeadsGuide')}>
                                                {t('fuseBeadsGuideDesc')}
                                            </ListItem>
                                            <ListItem href='/hama-beads' title={t('hamaBeads')}>
                                                {t('hamaBeadsDesc')}
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href='/showcase'
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${pathname.startsWith('/showcase') ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
                                                {t('showcase')}
                                            </span>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href='/patterns'
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${pathname.startsWith('/patterns') ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
                                                {t('patterns')}
                                            </span>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <Link
                            href='/perler-bead-pattern-generator'
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isGenerator ? 'bg-[#18181B] text-white' : 'border border-[#E4E4E7] text-[#18181B] hover:border-[#18181B]'}`}
                        >
                            <Hammer size={12} />
                            <span className='hidden sm:inline'>{t('generator')}</span>
                        </Link>

                        <div className='flex items-center border border-[#E4E4E7] rounded-full px-2 py-1 gap-1 bg-[#FAFAFA]'>
                            <Globe size={10} className='text-[#A1A1AA] ml-1' />
                            <Link
                                href={pathname}
                                locale='en'
                                className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'en' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-white'}`}
                            >
                                EN
                            </Link>
                            <Link
                                href={pathname}
                                locale='zh'
                                className={`px-2 py-1 text-[8px] font-black uppercase rounded-full transition-all ${locale === 'zh' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#71717A] hover:bg-white'}`}
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
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:bg-slate-100',
                        className
                    )}
                    {...props}
                >
                    <div className='text-sm font-bold leading-none text-[#18181B]'>{title}</div>
                    <p className='line-clamp-2 text-xs leading-snug text-muted-foreground text-[#71717A] mt-1 font-medium'>
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = 'ListItem'
