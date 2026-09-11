import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Druvians" },
      {
        name: "description",
        content:
          "Terms covering quotations, orders, payment, samples, delivery, cancellations and liability for Druvians corporate gifting.",
      },
      { property: "og:title", content: "Terms of Service | Druvians" },
      {
        property: "og:description",
        content: "Quotations, orders, payment, delivery, cancellations and liability terms.",
      },
      { property: "og:url", content: "https://druvians.com/terms" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Terms of service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 11 September 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl text-foreground">1. Quotations and pricing</h2>
          <p className="mt-2">
            Prices shown on this website are indicative starting prices for the stated minimum order
            quantity and exclude GST, freight and custom packaging. A formal quotation is valid for
            15 days from the date of issue.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">2. Orders and confirmation</h2>
          <p className="mt-2">
            An order is confirmed once we receive a written purchase order or written approval of
            our quotation, along with the agreed advance payment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">3. Artwork and approvals</h2>
          <p className="mt-2">
            You are responsible for supplying print-ready artwork and for approving mockups and
            samples. Production begins after written approval, and we are not liable for errors in
            approved artwork.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">4. Payment</h2>
          <p className="mt-2">
            Standard terms are an advance of 50% at order confirmation and the balance before
            dispatch, unless otherwise agreed in writing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">5. Delivery</h2>
          <p className="mt-2">
            Delivery timelines are estimates from the date of sample approval and can be affected by
            courier delays, festive volumes and force majeure events. Risk passes on delivery to the
            address you provide.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">6. Cancellations and returns</h2>
          <p className="mt-2">
            Customised and branded goods cannot be cancelled or returned once production has begun.
            Damaged or defective goods must be reported with photographs within 48 hours of delivery
            and will be replaced or credited.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">7. Intellectual property</h2>
          <p className="mt-2">
            You confirm you have the right to use any logo or artwork you supply. Website content,
            photography and branding remain the property of Druvians.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">8. Liability</h2>
          <p className="mt-2">
            Our total liability for any order is limited to the invoiced value of that order. We are
            not liable for indirect or consequential losses.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">9. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of India, and the courts of Mumbai have exclusive
            jurisdiction. Questions? Call {SITE.phone} or email {SITE.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
