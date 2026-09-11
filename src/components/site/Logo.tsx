import { Link } from "@tanstack/react-router";

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const tone = variant === "dark" ? "text-navy-foreground" : "text-primary";
  return (
    <Link to="/" className="group flex flex-col leading-none" aria-label="Druvians home">
      <span className={`font-display text-2xl font-semibold tracking-[0.22em] ${tone}`}>
        DRUVIANS
      </span>
      <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-accent">
        Corporate Gifts That Inspire
      </span>
    </Link>
  );
}
