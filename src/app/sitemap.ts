import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://www.pixel-beads.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/generator',
        '/showcase',
        '/showcase/halloween-perler-bead-patterns',
        '/showcase/christmas-perler-bead-patterns',
        '/cool-perler-bead-designs',
    ]

    const sitemapEntries: MetadataRoute.Sitemap = []

    routing.locales.forEach((locale) => {
        routes.forEach((route) => {
            sitemapEntries.push({
                url: `${BASE_URL}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            })
        })
    })

    return sitemapEntries
}
