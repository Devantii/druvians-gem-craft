DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;

CREATE POLICY "Anyone can submit an inquiry"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND length(name) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 200
  AND email LIKE '%_@_%.__%'
  AND length(phone) <= 40
  AND length(company) <= 160
  AND length(product_name) <= 200
  AND length(message) <= 4000
  AND (quantity IS NULL OR (quantity > 0 AND quantity <= 1000000))
);