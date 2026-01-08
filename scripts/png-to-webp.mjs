import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// 默认转换目录
const DEFAULT_DIR = path.join(ROOT, 'public', 'christmas')

// 从命令行参数获取目录，如果没有则使用默认目录
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DIR

// WebP 质量设置
const WEBP_QUALITY = 90

/**
 * 格式化文件大小
 */
function formatFileSize (bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 转换单个 PNG 文件为 WebP
 */
async function convertPngToWebp (pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp')
  const stats = fs.statSync(pngPath)
  const originalSize = stats.size

  try {
    // 使用 sharp 转换图片
    await sharp(pngPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath)

    // 获取转换后的文件大小
    const webpStats = fs.statSync(webpPath)
    const webpSize = webpStats.size
    const saved = originalSize - webpSize
    const savedPercent = ((saved / originalSize) * 100).toFixed(1)

    // 删除原始 PNG 文件
    fs.unlinkSync(pngPath)

    return {
      success: true,
      originalSize,
      webpSize,
      saved,
      savedPercent,
      filename: path.basename(pngPath)
    }
  } catch (error) {
    console.error(`转换失败: ${pngPath}`, error.message)
    return {
      success: false,
      filename: path.basename(pngPath),
      error: error.message
    }
  }
}

/**
 * 主函数
 */
async function main () {
  console.log('开始转换 PNG 到 WebP...\n')
  console.log(`目标目录: ${targetDir}\n`)

  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    console.error(`错误: 目录不存在 ${targetDir}`)
    process.exit(1)
  }

  // 读取目录下的所有 PNG 文件
  const files = fs.readdirSync(targetDir)
    .filter(file => /\.png$/i.test(file))
    .map(file => path.join(targetDir, file))

  if (files.length === 0) {
    console.log('未找到 PNG 文件')
    return
  }

  console.log(`找到 ${files.length} 个 PNG 文件\n`)

  // 转换所有文件
  const results = []
  let totalOriginalSize = 0
  let totalWebpSize = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filename = path.basename(file)
    console.log(`[${i + 1}/${files.length}] 转换: ${filename}`)

    const result = await convertPngToWebp(file)

    if (result.success) {
      console.log(`  ✓ 完成`)
      console.log(`  原始大小: ${formatFileSize(result.originalSize)}`)
      console.log(`  WebP 大小: ${formatFileSize(result.webpSize)}`)
      console.log(`  节省: ${formatFileSize(result.saved)} (${result.savedPercent}%)\n`)

      totalOriginalSize += result.originalSize
      totalWebpSize += result.webpSize
    } else {
      console.log(`  ✗ 失败: ${result.error}\n`)
    }

    results.push(result)
  }

  // 显示总结
  console.log('='.repeat(50))
  console.log('转换完成！\n')
  console.log(`总计:`)
  console.log(`  原始总大小: ${formatFileSize(totalOriginalSize)}`)
  console.log(`  WebP 总大小: ${formatFileSize(totalWebpSize)}`)
  console.log(`  总节省: ${formatFileSize(totalOriginalSize - totalWebpSize)} (${((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1)}%)`)
  console.log(`  成功: ${results.filter(r => r.success).length}/${results.length}`)
  console.log('='.repeat(50))
}

main().catch(error => {
  console.error('发生错误:', error)
  process.exit(1)
})

