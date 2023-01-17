import { PostgrestResponse } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { Category } from "../types/Category"

export const getAllCategories = async (): Promise<
  PostgrestResponse<Category>
> => {
  return supabase.from("categories").select("*")
}
