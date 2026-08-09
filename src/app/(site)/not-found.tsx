import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="kicker mb-4">ERROR 404</p>
      <h1 className="text-3xl font-semibold text-text">No matching event found</h1>
      <p className="mt-3 max-w-md text-text-muted">
        That page doesn&apos;t exist. Check the URL, or head back to a known-good location.
      </p>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </section>
  );
}
