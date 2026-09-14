import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminFaqsQuery, type Faq } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const empty = { id: "", question: "", answer: "", sort_order: "0", is_active: true };
type FormState = typeof empty;

export function FaqManager() {
  const queryClient = useQueryClient();
  const faqs = useQuery(adminFaqsQuery);
  const [form, setForm] = useState<FormState | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });

  const save = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        question: values.question,
        answer: values.answer,
        sort_order: Number(values.sort_order) || 0,
        is_active: values.is_active,
      };
      const { error } = values.id
        ? await supabase.from("faqs").update(payload).eq("id", values.id)
        : await supabase.from("faqs").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Question saved");
      setForm(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Question deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toForm = (f: Faq): FormState => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    sort_order: String(f.sort_order),
    is_active: f.is_active,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form) save.mutate(form);
  };

  return (
    <div>
      <Button onClick={() => setForm({ ...empty })}>
        <Plus className="mr-2 size-4" aria-hidden="true" /> Add question
      </Button>

      {form ? (
        <form onSubmit={onSubmit} className="my-8 grid gap-5 rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">
            {form.id ? "Edit question" : "New question"}
          </h2>
          <div>
            <Label htmlFor="faq-question">Question</Label>
            <Input
              id="faq-question"
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea
              id="faq-answer"
              required
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="faq-sort">Sort order</Label>
              <Input
                id="faq-sort"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="faq-active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label htmlFor="faq-active">Visible on site</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save question"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Frequently asked questions</caption>
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Question</th>
              <th className="p-3 font-medium">Answer</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(faqs.data ?? []).map((f) => (
              <tr key={f.id} className="border-t border-border align-top">
                <td className="p-3 font-medium">{f.question}</td>
                <td className="max-w-sm p-3 text-xs text-muted-foreground">{f.answer}</td>
                <td className="p-3 text-xs">{f.is_active ? "Live" : "Hidden"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setForm(toForm(f))}
                      aria-label={`Edit question: ${f.question}`}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm("Delete this question?")) remove.mutate(f.id);
                      }}
                      aria-label={`Delete question: ${f.question}`}
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
