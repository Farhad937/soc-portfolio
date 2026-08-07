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
      <p className="kicker mb-3">{kicker}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-text-muted">{description}</p>}
    </div>
  );
}
