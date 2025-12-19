import {createClient} from "@supabase/supabase-js"

const supabaseUrl = "https://okdovdyjmkhnbkzfbmdq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZG92ZHlqbWtobmJremZibWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDcyODcsImV4cCI6MjA3OTI4MzI4N30.VzT7jWK0p0_xuKIP4w0Z-9tYOWKcI_L24FXrnR0bWU0"

// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
