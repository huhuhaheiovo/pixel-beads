import fs from 'fs'

const content = fs.readFileSync('src/lib/generatedMard.ts', 'utf8')

// 提取所有有图例符号的颜色
const regex = /code:\s*"([^"]+)",[^}]*legendSymbol:\s*"([^"]+)"/g
const matches = [...content.matchAll(regex)]

console.log('='.repeat(60))
console.log('MARD 图例符号分配情况')
console.log('='.repeat(60))
console.log(`\n总共有 ${matches.length} 个颜色分配了图例符号\n`)

// 按系列分组显示
const bySeries = {}
matches.forEach(m => {
  const code = m[1]
  const symbol = m[2]
  const series = code.match(/^[A-Z]+/)?.[0] || 'Other'
  if (!bySeries[series]) bySeries[series] = []
  bySeries[series].push({ code, symbol })
})

// 显示每个系列的符号
Object.keys(bySeries).sort().forEach(series => {
  const items = bySeries[series]
  console.log(`\n${series} 系列 (${items.length} 个):`)
  items.forEach(({ code, symbol }) => {
    console.log(`  ${code.padEnd(6)} → ${symbol}`)
  })
})

// 统计信息
console.log('\n' + '='.repeat(60))
console.log('统计信息:')
console.log('='.repeat(60))
console.log(`- 有图例符号的颜色数: ${matches.length}`)
console.log(`- 涉及的系列数: ${Object.keys(bySeries).length}`)

// 检查是否有重复的符号
const symbolMap = new Map()
matches.forEach(m => {
  const code = m[1]
  const symbol = m[2]
  if (!symbolMap.has(symbol)) {
    symbolMap.set(symbol, [])
  }
  symbolMap.get(symbol).push(code)
})

const duplicates = Array.from(symbolMap.entries()).filter(([symbol, codes]) => codes.length > 1)
if (duplicates.length > 0) {
  console.log(`\n⚠️  发现 ${duplicates.length} 个重复的符号:`)
  duplicates.forEach(([symbol, codes]) => {
    console.log(`  ${symbol}: ${codes.join(', ')}`)
  })
} else {
  console.log('\n✅ 所有符号都是唯一的，没有重复！')
}

// 显示前20个符号示例
console.log('\n' + '='.repeat(60))
console.log('前20个符号示例:')
console.log('='.repeat(60))
matches.slice(0, 20).forEach((m, i) => {
  console.log(`${(i + 1).toString().padStart(3)}. ${m[1].padEnd(6)} → ${m[2]}`)
})

