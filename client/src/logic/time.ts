/**
 * Is t1 before t2.
 * @param t1 Date to check for
 * @param t2 Date to compare to
 * @returns boolean
 */
export function isBefore(t1: Date, t2: Date) {
  return t1.valueOf() < t2.valueOf();
}
