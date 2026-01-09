import pinyin from 'pinyin'

/**
 * 将中文名称转换为 SEO 友好的 slug
 * @param chineseName - 中文名称（可选）
 * @param id - 图案 ID（用于保证唯一性）
 * @returns slug 字符串，格式为 name转拼音-id
 */
export function toSlug(chineseName: string | undefined, id: string): string {
  // 如果没有名称，直接使用 ID
  if (!chineseName || chineseName.trim() === '') {
    return id
  }

  // 转拼音（pinyin 库会自动处理中英文混合）
  const py = pinyin(chineseName, {
    style: pinyin.STYLE_NORMAL, // 不带声调
    heteronym: false
  }).flat() // 返回二维数组，拍平成一维

  // 拼成短横线连接
  let slug = py.join('-').toLowerCase()

  // 去掉特殊符号（保留字母、数字和短横线）
  slug = slug.replace(/[^a-z0-9\-]/g, '')

  // 移除连续的短横线
  slug = slug.replace(/-+/g, '-')

  // 移除开头和结尾的短横线
  slug = slug.replace(/^-+|-+$/g, '')

  // 如果处理后为空，使用 ID
  if (!slug) {
    return id
  }

  // 添加 ID 保证唯一
  slug += `-${id}`

  return slug
}

/**
 * 从 slug 中提取 ID
 * @param slug - slug 字符串，格式为 name转拼音-id
 * @returns 图案 ID
 */
export function parseSlugToId(slug: string): string {
  // 从 slug 中提取 ID（最后一个短横线后的部分）
  const parts = slug.split('-')
  
  // 如果只有一个部分，说明可能是纯 ID（向后兼容）
  if (parts.length === 1) {
    return slug
  }

  // 返回最后一部分作为 ID
  return parts[parts.length - 1] || slug
}
