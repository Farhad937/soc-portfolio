export default function SectionHeading({
  kicker,
  title,
  description,
  motion,
}: {
  kicker: string;
  title: string;
  description?: string;
  motion?: "home" | "about";
}) {
  const kickerMotion = motion ? "animate-slide-in" : "animate-fade-in";
  return (
    <div className="mb-12 max-w-2xl">
      <p className={`kicker mb-3 ${kickerMotion}`}>{kicker}</p>
      <h2 className="animate-fade-in text-3xl font-semibold tracking-tight text-text [animation-delay:75ms] md:text-4xl">{title}</h2>
      {description && <p className="mt-4 animate-fade-in text-text-muted [animation-delay:150ms]">{description}</p>}
    </div>
  );
}
