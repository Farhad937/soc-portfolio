// Hand-authored REFERENCE types matching supabase/schema.sql — documents
// each table's row shape for readability. NOT currently wired into the
// Supabase client generic (see client.ts/server.ts for why) — imported
// only where a data-access function wants to annotate a raw row.
//
// Can be replaced with real generated types via:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
// once the Supabase CLI is linked to the project, at which point they
// can also be wired back into createClient<Database>(...).

export type ContentStatus = "draft" | "published" | "archived";

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: number;
          name: string;
          role: string;
          tagline: string;
          location: string;
          email: string;
          github_url: string | null;
          linkedin_url: string | null;
          tryhackme_url: string | null;
          status_text: string;
          learning_hours: number;
          github_repos: number;
          blog_articles: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          difficulty: "Beginner" | "Intermediate" | "Advanced" | null;
          status: "In Progress" | "Complete" | "Planned" | null;
          time_invested: string | null;
          tech: string[];
          skills: string[];
          overview: string | null;
          objective: string | null;
          environment: string | null;
          tools_used: string[];
          challenges: string | null;
          investigation: string | null;
          findings: string | null;
          lessons_learned: string | null;
          future_improvements: string | null;
          github_url: string | null;
          featured: boolean;
          order_index: number;
          content_status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      writeups: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string | null;
          reading_time: string | null;
          difficulty: "Beginner" | "Intermediate" | "Advanced" | null;
          summary: string | null;
          concept: string | null;
          key_takeaways: string[];
          references: { label: string; url: string }[];
          featured: boolean;
          order_index: number;
          content_status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["writeups"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["writeups"]["Row"]>;
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          issuer: string | null;
          date: string | null;
          skills: string[];
          credential_url: string | null;
          status: "Completed" | "In Progress" | "Planned" | null;
          order_index: number;
          content_status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["certifications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["certifications"]["Row"]>;
      };
      seo_metadata: {
        Row: {
          route: string;
          title: string | null;
          description: string | null;
          og_title: string | null;
          og_description: string | null;
          og_image: string | null;
          canonical_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["seo_metadata"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["seo_metadata"]["Row"]>;
      };
      timeline_entries: {
        Row: {
          id: string;
          date: string | null;
          title: string;
          description: string | null;
          order_index: number;
          content_status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["timeline_entries"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["timeline_entries"]["Row"]>;
      };
      skill_groups: {
        Row: {
          id: string;
          category: string;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["skill_groups"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["skill_groups"]["Row"]>;
      };
      skills: {
        Row: {
          id: string;
          skill_group_id: string;
          name: string;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
      };
      tryhackme_paths: {
        Row: {
          id: string;
          name: string;
          progress: number;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["tryhackme_paths"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["tryhackme_paths"]["Row"]>;
      };
      tryhackme_rooms: {
        Row: {
          id: string;
          path_id: string;
          name: string;
          status: "Complete" | "In Progress" | "Not Started" | null;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["tryhackme_rooms"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["tryhackme_rooms"]["Row"]>;
      };
    };
  };
};
