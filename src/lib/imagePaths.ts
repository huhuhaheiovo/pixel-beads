/**
 * 图片路径常量
 * 统一管理所有图片路径，避免硬编码
 */

// Christmas 图片路径
export const CHRISTMAS_IMAGES = {
  GINGERBREAD_MAN: 'christmas/christmas-gingerbread-man-pixel-beads.webp',
  REINDEER: 'christmas/christmas-reindeer-pixel-beads.webp',
  SANTA_CLAUS: 'christmas/christmas-santa-claus-pixel-beads.webp',
  TREE: 'christmas/christmas-tree-pixel-beads.webp',
  SANTA_CLAUS_ALT: 'christmas/santa-claus-pixel-beads.webp',
} as const

// Halloween 图片路径
export const HALLOWEEN_IMAGES = {
  CAT: 'halloween/halloween-cat-pixel-beads.webp',
  GHOST: 'halloween/halloween-ghost-pixel-beads.webp',
  GHOST_2: 'halloween/halloween-ghost-pixel-beads-2.webp',
  GHOST_3: 'halloween/halloween-ghost-pixel-beads-3.webp',
  GHOST_4: 'halloween/halloween-ghost-pixel-beads-4.webp',
  GHOST_5: 'halloween/halloween-ghost-pixel-beads-5.png.webp',
  GHOST_6: 'halloween/halloween-ghost-pixel-beads-6.webp',
  JACK_O_LANTERN: 'halloween/halloween-jack-o-lantern-pixel-beads.webp',
  JACK_O_LANTERN_2: 'halloween/halloween-jack-o-lantern-pixel-beads-2.webp',
  JACK_O_LANTERN_3: 'halloween/halloween-jack-o-lantern-pixel-beads-3.webp',
  WITCH_HAT: 'halloween/witch-hat-pixel-beads.webp',
} as const

// Pallettes 图片路径
export const PALLETTES_IMAGES = {
  CHRISTMAS_TREE: 'pallettes/christmas-tree-pixel-beads.webp',
  GINGERBREAD_MAN: 'pallettes/gingerbread-man-pixel-beads.webp',
  INBETWEENING_1: 'pallettes/inbetweening-1.webp',
  INBETWEENING_2: 'pallettes/inbetweening-2.webp',
  INBETWEENING_3: 'pallettes/inbetweening-3.webp',
  INBETWEENING_4: 'pallettes/inbetweening-4.webp',
  INBETWEENING_5: 'pallettes/inbetweening-5.webp',
  PATRICK_STAR: 'pallettes/patrick-star.webp',
  PEPPA_PIG_MR_DINOSAUR: 'pallettes/peppa-pig-mr-dinosaur-pixel-beads.webp',
  PEPPA_PIG: 'pallettes/peppa-pig-pixel-beads.webp',
  PEPPA_PIG_BALLOON: 'pallettes/peppa-pig-pixel-beads-balloon.webp',
  REINDEER: 'pallettes/reindeer-pixel-beads.webp',
  SANTA_CLAUS: 'pallettes/santa-claus-pixel-beads.webp',
  SPONGEBOB_SQUAREPANTS: 'pallettes/spongebob-squarepants.webp',
} as const

// 所有图片路径数组（用于批量处理）
export const ALL_CHRISTMAS_IMAGES = Object.values(CHRISTMAS_IMAGES)
export const ALL_HALLOWEEN_IMAGES = Object.values(HALLOWEEN_IMAGES)
export const ALL_PALLETTES_IMAGES = Object.values(PALLETTES_IMAGES)

// 类型定义
export type ChristmasImageKey = keyof typeof CHRISTMAS_IMAGES
export type HalloweenImageKey = keyof typeof HALLOWEEN_IMAGES
export type PallettesImageKey = keyof typeof PALLETTES_IMAGES
