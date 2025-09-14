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

    // Actions
    clearError,
    refetch,
    reset,
  };
});
