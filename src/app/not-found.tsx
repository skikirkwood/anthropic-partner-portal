import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-32 text-center">
      <span className="font-serif text-5xl font-semibold text-ink-muted">404</span>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
      >
        Back to home
      </Link>
    </div>
  );
}
