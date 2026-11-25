import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-200">
        <span className="text-2xl font-bold text-charcoal-muted">404</span>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-charcoal">Page not found</h1>
      <p className="mt-2 text-charcoal-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
      >
        Back to home
      </Link>
    </div>
  );
}
