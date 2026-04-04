import { createClient } from '@supabase/supabase-js'

// Try to grab from environment variables, fallback for demo purposes if not provided.
// IMPORTANT: DO NOT expose real keys in source control for production.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...YOUR_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
