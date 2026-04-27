// Auto-mirrors the database schema. Update when you add columns.

export type CustomerStatus = "new" | "regular" | "vip";
export type ProductStatus  = "active" | "out_of_stock" | "archived";
export type TicketPriority = "normal" | "high" | "urgent";
export type TicketStatus   = "open" | "closed";
export type MessageRole    = "user" | "agent";
export type SessionStatus  = "active" | "closed" | "escalated";
export type MemberRole     = "owner" | "admin" | "support";
export type MemberStatus   = "active" | "offline" | "pending";

export interface Store {
  id: string;
  name: string;
  domain: string | null;
  phone: string | null;
  address: string | null;
  about: string | null;
  agent_name: string;
  agent_persona: {
    traits?:       string;
    rules?:        string;
    style?:        string;
    role?:         string;
    greeting?:     string;
    escalation?:   string;
    knowledge?:    string;
    faqs?:         string;
    restrictions?: string;
  };
  created_at: string;
}

export interface TeamMember {
  id:         string;
  store_id:   string;
  name:       string;
  email:      string;
  role:       MemberRole;
  status:     MemberStatus;
  created_at: string;
}

export interface Customer {
  id: string;
  store_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
  total_spent: number;
  orders_count: number;
  rating: number | null;
  notes: string | null;
  last_chat_at: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  image_url: string | null;
  status: ProductStatus;
  sold_count: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  store_id: string;
  customer_id: string | null;
  summary: string | null;
  message_count: number;
  status: SessionStatus;
  escalated_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  customer?: Pick<Customer, "id" | "name" | "email">;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  store_id: string;
  session_id: string | null;
  customer_id: string | null;
  order_number: string | null;
  summary: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  customer?: Pick<Customer, "id" | "name">;
}

// Database type map for the Supabase client generic
export type Database = {
  public: {
    Tables: {
      stores:          { Row: Store;          Insert: Omit<Store,          "id" | "created_at">; Update: Partial<Store> };
      team_members:    { Row: TeamMember;     Insert: Omit<TeamMember,     "id" | "created_at">; Update: Partial<TeamMember> };
      customers:       { Row: Customer;       Insert: Omit<Customer,       "id" | "created_at">; Update: Partial<Customer> };
      products:        { Row: Product;        Insert: Omit<Product,        "id" | "created_at" | "updated_at">; Update: Partial<Product> };
      chat_sessions:   { Row: ChatSession;    Insert: Omit<ChatSession,    "id" | "created_at" | "updated_at" | "message_count" | "customer">; Update: Partial<ChatSession> };
      chat_messages:   { Row: ChatMessage;    Insert: Omit<ChatMessage,    "id" | "created_at">; Update: never };
      support_tickets: { Row: SupportTicket;  Insert: Omit<SupportTicket,  "id" | "created_at" | "updated_at" | "customer">; Update: Partial<SupportTicket> };
    };
  };
};
