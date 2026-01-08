import fs from 'fs/promises';
import path from 'path';

export interface Pattern {
    id: string;
    title: string;
    description: string;
    width: number;
    height: number;
    paletteId: string;
    isPublic: boolean;
    authorId: string;
    pixels: string[][];
    createdAt?: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'patterns.json');

export async function getPatterns(options?: {
    page?: number;
    limit?: number;
}): Promise<{ data: Pattern[]; total: number }> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const patterns: Pattern[] = JSON.parse(data);

        // Simple sorting by newness (simulated)
        // patterns.reverse();

        return {
            data: patterns,
            total: patterns.length,
        };
    } catch (error) {
        console.error('Error reading patterns:', error);
        return { data: [], total: 0 };
    }
}

export async function getPatternById(id: string): Promise<Pattern | null> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const patterns: Pattern[] = JSON.parse(data);
        return patterns.find((p) => p.id === id) || null;
    } catch (error) {
        console.error('Error reading pattern:', error);
        return null;
    }
}

export async function savePattern(pattern: Pattern): Promise<boolean> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const patterns: Pattern[] = JSON.parse(data);
        patterns.push(pattern);
        await fs.writeFile(DATA_FILE, JSON.stringify(patterns, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error saving pattern:', error);
        return false;
    }
}
