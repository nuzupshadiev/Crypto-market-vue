<script setup lang="ts">
import { computed } from "vue";
import { CurrencyIcon } from "@/components/currency-icon/index";
import type { MarketTableItem } from "@/types/table";

interface Props {
  item: MarketTableItem;
  baseIcon?: string;
  baseTicker?: string;
  currencyMap?: Record<string, any>;
}

const props = defineProps<Props>();

// Make these computed so they react to currencyMap changes
const baseCurrency = computed(() => props.currencyMap?.[props.item.pair.primary]);
const quoteCurrency = computed(() => props.currencyMap?.[props.item.pair.secondary]);

const tickerSymbol = computed(() => {
  return baseCurrency.value?.data?.ticker?.toUpperCase() ||
    props.baseTicker?.toUpperCase() ||
    props.item.pair.primary;
});

const quoteTicker = computed(() => {
  return quoteCurrency.value?.data?.ticker || props.item.pair.secondary;
});

const baseCode = computed(() => {
  return baseCurrency.value?.data?.code || props.item.pair.primary;
});
</script>

<template>
  <div class="flex items-center gap-2">
    <CurrencyIcon :icon-url="baseIcon" :alt="item.pair.primary" :size="24" />
    <div>
      <div class="font-medium text-lg">{{ tickerSymbol }}</div>
      <div class="text-xs text-gray-500">{{ baseCode }}/{{ quoteTicker }}</div>
    </div>
  </div>
</template>
