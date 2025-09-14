/**
 * Format a number with appropriate separators and precision
 * @param value The number to format
 * @param abbreviate Whether to abbreviate large numbers (e.g., 1.2M)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, abbreviate = false): string => {
  if (abbreviate) {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + "B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + "M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + "K";
    }
  }

  // Determine appropriate precision based on value
  let precision = 2;
  if (value < 0.01) precision = 6;
  else if (value < 1) precision = 4;
  else if (value >= 10000) precision = 0;

  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};
