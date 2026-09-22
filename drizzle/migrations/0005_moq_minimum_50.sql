ALTER TABLE public.products ALTER COLUMN moq SET DEFAULT 50;
ALTER TABLE public.products ADD CONSTRAINT products_moq_min_50 CHECK (moq >= 50) NOT VALID;
UPDATE public.products SET moq = 50 WHERE moq < 50;
ALTER TABLE public.products VALIDATE CONSTRAINT products_moq_min_50;