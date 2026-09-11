import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { categoryImage, formatPrice, SITE } from "@/lib/site";
import type { Product } from "@/lib/catalogue";

export const Route = createFileRoute("/catalogue/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(slug, name)")
      .eq("slug", params.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as Product & { categories: { slug: string; name: string } | null };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Gift unavailable | Druvians" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} | Druvians Corporate Gifts`;
    const description = loaderData.short_description || loaderData.description.slice(0, 155);
    const url = `https://druvians.com/catalogue/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: loaderData.name,
            description,
            brand: { "@type": "Brand", name: "Druvians" },
          }),
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const product = Route.useLoaderData();
  const image = product.image_url || categoryImage(product.categories?.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link
        to="/catalogue"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to catalogue
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <img
          src={image}
          alt={product.image_alt || product.name}
          width={900}
          height={900}
          className="w-full rounded-lg border border-border object-cover"
        />

        <div>
          {product.categories ? <p className="eyebrow">{product.categories.name}</p> : null}
          <h1 className="mt-3 font-display text-4xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-lg text-primary">{formatPrice(product.price_from)}</p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              Minimum order quantity: {product.moq} pieces
            </li>
            {product.branding_options ? (
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-accent" aria-hidden="true" />
                Branding: {product.branding_options}
              </li>
            ) : null}
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              Samples available before bulk production
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/contact" search={{ product: product.name }}>
                Request a quote
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={SITE.phoneHref}>Call {SITE.phone}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
