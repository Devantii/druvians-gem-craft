-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price_from numeric(10,2),
  moq integer NOT NULL DEFAULT 25,
  image_url text,
  image_alt text NOT NULL DEFAULT '',
  branding_options text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are public" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Inquiries
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  quantity integer,
  product_name text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update inquiries" ON public.inquiries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete inquiries" ON public.inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
('drinkware', 'Drinkware', 'Insulated bottles, tumblers and premium mugs built for daily use.', 1),
('tech-gadgets', 'Tech & Gadgets', 'Power banks, wireless chargers and audio gifts that stay on desks.', 2),
('desk-stationery', 'Desk & Stationery', 'Leather journals, pen sets and desk organisers with fine finishing.', 3),
('apparel', 'Apparel & Merch', 'Polos, jackets and tees with embroidery and premium branding.', 4),
('eco-friendly', 'Eco-Friendly Gifts', 'Recycled, bamboo and plantable gifting for sustainable brands.', 5),
('hampers', 'Gift Hampers', 'Curated festive and welcome hampers, packed and delivered pan-India.', 6),
('awards-trophies', 'Awards & Trophies', 'Crystal, wood and metal awards for recognition moments.', 7),
('travel-bags', 'Travel & Bags', 'Laptop backpacks, duffels and travel organisers for teams on the move.', 8);

