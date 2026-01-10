import { createServerClient } from './supabase'

export interface Pattern {
  id: string
  name?: string
  author?: string
  public?: boolean
  message?: string
  description?: string
  createdAt: string
  format: 'pdf' | 'png'
  gridSize: {
    width: number
    height: number
  }
  pixels: string[][]
  materials?: {
    brand: string
    totalBeads: number
    colors: Array<{
      colorCode: string
      colorName: string
      hex: string
      count: number
    }>
  }
  source?: string
}

export async function getPatterns(options?: {
  page?: number
  limit?: number
}): Promise<{ data: Pattern[]; total: number }> {
  try {
    const supabase = createServerClient()

    let query = supabase
        .from('patterns')
        .select('*', { count: 'exact' })
        .eq('public_at', true)         // 注意这里是 public_at
        .order('createdAt', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.page && options?.limit) {
      const from = (options.page - 1) * options.limit
      const to = from + options.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching patterns from Supabase:', error)
      return { data: [], total: 0 }
    }

    return {
      data: (data as Pattern[]) || [],
      total: count || 0
    }
  } catch (error) {
    console.error('Error reading patterns:', error)
    return { data: [], total: 0 }
  }
}

export async function getPatternById(id: string): Promise<Pattern | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching pattern from Supabase:', error)
      return null
    }

    return data as Pattern | null
  } catch (error) {
    console.error('Error reading pattern:', error)
    return null
  }
}

export async function savePattern(pattern: Pattern): Promise<boolean> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('patterns')
      .insert([pattern])

    if (error) {
      console.error('Error saving pattern to Supabase:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving pattern:', error)
    return false
  }
}
