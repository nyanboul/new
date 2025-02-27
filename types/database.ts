export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Item = Database['public']['Tables']['items']['Row'];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          phone_number: string | null;
          shipping_address: string | null;
          payment_info: any | null;
          notification_settings: any | null;
          rating: number | null;
          total_sales: number;
          total_purchases: number;
          is_verified: boolean;
          status: string;
          email_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          phone_number?: string | null;
          shipping_address?: string | null;
          payment_info?: any | null;
          notification_settings?: any | null;
          rating?: number | null;
          total_sales?: number;
          total_purchases?: number;
          is_verified?: boolean;
          status?: string;
          email_notifications?: boolean;
        };
        Update: {
          username?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          phone_number?: string | null;
          shipping_address?: string | null;
          payment_info?: any | null;
          notification_settings?: any | null;
          rating?: number | null;
          total_sales?: number;
          total_purchases?: number;
          is_verified?: boolean;
          status?: string;
          email_notifications?: boolean;
        };
      };
      items: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string | null;
          price: number;
          condition: string;
          category_id: number | null;
          status: string;
          shipping_method: string[];
          shipping_fee: number;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          // ... 必要に応じて追加
        };
        Update: {
          // ... 必要に応じて追加
        };
      };
      // ... 他のテーブル
    };
    Functions: {
      // データベース関数の型定義（必要な場合）
    };
    Enums: {
      // 列挙型の定義（必要な場合）
    };
  };
}; 