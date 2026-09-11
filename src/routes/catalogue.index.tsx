import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/catalogue";

type Search = { category?: string };

export const Route = createFileRoute("/catalogue/")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search.category === "string" ? { category: search.category } : {},
  head: () => ({
    meta: [
      { title: "Corporate Gift Catalogue | Druvians" },
      {
        name: "description",
        content:
          "Browse Druvians corporate gifts: drinkware, tech gadgets, desk sets, apparel, eco gifts, hampers, awards and travel bags with branding options.",
      },
      { property: "og:title", content: "Corporate Gift Catalogue | Druvians" },
      {
        property: "og:description",
        content:
          "Browse premium corporate gifts with branding options, indicative pricing and minimum order quantities.",
      },
      { property: "og:url", content: "https://druvians.com/catalogue" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/catalogue" }],
  }),
  component: Catalogue,
});

function Catalogue() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogue" });
  const [term, setTerm] = useState("");

  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = products.filter((p) => {
    const inCategory = !activeCategory || p.category_id === activeCategory.id;
    const q = term.trim().toLowerCase();
    const matches =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return inCategory && matches;
  });

  const setCategory = (slug?: string) =>
    navigate({ search: slug ? { category: slug } : {}, replace: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">
        {activeCategory ? activeCategory.name : "Corporate gifts"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {activeCategory
          ? activeCategory.description
          : "Indicative pricing shown for standard branding. Share your quantity and we will confirm final pricing, samples and delivery timelines."}
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <label htmlFor="product-search" className="sr-only">
          Search gifts
        </label>
        <Input
          id="product-search"
          type="search"
          placeholder="Search gifts, e.g. bottle, hamper, backpack"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Button
            size="sm"
            variant={activeCategory ? "outline" : "default"}
            onClick={() => setCategory(undefined)}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={activeCategory?.id === c.id ? "default" : "outline"}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-12 text-sm text-muted-foreground">Loading gifts…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-lg border border-border bg-card p-10 text-center">
          <p className="font-display text-2xl">No gifts match that search</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another keyword, or{" "}
            <Link to="/contact" className="underline underline-offset-4">
              tell us what you need
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={product.category_id ? categoryById.get(product.category_id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
