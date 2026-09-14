import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/lib/site";
import { fetchFaqs, fetchPage } from "@/lib/content";
import { PageBody } from "@/components/site/PageBody";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    const [page, faqs] = await Promise.all([fetchPage("faq"), fetchFaqs()]);
    return { page, faqs };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page?.meta_title || "FAQ | Druvians Corporate Gifting";
    const description =
      loaderData?.page?.meta_description ||
      "Answers on minimum order quantities, timelines, samples, branding methods, delivery and GST invoicing for Druvians corporate gifts.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://druvians.com/faq" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "https://druvians.com/faq" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (loaderData?.faqs ?? []).map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        },
      ],
    };
  },
  component: Faq,
});

function Faq() {
  const { page, faqs } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">{page?.eyebrow || "Questions"}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{page?.title || "Frequently asked"}</h1>
      {page?.subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground">{page.subtitle}</p>
      ) : null}
      <PageBody body={page?.body ?? ""} />

      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-display text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-10 text-sm text-muted-foreground">
        Still unsure? Call {SITE.phone} or{" "}
        <Link to="/contact" className="underline underline-offset-4">
          send us your brief
        </Link>
        .
      </p>
    </div>
  );
}
