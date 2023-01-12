import { Database } from "./supabase"

export type Category = Database["public"]["Tables"]["categories"]["Row"]
