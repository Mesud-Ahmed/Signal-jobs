import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Normalizes an external URL (job link, Telegram channel post, application form).
 * Automatically prepends https:// if omitted by user/data-entry staff.
 */
export function normalizeExternalUrl(raw?: string | null): string {
  if (!raw) return "";
  let trimmed = raw.trim();
  if (!trimmed) return "";

  // Strip leading/trailing quotes or brackets if pasted inadvertently
  trimmed = trimmed.replace(/^["'<(\[]+|[>"')\]]+$/g, "");

  // If protocol is missing, prepend https://
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Ensures an app base URL uses https:// and strips trailing slashes.
 */
export function ensureHttps(url?: string | null): string {
  if (!url) return "";
  let trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return "";

  // Do not force HTTPS for local development (localhost or 127.0.0.1)
  if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
    if (!/^https?:\/\//i.test(trimmed)) {
      return `http://${trimmed}`;
    }
    return trimmed;
  }

  // Upgrade http:// to https:// in staging/production
  if (trimmed.startsWith("http://")) {
    trimmed = trimmed.replace(/^http:\/\//i, "https://");
  } else if (!trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Validates that an input looks like a valid web URL or Telegram post link.
 */
export function isValidWebUrl(raw?: string | null): boolean {
  if (!raw) return false;
  const normalized = normalizeExternalUrl(raw);
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
