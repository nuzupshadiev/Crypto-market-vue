<template>
  <div class="space-y-4">
    <!-- Search and Actions -->
    <div class="flex flex-col sm:flex-row justify-between gap-3">
      <Input
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        class="w-full sm:max-w-xs"
        @update:modelValue="(value: string | number) => handleSearchChange(String(value))"
      >
        <template #start>
          <Search class="h-4 w-4 text-muted-foreground" />
        </template>
      </Input>
      
      <div class="flex gap-2">
        <Button
          v-if="onRefresh"
          variant="outline"
          color="default"
          :disabled="loading"
          @click="onRefresh"
        >
          <RefreshCw 
            class="mr-2 h-4 w-4" 
            :class="{ 'animate-spin': loading }"
          />
          <span :class="{ 'animate-pulse': loading }">
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </span>
        </Button>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="flex flex-wrap gap-4">
      <!-- Base Currency Filter -->
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label class="text-sm font-medium text-gray-700">Base (primary)</label>
        <Select
          v-model="selectedBaseCurrencies"
          multiple
          @update:modelValue="(value: any) => handleBaseChange(Array.isArray(value) ? value : [])"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select base(s)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="base in baseOptions"
              :key="base.code"
              :value="base.code"
            >
              <CurrencyOption 
                :currency="base.code" 
                :currency-icons="currencyIcons"
                :ticker="base.ticker"
                :display-text="base.displayText"
              />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Quote Currency Filter -->
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label class="text-sm font-medium text-gray-700">Quote (secondary)</label>
        <Select
          v-model="selectedQuoteCurrencies"
          multiple
          @update:modelValue="(value: any) => handleQuoteChange(Array.isArray(value) ? value : [])"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select quote(s)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="quote in quoteOptions"
              :key="quote.code"
              :value="quote.code"
            >
              <CurrencyOption 
                :currency="quote.code" 
                :currency-icons="currencyIcons"
                :ticker="quote.ticker"
                :display-text="quote.displayText"
              />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Direction Filter -->
      <div class="flex flex-col gap-2 min-w-[120px]">
        <span class="text-sm font-medium text-gray-700">Direction</span>
        <div class="flex gap-2">
          <Button
            v-for="dir in ['Up', 'Down']"
            :key="dir"
            size="sm"
            :variant="filters.direction === dir ? 'default' : 'outline'"
            @click="handleDirectionChange(dir as 'Up' | 'Down')"
            class="flex-1"
          >
            {{ dir }}
          </Button>
        </div>
      </div>

      <!-- Change Range Filter -->
      <div class="flex flex-col gap-2 min-w-[200px]">
        <span class="text-sm font-medium text-gray-700">Change Range (%)</span>
        <div class="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            :model-value="String(filters.changeMin)"
            @update:model-value="(value: string | number) => handleChangeMinChange(String(value))"
            min="-100"
            class="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            :model-value="String(filters.changeMax)"
            @update:model-value="(value: string | number) => handleChangeMaxChange(String(value))"
            class="text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, h, defineComponent, computed, type PropType } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, RefreshCw } from 'lucide-vue-next'
import { CurrencyIcon } from '@/components/currency-icon'
import { useDebouncedSearch } from '@/composables/useTableData'
import { isEmpty } from '@/utils/table-utils'
import type { MarketFilters as MarketFiltersType } from '@/types/table'

// Utility function to format currency display
const formatCurrencyDisplay = (currency: string) => currency.toUpperCase()

// Component for rendering currency option with icon
const CurrencyOption = defineComponent({
  props: {
    currency: {
      type: String,
      required: true
    },
    currencyIcons: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    ticker: {
      type: String,
      required: false
    },
    displayText: {
      type: String,
      required: false
    }
  },
  setup(props) {
    return () => h('div', { class: 'flex items-center gap-2' }, [
      h(CurrencyIcon, {
        iconUrl: props.currencyIcons[props.currency],
        alt: props.currency,
        size: 16
      }),
      h('span', props.displayText || formatCurrencyDisplay(props.currency))
    ])
  }
})

interface CurrencyOption {
  code: string
  ticker: string
  displayText: string
}

interface Props {
  filters: MarketFiltersType
  onFiltersChange: (filters: Partial<MarketFiltersType>) => void
  baseOptions: CurrencyOption[]
  quoteOptions: CurrencyOption[]
  currencyIcons: Record<string, string>
  currencyMap?: Record<string, any>
  onRefresh?: () => void
  loading?: boolean
}

const props = defineProps<Props>()

// Local state for selected currencies
const selectedBaseCurrencies = ref<string[]>(props.filters.baseCurrencies || [])
const selectedQuoteCurrencies = ref<string[]>(props.filters.quoteCurrencies || [])

// Use debounced search hook
const { searchValue, handleSearchChange } = useDebouncedSearch(
  (value: string) => props.onFiltersChange({ search: value }),
  300
)

// Computed search placeholder based on currency map availability
const searchPlaceholder = computed(() => {
  const hasValidCurrencyMap = props.currencyMap && !isEmpty(props.currencyMap)
  return hasValidCurrencyMap 
    ? "Search by name or ticker symbol..."
    : "Search by name... (ticker search unavailable)"
})

// Watch for external filter changes
watch(() => props.filters.baseCurrencies, (newValue) => {
  selectedBaseCurrencies.value = newValue || []
}, { immediate: true })

watch(() => props.filters.quoteCurrencies, (newValue) => {
  selectedQuoteCurrencies.value = newValue || []
}, { immediate: true })

const handleBaseChange = (keys: string[]) => {
  props.onFiltersChange({ baseCurrencies: keys })
}

const handleQuoteChange = (keys: string[]) => {
  props.onFiltersChange({ quoteCurrencies: keys })
}

const handleDirectionChange = (direction: "Up" | "Down") => {
  props.onFiltersChange({
    direction: props.filters.direction === direction ? null : direction,
  })
}

const handleChangeMinChange = (value: string) => {
  props.onFiltersChange({ changeMin: Number(value) })
}

const handleChangeMaxChange = (value: string) => {
  props.onFiltersChange({ changeMax: Number(value) })
}
</script>
