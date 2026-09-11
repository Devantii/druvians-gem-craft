import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-gifts.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Druvians | Corporate Gifting Partner in India" },
      {
        name: "description",
        content:
          "Druvians is a corporate gifting studio curating, branding and delivering premium gifts for teams and clients across India.",
      },
      { property: "og:title", content: "About Druvians" },
      {
        property: "og:description",
        content:
          "A corporate gifting studio curating, branding and delivering premium gifts across India.",
      },
      { property: "og:url", content: "https://druvians.com/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/about" }],
  }),
  component: About,
});

const STEPS = [
  {
    title: "1. Brief",
    body: "Share the occasion, headcount, budget per head and delivery dates. A gifting consultant responds within one working day.",
  },
  {
    title: "2. Curation",
    body: "We propose two or three curated options with mockups showing your branding on each item and on the packaging.",
  },
  {
    title: "3. Sampling",
    body: "Approve a physical or digital sample before production begins. Nothing goes to bulk without your sign-off.",
  },
  {
    title: "4. Delivery",
    body: "Bulk delivery to your office or individual dispatch to home addresses, with tracking shared for every consignment.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="eyebrow">About us</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold">
        Gifting that carries your brand with the care it deserves
      </h1>
      <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
        Druvians is a corporate gifting studio built for Indian businesses that treat gifting as
        part of their brand experience, not an afterthought. We source, brand, pack and deliver
        gifts for onboarding, milestones, festivals, exhibitions and client appreciation, working
        with vetted manufacturers and a quality process that catches problems before your recipients
        do.
      </p>

      <img
        src={heroImage}
        alt="Premium branded corporate gift set arranged on a navy surface"
        loading="lazy"
        width={1600}
        height={1008}
        className="mt-12 w-full rounded-lg border border-border object-cover"
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/contact">Start a gifting brief</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/catalogue">Browse the catalogue</Link>
        </Button>
      </div>
    </div>
  );
}
