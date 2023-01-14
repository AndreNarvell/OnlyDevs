import { supabase } from "../lib/supabase"

export const getProfileById = async (id: string) => {
  return supabase.from("profiles").select("*").eq("id", id).single()
}
