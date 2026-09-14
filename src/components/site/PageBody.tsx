import { parseBody } from "@/lib/content";

export function PageBody({ body }: { body: string }) {
  const blocks = parseBody(body);
  if (blocks.length === 0) return null;

  return (
    <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, index) => (
        <section key={`${block.heading ?? "intro"}-${index}`}>
          {block.heading ? (
            <h2 className="font-display text-2xl text-foreground">{block.heading}</h2>
          ) : null}
          {block.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-2">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
