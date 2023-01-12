import { Database } from "./supabase"

export type Course = Database["public"]["Tables"]["courses"]["Row"]
