import { defineStore } from "pinia";
import { computed } from "vue";
import { useQuery } from "@/composables/useQuery";
import CurrencyAPI from "@/API/currency";

export const useCurrencyStore = defineStore("currency", () => {
  const queryData = computed(() => CurrencyAPI.getAll());
  const {
    data: currenciesData,
    loading,
    lastUpdated,
    refetch,
  } = useQuery(queryData, {
    enabled: true,
    keepPreviousData: true,
  });

  const currencies = computed(() => {
    if (!currenciesData.value) return [];
    return currenciesData.value.map((c) => c.data);
  });
  const currencyMap = computed(() => {
    if (!currencies.value.length) return {};
    return Object.fromEntries(
      currencies.value.map((currency) => [currency.code, currency])
    );
  });

  const currencyIcons = computed(() => {
    const icons: Record<string, string> = {};
    Object.entries(currencyMap.value).forEach(([code, currency]) => {
      icons[code] = currency.icon.startsWith("data:")
        ? currency.icon
        : `data:image/svg+xml;base64,${currency.icon}`;
    });
    return icons;
  });

  const primaryCurrencies = computed(() => {
    return currencies.value
      .filter((c) => c.type === "Primary")
      .sort((a, b) => a.sort_order - b.sort_order);
  });

  const secondaryCurrencies = computed(() => {
    return currencies.value
      .filter((c) => c.type === "Secondary")
      .sort((a, b) => a.sort_order - b.sort_order);
  });

  const allCurrenciesSorted = computed(() => {
    return [...currencies.value].sort((a, b) => a.sort_order - b.sort_order);
  });

  const getCurrencyByCode = (code: string) => {
    return currencies.value.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
  };

  const getCurrencyIcon = (code: string) => {
    return currencyIcons.value[code.toUpperCase()];
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return amount.toString();
    return amount.toFixed(currency.decimals_places);
  };

  return {
    currencies,
    loading,
    lastUpdated,
    refetch,
    currencyMap,
    currencyIcons,
    primaryCurrencies,
    secondaryCurrencies,
    allCurrenciesSorted,
    getCurrencyByCode,
    getCurrencyIcon,
    formatAmount,
  };
});
