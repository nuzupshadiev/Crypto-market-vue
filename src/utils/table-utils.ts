import MarketAPI from "@/API/market";
import type {
  MarketTableItem,
  SortConfig,
  FilterConfig,
  MarketFilters,
} from "@/types/table";
import { formatNumber } from "./format-utils";

/**
 * Transform MarketAPI data to MarketTableItem format
 */
export const transformMarketData = (data: MarketAPI[]): MarketTableItem[] => {
  return data.map((item) => ({
    id: `${item.data.pair.primary}-${item.data.pair.secondary}`,
    pair: {
      primary: item.data.pair.primary,
      secondary: item.data.pair.secondary,
    },
    price: {
      last: parseFloat(item.data.price.last),
      bestBid: parseFloat(item.data.price.bestBid),
      bestOffer: parseFloat(item.data.price.bestOffer),
      change: {
        direction: item.data.price.change.direction,
        percent: parseFloat(item.data.price.change.percent),
        amount: parseFloat(item.data.price.change.amount),
      },
    },
    volume: {
      primary: parseFloat(item.data.volume.primary),
      secondary: parseFloat(item.data.volume.secondary),
    },
    priceHistory: item.data.priceHistory.map(Number),
  }));
};

/**
 * Calculate volume percentages for all items
 */
export const calculateVolumePercentages = (
  items: MarketTableItem[]
): MarketTableItem[] => {
  const totalVolume = items.reduce(
    (sum, item) => sum + item.volume.secondary,
    0
  );

  return items.map((item) => ({
    ...item,
    volumePercent:
      totalVolume > 0 ? (item.volume.secondary / totalVolume) * 100 : 0,
  }));
};

/**
 * Sort data based on configuration
 */
export const sortData = <T>(
  data: T[],
  sortConfig: SortConfig,
  getValue: (item: T, column: string) => any
): T[] => {
  if (!sortConfig.column || !sortConfig.direction) {
    return data;
  }

  const sorted = [...data].sort((a, b) => {
    const valueA = getValue(a, sortConfig.column);
    const valueB = getValue(b, sortConfig.column);

    // Handle null/undefined values
    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    // Handle different data types
    let comparison = 0;

    if (typeof valueA === "number" && typeof valueB === "number") {
      comparison = valueA - valueB;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      comparison = valueA.localeCompare(valueB);
    } else if (typeof valueA === "object" && typeof valueB === "object") {
      // Handle complex objects like pair sorting
      if (sortConfig.column === "pair") {
        const pairA = valueA as { primary: string; secondary: string };
        const pairB = valueB as { primary: string; secondary: string };
        const pairStringA = `${pairA.primary}/${pairA.secondary}`;
        const pairStringB = `${pairB.primary}/${pairB.secondary}`;
        comparison = pairStringA.localeCompare(pairStringB);
      } else if (sortConfig.column === "price.change") {
        // Sort by percent value for price change
        const changeA = valueA as { percent: number };
        const changeB = valueB as { percent: number };
        comparison = changeA.percent - changeB.percent;
      } else if (sortConfig.column === "volume") {
        // Sort by secondary volume value (the main volume metric)
        const volumeA = valueA as { primary: number; secondary: number };
        const volumeB = valueB as { primary: number; secondary: number };
        comparison = volumeA.secondary - volumeB.secondary;
      } else {
        // Fallback to string comparison
        comparison = String(valueA).localeCompare(String(valueB));
      }
    } else {
      // Mixed types - convert to string for comparison
      comparison = String(valueA).localeCompare(String(valueB));
    }

    return sortConfig.direction === "ascending" ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Filter data based on configuration
 */
export const filterData = <T>(
  data: T[],
  filterConfig: FilterConfig,
  getValue: (item: T, key: string) => any,
  currencyMap?: Record<string, any>
): T[] => {
  return data.filter((item) => {
    // Search filter
    if (filterConfig.search) {
      const searchValue = filterConfig.search.toLowerCase();

      // Check regular string fields
      const searchableFields = Object.keys(item as any).filter(
        (key) => typeof getValue(item, key) === "string"
      );

      const matchesRegularSearch = searchableFields.some((field) =>
        getValue(item, field)?.toLowerCase().includes(searchValue)
      );

      // Check ticker-based search for market items
      let matchesTickerSearch = false;
      if (currencyMap && (item as any).pair) {
        const marketItem = item as any;
        const baseCurrency = currencyMap[marketItem.pair.primary];
        const quoteCurrency = currencyMap[marketItem.pair.secondary];
        const baseTicker =
          baseCurrency?.data?.ticker?.toLowerCase() ||
          marketItem.pair.primary.toLowerCase();
        const quoteTicker =
          quoteCurrency?.data?.ticker?.toLowerCase() ||
          marketItem.pair.secondary.toLowerCase();

        const pairText = `${baseTicker}/${quoteTicker}`;

        matchesTickerSearch =
          pairText.includes(searchValue) ||
          baseTicker.includes(searchValue) ||
          quoteTicker.includes(searchValue);
      }

      if (!matchesRegularSearch && !matchesTickerSearch) return false;
    }

    // Custom filters
    if (filterConfig.customFilters) {
      for (const [, filterFn] of Object.entries(filterConfig.customFilters)) {
        if (!filterFn(item)) return false;
      }
    }

    // Regular filters
    if (filterConfig.filters) {
      for (const [key, value] of Object.entries(filterConfig.filters)) {
        if (value !== undefined && value !== null && value !== "") {
          const itemValue = getValue(item, key);
          if (Array.isArray(value)) {
            if (!value.includes(itemValue)) return false;
          } else if (itemValue !== value) {
            return false;
          }
        }
      }
    }

    return true;
  });
};

/**
 * Market-specific filter function
 */
export const createMarketFilters = (filters: MarketFilters) => {
  return {
    search: filters.search,
    filters: {
      "pair.primary":
        filters.baseCurrencies.length > 0 ? filters.baseCurrencies : undefined,
      "pair.secondary":
        filters.quoteCurrencies.length > 0
          ? filters.quoteCurrencies
          : undefined,
      "price.change.direction": filters.direction || undefined,
    },
    customFilters: {
      changeRange: (item: MarketTableItem) => {
        const change = item.price.change.percent;
        const signedChange =
          item.price.change.direction === "Down"
            ? -Math.abs(change)
            : Math.abs(change);
        return (
          signedChange >= filters.changeMin && signedChange <= filters.changeMax
        );
      },
    },
  };
};

/**
 * Get value from nested object path
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

/**
 * Format currency with proper decimals
 */
export const formatCurrency = (
  value: number,
  _currencyCode: string,
  decimals?: number,
  showSymbol = true
): string => {
  const formatted =
    decimals !== undefined ? value.toFixed(decimals) : formatNumber(value);

  return showSymbol ? `$${formatted}` : formatted;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get change indicator color
 */
export const getChangeColor = (direction: "Up" | "Down" | "None"): string => {
  switch (direction) {
    case "Up":
      return "text-green-600";
    case "Down":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

/**
 * Generate unique IDs for table rows
 */
export const generateRowId = (prefix: string, index: number): string => {
  return `${prefix}-${index}`;
};

/**
 * Check if value is empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};
