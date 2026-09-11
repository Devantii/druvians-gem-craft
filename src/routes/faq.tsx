import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "What is the minimum order quantity?",
    a: "Most gifts start at 25 pieces, and awards start at 10. Hampers can be curated from 25 sets. Tell us your headcount and we will confirm.",
  },
  {
    q: "How long does an order take?",
    a: "Standard branded orders ship in 7 to 12 working days after sample approval. Festive periods need 3 to 4 weeks, so plan early.",
  },
  {
    q: "Can I see a sample before bulk production?",
    a: "Yes. We share digital mockups free of cost, and physical samples are chargeable but adjusted against your final invoice.",
  },
  {
    q: "Do you deliver to individual home addresses?",
    a: "Yes. We handle both bulk delivery to one office and individual dispatch to hundreds of home addresses with tracking for each parcel.",
  },
  {
    q: "What branding methods do you offer?",
    a: "Laser engraving, embroidery, UV printing, screen printing, debossing, foil stamping, metal badges and full custom packaging.",
  },
  {
    q: "How is pricing decided?",
    a: "Pricing depends on quantity, branding method and packaging. The catalogue shows indicative starting prices exclusive of GST and freight.",
  },
  {
    q: "Do you support GST invoicing and vendor onboarding?",
    a: "Yes. We issue GST invoices and can complete your standard vendor onboarding and compliance documentation.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Druvians Corporate Gifting" },
      {
        name: "description",
        content:
          "Answers on minimum order quantities, timelines, samples, branding methods, delivery and GST invoicing for Druvians corporate gifts.",
      },
      { property: "og:title", content: "Druvians FAQ" },
      {
        property: "og:description",
        content: "Order quantities, timelines, samples, branding, delivery and invoicing answered.",
      },
      { property: "og:url", content: "https://druvians.com/faq" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">Questions</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Frequently asked</h1>

      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger className="text-left font-display text-lg">{item.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
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
