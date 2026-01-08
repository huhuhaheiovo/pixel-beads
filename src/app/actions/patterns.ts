'use server';

import { getPatternById, getPatterns, savePattern, Pattern } from "@/lib/pattern-service";

export async function fetchPatternsAction() {
    return await getPatterns();
}

export async function fetchPatternAction(id: string) {
    return await getPatternById(id);
}

export async function savePatternAction(pattern: Pattern) {
    return await savePattern(pattern);
}
