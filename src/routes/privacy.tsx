import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Druvians" },
      {
        name: "description",
        content:
          "How Druvians collects, uses, stores and protects the personal information you share through our corporate gifting website.",
      },
      { property: "og:title", content: "Privacy Policy | Druvians" },
      {
        property: "og:description",
        content: "How Druvians collects, uses and protects your personal information.",
      },
      { property: "og:url", content: "https://druvians.com/privacy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 11 September 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl text-foreground">1. Who we are</h2>
          <p className="mt-2">
            Druvians ("we", "us") is a corporate gifting business operating from {SITE.address}. You
            can reach us at {SITE.phone} or {SITE.email} for any privacy question or request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">2. Information we collect</h2>
          <p className="mt-2">
            We collect the details you submit through our enquiry form: name, work email, phone
            number, company name, quantity, product interest and your message. We also collect basic
            technical data such as browser type, device type and pages visited, in aggregate form.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">3. How we use it</h2>
          <p className="mt-2">
            We use your information to respond to enquiries, prepare quotations, fulfil orders,
            issue invoices, provide customer support and improve our website. We do not sell your
            personal information to anyone.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">4. Cookies</h2>
          <p className="mt-2">
            We use essential cookies and local storage to run the website and remember your cookie
            choice. Optional analytics cookies are only used when you accept them in the cookie
            banner. You can clear cookies at any time in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">5. Sharing and processors</h2>
          <p className="mt-2">
            We share data only with service providers who help us operate: our website and database
            hosting provider, email provider and logistics partners for delivery. They process data
            on our instructions and are required to keep it secure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">6. Retention</h2>
          <p className="mt-2">
            Enquiry records are kept for up to three years so we can service repeat orders and meet
            accounting requirements, unless you ask us to delete them earlier.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">7. Your rights</h2>
          <p className="mt-2">
            You may request access to, correction of, or deletion of your personal information, and
            you may withdraw consent for marketing at any time. Email {SITE.email} and we will
            respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">8. Security</h2>
          <p className="mt-2">
            Data is transmitted over HTTPS and stored in access-controlled systems. No method of
            transmission is perfectly secure, but we take reasonable technical and organisational
            measures to protect your data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">9. Changes</h2>
          <p className="mt-2">
            We may update this policy from time to time. The revision date at the top of this page
            always reflects the current version.
          </p>
        </section>
      </div>
    </div>
  );
}
