/**
 * profileNormalizer.ts
 *
 * Provides pure utility functions to clean, normalize, and sanitize raw profile data.
 *
 * Normalization Strategy:
 * 1. String Sanitization: Trim whitespace and eliminate empty strings (or convert them to undefined).
 * 2. Null/Undefined Purging: Clean up objects recursively to omit empty keys, ensuring the prompt payloads are compact.
 * 3. Array Sanitization: Deduplicate string arrays and normalize objects inside list fields.
 * 4. Structural Fallbacks: Ensure list properties default to empty arrays `[]` rather than null or undefined.
 */

/**
 * Sanitizes a string by trimming it. Returns undefined if the string is empty.
 */
export function sanitizeString(val: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Sanitizes a number by ensuring it is a valid integer.
 */
export function sanitizeNumber(val: unknown): number | undefined {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const num = parseInt(val, 10);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

/**
 * Cleans an array of strings by trimming entries, filtering out empty ones, and deduplicating.
 */
export function cleanStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const cleaned = arr.map((item) => sanitizeString(item)).filter((item): item is string => !!item);
  return Array.from(new Set(cleaned));
}

/**
 * Sanitizes objects in arrays. Filters out items that lack primary identifier keys.
 * Removes empty/nullish properties from nested keys.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanObjectArray<T extends Record<string, any>>(
  arr: unknown,
  requiredKey: keyof T
): T[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null;

      const cleanedItem: Record<string, unknown> = {};
      Object.keys(item).forEach((key) => {
        const val = (item as Record<string, unknown>)[key];
        if (typeof val === 'string') {
          const s = sanitizeString(val);
          if (s !== undefined) cleanedItem[key] = s;
        } else if (typeof val === 'number') {
          const n = sanitizeNumber(val);
          if (n !== undefined) cleanedItem[key] = n;
        } else if (val !== null && val !== undefined) {
          cleanedItem[key] = val;
        }
      });
      return cleanedItem as T;
    })
    .filter((item): item is T => {
      return item !== null && item[requiredKey] !== undefined && item[requiredKey] !== '';
    });
}
