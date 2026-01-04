import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author: string;
    pinned?: boolean;
    tags?: string[];
    readingTime?: string;
}

export function getBlogPosts(locale: string): BlogPost[] {
    const contentDir = path.join(process.cwd(), `src/app/[locale]/blog/content/${locale}`);

    if (!fs.existsSync(contentDir)) {
        return [];
    }

    const files = fs.readdirSync(contentDir);
    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const filePath = path.join(contentDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            return {
                slug: file.replace(/\.mdx$/, ''),
                title: data.title || '',
                date: data.date || '',
                excerpt: data.excerpt || '',
                author: data.author || '',
                pinned: data.pinned || false,
                tags: data.tags || [],
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getBlogPost(locale: string, slug: string): BlogPost | null {
    const filePath = path.join(process.cwd(), `src/app/[locale]/blog/content/${locale}/${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        author: data.author || '',
        pinned: data.pinned || false,
        tags: data.tags || [],
    };
}
