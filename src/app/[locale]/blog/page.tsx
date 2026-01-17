import { getBlogPosts } from './utils';
import { Link } from '@/i18n/routing';
import BlogLayout from './BlogLayout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Search, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Header' });

    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en'
        ? '/blog'
        : `/${locale}/blog`

    return {
        title: `${t('blog')} - PixelBeads`,
        description: locale === 'zh'
            ? '探索拼豆艺术的世界，获取灵感、教程和最新动态。'
            : 'Explore the world of pixel beads art, get inspiration, tutorials, and latest updates.',
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
                en: '/blog',
                zh: '/zh/blog',
                ja: '/ja/blog',
                'x-default': `${baseUrl}/blog`
            }
        }
    };
}

export default async function BlogPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const posts = getBlogPosts(locale);
    const t = await getTranslations({ locale, namespace: 'Blog' });

    return (
        <BlogLayout>
            {/* Archive Header */}
            <div className='relative mb-24 text-center'>
                <div className='absolute -top-12 left-1/2 -translate-x-1/2 opacity-10'>
                    <Search size={120} className='text-[#18181B]' />
                </div>
                <div className='relative inline-block'>
                    <div className='absolute -inset-2 bg-[#EF4444] skew-x-[-2deg]' />
                    <h1 className='relative px-8 py-4 text-4xl md:text-6xl font-black uppercase tracking-tighter text-white'>
                        {t('title')}
                    </h1>
                </div>
                <p className='mt-8 text-xl text-[#71717A] max-w-2xl mx-auto font-medium leading-relaxed'>
                    {t('subtitle')}
                </p>
                <div className='mt-8 flex justify-center gap-4'>
                    <div className='h-1 w-12 bg-[#EF4444]' />
                    <div className='h-1 w-4 bg-[#18181B]' />
                    <div className='h-1 w-12 bg-[#EF4444]' />
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {posts.map((post, index) => {
                    const accents = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
                    const accentColor = accents[index % accents.length];

                    return (
                        <article key={post.slug} className="group relative">
                            {/* Decorative Tape */}
                            <div className='absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 backdrop-blur-sm -rotate-2 z-20 border border-black/5 shadow-sm' />

                            <Link href={`/blog/${post.slug}`} className="block relative h-full">
                                <div className="h-full bg-white border-[3px] border-[#18181B] p-8 transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_#18181B]">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                                            <time dateTime={post.date}>{post.date}</time>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                                            <span>{post.author}</span>
                                        </div>

                                        <h2 className="text-2xl font-black uppercase tracking-tight text-[#18181B] mb-4 leading-tight group-hover:text-[#EF4444] transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-[#52525B] leading-relaxed mb-8 flex-grow line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-dashed border-[#E4E4E7]">
                                            <div className="text-xs font-black uppercase tracking-widest text-[#18181B] flex items-center gap-2">
                                                {t('readMore')}
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex gap-2">
                                                    {post.tags.slice(0, 1).map(tag => (
                                                        <span key={tag} className="text-[10px] font-bold text-[#A1A1AA]">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    );
                })}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-24 bg-white/40 border-4 border-dashed border-[#D4D4D8] pixel-notched">
                    <p className="text-[#A1A1AA] font-black uppercase tracking-[0.3em] text-sm">
                        {t('noPosts')}
                    </p>
                </div>
            )}
        </BlogLayout>
    );
}
