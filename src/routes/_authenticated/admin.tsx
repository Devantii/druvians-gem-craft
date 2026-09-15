import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminProductsQuery, categoriesQuery, inquiriesQuery, type Product } from "@/lib/catalogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/site";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { FaqManager } from "@/components/admin/FaqManager";
import { PageManager } from "@/components/admin/PageManager";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Catalogue Admin | Druvians" },
      { name: "description", content: "Manage the Druvians gift catalogue and enquiries." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Catalogue Admin | Druvians" },
      { property: "og:description", content: "Manage the Druvians gift catalogue and enquiries." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Admin,
});

const emptyProduct = {
  id: "",
  slug: "",
  name: "",
  short_description: "",
  description: "",
  category_id: "",
  price_from: "",
  moq: "25",
  image_url: "",
  image_alt: "",
  branding_options: "",
  featured: false,
  is_active: true,
  sort_order: "0",
};

type FormState = typeof emptyProduct;

function toForm(p: Product): FormState {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    short_description: p.short_description,
    description: p.description,
    category_id: p.category_id ?? "",
    price_from: p.price_from === null ? "" : String(p.price_from),
    moq: String(p.moq),
    image_url: p.image_url ?? "",
    image_alt: p.image_alt,
    branding_options: p.branding_options,
    featured: p.featured,
    is_active: p.is_active,
    sort_order: String(p.sort_order),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    supabase.rpc("claim_first_admin").then(({ data, error }) => {
      if (error) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(Boolean(data));
    });
  }, []);

  const products = useQuery({ ...adminProductsQuery, enabled: isAdmin === true });
  const categories = useQuery(categoriesQuery);
  const inquiries = useQuery({ ...inquiriesQuery, enabled: isAdmin === true });

  const save = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        slug: values.slug || slugify(values.name),
        name: values.name,
        short_description: values.short_description,
        description: values.description,
        category_id: values.category_id || null,
        price_from: values.price_from ? Number(values.price_from) : null,
        moq: Number(values.moq) || 25,
        image_url: values.image_url || null,
        image_alt: values.image_alt,
        branding_options: values.branding_options,
        featured: values.featured,
        is_active: values.is_active,
        sort_order: Number(values.sort_order) || 0,
      };
      if (values.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Catalogue updated");
      setForm(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form) save.mutate(form);
  };

  if (isAdmin === null) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="font-display text-4xl font-semibold">Admin access required</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This account does not have catalogue permissions. Ask an existing administrator to grant
          you access, then reload this page.
        </p>
        <Button className="mt-8" variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Catalogue manager</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setForm({ ...emptyProduct })}>
            <Plus className="mr-2 size-4" aria-hidden="true" /> Add product
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="mt-10">
        <TabsList className="flex-wrap">
          <TabsTrigger value="products">Products ({products.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="categories">Collections</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQ</TabsTrigger>
          <TabsTrigger value="inquiries">Enquiries ({inquiries.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {form ? (
            <form
              onSubmit={onSubmit}
              className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <h2 className="font-display text-2xl font-semibold">
                  {form.id ? "Edit product" : "New product"}
                </h2>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL slug (optional)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  placeholder={slugify(form.name)}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Uncategorised</option>
                  {(categories.data ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="price">Starting price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price_from}
                  onChange={(e) => setForm({ ...form, price_from: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="moq">Minimum order quantity</Label>
                <Input
                  id="moq"
                  type="number"
                  min={1}
                  value={form.moq}
                  onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sort">Sort order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="short">Short description</Label>
                <Input
                  id="short"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Full description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={form.image_url}
                  placeholder="https://…"
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="alt">Image alt text</Label>
                <Input
                  id="alt"
                  value={form.image_alt}
                  onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="branding">Branding options</Label>
                <Input
                  id="branding"
                  value={form.branding_options}
                  onChange={(e) => setForm({ ...form, branding_options: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                <Label htmlFor="featured">Show on homepage</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="active"
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <Label htmlFor="active">Visible on site</Label>
              </div>

              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Save product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Catalogue products</caption>
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium">MOQ</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products.data ?? []).map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">
                      <span className="font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">/{p.slug}</span>
                    </td>
                    <td className="p-3">{formatPrice(p.price_from)}</td>
                    <td className="p-3">{p.moq}</td>
                    <td className="p-3 text-xs">
                      {p.is_active ? "Live" : "Hidden"}
                      {p.featured ? " · Featured" : ""}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setForm(toForm(p))}
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm(`Delete ${p.name}?`)) remove.mutate(p.id);
                          }}
                          aria-label={`Delete ${p.name}`}
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
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <PageManager />
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <FaqManager />
        </TabsContent>

        <TabsContent value="inquiries" className="mt-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Website enquiries</caption>
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3 font-medium">Received</th>
                  <th className="p-3 font-medium">Contact</th>
                  <th className="p-3 font-medium">Interest</th>
                  <th className="p-3 font-medium">Brief</th>
                </tr>
              </thead>
              <tbody>
                {(inquiries.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      No enquiries yet.
                    </td>
                  </tr>
                ) : (
                  (inquiries.data ?? []).map((i) => (
                    <tr key={i.id} className="border-t border-border align-top">
                      <td className="p-3 whitespace-nowrap">
                        {new Date(i.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{i.name}</span>
                        <span className="block text-xs text-muted-foreground">{i.email}</span>
                        <span className="block text-xs text-muted-foreground">{i.phone}</span>
                        {i.company ? (
                          <span className="block text-xs text-muted-foreground">{i.company}</span>
                        ) : null}
                      </td>
                      <td className="p-3 text-xs">
                        {i.product_name || "—"}
                        {i.quantity ? ` · ${i.quantity} pcs` : ""}
                      </td>
                      <td className="max-w-sm p-3 text-xs text-muted-foreground">{i.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
