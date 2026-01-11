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

    // Map database schema to Pattern interface
    // Convert 'public_at' field to 'public' for TypeScript
    const patterns: Pattern[] = (data || []).map((item: any) => {
      const { public_at, ...rest } = item
      return {
        ...rest,
        public: public_at ?? false
      }
    })

    return {
      data: patterns,
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

    if (!data) return null

    // Map database schema to Pattern interface
    // Convert 'public_at' field to 'public' for TypeScript
    const { public_at, ...rest } = data as any
    const pattern: Pattern = {
      ...rest,
      public: public_at ?? false
    }

    return pattern
  } catch (error) {
    console.error('Error reading pattern:', error)
    return null
  }
}

export async function savePattern(pattern: Pattern): Promise<boolean> {
  try {
    const supabase = createServerClient()

    // Map Pattern interface to database schema
    // Convert 'public' field to 'public_at' for database
    const { public: publicValue, ...rest } = pattern
    const dbPattern = {
      ...rest,
      public_at: publicValue ?? true
    }

    const { error } = await supabase
      .from('patterns')
      .insert([dbPattern])

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
