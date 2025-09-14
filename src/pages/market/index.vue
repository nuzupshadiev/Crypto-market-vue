<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-default-900">Market Overview</h1>
      <p class="text-default-600 mt-2">
        Real-time cryptocurrency market data
      </p>
    </div>
    
    <!-- Loading state -->
    <div v-if="!status || !marketData || !currencyStatus || !currencyMap" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-default-500">Loading market data...</p>
    </div>

    <!-- Data Table -->
    <div v-else>
      
      <!-- Market Filters -->
      <div class="mb-6">
        <MarketFiltersComponent
          :filters="state.marketFilters"
          :on-filters-change="handleFiltersChange"
          :base-options="baseCurrencyOptions"
          :quote-options="quoteCurrencyOptions"
          :currency-icons="currencyIcons"
          :currency-map="currencyMap || undefined"
          :on-refresh="refetch"
          :loading="loading"
        />
      </div>
      
      <!-- Data table -->
      <TooltipProvider>
        <DataTable
          :data="state.sortedData || []"
          :config="marketTableConfig"
          :sort-config="state.sortConfig"
          :on-sort="loggedActions.setSorting"
          :on-refresh="refetch"
          :loading="loading"
          :error="state.error"
          :footer-content="footerContent"
        />
      </TooltipProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, h } from 'vue'
import { useQuery } from '../../composables/useQuery'
import MarketAPI from '../../API/market'
import CurrencyAPI from '../../API/currency'
import DataTable from '@/components/table/index.vue'
import { useMarketTableData } from '../../composables/useTableData'
import { transformMarketData, calculateVolumePercentages } from '../../utils/table-utils'
import { createMarketTableConfig } from '../../components/table/marketTableConfig'
import { TooltipProvider } from '../../components/ui/tooltip'
import { MarketFilters as MarketFiltersComponent } from '../../components/table/filters'
import type { MarketTableItem, TableColumn, MarketFilters } from '../../types/table'

// Memoize the query function 
const queryData = computed(() => MarketAPI.getAll())

// Use the useQuery composable to fetch market data
const {
  data: marketData,
  status,
  loading,
  lastUpdated,
  refetch,
} = useQuery<MarketAPI[]>(queryData, {
  refetchInterval: 10000,
  enabled: true,
  keepPreviousData: true,
})

// Fetch currency data
const currencyQueryData = computed(() => CurrencyAPI.getAllAsMap())
const {
  data: currencyMap,
  status: currencyStatus,
} = useQuery(currencyQueryData, {
  enabled: true,
  keepPreviousData: true,
})


// Process currency data to create icons map
const currencyIcons = computed(() => {
  if (!currencyMap.value) return {}
  
  const icons: Record<string, string> = {}
  Object.entries(currencyMap.value).forEach(([code, currency]) => {
    icons[code] = currency.getIconDataUrl()
  })
  return icons
})

// Extract unique base and quote currencies for filter options with ticker info
const baseCurrencyOptions = computed(() => {
  if (!processedData.value) return []
  
  const baseCurrencies = new Set<string>()
  processedData.value.forEach(item => {
    if (item.pair?.primary) {
      baseCurrencies.add(item.pair.primary)
    }
  })
  
  return Array.from(baseCurrencies).map(code => {
    const currency = currencyMap.value?.[code]
    const ticker = currency?.data?.ticker || code
    return {
      code,
      ticker,
      displayText: `${ticker.toUpperCase()} (${code})`
    }
  })
})

const quoteCurrencyOptions = computed(() => {
  if (!processedData.value) return []
  
  const quoteCurrencies = new Set<string>()
  processedData.value.forEach(item => {
    if (item.pair?.secondary) {
      quoteCurrencies.add(item.pair.secondary)
    }
  })
  
  return Array.from(quoteCurrencies).map(code => {
    const currency = currencyMap.value?.[code]
    const ticker = currency?.data?.ticker || code
    return {
      code,
      ticker,
      displayText: `${ticker} (${code})`
    }
  })
})

// Process market data
const processedData = computed(() => {
  if (!marketData.value) {
    // Return test data when no real data is available
    return []
  }
  
  const transformed = transformMarketData(marketData.value)
  return calculateVolumePercentages(transformed)
})

// Use market table data hook
const { state, actions } = useMarketTableData(
  [], // Start with empty array
  currencyMap.value || undefined // Use currency map
)

// Watch currency map for updates
watch(currencyMap, (newMap) => {
  // Always update the currency map, even if it's null/undefined
  actions.updateCurrencyMap(newMap || undefined);
}, { immediate: true })




// Update data when processed data changes
watch(processedData, (newData) => {
  if (newData.length > 0) {
    actions.setData(newData)
  }
}, { immediate: true })



// Actions wrapper
const loggedActions = {
  setData: (data: MarketTableItem[]) => {
    return actions.setData(data)
  },
  setSorting: (column: string, direction: "ascending" | "descending" | undefined) => {
    return actions.setSorting(column, direction)
  },
  setFilter: (key: string, value: any) => {
    return actions.setFilter(key, value)
  },
  setFilterConfig: (config: any) => {
    return actions.setFilterConfig(config)
  },
  setSearch: (search: string) => {
    return actions.setSearch(search)
  }
}

// Filter change handler
const handleFiltersChange = (newFilters: Partial<MarketFilters>) => {
  if (newFilters.search !== undefined) {
    actions.setSearch(newFilters.search)
  }
  if (newFilters.baseCurrencies !== undefined) {
    actions.setBaseCurrencies(newFilters.baseCurrencies)
  }
  if (newFilters.quoteCurrencies !== undefined) {
    actions.setQuoteCurrencies(newFilters.quoteCurrencies)
  }
  if (newFilters.direction !== undefined) {
    actions.setDirection(newFilters.direction)
  }
  if (newFilters.changeMin !== undefined || newFilters.changeMax !== undefined) {
    actions.setChangeRange(
      newFilters.changeMin ?? state.value.marketFilters.changeMin,
      newFilters.changeMax ?? state.value.marketFilters.changeMax
    )
  }
}

// Create market table configuration using existing function
const marketTableConfig = computed(() => {
  const config = createMarketTableConfig({
    currencyIcons: currencyIcons.value,
    currencyMap: currencyMap.value || undefined
  })
  
  
  // Convert the component-based render functions to VNode render functions
  const columnsWithVNodeRenderers: TableColumn<MarketTableItem>[] = config.columns.map(column => ({
    ...column,
    render: (value: any, item: MarketTableItem, index: number) => {
      const renderResult = column.render!(value, item, index)
      
      // If it's already a VNode, return it
      if (typeof renderResult === 'string' || (renderResult && typeof renderResult === 'object' && 'type' in renderResult)) {
        return renderResult
      }
      
      // If it's a component object, convert to VNode
      if (renderResult && typeof renderResult === 'object' && 'component' in renderResult) {
        return h(renderResult.component, renderResult.props)
      }
      
      return String(value)
    }
  }))
  
  return {
    ...config,
    columns: columnsWithVNodeRenderers
  }
})

// Create footer content
const footerContent = computed(() => {
  return h('div', { class: 'flex flex-col justify-between text-sm text-muted-foreground' }, [
    h('span', `Showing ${state.value.sortedData?.length || 0} market pairs`),
    h('span', `Last updated: ${lastUpdated.value ? lastUpdated.value.toLocaleTimeString() : 'Never'}`)
  ])
})

</script>
