export const daysBetween = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};
