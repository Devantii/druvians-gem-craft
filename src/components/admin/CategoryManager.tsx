import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, type Category } from "@/lib/catalogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const empty = { id: "", slug: "", name: "", description: "", sort_order: "0" };
type FormState = typeof empty;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoryManager() {
  const queryClient = useQueryClient();
  const categories = useQuery(categoriesQuery);
  const [form, setForm] = useState<FormState | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        slug: values.slug || slugify(values.name),
        name: values.name,
        description: values.description,
        sort_order: Number(values.sort_order) || 0,
      };
      const { error } = values.id
        ? await supabase.from("categories").update(payload).eq("id", values.id)
        : await supabase.from("categories").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Collection saved");
      setForm(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Collection deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toForm = (c: Category): FormState => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    sort_order: String(c.sort_order),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form) save.mutate(form);
  };

  return (
    <div>
      <Button onClick={() => setForm({ ...empty })}>
        <Plus className="mr-2 size-4" aria-hidden="true" /> Add collection
      </Button>

      {form ? (
        <form
          onSubmit={onSubmit}
          className="my-8 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <h2 className="font-display text-2xl font-semibold">
              {form.id ? "Edit collection" : "New collection"}
            </h2>
          </div>
          <div>
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="cat-slug">URL slug (optional)</Label>
            <Input
              id="cat-slug"
              value={form.slug}
              placeholder={slugify(form.name)}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="cat-description">Description</Label>
            <Textarea
              id="cat-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="cat-sort">Sort order</Label>
            <Input
              id="cat-sort"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save collection"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Catalogue collections</caption>
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Collection</th>
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories.data ?? []).map((c) => (
              <tr key={c.id} className="border-t border-border align-top">
                <td className="p-3">
                  <span className="font-medium">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">/{c.slug}</span>
                </td>
                <td className="max-w-sm p-3 text-xs text-muted-foreground">{c.description}</td>
                <td className="p-3">{c.sort_order}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setForm(toForm(c))}
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete ${c.name}? Products stay but lose this collection.`)) {
                          remove.mutate(c.id);
                        }
                      }}
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
