export function generateColorMap(pixels: string[][]): Record<string, string> {
    const uniqueColors = Array.from(new Set(pixels.flat())).filter(
        (c) => c !== '#00000000' && c !== 'transparent'
    );

    const map: Record<string, string> = {};
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    uniqueColors.forEach((color, index) => {
        map[color] = chars[index % chars.length];
    });

    return map;
}
