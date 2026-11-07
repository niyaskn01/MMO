export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          amount: number
          commission: number
          created_at: string
          destination: string
          duration: number
          duration_unit: string
          email: string
          id: string
          kind: string
          listing_id: string | null
          listing_name: string
          message: string
          name: string
          payment_id: string | null
          payment_status: string
          phone: string
          refund_status: string
          status: string
          travel_date: string | null
          travelers: number
        }
        Insert: {
          amount?: number
          commission?: number
          created_at?: string
          destination?: string
          duration?: number
          duration_unit?: string
          email: string
          id?: string
          kind: string
          listing_id?: string | null
          listing_name?: string
          message?: string
          name: string
          payment_id?: string | null
          payment_status?: string
          phone: string
          refund_status?: string
          status?: string
          travel_date?: string | null
          travelers?: number
        }
        Update: {
          amount?: number
          commission?: number
          created_at?: string
          destination?: string
          duration?: number
          duration_unit?: string
          email?: string
          id?: string
          kind?: string
          listing_id?: string | null
          listing_name?: string
          message?: string
          name?: string
          payment_id?: string | null
          payment_status?: string
          phone?: string
          refund_status?: string
          status?: string
          travel_date?: string | null
          travelers?: number
        }
        Relationships: []
      }
      companions: {
        Row: {
          about: string
          age: number
          availability: string
          city: string
          experience: number
          gender: string
          hourly_price: number
          id: string
          image: string
          images: string[]
          interests: string[]
          is_demo: boolean
          languages: string[]
          name: string
          price: number
          rating: number
          services: string[]
          trips: number
          verification: string
        }
        Insert: {
          about?: string
          age: number
          availability?: string
          city: string
          experience?: number
          gender?: string
          hourly_price?: number
          id?: string
          image?: string
          images?: string[]
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          name: string
          price: number
          rating?: number
          services?: string[]
          trips?: number
          verification?: string
        }
        Update: {
          about?: string
          age?: number
          availability?: string
          city?: string
          experience?: number
          gender?: string
          hourly_price?: number
          id?: string
          image?: string
          images?: string[]
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          name?: string
          price?: number
          rating?: number
          services?: string[]
          trips?: number
          verification?: string
        }
        Relationships: [
          {
            foreignKeyName: "companions_city_fkey"
            columns: ["city"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          description: string
          id: string
          image: string
          name: string
        }
        Insert: {
          description: string
          id: string
          image: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          image?: string
          name?: string
        }
        Relationships: []
      }
      listing_reservations: {
        Row: {
          end_date: string
          kind: string
          listing_id: string
          request_id: string
          start_date: string
        }
        Insert: {
          end_date: string
          kind: string
          listing_id: string
          request_id: string
          start_date: string
        }
        Update: {
          end_date?: string
          kind?: string
          listing_id?: string
          request_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reservations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          companion_id: string | null
          created_at: string
          id: string
          is_demo: boolean
          rating: number
          review: string
          stay_id: string | null
          traveler_name: string
        }
        Insert: {
          companion_id?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          rating: number
          review: string
          stay_id?: string | null
          traveler_name: string
        }
        Update: {
          companion_id?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          rating?: number
          review?: string
          stay_id?: string | null
          traveler_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_stay_id_fkey"
            columns: ["stay_id"]
            isOneToOne: false
            referencedRelation: "stays"
            referencedColumns: ["id"]
          },
        ]
      }
      stays: {
        Row: {
          active: boolean
          amenities: string[]
          city: string
          contact: string
          description: string
          host: string
          house_rules: string
          id: string
          image: string
          images: string[]
          is_demo: boolean
          name: string
          price: number
          property_type: string
          rating: number
          review_count: number
          rooms: string
        }
        Insert: {
          active?: boolean
          amenities?: string[]
          city: string
          contact?: string
          description?: string
          host?: string
          house_rules?: string
          id?: string
          image?: string
          images?: string[]
          is_demo?: boolean
          name: string
          price: number
          property_type?: string
          rating?: number
          review_count?: number
          rooms?: string
        }
        Update: {
          active?: boolean
          amenities?: string[]
          city?: string
          contact?: string
          description?: string
          host?: string
          house_rules?: string
          id?: string
          image?: string
          images?: string[]
          is_demo?: boolean
          name?: string
          price?: number
          property_type?: string
          rating?: number
          review_count?: number
          rooms?: string
        }
        Relationships: [
          {
            foreignKeyName: "stays_city_fkey"
            columns: ["city"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_account_directory: {
        Args: never
        Returns: {
          admin: boolean
          display_name: string
          email: string
          id: string
        }[]
      }
      admin_delete_listing: {
        Args: { listing_kind: string; target_id: string }
        Returns: undefined
      }
      admin_set_account_role: {
        Args: { make_admin: boolean; target_user: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
