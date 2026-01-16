/**
 * 首页固定展示图片配置
 * 从 imagePaths.ts 中选择6张固定图片（2张 Christmas、2张 Halloween、2张 Pallettes）
 */

import { CHRISTMAS_IMAGES, HALLOWEEN_IMAGES, PALLETTES_IMAGES } from './imagePaths'
import { toSlug } from './slug-utils'

export interface FeaturedImage {
  name: string
  path: string  // 图片路径，如 'christmas/christmas-tree-pixel-beads.webp'
  patternId: string  // 对应的 pattern ID（用于生成跳转链接）
  patternName?: string  // pattern 名称（可选，用于生成更友好的 slug）
}

/**
 * 首页固定展示的6张图片
 * 选择规则：2张 Christmas、2张 Halloween、2张 Pallettes
 */
export const FEATURED_IMAGES: FeaturedImage[] = [
  // Christmas 图片 - 2张
  {
    name: 'Christmas Man',
    path: CHRISTMAS_IMAGES.GINGERBREAD_MAN,
    patternId: 'pt_1768495403841',  // 占位符，需要从数据库获取或手动配置
    patternName: 'jiang-bing-ren '
  },
  {
    name: 'Santa Claus',
    path: CHRISTMAS_IMAGES.SANTA_CLAUS,
    patternId: 'pt_1768498036943',  // 占位符，需要从数据库获取或手动配置
    patternName: 'sheng-dan-lao-ren'
  },
  // Halloween 图片 - 2张
  {
    name: 'Halloween Cat',
    path: HALLOWEEN_IMAGES.CAT,
    patternId: 'pt_1768495761912',  // 占位符，需要从数据库获取或手动配置
    patternName: 'hei-mao'
  },
  {
    name: 'Jack O Lantern',
    path: HALLOWEEN_IMAGES.JACK_O_LANTERN,
    patternId: 'pt_1768498159930',  // 占位符，需要从数据库获取或手动配置
    patternName: 'wan-sheng-jie-nan-gua'
  },
  // Pallettes 图片 - 2张
  {
    name: 'Christmas Tree',
    path: PALLETTES_IMAGES.CHRISTMAS_TREE,
    patternId: 'pt_1768495309219',  // 占位符，需要从数据库获取或手动配置
    patternName: 'sheng-dan-shu'
  },
  {
    name: 'Peppa Pig',
    path: PALLETTES_IMAGES.PEPPA_PIG,
    patternId: 'pt_1768498270284',  // 占位符，需要从数据库获取或手动配置
    patternName: 'xiao-zhu-pei-qi'
  }
] as const

/**
 * 生成首页图片的跳转链接
 * @param image - 首页图片配置对象
 * @returns 跳转链接路径（不带 locale，由 i18n Link 组件自动处理）
 */
export function getFeaturedImageLink(image: FeaturedImage): string {
  const slug = image.patternName
    ? toSlug(image.patternName, image.patternId)
    : image.patternId

  return `/perler-bead-pattern/${slug}`
}
