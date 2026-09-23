import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Boxes, Palette, Truck } from "lucide-react";
import heroImage from "@/assets/hero-gifts.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/catalogue";
import { categoryImage, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Druvians | Corporate Gifts That Inspire" },
      {
        name: "description",
        content:
          "Premium corporate gifting from Druvians: welcome kits, festive hampers, branded drinkware, tech gifts and awards, delivered across India.",
      },
      { property: "og:title", content: "Druvians | Corporate Gifts That Inspire" },
      {
        property: "og:description",
        content:
          "Premium corporate gifting from Druvians: welcome kits, festive hampers, branded drinkware, tech gifts and awards, delivered across India.",
      },
      { property: "og:url", content: "https://druvians.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://druvians.com/" },
      { rel: "preload", as: "image", href: heroImage },
    ],
  }),
  component: Home,
});

const PROMISES = [
  {
    icon: Palette,
    title: "Brand-true customisation",
    body: "Laser engraving, embroidery, foil and full box branding matched to your brand guide.",
  },
  {
    icon: Boxes,
    title: "Curated, not catalogued",
    body: "We build gift sets around the occasion, the recipient and your budget per head.",
  },
  {
    icon: Truck,
    title: "Pan-India fulfilment",
    body: "Bulk delivery to one office or individual dispatch to hundreds of home addresses.",
  },
  {
    icon: BadgeCheck,
    title: "Quality checked twice",
    body: "Pre-production samples plus a final QC pass before anything leaves our floor.",
  },
];

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <section className="surface-navy relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="eyebrow">Corporate gifting studio</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Gifts your team and clients actually <span className="text-gradient-gold">keep</span>.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-navy-foreground/80">
              Druvians designs, brands and delivers premium corporate gifts for onboarding,
              milestones, festivals and client appreciation, anywhere in India.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/catalogue">
                  Explore the catalogue <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="onNavy">
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-navy-foreground/15 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-widest text-accent">Gift sets</dt>
                <dd className="mt-1 font-display text-2xl">300+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-accent">Cities served</dt>
                <dd className="mt-1 font-display text-2xl">80+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-accent">Min. order</dt>
                <dd className="mt-1 font-display text-2xl">50 pcs</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Navy and gold corporate gift set with copper bottle, leather journal and ribboned gift box"
              width={1600}
              height={1008}
              fetchPriority="high"
              className="rounded-lg border border-navy-foreground/10 shadow-luxe"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6">
              <Icon className="size-6 text-accent" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse by category</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Gifting collections</h2>
          </div>
          <Link
            to="/catalogue"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            See everything
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/catalogue"
              search={{ category: category.slug }}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <img
                src={categoryImage(category.slug)}
                alt={`${category.name} corporate gifts`}
                loading="lazy"
                width={900}
                height={900}
                className="aspect-square size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="surface-navy absolute inset-x-0 bottom-0 p-4 opacity-95">
                <h3 className="font-display text-lg font-semibold">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-navy-foreground/75">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length ? (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <p className="eyebrow">Client favourites</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Featured gifts</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={
                  product.category_id ? categoryById.get(product.category_id) : undefined
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="surface-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <p className="eyebrow">Ready when you are</p>
          <h2 className="max-w-2xl font-display text-4xl font-semibold">
            Tell us the occasion, headcount and budget. We will send a curated proposal.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">Request a quote</Link>
            </Button>
            <Button asChild size="lg" variant="onNavy">
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer noopener">
                WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
