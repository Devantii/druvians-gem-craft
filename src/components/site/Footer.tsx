import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="surface-navy mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold tracking-[0.22em]">DRUVIANS</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-accent">{SITE.tagline}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-navy-foreground/75">
            Curated corporate gifting for onboarding kits, client appreciation, festive campaigns
            and recognition programmes. Branded, packed and delivered across India.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/80">
            <li>
              <Link to="/catalogue" className="hover:text-accent">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-accent">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-accent">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-accent">
                Terms of service
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <a href={SITE.phoneHref} className="hover:text-accent">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-accent" aria-hidden="true" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Druvians. All rights reserved.</p>
          <Link to="/admin" className="hover:text-accent">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
