export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      completed_lessons: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          lessons_count: number | null
          order_index: number
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          lessons_count?: number | null
          order_index: number
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          lessons_count?: number | null
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      decision_options: {
        Row: {
          created_at: string
          decision_id: string
          id: string
          text: string
        }
        Insert: {
          created_at?: string
          decision_id: string
          id?: string
          text: string
        }
        Update: {
          created_at?: string
          decision_id?: string
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_options_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          created_at: string
          description: string
          id: string
          lesson_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          lesson_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          lesson_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_choices: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          text: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          is_correct?: boolean
          text: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_choices_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          after_text: string | null
          before_text: string | null
          correct_answer: string | null
          created_at: string
          id: string
          is_correct_answer: boolean | null
          lesson_id: string
          order_index: number
          question: string | null
          scripture: string | null
          statement: string | null
          type: string
          xp_reward: number | null
        }
        Insert: {
          after_text?: string | null
          before_text?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_correct_answer?: boolean | null
          lesson_id: string
          order_index: number
          question?: string | null
          scripture?: string | null
          statement?: string | null
          type: string
          xp_reward?: number | null
        }
        Update: {
          after_text?: string | null
          before_text?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_correct_answer?: boolean | null
          lesson_id?: string
          order_index?: number
          question?: string | null
          scripture?: string | null
          statement?: string | null
          type?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string
          id: string
          key_verse: string | null
          main_text: string
          order_index: number
          scripture: string | null
          scripture_reference: string | null
          summary: string
          title: string
          type: string
          xp_reward: number | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description: string
          id?: string
          key_verse?: string | null
          main_text: string
          order_index: number
          scripture?: string | null
          scripture_reference?: string | null
          summary: string
          title: string
          type?: string
          xp_reward?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string
          id?: string
          key_verse?: string | null
          main_text?: string
          order_index?: number
          scripture?: string | null
          scripture_reference?: string | null
          summary?: string
          title?: string
          type?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_decisions: {
        Row: {
          created_at: string
          decision_id: string
          id: string
          lesson_id: string
          option_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decision_id: string
          id?: string
          lesson_id: string
          option_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          decision_id?: string
          id?: string
          lesson_id?: string
          option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_decisions_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_decisions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_decisions_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "decision_options"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          id: string
          joined_at: string
          last_activity: string | null
          level: number | null
          streak: number | null
          user_id: string
          xp: number | null
        }
        Insert: {
          id?: string
          joined_at?: string
          last_activity?: string | null
          level?: number | null
          streak?: number | null
          user_id: string
          xp?: number | null
        }
        Update: {
          id?: string
          joined_at?: string
          last_activity?: string | null
          level?: number | null
          streak?: number | null
          user_id?: string
          xp?: number | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
