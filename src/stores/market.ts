import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQuery } from "../composables/useQuery";
import MarketAPI from "../API/market";

export const useMarketStore = defineStore("market", () => {
  // Memoized query data
  const marketsQuery = computed(() => MarketAPI.getAll());

  // Use useQuery for markets
  const {
    data: markets,
    loading: marketsLoading,
    lastUpdated: marketsLastUpdated,
    refetch: refetchMarkets,
  } = useQuery<MarketAPI[]>(marketsQuery, {
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: true,
    keepPreviousData: true,
  });

  // Computed state
  const loading = computed(() => marketsLoading.value);
  const error = ref<string | null>(null);
  const lastUpdated = computed(() => marketsLastUpdated.value || null);

  // Getters
  const marketMap = computed(() => {
    if (!markets.value) return {};
    return Object.fromEntries(
      markets.value.map((market) => [
        `${market.data.pair.primary}-${market.data.pair.secondary}`,
        market,
      ])
    );
  });

  const marketsByPrimary = computed(() => {
    if (!markets.value) return {};
    const grouped: Record<string, MarketAPI[]> = {};
    markets.value.forEach((market) => {
      const primary = market.data.pair.primary;
      if (!grouped[primary]) {
        grouped[primary] = [];
      }
      grouped[primary].push(market);
    });
    return grouped;
  });

  const marketsBySecondary = computed(() => {
    if (!markets.value) return {};
    const grouped: Record<string, MarketAPI[]> = {};
    markets.value.forEach((market) => {
      const secondary = market.data.pair.secondary;
      if (!grouped[secondary]) {
        grouped[secondary] = [];
      }
      grouped[secondary].push(market);
    });
    return grouped;
  });

  const totalVolume = computed(() => {
    if (!markets.value) return 0;
    return markets.value.reduce((total, market) => {
      const volume = parseFloat(market.data.volume.secondary) || 0;
      return total + volume;
    }, 0);
  });

  const averageChange = computed(() => {
    if (!markets.value || markets.value.length === 0) return 0;
    const totalChange = markets.value.reduce((total, market) => {
      const change = parseFloat(market.data.price.change.percent) || 0;
      return total + change;
    }, 0);
    return totalChange / markets.value.length;
  });

  // Actions
  const getMarketByPair = (primary: string, secondary: string) => {
    if (!markets.value) return undefined;
    return markets.value.find(
      (market) =>
        market.data.pair.primary.toLowerCase() === primary.toLowerCase() &&
        market.data.pair.secondary.toLowerCase() === secondary.toLowerCase()
    );
  };

  const getMarketsByPrimary = (primary: string) => {
    if (!markets.value) return [];
    return markets.value.filter(
      (market) =>
        market.data.pair.primary.toLowerCase() === primary.toLowerCase()
    );
  };

  const getMarketsBySecondary = (secondary: string) => {
    if (!markets.value) return [];
    return markets.value.filter(
      (market) =>
        market.data.pair.secondary.toLowerCase() === secondary.toLowerCase()
    );
  };

  const getTopMarketsByVolume = (limit: number = 10) => {
    if (!markets.value) return [];
    return [...markets.value]
      .sort((a, b) => {
        const volumeA = parseFloat(a.data.volume.secondary) || 0;
        const volumeB = parseFloat(b.data.volume.secondary) || 0;
        return volumeB - volumeA;
      })
      .slice(0, limit);
  };

  const getMarketsByChange = (direction: "up" | "down" | "all" = "all") => {
    if (!markets.value) return [];
    return markets.value.filter((market) => {
      const change = parseFloat(market.data.price.change.percent) || 0;
      switch (direction) {
        case "up":
          return change > 0;
        case "down":
          return change < 0;
        default:
          return true;
      }
    });
  };

  const clearError = () => {
    error.value = null;
  };

  const refetch = () => {
    refetchMarkets();
  };

  const reset = () => {
    error.value = null;
  };

  return {
    // State
    markets,
    loading,
    error,
    lastUpdated,

    // Getters
    marketMap,
    marketsByPrimary,
    marketsBySecondary,
    totalVolume,
    averageChange,

    // Actions
    getMarketByPair,
    getMarketsByPrimary,
    getMarketsBySecondary,
    getTopMarketsByVolume,
    getMarketsByChange,
    clearError,
    refetch,
    reset,
  };
});
