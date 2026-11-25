"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AnthropicLogo from "@/components/AnthropicLogo";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/partners";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <AnthropicLogo className="mx-auto mb-4 h-8 w-8 text-ink" />
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Sign in to Partner Hub
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Enter your credentials to access partner resources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-cream-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-ink"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-cream-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 rounded-md border border-cream-200 bg-cream-50 p-4">
        <p className="text-xs font-medium text-ink-muted">Demo accounts</p>
        <div className="mt-2 space-y-1 text-xs text-ink-muted">
          <p>
            <span className="font-medium text-ink">demo@anthropic.com</span>{" "}
            / demo123
          </p>
          <p>
            <span className="font-medium text-ink">partner@deloitte.com</span>{" "}
            / deloitte123
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <Suspense
        fallback={
          <div className="text-sm text-ink-muted">Loading&hellip;</div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
