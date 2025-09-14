<script setup lang="ts">
import { computed } from "vue";

interface Props {
  iconUrl?: string;
  alt: string;
  size?: number;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  className: "",
});

// Compute the first letter for fallback
const firstLetter = computed(() => props.alt.charAt(0).toUpperCase());
</script>

<template>
  <div v-if="!iconUrl"
      :class="`bg-gray-200 rounded-full flex items-center justify-center ${className}`"
      :style="{ width: `${size}px`, height: `${size}px` }">
    <span class="text-xs font-semibold text-gray-600">{{ firstLetter }}</span>
  </div>
  <img v-else
      :src="iconUrl"
      :alt="alt"
      :width="size"
      :height="size"
      :class="`flex-shrink-0 ${className}`"
      style="display: inline-block;" />
</template>
