import { cookies } from "next/headers";

export const DEFAULT_LOCALE = "en-US";
export const SUPPORTED_LOCALES = ["en-US", "fr-CA", "de-DE"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Read the user's preferred locale from the `locale` cookie (server-side).
 * Falls back to en-US if unset or unrecognized.
 */
export function getLocale(): SupportedLocale {
  const jar = cookies();
  const raw = jar.get("locale")?.value;
  if (raw && (SUPPORTED_LOCALES as readonly string[]).includes(raw)) {
    return raw as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}
