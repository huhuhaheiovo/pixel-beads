import { getBlogPosts } from './utils';
import { Link } from '@/i18n/routing';
import BlogLayout from './BlogLayout';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Header' }); // Using Header namespace temporarily or add Blog namespace later

    return {
        title: `Blog - PixelBeads`,
        description: 'Read our latest articles, guides, and updates about pixel art and perler beads.',
    };
}

export default async function BlogPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const posts = getBlogPosts(locale);
    const t = await getTranslations({ locale, namespace: 'Header' });

    return (
        <BlogLayout>
            <div className="mb-16">
                <h1 className="text-5xl font-black uppercase tracking-tight text-[#18181B] mb-6">Blog</h1>
                <p className="text-xl text-[#71717A] max-w-2xl font-medium">
                    {locale === 'zh'
                        ? '探索拼豆艺术的世界，获取灵感、教程和最新动态。'
                        : 'Explore the world of pixel beads art, get inspiration, tutorials, and latest updates.'}
                </p>
            </div>

            <div className="grid gap-12">
                {posts.map((post) => (
                    <article key={post.slug} className="group">
                        <Link href={`/blog/${post.slug}`} className="block">
                            <div className="flex flex-col gap-3 mb-3">
                                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">
                                    <time dateTime={post.date}>{post.date}</time>
                                    <span>•</span>
                                    <span>{post.author}</span>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-[#18181B] group-hover:text-[#3F3F46] transition-colors">
                                    {post.title}
                                </h2>
                            </div>
                            <p className="text-lg text-[#52525B] leading-relaxed mb-4">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center text-sm font-bold uppercase tracking-widest text-[#18181B] group-hover:underline decoration-2 underline-offset-4">
                                {locale === 'zh' ? '阅读全文' : 'Read Article'}
                                <span className="ml-2">→</span>
                            </div>
                        </Link>
                    </article>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-[#FAFAFA] rounded-2xl border border-[#E4E4E7]">
                        <p className="text-[#A1A1AA] font-bold uppercase tracking-widest">
                            {locale === 'zh' ? '暂无文章' : 'No posts found'}
                        </p>
                    </div>
                )}
            </div>
        </BlogLayout>
    );
}
