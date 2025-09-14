<script setup lang="ts">
import { Tooltip } from "@/components/ui/tooltip"; // shadcn tooltip
import { formatNumber } from "@/utils/format-utils";
import type { MarketTableItem } from "@/types/table";

interface Props {
  item: MarketTableItem;
  value: number;
  primaryValue: number;
  abbreviate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  abbreviate: false,
});
</script>

<template>
  <Tooltip :content="`${formatNumber(props.primaryValue, false)} ${props.item.pair.primary}`">
    <div class="cursor-help flex items-center justify-center">{{ formatNumber(props.value, props.abbreviate) }}</div>
  </Tooltip>
</template>
