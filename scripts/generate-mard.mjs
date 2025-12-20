import fs from "node:fs";
import path from "node:path";

/**
 * public/MARD.json is actually a JS-ish file (two object literals, second one references Object.keys(c)).
 * This script extracts:
 * - MARD_COLORS: Record<code, hex>
 * - MARD_GROUPS: Record<groupKey, { name: string; keys: string[] }>
 * and emits src/lib/generatedMard.ts
 */

const ROOT = process.cwd();
 // Prefer public/MARD.json if present; fallback to legacy public/c.json
 const SOURCE = fs.existsSync(path.join(ROOT, "public", "MARD.json"))
   ? path.join(ROOT, "public", "MARD.json")
   : path.join(ROOT, "public", "c.json");
const OUT_TS = path.join(ROOT, "src", "lib", "generatedMard.ts");

function rgbHexNormalize(hex) {
  const h = String(hex).trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return "#000000";
  return h.toUpperCase();
}

function seriesFromCode(code) {
  const m = String(code).match(/^[^\d]+/);
  return m ? m[0] : "";
}

// Note: assignLegendSymbol function removed - symbols are now assigned
// in main() using a Map to ensure uniqueness

function extractFirstJsonObject(text) {
  // First object ends at the first "}\n," sequence (as in the file)
  const idx = text.indexOf("},");
  if (idx === -1) throw new Error("Could not find end of first object (},)");
  const objText = text.slice(0, idx + 1).trim();
  return objText;
}

function extractSecondObject(text) {
  const idx = text.indexOf("},");
  if (idx === -1) throw new Error("Could not find delimiter between objects");
  const rest = text.slice(idx + 2).trim(); // after "},"
  const start = rest.indexOf("{");
  const end = rest.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not find second object braces");
  }
  return rest.slice(start, end + 1);
}

function parseGroups(secondObjText, allKeys) {
  // Very small parser for patterns like:
  // all: {name: "All ...", keys: Object.keys(c)},
  // 168: { name: "...", keys: [...] },
  // We only need name + keys list.

  const groups = {};

  // Normalize whitespace to make regex easier
  const t = secondObjText.replace(/\r\n/g, "\n");

  // Parse "all" group
  {
    const m = t.match(
      /all\s*:\s*\{\s*name\s*:\s*"([^"]+)"\s*,\s*keys\s*:\s*Object\.keys\(c\)\s*\}/
    );
    if (m) {
      groups.all = { name: m[1], keys: allKeys };
    }
  }

  // Parse numeric groups: 72/96/120/144/168 etc
  const re = /(\d+)\s*:\s*\{\s*name\s*:\s*"([^"]+)"\s*,\s*keys\s*:\s*\[([\s\S]*?)\]\s*\}/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    const key = m[1];
    const name = m[2];
    const listText = m[3];
    const keys = (listText.match(/"[^"]+"/g) ?? []).map((s) =>
      s.slice(1, -1)
    );
    groups[key] = { name, keys };
  }

  return groups;
}

