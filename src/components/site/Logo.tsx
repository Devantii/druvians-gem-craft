import { Link } from "@tanstack/react-router";
import markImg from "@/assets/druvians-mark.png";

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const tone = variant === "dark" ? "text-navy-foreground" : "text-primary";
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Druvians home">
      <img
        src={markImg}
        alt=""
        className="h-10 w-10 object-contain md:h-12 md:w-12"
      />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-2xl font-semibold tracking-[0.22em] ${tone}`}>
          DRUVIANS
        </span>
        <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-accent">
          Corporate Gifts That Inspire
        </span>
      </span>
    </Link>
  );
}
