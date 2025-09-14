import { ref, computed, type Ref } from "vue";
import type {
  TableActions,
  SortConfig,
  FilterConfig,
  MarketFilters,
} from "@/types/table";
import {
  sortData,
  filterData,
  getNestedValue,
  createMarketFilters,
  isEmpty,
} from "@/utils/table-utils";

/**
 * Generic table data management composable
 */
export function useTableData<T>(
  initialData: T[] = [],
  getValue: (item: T, key: string) => any = getNestedValue,
  currencyMap?: Record<string, any>
) {
  // State
  const data = ref<T[]>(initialData) as Ref<T[]>;
  const sortConfig = ref<SortConfig>({
    column: "",
    direction: undefined,
  });
  const filterConfig = ref<FilterConfig>({});
  const loading = ref(false);
  const error = ref<string | undefined>();

  // Computed filtered data
  const filteredData = computed(() => {
    return filterData(data.value, filterConfig.value, getValue, currencyMap);
  });

  // Computed sorted data
  const sortedData = computed(() => {
    return sortData(filteredData.value, sortConfig.value, getValue);
  });

  // Actions
  const actions: TableActions<T> = {
    setData: (newData: T[]) => {
      data.value = newData;
      error.value = undefined;
    },

    setSorting: (
      column: string,
      direction: "ascending" | "descending" | undefined
    ) => {
      sortConfig.value = { column, direction };
    },

    setFilter: (key: string, value: any) => {
      filterConfig.value = {
        ...filterConfig.value,
        filters: {
          ...filterConfig.value.filters,
          [key]: value,
        },
      };
    },

    setFilterConfig: (config: FilterConfig) => {
      filterConfig.value = config;
    },

    setSearch: (search: string) => {
      filterConfig.value = {
        ...filterConfig.value,
        search,
      };
    },
  };

  const state = computed(() => ({
    data: data.value,
    filteredData: filteredData.value,
    sortedData: sortedData.value,
    sortConfig: sortConfig.value,
    filterConfig: filterConfig.value,
    loading: loading.value,
    error: error.value,
  }));

  return { state, actions };
}

/**
 * Market-specific table data composable
 */
export function useMarketTableData(
  initialData: any[] = [],
  currencyMap?: Record<string, any>
) {
  // Create reactive currency map
  const reactiveCurrencyMap = ref<Record<string, any> | undefined>(
    currencyMap && !isEmpty(currencyMap) ? currencyMap : undefined
  );

  const { state, actions } = useTableData(
    initialData,
    getNestedValue,
    reactiveCurrencyMap.value
  );

  // Override the filteredData to use reactive currency map
  const filteredData = computed(() => {
    return filterData(
      state.value.data,
      state.value.filterConfig,
      getNestedValue,
      reactiveCurrencyMap.value
    );
  });

  // Override the sortedData to use our filteredData
  const sortedData = computed(() => {
    return sortData(filteredData.value, state.value.sortConfig, getNestedValue);
  });

  const marketFilters = ref<MarketFilters>({
    search: "",
    baseCurrencies: [],
    quoteCurrencies: [],
    direction: null,
    changeMin: -100,
    changeMax: 100,
  });

  // Update filter config when market filters change
  const updateMarketFilters = (newFilters: Partial<MarketFilters>) => {
    const updatedFilters = { ...marketFilters.value, ...newFilters };
    marketFilters.value = updatedFilters;

    const filterConfig = createMarketFilters(updatedFilters);
    actions.setFilterConfig(filterConfig);
  };

  // Market-specific actions
  const marketActions = {
    ...actions,
    setSearch: (search: string) => updateMarketFilters({ search }),
    setBaseCurrencies: (currencies: string[]) =>
      updateMarketFilters({ baseCurrencies: currencies }),
    setQuoteCurrencies: (currencies: string[]) =>
      updateMarketFilters({ quoteCurrencies: currencies }),
    setDirection: (direction: "Up" | "Down" | null) =>
      updateMarketFilters({ direction }),
    setChangeRange: (min: number, max: number) =>
      updateMarketFilters({ changeMin: min, changeMax: max }),
    updateCurrencyMap: (newCurrencyMap?: Record<string, any>) => {
      // Validate and update currency map
      const validatedMap =
        newCurrencyMap && !isEmpty(newCurrencyMap) ? newCurrencyMap : undefined;

      // Update the reactive currency map
      reactiveCurrencyMap.value = validatedMap;

      // Re-trigger filtering with new currency map
      if (validatedMap) {
        const filterConfig = createMarketFilters(marketFilters.value);
        actions.setFilterConfig(filterConfig);
      }
    },
    clearFilters: () => {
      marketFilters.value = {
        search: "",
        baseCurrencies: [],
        quoteCurrencies: [],
        direction: null,
        changeMin: -100,
        changeMax: 100,
      };
      actions.setFilter("", {});
    },
  };

  const marketState = computed(() => ({
    ...state.value,
    filteredData: filteredData.value,
    sortedData: sortedData.value,
    marketFilters: marketFilters.value,
  }));

  return {
    state: marketState,
    actions: marketActions,
  } as const;
}

/**
 * Debounced search composable
 */
export function useDebouncedSearch(
  onSearch: (value: string) => void,
  delay: number = 300
) {
  const searchValue = ref("");

  let timeoutId: number;
  const debouncedSearch = (value: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => onSearch(value), delay);
  };

  const handleSearchChange = (value: string) => {
    searchValue.value = value;
    debouncedSearch(value);
  };

  return {
    searchValue,
    handleSearchChange,
  };
}
