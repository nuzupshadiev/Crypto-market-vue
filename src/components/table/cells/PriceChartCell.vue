<script setup lang="ts">
import { PriceSparkline } from "@/components/price-sparkline/index";
import type { MarketTableItem } from "@/types/table";

interface Props {
  item: MarketTableItem;
  color?: "success" | "danger" | "default";
}

const props = withDefaults(defineProps<Props>(), {
  color: "default",
});
</script>

<template>
  <div class="w-24 h-12 flex items-center justify-center">
    <PriceSparkline :data="props.item.priceHistory.map(String)" :color="props.color" />
  </div>
</template>
