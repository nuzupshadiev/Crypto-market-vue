<script setup lang="ts">
import { ArrowUp, ArrowDown, Minus } from "lucide-vue-next";
import { getChangeColor } from "@/utils/table-utils";

interface Props {
  direction: "Up" | "Down" | "None";
  percent: number;
}

const props = defineProps<Props>();

const colorClass = getChangeColor(props.direction);

const getIcon = () => {
  switch (props.direction) {
    case "Up":
      return ArrowUp;
    case "Down":
      return ArrowDown;
    default:
      return Minus;
  }
};

const getSign = () => {
  switch (props.direction) {
    case "Up":
      return "+";
    case "Down":
      return "-";
    default:
      return "";
  }
};
</script>

<template>
  <div :class="`flex items-center justify-center gap-1 ${colorClass}`">
    <component :is="getIcon()" class="w-4 h-4" />
    <span>{{ getSign() }}{{ props.percent.toFixed(2) }}%</span>
  </div>
</template>
