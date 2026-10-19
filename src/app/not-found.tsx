import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-signal uppercase">404</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">This page is not on the map.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
          The address may have changed, or the page has not been published yet.
        </p>
        <Link href="/" className="mt-8 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper hover:bg-signal hover:text-black">
          Back to Softcom
        </Link>
      </div>
    </main>
  );
}
