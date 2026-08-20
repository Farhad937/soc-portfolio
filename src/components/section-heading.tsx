export default function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="kicker mb-3 animate-fade-in">{kicker}</p>
      <h2 className="animate-fade-in text-3xl font-semibold tracking-tight text-text [animation-delay:75ms] md:text-4xl">{title}</h2>
      {description && <p className="mt-4 animate-fade-in text-text-muted [animation-delay:150ms]">{description}</p>}
    </div>
  );
}
