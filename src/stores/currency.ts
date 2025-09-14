import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQuery } from "../composables/useQuery";
import CurrencyAPI from "../API/currency";

export const useCurrencyStore = defineStore("currency", () => {
  // Memoized query data
  const currenciesQuery = computed(() => CurrencyAPI.getAll());

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

  // Computed state
  const loading = computed(() => currenciesLoading.value);
  const error = ref<string | null>(null);
  const lastUpdated = computed(() => currenciesLastUpdated.value || null);

  // Getters
  const currencyMap = computed(() => {
    if (currencies.value) {
      return Object.fromEntries(
        currencies.value.map((currency) => [currency.data.code, currency])
      );
    }
    return {};
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

  const clearError = () => {
    error.value = null;
  };

  const refetch = () => {
    refetchCurrencies();
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
    currencyIcons,

    // Actions
    clearError,
    refetch,
    reset,
  };
});
