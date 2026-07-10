import { diffWords, Change } from 'diff';

export interface DiffSegment {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

/**
 * Calculates string difference word-by-word using the 'diff' npm package.
 * Returns formatted segments for visual markup injection.
 */
export const calculateStringDiff = (oldText: string, newText: string): DiffSegment[] => {
  const diffs = diffWords(oldText, newText);
  return diffs.map((part: Change) => {
    let type: 'added' | 'removed' | 'unchanged' = 'unchanged';
    if (part.added) {
      type = 'added';
    } else if (part.removed) {
      type = 'removed';
    }
    return {
      type,
      value: part.value,
    };
  });
};

export default calculateStringDiff;
