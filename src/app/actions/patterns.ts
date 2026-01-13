'use server';

import { getPatternById, getPatterns, savePattern, Pattern } from "@/lib/pattern-service";

export async function fetchPatternsAction(options?: { page?: number; limit?: number }) {
    return await getPatterns(options);
}

export async function fetchPatternAction(id: string) {
    return await getPatternById(id);
}

export async function savePatternAction(pattern: Pattern) {
    return await savePattern(pattern);
}

export async function incrementPatternViewAction(id: string): Promise<boolean> {
    'use server'
    
    try {
        const { incrementPatternView } = await import('@/lib/pattern-service')
        return await incrementPatternView(id)
    } catch (error) {
        console.error('Error incrementing pattern view:', error)
        return false
    }
}
