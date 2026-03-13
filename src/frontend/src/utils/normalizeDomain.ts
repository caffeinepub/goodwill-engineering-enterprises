/**
 * Normalizes a domain string to canonical form:
 * - Converts to lowercase
 * - Strips protocol (http://, https://)
 * - Removes www. prefix
 * - Removes any path, query, or fragment
 * - Trims whitespace
 * - Removes trailing slashes
 *
 * @param domain - The domain string to normalize
 * @returns The normalized domain string
 */
export function normalizeDomain(domain: string): string {
  if (!domain) return "";

  let normalized = domain.trim().toLowerCase();

  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, "");

  // Remove www. prefix
  normalized = normalized.replace(/^www\./, "");

  // Remove any path, query, or fragment
  normalized = normalized.split("/")[0].split("?")[0].split("#")[0];

  // Remove trailing dots
  normalized = normalized.replace(/\.+$/, "");

  return normalized;
}
