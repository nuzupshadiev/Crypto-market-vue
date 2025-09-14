<template>
  <div class="flex items-center gap-2">
    <CurrencyIcon :icon-url="currencyIcons[currency]" :alt="currency" :size="16" />
    <span>{{ formatCurrencyDisplay(currency) }}</span>
  </div>
</template>

<script setup lang="ts">
import CurrencyIcon from '@/components/currency-icon/index.vue'

// Props
interface Props {
  currency: string
  currencyIcons: Record<string, string>
}

defineProps<Props>()

// Utility function to format currency display
const formatCurrencyDisplay = (currency: string) => currency.toUpperCase()
</script>