-- Seed products
INSERT INTO public.products (slug, name, short_description, description, category_id, price_from, moq, image_alt, branding_options, featured, sort_order)
VALUES
('signature-copper-bottle', 'Signature Copper Bottle', 'Hand-finished copper bottle in a rigid gift box.', 'A hand-finished copper bottle presented in a rigid magnetic gift box. Ideal for leadership gifting, onboarding kits and festive hampers.', (SELECT id FROM public.categories WHERE slug='drinkware'), 749, 25, 'Copper water bottle in a navy gift box', 'Laser engraving, box foiling', true, 1),
('vacuum-steel-tumbler', 'Vacuum Steel Tumbler', 'Double-wall tumbler that holds temperature for 12 hours.', 'Double-wall stainless steel tumbler with a leak-resistant lid. Keeps beverages hot or cold for up to 12 hours.', (SELECT id FROM public.categories WHERE slug='drinkware'), 549, 50, 'Stainless steel insulated tumbler', 'Laser engraving, UV print', false, 2),
('wireless-charging-pad', 'Wireless Charging Pad', 'Slim 15W pad with vegan leather top.', 'A slim 15W fast wireless charging pad with a vegan leather surface and anti-slip base. Comes with a braided cable.', (SELECT id FROM public.categories WHERE slug='tech-gadgets'), 899, 25, 'Wireless charging pad with leather finish', 'Debossing, UV print', true, 3),
('executive-power-bank', 'Executive Power Bank 10000mAh', 'Aluminium 10000mAh power bank with dual output.', 'Aluminium body 10000mAh power bank with USB-C PD and dual output ports, supplied in a premium sleeve box.', (SELECT id FROM public.categories WHERE slug='tech-gadgets'), 1149, 25, 'Aluminium power bank with cable', 'Laser engraving', false, 4),
('leather-journal-set', 'Leather Journal & Pen Set', 'Vegan leather journal with a metal roller pen.', 'A5 vegan leather journal with elastic closure paired with a brass-weighted roller pen, presented in a two-piece gift box.', (SELECT id FROM public.categories WHERE slug='desk-stationery'), 649, 50, 'Leather journal with metal pen', 'Debossing, foil stamping', true, 5),
('bamboo-desk-organiser', 'Bamboo Desk Organiser', 'Bamboo organiser with wireless charging deck.', 'Solid bamboo desk organiser with pen slots, phone stand and an integrated 10W wireless charging deck.', (SELECT id FROM public.categories WHERE slug='desk-stationery'), 1299, 25, 'Bamboo desk organiser on a workspace', 'Laser engraving', false, 6),
('premium-cotton-polo', 'Premium Cotton Polo', '220 GSM pique polo with embroidered logo.', '220 GSM cotton pique polo with a structured collar, available in eight colours and sizes XS to 3XL.', (SELECT id FROM public.categories WHERE slug='apparel'), 599, 50, 'Folded navy cotton polo shirt', 'Embroidery, woven label', false, 7),
('softshell-corporate-jacket', 'Softshell Corporate Jacket', 'Water-resistant softshell for offsites and events.', 'Water-resistant three-layer softshell jacket with zip pockets and a fleece lining. A favourite for offsites and annual days.', (SELECT id FROM public.categories WHERE slug='apparel'), 1699, 25, 'Navy softshell corporate jacket', 'Embroidery, silicone badge', true, 8),
('plantable-seed-diary', 'Plantable Seed Diary', 'Recycled diary with plantable seed paper pages.', 'Recycled paper diary with plantable seed paper covers and a seed pencil. A low-waste gift for sustainability programmes.', (SELECT id FROM public.categories WHERE slug='eco-friendly'), 399, 100, 'Recycled seed paper diary with pencil', 'Screen print, foil', false, 9),
('cork-laptop-sleeve', 'Cork Laptop Sleeve', 'Natural cork sleeve for 14 and 15 inch laptops.', 'Natural cork laptop sleeve with a padded interior, fitting 14 and 15 inch machines.', (SELECT id FROM public.categories WHERE slug='eco-friendly'), 899, 50, 'Cork laptop sleeve', 'Laser engraving', false, 10),
('welcome-kit-hamper', 'New Joiner Welcome Kit', 'Six-piece onboarding kit in a branded box.', 'A six-piece onboarding kit with bottle, notebook, pen, badge holder, tote and a welcome card, packed in a branded rigid box.', (SELECT id FROM public.categories WHERE slug='hampers'), 1899, 25, 'Employee welcome kit box with gifts', 'Full box branding', true, 11),
('festive-diwali-hamper', 'Festive Diwali Hamper', 'Dry fruits, candles and diyas in a keepsake tray.', 'A festive hamper with premium dry fruits, soy candles and hand-painted diyas in a reusable keepsake tray.', (SELECT id FROM public.categories WHERE slug='hampers'), 1499, 25, 'Diwali gift hamper tray with candles and dry fruits', 'Sleeve and card branding', true, 12),
('crystal-recognition-award', 'Crystal Recognition Award', 'Optical crystal award with 3D engraving.', 'Optical crystal award with 3D internal engraving and a velvet presentation case.', (SELECT id FROM public.categories WHERE slug='awards-trophies'), 1299, 10, 'Crystal award with engraving', '3D laser engraving', false, 13),
('walnut-wood-plaque', 'Walnut Wood Plaque', 'Walnut plaque with brushed metal plate.', 'Walnut wood plaque with a brushed metal engraving plate, supplied with a stand and gift box.', (SELECT id FROM public.categories WHERE slug='awards-trophies'), 999, 10, 'Walnut wood award plaque', 'Metal plate engraving', false, 14),
('executive-laptop-backpack', 'Executive Laptop Backpack', 'Water-resistant backpack with USB pass-through.', 'Water-resistant laptop backpack with a padded 15.6 inch compartment, luggage strap and USB pass-through port.', (SELECT id FROM public.categories WHERE slug='travel-bags'), 1599, 25, 'Navy executive laptop backpack', 'Embroidery, metal badge', true, 15),
('weekender-duffel', 'Weekender Duffel', 'Cabin-friendly duffel with a shoe compartment.', 'Cabin-friendly duffel bag with a separate shoe compartment and detachable shoulder strap.', (SELECT id FROM public.categories WHERE slug='travel-bags'), 1399, 25, 'Canvas weekender duffel bag', 'Embroidery, patch', false, 16);