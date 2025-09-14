<script setup lang="ts">
import { formatPercentage } from "@/utils/table-utils";

interface Props {
  value: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="text-gray-600 flex items-center justify-center">{{ formatPercentage(props.value) }}</div>
</template>
