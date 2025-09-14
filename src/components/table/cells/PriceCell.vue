<script setup lang="ts">
import { CurrencyIcon } from "@/components/currency-icon/index";
import type { MarketTableItem } from "@/types/table";
import { formatCurrency } from "@/utils/table-utils";

interface Props {
  item: MarketTableItem;
  value: number;
  quoteIcon?: string;
  showSymbol?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSymbol: true,
});
</script>

<template>
  <div class="flex items-center justify-center gap-2 font-medium">
    <div>{{ formatCurrency(props.value, props.item.pair.secondary) }}</div>
    <CurrencyIcon :icon-url="props.quoteIcon" :alt="props.item.pair.secondary" />
  </div>
</template>
