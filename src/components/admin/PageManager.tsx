import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminPagesQuery, type SitePage } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LABELS: Record<string, string> = {
  faq: "FAQ page",
  privacy: "Privacy policy",
  terms: "Terms of service",
};

export function PageManager() {
  const queryClient = useQueryClient();
  const pages = useQuery(adminPagesQuery);
  const [form, setForm] = useState<SitePage | null>(null);

  const save = useMutation({
    mutationFn: async (values: SitePage) => {
      const { error } = await supabase
        .from("site_pages")
        .update({
          title: values.title,
          eyebrow: values.eyebrow,
          subtitle: values.subtitle,
          body: values.body,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
        })
        .eq("id", values.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Page updated");
      setForm(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form) save.mutate(form);
  };

  return (
    <div>
      {form ? (
        <form onSubmit={onSubmit} className="mb-8 grid gap-5 rounded-lg border border-border bg-card p-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Editing: {LABELS[form.slug] ?? form.slug}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              In the page text, start a line with “## ” to make it a section heading. Leave a blank
              line between paragraphs.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="page-eyebrow">Small label above the title</Label>
              <Input
                id="page-eyebrow"
                value={form.eyebrow}
                onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="page-title">Page heading</Label>
              <Input
                id="page-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="page-subtitle">Sub-line (e.g. last updated date)</Label>
            <Input
              id="page-subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="page-body">Page text</Label>
            <Textarea
              id="page-body"
              rows={18}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="mt-2 font-mono text-xs"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="page-meta-title">Search result title</Label>
              <Input
                id="page-meta-title"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="page-meta-description">Search result description</Label>
              <Input
                id="page-meta-description"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save page"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Editable website pages</caption>
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Page</th>
              <th className="p-3 font-medium">Heading</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(pages.data ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <span className="font-medium">{LABELS[p.slug] ?? p.slug}</span>
                  <span className="block text-xs text-muted-foreground">/{p.slug}</span>
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForm(p)}
                    aria-label={`Edit ${LABELS[p.slug] ?? p.slug}`}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
