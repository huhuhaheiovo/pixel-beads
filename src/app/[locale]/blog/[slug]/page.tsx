import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBlogPost, getBlogPosts } from '../utils';
import BlogLayout from '../BlogLayout';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const post = getBlogPost(locale, slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const baseUrl = 'https://www.pixel-beads.com'
    const canonicalPath = locale === 'en'
        ? `/blog/${slug}`
        : `/${locale}/blog/${slug}`

    return {
        title: `${post.title} - PixelBeads Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            url: `${baseUrl}${canonicalPath}`
        },
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
                en: `/blog/${slug}`,
                zh: `/zh/blog/${slug}`,
                ja: `/ja/blog/${slug}`,
                'x-default': `${baseUrl}/blog/${slug}`
            }
        }
    };
}

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
    // This is tricky because generateStaticParams usually runs at build time where params might not be fully available for all locales
    // But for [locale], we usually know the locales.
    // However, since we are inside [locale], we might only need to return slugs.
    // Let's list all posts for all supported locales? 
    // Actually, Next.js generates static params for the current segment.
    // Since [locale] is a parent dynamic segment, we should arguably check all locales?
    // But typically generateStaticParams is used to populate [slug].
    // We can just iterate over our known locales 'en' and 'zh'.

    // For simplicity right now, let's not implement generating static params rigorously if not strictly required, 
    // or just fetch for 'en' and 'zh'.
    const locales = ['en', 'zh'];
    let paramsList: { locale: string; slug: string }[] = [];

    for (const locale of locales) {
        const posts = getBlogPosts(locale);
        for (const post of posts) {
            paramsList.push({ locale, slug: post.slug });
        }
    }

    // Since we are inside [locale] layout, normally we just return { slug: ... }.
    // But if we want to generate all paths at build time for [locale] + [slug], 
    // we need to return the combination if [locale] is also dynamic.
    // Let's just return slugs for the *current* locale context if possible? 
    // No, strictly generateStaticParams replaces getStaticPaths.

    return paramsList.map(({ slug }) => ({ slug }));
}


export default async function BlogPostPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const post = getBlogPost(locale, slug);

    if (!post) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'Blog' });

    let MDXContent;
    try {
        MDXContent = (await import(`../content/${locale}/${slug}.mdx`)).default;
    } catch (error) {
        console.error('Error loading MDX content:', error);
        notFound();
    }

    return (
        <BlogLayout>
            {/* Post Header */}
            <div className="mb-20">
                <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#EF4444] hover:text-[#18181B] transition-colors mb-8 group">
                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    {t('readMore').includes('阅读') ? '返回创作周报' : 'Back to Gazette'}
                </Link>

                <div className="relative inline-block mb-10">
                    <div className="absolute -inset-1 bg-[#18181B] skew-x-[-1deg]" />
                    <h1 className="relative px-6 py-3 text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                        {post.title}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#71717A]">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 border-2 border-[#18181B]">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        {post.date}
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 border-2 border-[#18181B]">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                        {post.author}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-[#18181B] text-white px-3 py-1.5 border-2 border-[#18181B]">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {/* Decorative Side Marker */}
                <div className="absolute -left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-[#EF4444] via-[#10B981] to-[#3B82F6] hidden lg:block opacity-20" />

                <div className="bg-white border-[3px] border-[#18181B] p-8 md:p-16 shadow-[12px_12px_0px_#18181B]/5 relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-[#EF4444]/10 rotate-45 translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <div className="prose prose-zinc max-w-none 
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-[#18181B]
                        prose-p:text-[#3F3F46] prose-p:text-lg prose-p:leading-relaxed
                        prose-a:text-[#EF4444] prose-a:no-underline prose-a:font-black hover:prose-a:underline
                        prose-strong:text-[#18181B] prose-strong:font-black
                        prose-img:border-[3px] prose-img:border-[#18181B] prose-img:pixel-shadow
                        prose-code:text-[#18181B] prose-code:bg-[#F4F4F5] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-none prose-code:border prose-code:border-[#E4E4E7]
                        prose-code:before:content-none prose-code:after:content-none
                        prose-blockquote:border-l-4 prose-blockquote:border-[#EF4444] prose-blockquote:bg-[#FEF2F2] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic">
                        <MDXContent />
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-20 flex justify-center">
                <Link href="/blog" className="group relative inline-block">
                    <div className="absolute inset-0 bg-[#18181B] translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                    <div className="relative px-10 py-4 bg-white border-[3px] border-[#18181B] font-black uppercase tracking-widest text-[#18181B] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
                        {t('readMore').includes('阅读') ? '返回博客列表' : 'Back to Blog'}
                    </div>
                </Link>
            </div>
        </BlogLayout>
    );
}
