/**
 * Normalizes text for search matching by:
 * - Converting to lowercase
 * - Trimming leading/trailing whitespace
 * - Collapsing multiple consecutive spaces into a single space
 * - Treating null/undefined as empty string
 */
export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
