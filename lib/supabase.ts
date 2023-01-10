import { createClient } from "@supabase/supabase-js"
import { Database } from "../types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

supabase.from("lessons").select("*").then(console.log)
