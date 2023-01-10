export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          background_image: string
          created_at: string
          creator: string
          description: string
          icon: string
          id: string
          price: number
          short_desc: string
          slug: string
          tags: string[]
          title: string
        }
        Insert: {
          background_image: string
          created_at?: string
          creator: string
          description: string
          icon: string
          id?: string
          price: number
          short_desc: string
          slug: string
          tags: string[]
          title: string
        }
        Update: {
          background_image?: string
          created_at?: string
          creator?: string
          description?: string
          icon?: string
          id?: string
          price?: number
          short_desc?: string
          slug?: string
          tags?: string[]
          title?: string
        }
      }
      lessons: {
        Row: {
          created_at: string | null
          id: string
          module_id: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          sort_order: number
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          sort_order?: number
          title?: string
        }
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string
          id: string
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          slug: string
          sort_order: number
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
