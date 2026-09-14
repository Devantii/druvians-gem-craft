import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  body: string;
  meta_title: string;
  meta_description: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

const PAGE_COLUMNS = "id, slug, title, eyebrow, subtitle, body, meta_title, meta_description";

export async function fetchPage(slug: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select(PAGE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as SitePage | null) ?? null;
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Faq[];
}

export const adminPagesQuery = queryOptions({
  queryKey: ["admin", "pages"],
  queryFn: async (): Promise<SitePage[]> => {
    const { data, error } = await supabase.from("site_pages").select(PAGE_COLUMNS).order("slug");
    if (error) throw error;
    return (data ?? []) as SitePage[];
  },
});

export const adminFaqsQuery = queryOptions({
  queryKey: ["admin", "faqs"],
  queryFn: async (): Promise<Faq[]> => {
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, sort_order, is_active")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Faq[];
  },
});

/** Splits an editable page body into sections: "## Heading" lines start a section. */
export function parseBody(body: string) {
  const blocks: { heading: string | null; paragraphs: string[] }[] = [];
  let current: { heading: string | null; paragraphs: string[] } | null = null;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      current = { heading: line.slice(3).trim(), paragraphs: [] };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { heading: null, paragraphs: [] };
      blocks.push(current);
    }
    current.paragraphs.push(line);
  }

  return blocks;
}
