import { Link } from "@tanstack/react-router";
import type { Category, Product } from "@/lib/catalogue";
import { categoryImage, formatPrice } from "@/lib/site";

export function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category | undefined;
}) {
  const src = product.image_url || categoryImage(category?.slug);
  return (
    <Link
      to="/catalogue/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-luxe"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={src}
          alt={product.image_alt || product.name}
          loading="lazy"
          width={900}
          height={900}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category ? (
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {category.name}
          </span>
        ) : null}
        <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-medium text-primary">{formatPrice(product.price_from)}</span>
          <span className="text-xs text-muted-foreground">MOQ {product.moq}</span>
        </div>
      </div>
    </Link>
  );
}
