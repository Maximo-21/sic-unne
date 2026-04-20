import { createClient } from '@supabase/supabase-js'

// Aquí le decimos que busque en el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Si las variables están bien en el .env.local, esto ya no tirará error
export const supabase = createClient(supabaseUrl, supabaseKey)