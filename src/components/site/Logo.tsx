import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/druvians-logo.webp";

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <Link to="/" className="group flex items-center" aria-label="Druvians home">
      <img
        src={logoImg}
        alt="Druvians — Corporate Gifts That Inspire"
        className="h-14 w-auto rounded-md object-contain md:h-16"
      />
    </Link>
  );
}
