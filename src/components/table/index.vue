<script lang="ts" setup>
import { ref, watch } from "vue";
import { ChevronUp, ChevronDown } from "lucide-vue-next";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { DataTableProps } from "@/types/table";

const props = defineProps<DataTableProps<any>>();

// Sorting state - sync with parent
const sortColumn = ref(props.sortConfig?.column || "");
const sortDirection = ref(props.sortConfig?.direction || undefined);

// Watch for changes in parent sort config
watch(() => props.sortConfig, (newConfig) => {
  if (newConfig) {
    sortColumn.value = newConfig.column;
    sortDirection.value = newConfig.direction;
  }
}, { immediate: true });

// Watch for data changes
watch(() => props.data, () => {
  // Data changed, table will re-render
}, { deep: true });

// Sorting handler
function handleSortChange(columnKey: string) {
  const column = props.config.columns.find((c) => c.key === columnKey);
  if (!column || column.sortable === false) return;

  let newDirection: "ascending" | "descending" | undefined;

  if (sortColumn.value === columnKey) {
    if (sortDirection.value === "ascending") newDirection = "descending";
    else if (sortDirection.value === "descending") newDirection = undefined;
    else newDirection = "ascending";
  } else {
    newDirection = "ascending";
  }

  sortColumn.value = columnKey;
  sortDirection.value = newDirection;
  props.onSort?.(columnKey, newDirection);
}

// Render sort icon
function renderSortIcon(columnKey: string) {
  if (sortColumn.value !== columnKey) return null;
  if (sortDirection.value === "ascending") return ChevronUp;
  if (sortDirection.value === "descending") return ChevronDown;
  return null;
}

// Helper to get nested value
function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="props.loading" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <span class="spinner">Loading...</span>
      <p class="text-default-500">Loading data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="props.error" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div class="text-danger text-center">
        <p class="text-lg font-semibold">Error loading data</p>
        <p class="text-sm">{{ props.error }}</p>
      </div>
      <button
        v-if="props.onRefresh"
        @click="props.onRefresh"
        :disabled="props.loading"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span :class="{ 'animate-pulse': props.loading }">
          {{ props.loading ? 'Retrying...' : 'Retry' }}
        </span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="props.data.length === 0" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div class="text-default-500 text-center">
        <p class="text-lg">{{ props.config.emptyMessage || "No data available" }}</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="w-full">
      <div class="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table class="w-full">
          <TableHeader>
            <TableHead>
              <TableRow class="grid w-full" :style="{ gridTemplateColumns: props.config.columns.map(col => col.width).join(' ') }">
                <TableCell
                  v-for="column in props.config.columns"
                  :key="String(column.key)"
                  @click="column.sortable !== false && handleSortChange(String(column.key))"
                  :class="[
                    'flex items-center justify-center gap-1 px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider',
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-50 transition-colors' : '',
                    sortColumn === column.key ? 'bg-gray-50' : ''
                  ]"
                >
                  <span v-if="!column.headerRender">{{ column.label }}</span>
                  <component v-if="column.headerRender" :is="column.headerRender()" />
                  <component
                    v-if="column.sortable !== false && renderSortIcon(String(column.key))"
                    :is="renderSortIcon(String(column.key))"
                    class="w-3 h-3 ml-1"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="(item, rowIndex) in props.data"
              :key="item.id || `row-${rowIndex}`"
              class="grid w-full border-t border-gray-100 hover:bg-gray-50 transition-colors"
              :style="{ gridTemplateColumns: props.config.columns.map(col => col.width).join(' ') }"
            >
              <TableCell
                v-for="(column, cellIndex) in props.config.columns"
                :key="`${String(column.key)}-${cellIndex}`"
              >
                <div class="flex items-center justify-center w-full">
                  <template v-if="column.render">
                    <component :is="column.render(getNestedValue(item, String(column.key)), item, rowIndex)" />
                  </template>
                  <template v-else>
                    {{ getNestedValue(item, String(column.key)) }}
                  </template>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="props.footerContent" class="flex justify-between items-center pt-2">
      <component :is="props.footerContent" />
    </div>
  </div>
</template>
