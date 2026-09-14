import { createFileRoute } from "@tanstack/react-router";
import { fetchPage } from "@/lib/content";
import { PageBody } from "@/components/site/PageBody";

export const Route = createFileRoute("/terms")({
  loader: () => fetchPage("terms"),
  head: ({ loaderData }) => {
    const title = loaderData?.meta_title || "Terms of Service | Druvians";
    const description =
      loaderData?.meta_description ||
      "Terms covering quotations, orders, payment, samples, delivery, cancellations and liability for Druvians corporate gifting.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://druvians.com/terms" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "https://druvians.com/terms" }],
    };
  },
  component: Terms,
});

function Terms() {
  const page = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">{page?.eyebrow || "Legal"}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">
        {page?.title || "Terms of service"}
      </h1>
      {page?.subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground">{page.subtitle}</p>
      ) : null}
      <PageBody body={page?.body ?? ""} />
    </div>
  );
}
