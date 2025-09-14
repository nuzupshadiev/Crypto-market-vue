import { defineStore } from "pinia";
import { computed } from "vue";
import { useQuery } from "@/composables/useQuery";
import MarketAPI from "@/API/market";
import {
  transformMarketData,
  calculateVolumePercentages,
} from "@/utils/table-utils";

export const useMarketStore = defineStore("market", () => {
  const queryData = computed(() => MarketAPI.getAll());
  const {
    data: marketDataRaw,
    loading,
    lastUpdated,
    refetch,
  } = useQuery(queryData, {
    enabled: true,
    keepPreviousData: true,
    refetchInterval: 10000, // 10 seconds default
  });

  const marketData = computed(() => {
    if (!marketDataRaw.value) return [];
    return marketDataRaw.value.map((m) => m.data);
  });

  const processedData = computed(() => {
    if (!marketDataRaw.value) return [];
    const transformed = transformMarketData(marketDataRaw.value);
    return calculateVolumePercentages(transformed);
  });
  const hasData = computed(() => marketData.value.length > 0);
  const dataCount = computed(() => processedData.value.length);

  const baseCurrencies = computed(() => {
    const currencies = new Set<string>();
    processedData.value.forEach((item) => {
      if (item.pair?.primary) {
        currencies.add(item.pair.primary);
      }
    });
    return Array.from(currencies);
  });

  const quoteCurrencies = computed(() => {
    const currencies = new Set<string>();
    processedData.value.forEach((item) => {
      if (item.pair?.secondary) {
        currencies.add(item.pair.secondary);
      }
    });
    return Array.from(currencies);
  });

  return {
    marketData,
    processedData,
    loading,
    lastUpdated,
    refetch,
    hasData,
    dataCount,
    baseCurrencies,
    quoteCurrencies,
  };
});
