/** Balance complete words into an exact number of lines without hiding content. */
export function balanceBenefitLines(text: string, lines: number, maxWidth: number, measure: (text: string) => number): string[] | null {
  const words = text.trim().split(/\s+/);
  const count = words.length;
  if (lines > count) return null;
  const targetWidth = measure(text) / lines;
  const cost = Array.from({ length: lines + 1 }, () => Array(count + 1).fill(Infinity));
  const breaks = Array.from({ length: lines + 1 }, () => Array(count + 1).fill(-1));
  cost[0][0] = 0;

  for (let row = 1; row <= lines; row++) {
    for (let end = row; end <= count; end++) {
      for (let start = row - 1; start < end; start++) {
        if (!Number.isFinite(cost[row - 1][start])) continue;
        const width = measure(words.slice(start, end).join(' '));
        if (width > maxWidth) continue;
        const candidate = cost[row - 1][start] + (width - targetWidth) ** 2;
        if (candidate < cost[row][end]) {
          cost[row][end] = candidate;
          breaks[row][end] = start;
        }
      }
    }
  }

  if (!Number.isFinite(cost[lines][count])) return null;
  const result: string[] = [];
  let end = count;
  for (let row = lines; row > 0; row--) {
    const start = breaks[row][end];
    result.unshift(words.slice(start, end).join(' '));
    end = start;
  }
  return result;
}
