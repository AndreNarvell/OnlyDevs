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
      categories: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: number
          title: string
        }
        Update: {
          id?: number
          title?: string
        }
      }
      courses: {
        Row: {
          background_image: string
          category_id: number
          created_at: string
          creator: string
          description: string
          icon: string
          id: string
          includes: string[] | null
          number_of_students: number | null
          price: number
          requirements: string[] | null
          short_desc: string
          slug: string
          tags: string[]
          title: string
        }
        Insert: {
          background_image: string
          category_id: number
          created_at?: string
          creator: string
          description: string
          icon: string
          id?: string
          includes?: string[] | null
          number_of_students?: number | null
          price: number
          requirements?: string[] | null
          short_desc: string
          slug: string
          tags: string[]
          title: string
        }
        Update: {
          background_image?: string
          category_id?: number
          created_at?: string
          creator?: string
          description?: string
          icon?: string
          id?: string
          includes?: string[] | null
          number_of_students?: number | null
          price?: number
          requirements?: string[] | null
          short_desc?: string
          slug?: string
          tags?: string[]
          title?: string
        }
      }
      lectures: {
        Row: {
          content_type: string | null
          created_at: string | null
          id: string
          lecture_data: string | null
          section_id: string
          sort_order: number
          title: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          lecture_data?: string | null
          section_id: string
          sort_order: number
          title: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          lecture_data?: string | null
          section_id?: string
          sort_order?: number
          title?: string
        }
      }
      lectures_data: {
        Row: {
          article_data: Json | null
          created_at: string | null
          id: string
          video_url: string | null
        }
        Insert: {
          article_data?: Json | null
          created_at?: string | null
          id: string
          video_url?: string | null
        }
        Update: {
          article_data?: Json | null
          created_at?: string | null
          id?: string
          video_url?: string | null
        }
      }
      profiles: {
        Row: {
          cart: string[] | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          owned_courses: string[] | null
          picture: string | null
          stripe_customer: string | null
        }
        Insert: {
          cart?: string[] | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          owned_courses?: string[] | null
          picture?: string | null
          stripe_customer?: string | null
        }
        Update: {
          cart?: string[] | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          owned_courses?: string[] | null
          picture?: string | null
          stripe_customer?: string | null
        }
      }
      sections: {
        Row: {
          course_id: string
          created_at: string | null
          description: string
          id: string
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description: string
          id?: string
          slug: string
          sort_order: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
        }
      }
      teachers: {
        Row: {
          created_at: string | null
          description: string
          id: string
          short_desc: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id: string
          short_desc: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          short_desc?: string
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