function toTs(out) {
  return out.join("\n") + "\n";
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(SOURCE, "utf8");

  const firstObjText = extractFirstJsonObject(raw);
  const colorsMap = JSON.parse(firstObjText);

  const allKeys = Object.keys(colorsMap);

  const secondObjText = extractSecondObject(raw);
  const groups = parseGroups(secondObjText, allKeys);

  // Build palette array
  // Collect ALL codes that need symbols (not just short ones)
  const allCodesSorted = allKeys.slice().sort((a, b) => a.localeCompare(b, "en"));
  
  // Assign unique symbols to each code
  // Using comprehensive Unicode symbol set to ensure uniqueness (489 unique symbols)
  const symbolMap = new Map();
  const symbols = [
    // Geometric Shapes - Squares (U+25A0-25A9)
    "■", "□", "▢", "▣", "▤", "▥", "▦", "▧", "▨", "▩",
    // Rectangles (U+25AA-25AF)
    "▪", "▫", "▬", "▭", "▮", "▯",
    // Circles (U+25CB-25D3)
    "○", "◉", "◐", "◑", "◒", "◓", "◔", "◕", "◖", "◗",
    // Quarter circles (U+25D8-25E1)
    "◘", "◙", "◚", "◛", "◜", "◝", "◞", "◟", "◠", "◡",
    // Triangle corners (U+25E2-25E5)
    "◢", "◣", "◤", "◥",
    // More circles and shapes (U+25E6-25EF)
    "◦", "◯", "◰", "◱", "◲", "◳", "◴", "◵", "◶", "◷",
    // More shapes (U+25F0-25FF)
    "◸", "◹", "◺", "◻", "◼", "◽", "◾", "◿",
    
    // Triangles (U+25B0-25C7)
    "▲", "△", "▴", "▵", "▶", "▷", "▸", "▹", "►", "▻",
    "▼", "▽", "▾", "▿", "◀", "◁", "◂", "◃", "◄", "◅",
    
    // Diamonds (U+25C6-25C9)
    "◆", "◇", "◈", "◊",
    
    // Stars (U+2605-2606, U+2721-2730) - removed duplicates
    "★", "☆", "✦", "✧", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "✰",
    "✱", "✲", "✳", "✴", "✵", "✶", "✷", "✸", "✹", "✺", "✻", "✼", "✽", "✾", "✿", "❀",
    // Note: Some stars appear in both U+2605 and U+2721 ranges, duplicates removed by Set
    
    // Arrows - Basic (U+2190-219F)
    "←", "↑", "→", "↓", "↔", "↕", "↖", "↗", "↘", "↙",
    "↚", "↛", "↜", "↝", "↞", "↟", "↠", "↡",
    
    // Arrows - Double (U+21D0-21DF)
    "⇐", "⇑", "⇒", "⇓", "⇔", "⇕", "⇖", "⇗", "⇘", "⇙",
    "⇚", "⇛", "⇜", "⇝", "⇞", "⇟", "⇠", "⇡", "⇢", "⇣",
    
    // Arrows - Heavy (U+2794-27BF)
    "➔", "➙", "➚", "➛", "➜", "➝", "➞", "➟", "➠", "➡",
    "➢", "➣", "➤", "➥", "➦", "➧", "➨", "➩", "➪", "➫",
    "➬", "➭", "➮", "➯", "➰", "➱", "➲", "➳", "➴", "➵",
    "➶", "➷", "➸", "➹", "➺", "➻", "➼", "➽", "➾", "➿",
    
    // Mathematical Operators (U+2295-22A5)
    "⊕", "⊖", "⊗", "⊘", "⊙", "⊚", "⊛", "⊜", "⊝", "⊞", "⊟",
    "⊠", "⊡", "⊢", "⊣", "⊤", "⊥", "⊦", "⊧", "⊨", "⊩", "⊪",
    
    // Box Drawing and Block Elements (U+2580-259F)
    "▀", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█",
    "▉", "▊", "▋", "▌", "▍", "▎", "▏",
    "▐", "░", "▒", "▓", "▔", "▕", "▖", "▗", "▘", "▙",
    "▚", "▛", "▜", "▝", "▞", "▟",
    
    // Miscellaneous Symbols (U+2600-26FF) - removed duplicate stars
    "☀", "☁", "☂", "☃", "☄", "☇", "☈", "☉",
    "☊", "☋", "☌", "☍", "☎", "☏", "☐", "☑", "☒", "☓",
    "☔", "☕", "☖", "☗", "☘", "☙", "☚", "☛", "☜", "☝",
    "☞", "☟", "☠", "☡", "☢", "☣", "☤", "☥", "☦", "☧",
    "☨", "☩", "☪", "☫", "☬", "☭", "☮", "☯", "☰", "☱",
    "☲", "☳", "☴", "☵", "☶", "☷", "☸", "☹", "☺", "☻",
    "☼", "☽", "☾", "☿", "♀", "♁", "♂", "♃", "♄", "♅",
    "♆", "♇", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏",
    "♐", "♑", "♒", "♓", "♔", "♕", "♖", "♗", "♘", "♙",
    "♚", "♛", "♜", "♝", "♞", "♟", "♠", "♡", "♢", "♣",
    "♤", "♥", "♦", "♧", "♨", "♩", "♪", "♫", "♬", "♭",
    "♮", "♯", "♰", "♱", "♲", "♳", "♴", "♵", "♶", "♷",
    "♸", "♹", "♺", "♻", "♼", "♽", "♾", "♿",
    
    // Dingbats (U+2700-27BF)
    "✀", "✁", "✂", "✃", "✄", "✅", "✆", "✇", "✈", "✉",
    "✊", "✋", "✌", "✍", "✎", "✏", "✐", "✑", "✒", "✓",
    "✔", "✕", "✖", "✗", "✘", "✙", "✚", "✛", "✜", "✝",
    "✞", "✟", "✠", "✡", "✢", "✣", "✤", "✥",
    // Note: ✦ and ✧ already included in stars section above
    // Note: Stars already included above, skipping duplicates
    "❁", "❂", "❃", "❄", "❅", "❆",
    "❇", "❈", "❉", "❊", "❋", "❌", "❍", "❎", "❏", "❐",
    "❑", "❒", "❓", "❔", "❕", "❖", "❗", "❘", "❙", "❚",
    "❛", "❜", "❝", "❞", "❟", "❠", "❡", "❢", "❣", "❤",
    "❥", "❦", "❧", "❨", "❩", "❪", "❫", "❬", "❭", "❮",
    "❯", "❰", "❱", "❲", "❳", "❴", "❵", "❶", "❷", "❸",
    "❹", "❺", "❻", "❼", "❽", "❾", "❿", "➀", "➁", "➂",
    "➃", "➄", "➅", "➆", "➇", "➈", "➉", "➊", "➋", "➌",
    "➍", "➎", "➏", "➐", "➑", "➒", "➓"
  ];
  
  // Remove duplicates to ensure uniqueness
  const uniqueSymbols = [...new Set(symbols)];
  
  // Assign symbols sequentially to ensure uniqueness for ALL codes
  allCodesSorted.forEach((code, index) => {
    symbolMap.set(code, uniqueSymbols[index % uniqueSymbols.length]);
  });
  
  const palette = allKeys
    .slice()
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((code) => {
      const hex = rgbHexNormalize(colorsMap[code]);
      const series = seriesFromCode(code);
      return {
        id: `MARD:${code}`,
        name: code,
        hex,
        brand: "MARD",
        code,
        productCode: code,
        series,
        legendSymbol: symbolMap.get(code) || undefined,
      };
    });

  // Ensure output dir exists
  fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });

  const out = [];
  out.push(`/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.`);
  out.push(` *`);
   out.push(` * Source: ${path.relative(ROOT, SOURCE).replace(/\\/g, "/")}`);
  out.push(` * Generated by: scripts/generate-mard.mjs`);
  out.push(` */`);
  out.push("");
  out.push(
    `export type MardBeadColor = { id: string; name: string; hex: string; brand: "MARD"; code: string; productCode: string; series: string; legendSymbol?: string };`
  );
  out.push(
    `export type MardGroup = { name: string; keys: string[] };`
  );
  out.push("");

  out.push(`export const MARD_PALETTE_FULL: MardBeadColor[] = [`);
  for (const c of palette) {
    const legendSymbolPart = c.legendSymbol
      ? `, legendSymbol: ${JSON.stringify(c.legendSymbol)}`
      : "";
    out.push(
      `  { id: ${JSON.stringify(c.id)}, name: ${JSON.stringify(
        c.name
      )}, hex: ${JSON.stringify(c.hex)}, brand: "MARD", code: ${JSON.stringify(
        c.code
      )}, productCode: ${JSON.stringify(
        c.productCode
      )}, series: ${JSON.stringify(c.series)}${legendSymbolPart} },`
    );
  }
  out.push(`];`);
  out.push("");

  // Emit groups in stable order
  const groupOrder = ["72", "96", "120", "144", "168", "all"].filter(
    (k) => groups[k]
  );
  out.push(`export const MARD_GROUPS: Record<string, MardGroup> = {`);
  for (const k of groupOrder) {
    out.push(
      `  ${JSON.stringify(k)}: { name: ${JSON.stringify(
        groups[k].name
      )}, keys: ${JSON.stringify(groups[k].keys)} },`
    );
  }
  out.push(`};`);
  out.push("");

  fs.writeFileSync(OUT_TS, toTs(out), "utf8");
  console.log(
    `Generated ${path.relative(ROOT, OUT_TS)} (colors=${palette.length}, groups=${groupOrder.length})`
  );
}

main();


