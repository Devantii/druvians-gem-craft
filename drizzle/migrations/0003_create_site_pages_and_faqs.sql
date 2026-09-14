CREATE TABLE public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  eyebrow TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are public" ON public.site_pages
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage pages" ON public.site_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_pages_updated_at BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active faqs are public" ON public.faqs
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins manage faqs" ON public.faqs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('What is the minimum order quantity?', 'Most gifts start at 25 pieces, and awards start at 10. Hampers can be curated from 25 sets. Tell us your headcount and we will confirm.', 1),
('How long does an order take?', 'Standard branded orders ship in 7 to 12 working days after sample approval. Festive periods need 3 to 4 weeks, so plan early.', 2),
('Can I see a sample before bulk production?', 'Yes. We share digital mockups free of cost, and physical samples are chargeable but adjusted against your final invoice.', 3),
('Do you deliver to individual home addresses?', 'Yes. We handle both bulk delivery to one office and individual dispatch to hundreds of home addresses with tracking for each parcel.', 4),
('What branding methods do you offer?', 'Laser engraving, embroidery, UV printing, screen printing, debossing, foil stamping, metal badges and full custom packaging.', 5),
('How is pricing decided?', 'Pricing depends on quantity, branding method and packaging. The catalogue shows indicative starting prices exclusive of GST and freight.', 6),
('Do you support GST invoicing and vendor onboarding?', 'Yes. We issue GST invoices and can complete your standard vendor onboarding and compliance documentation.', 7);

INSERT INTO public.site_pages (slug, title, eyebrow, subtitle, meta_title, meta_description, body) VALUES
('faq', 'Frequently asked', 'Questions', '', 'FAQ | Druvians Corporate Gifting', 'Answers on minimum order quantities, timelines, samples, branding methods, delivery and GST invoicing for Druvians corporate gifts.', ''),
('privacy', 'Privacy policy', 'Legal', 'Last updated: 11 September 2026', 'Privacy Policy | Druvians', 'How Druvians collects, uses, stores and protects the personal information you share through our corporate gifting website.',
$body$## 1. Who we are
Druvians ("we", "us") is a corporate gifting business operating from Mumbai, Maharashtra, India. You can reach us at +91 9152307515 or hello@druvians.com for any privacy question or request.

## 2. Information we collect
We collect the details you submit through our enquiry form: name, work email, phone number, company name, quantity, product interest and your message. We also collect basic technical data such as browser type, device type and pages visited, in aggregate form.

## 3. How we use it
We use your information to respond to enquiries, prepare quotations, fulfil orders, issue invoices, provide customer support and improve our website. We do not sell your personal information to anyone.

## 4. Cookies
We use essential cookies and local storage to run the website and remember your cookie choice. Optional analytics cookies are only used when you accept them in the cookie banner. You can clear cookies at any time in your browser settings.

## 5. Sharing and processors
We share data only with service providers who help us operate: our website and database hosting provider, email provider and logistics partners for delivery. They process data on our instructions and are required to keep it secure.

## 6. Retention
Enquiry records are kept for up to three years so we can service repeat orders and meet accounting requirements, unless you ask us to delete them earlier.

## 7. Your rights
You may request access to, correction of, or deletion of your personal information, and you may withdraw consent for marketing at any time. Email hello@druvians.com and we will respond within 30 days.

## 8. Security
Data is transmitted over HTTPS and stored in access-controlled systems. No method of transmission is perfectly secure, but we take reasonable technical and organisational measures to protect your data.

## 9. Changes
We may update this policy from time to time. The revision date at the top of this page always reflects the current version.$body$),
('terms', 'Terms of service', 'Legal', 'Last updated: 11 September 2026', 'Terms of Service | Druvians', 'Terms covering quotations, orders, payment, samples, delivery, cancellations and liability for Druvians corporate gifting.',
$body$## 1. Quotations and pricing
Prices shown on this website are indicative starting prices for the stated minimum order quantity and exclude GST, freight and custom packaging. A formal quotation is valid for 15 days from the date of issue.

## 2. Orders and confirmation
An order is confirmed once we receive a written purchase order or written approval of our quotation, along with the agreed advance payment.

## 3. Artwork and approvals
You are responsible for supplying print-ready artwork and for approving mockups and samples. Production begins after written approval, and we are not liable for errors in approved artwork.

## 4. Payment
Standard terms are an advance of 50% at order confirmation and the balance before dispatch, unless otherwise agreed in writing.

## 5. Delivery
Delivery timelines are estimates from the date of sample approval and can be affected by courier delays, festive volumes and force majeure events. Risk passes on delivery to the address you provide.

## 6. Cancellations and returns
Customised and branded goods cannot be cancelled or returned once production has begun. Damaged or defective goods must be reported with photographs within 48 hours of delivery and will be replaced or credited.

## 7. Intellectual property
You confirm you have the right to use any logo or artwork you supply. Website content, photography and branding remain the property of Druvians.

## 8. Liability
Our total liability for any order is limited to the invoiced value of that order. We are not liable for indirect or consequential losses.

## 9. Governing law
These terms are governed by the laws of India, and the courts of Mumbai have exclusive jurisdiction. Questions? Call +91 9152307515 or email hello@druvians.com.$body$),
('about', 'About Druvians', 'Who we are', '', 'About Druvians | Corporate Gifting Partner', 'Druvians curates and delivers premium branded corporate gifts for teams, clients and events across India.', '');
