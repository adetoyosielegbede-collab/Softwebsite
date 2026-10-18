import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-start justify-end px-6 pb-20 md:px-12">
      <p className="kicker">404</p>
      <h1 className="display mt-4 max-w-3xl text-5xl md:text-7xl">This page is not on the site.</h1>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
        Back home
      </Link>
    </div>
  );
}
