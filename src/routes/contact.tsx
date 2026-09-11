import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/site";

type Search = { product?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["product"] === "string" ? { product: search["product"] } : {},
  head: () => ({
    meta: [
      { title: "Contact Druvians | Corporate Gifting Enquiries" },
      {
        name: "description",
        content:
          "Request a corporate gifting quote from Druvians. Call +91 9152307515 or send your brief and we respond within one working day.",
      },
      { property: "og:title", content: "Contact Druvians" },
      {
        property: "og:description",
        content: "Request a corporate gifting quote. Call +91 9152307515 or send your brief.",
      },
      { property: "og:url", content: "https://druvians.com/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://druvians.com/contact" }],
  }),
  component: Contact,
});

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

function Contact() {
  const { product } = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const values = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      quantity: Number(fd.get("quantity")) || null,
      product_name: String(fd.get("product_name") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    const next: Errors = {};
    if (values.name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a valid phone number.";
    if (values.message.length < 10) next.message = "Tell us a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert(values);
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't send that. Please call us instead.");
      return;
    }
    form.reset();
    setDone(true);
    toast.success("Thank you. We'll reply within one working day.");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Let's plan your gifting</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Share the occasion, quantity and budget per head. A gifting consultant replies within one
        working day with curated options and pricing.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name *</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="mt-2"
              />
              {errors.name ? (
                <p id="name-error" className="mt-1 text-xs text-destructive">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="email">Work email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-2"
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-xs text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className="mt-2"
              />
              {errors.phone ? (
                <p id="phone-error" className="mt-1 text-xs text-destructive">
                  {errors.phone}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" autoComplete="organization" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="product_name">Gift of interest</Label>
              <Input
                id="product_name"
                name="product_name"
                defaultValue={product ?? ""}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Approx. quantity</Label>
              <Input id="quantity" name="quantity" type="number" min={1} className="mt-2" />
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor="message">Your brief *</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              required
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="mt-2"
              placeholder="Occasion, budget per head, delivery city and timeline"
            />
            {errors.message ? (
              <p id="message-error" className="mt-1 text-xs text-destructive">
                {errors.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" size="lg" className="mt-6" disabled={submitting}>
            {submitting ? "Sending…" : "Send enquiry"}
          </Button>

          <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {done ? "Thank you — your enquiry has reached our team." : ""}
          </p>
        </form>

        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Talk to us directly</h2>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <a href={SITE.phoneHref} className="hover:underline">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="hover:underline">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
          <Button asChild variant="outline" className="mt-8 w-full">
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer noopener">
              Chat on WhatsApp
            </a>
          </Button>
        </aside>
      </div>
    </div>
  );
}
