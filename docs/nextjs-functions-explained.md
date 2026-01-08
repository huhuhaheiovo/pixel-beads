# Next.js App Router 函数说明：generateMetadata 与 generateStaticParams

## 概述

在 Next.js App Router 中，`generateMetadata` 和 `generateStaticParams` 是两个重要的函数，它们分别用于 SEO 优化和静态生成优化。本文档详细说明它们的作用、使用场景和优劣势。

---

## 1. generateMetadata

### 作用

`generateMetadata` 是一个异步函数，用于为页面生成 SEO 元数据（metadata）。它返回的 `Metadata` 对象会被 Next.js 用于生成页面的 `<head>` 标签，包括：

- `<title>` 标签
- `<meta name="description">` 标签
- Open Graph 标签（用于社交媒体分享）
- Twitter Card 标签
- Canonical URL
- 多语言 alternate 链接

### 代码示例

```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    metadataBase: new URL('https://www.pixel-beads.com'),
    title: t('titlePrefix') + ' ' + t('titleAccent') + ' ' + t('titleSuffix'),
    description: t('description'),
    alternates: {
      canonical: locale === 'en' 
        ? 'https://www.pixel-beads.com/' 
        : `https://www.pixel-beads.com/${locale}`,
      languages: {
        en: '/',
        zh: '/zh',
        'x-default': 'https://www.pixel-beads.com/'
      }
    }
  }
}
```

### 优势

1. **SEO 优化**
   - 为每个页面生成独特的标题和描述
   - 支持多语言 SEO（hreflang 标签）
   - 支持 Open Graph 和 Twitter Card，提升社交媒体分享效果

2. **动态内容**
   - 可以根据路由参数（如 `locale`）动态生成元数据
   - 可以从数据库或 API 获取数据来生成元数据
   - 支持国际化，为不同语言生成对应的元数据

3. **类型安全**
   - TypeScript 支持，编译时检查元数据结构
   - Next.js 提供 `Metadata` 类型定义

4. **服务器端执行**
   - 在服务器端执行，不增加客户端 bundle 大小
   - 可以访问服务器端资源（数据库、文件系统等）

### 劣势

1. **性能开销**
   - 每次请求都需要执行（除非使用静态生成）
   - 如果涉及数据库查询或 API 调用，可能增加响应时间

2. **构建时间**
   - 在静态生成时，会为每个路径执行一次
   - 如果路径很多，可能显著增加构建时间

3. **复杂性**
   - 需要处理异步操作
   - 需要处理错误情况（如数据获取失败）

### 使用场景

- 需要为每个页面生成独特的 SEO 元数据
- 多语言网站，需要为不同语言生成对应的元数据
- 动态内容页面（如博客文章、产品页面）
- 需要社交媒体分享优化的页面

---

## 2. generateStaticParams

### 作用

`generateStaticParams` 是一个同步或异步函数，用于在构建时生成静态路径参数。它告诉 Next.js 在构建时应该为哪些路径参数组合预生成静态页面。

对于动态路由（如 `[locale]`、`[slug]`），Next.js 需要知道所有可能的值，以便在构建时生成对应的静态页面。

### 代码示例

```typescript
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

这个函数返回一个数组，每个元素是一个对象，包含动态路由段的值。例如，对于路由 `[locale]`，返回 `[{ locale: 'en' }, { locale: 'zh' }]`。

### 优势

1. **静态生成（SSG）**
   - 在构建时预生成所有页面，提供最佳性能
   - 页面以静态 HTML 形式存在，加载速度极快
   - 减少服务器负载，适合高流量网站

2. **SEO 友好**
   - 静态页面更容易被搜索引擎爬取
   - 所有内容在 HTML 中，无需 JavaScript 执行

3. **CDN 友好**
   - 静态文件可以轻松部署到 CDN
   - 全球用户都能获得快速访问体验

4. **成本效益**
   - 减少服务器计算资源需求
   - 可以部署到静态托管服务（如 Vercel、Netlify）

5. **可预测性**
   - 构建时就知道所有页面路径
   - 便于生成 sitemap 和进行 SEO 分析

### 劣势

1. **构建时间**
   - 如果路径很多，构建时间会显著增加
   - 每次内容更新都需要重新构建

2. **动态内容限制**
   - 不适合需要实时更新的内容
   - 不适合用户生成的内容（除非使用 ISR）

3. **存储空间**
   - 需要存储所有生成的静态页面
   - 如果页面数量巨大，可能占用大量存储空间

4. **灵活性较低**
   - 无法处理构建时未知的路径
   - 需要提前知道所有可能的路径参数

### 使用场景

- 多语言网站，语言列表固定
- 博客文章列表（文章数量有限）
- 产品目录（产品数量相对固定）
- 任何路径参数可以提前确定的场景

---

## 两者配合使用

在实际项目中，`generateMetadata` 和 `generateStaticParams` 经常配合使用：

```typescript
// 1. 首先定义所有静态路径
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// 2. 然后为每个路径生成元数据
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    // ...
  }
}
```

### 工作流程

1. **构建时**：
   - `generateStaticParams` 返回所有路径参数组合
   - Next.js 为每个组合调用 `generateMetadata` 和页面组件
   - 生成所有静态 HTML 文件

2. **运行时**：
   - 如果请求的路径已静态生成，直接返回静态文件
   - 如果路径未静态生成，Next.js 会动态生成（如果允许）

---

## 最佳实践

### generateMetadata

1. **使用国际化**
   ```typescript
   const t = await getTranslations({ locale, namespace: 'HomePage' })
   return { title: t('metaTitle') }
   ```

2. **设置 metadataBase**
   ```typescript
   return {
     metadataBase: new URL('https://www.pixel-beads.com'),
     // ...
   }
   ```

3. **添加 canonical URL**
   ```typescript
   alternates: {
     canonical: `https://www.pixel-beads.com/${locale}/page`
   }
   ```

4. **处理错误情况**
   ```typescript
   try {
     const data = await fetchData()
     return { title: data.title }
   } catch {
     return { title: 'Default Title' }
   }
   ```

### generateStaticParams

1. **返回所有可能的路径**
   ```typescript
   export async function generateStaticParams() {
     const posts = await getAllPosts()
     return posts.map((post) => ({ slug: post.slug }))
   }
   ```

2. **处理大量路径**
   - 如果路径数量巨大，考虑使用 `dynamicParams = true` 和 ISR
   - 或者只预生成最重要的路径

3. **类型安全**
   ```typescript
   export function generateStaticParams(): Array<{ locale: string }> {
     return routing.locales.map((locale) => ({ locale }))
   }
   ```

---

## 总结对比

| 特性 | generateMetadata | generateStaticParams |
|------|------------------|---------------------|
| **主要用途** | SEO 元数据生成 | 静态路径参数生成 |
| **执行时机** | 构建时 + 请求时 | 仅构建时 |
| **返回值** | `Promise<Metadata>` | `Array<Params>` |
| **性能影响** | 中等（每次请求） | 高（构建时） |
| **SEO 价值** | 极高 | 高（通过静态生成） |
| **灵活性** | 高 | 低 |
| **适用场景** | 所有页面 | 路径参数可预知的页面 |

---

## 参考资料

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

