import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQuery } from "../composables/useQuery";
import CurrencyAPI from "../API/currency";

export const useCurrencyStore = defineStore("currency", () => {
  // Memoized query data
  const currenciesQuery = computed(() => CurrencyAPI.getAll());
  const currencyMapQuery = computed(() => CurrencyAPI.getAllAsMap());

  // Use useQuery for currencies
  const {
    data: currencies,
    loading: currenciesLoading,
    lastUpdated: currenciesLastUpdated,
    refetch: refetchCurrencies,
  } = useQuery<CurrencyAPI[]>(currenciesQuery, {
    enabled: true,
    keepPreviousData: true,
  });

  // Use useQuery for currency map
  const {
    data: currencyMapData,
    loading: currencyMapLoading,
    lastUpdated: currencyMapLastUpdated,
    refetch: refetchCurrencyMap,
  } = useQuery<Record<string, CurrencyAPI>>(currencyMapQuery, {
    enabled: true,
    keepPreviousData: true,
  });

  // Computed state
  const loading = computed(
    () => currenciesLoading.value || currencyMapLoading.value
  );
  const error = ref<string | null>(null);
  const lastUpdated = computed(
    () => currenciesLastUpdated.value || currencyMapLastUpdated.value || null
  );

  // Getters
  const currencyMap = computed(() => {
    if (currencyMapData.value) {
      return currencyMapData.value;
    }
    if (currencies.value) {
      return Object.fromEntries(
        currencies.value.map((currency) => [currency.data.code, currency])
      );
    }
    return {};
  });

  const primaryCurrencies = computed(() => {
    if (!currencies.value) return [];
    return currencies.value.filter((currency) => currency.isPrimary());
  });

  const secondaryCurrencies = computed(() => {
    if (!currencies.value) return [];
    return currencies.value.filter((currency) => currency.isSecondary());
  });

  const currencyIcons = computed(() => {
    const icons: Record<string, string> = {};
    if (currencies.value) {
      currencies.value.forEach((currency) => {
        icons[currency.data.code] = currency.getIconDataUrl();
      });
    }
    return icons;
  });

  // Actions
  const getCurrencyByCode = (code: string) => {
    if (!currencies.value) return undefined;
    return currencies.value.find(
      (currency) => currency.data.code.toLowerCase() === code.toLowerCase()
    );
  };

  const clearError = () => {
    error.value = null;
  };

  const refetch = () => {
    refetchCurrencies();
    refetchCurrencyMap();
  };

  const reset = () => {
    error.value = null;
  };

  return {
    // State
    currencies,
    loading,
    error,
    lastUpdated,

    // Getters
    currencyMap,
    primaryCurrencies,
    secondaryCurrencies,
    currencyIcons,

    // Actions
    getCurrencyByCode,
    clearError,
    refetch,
    reset,
  };
});
