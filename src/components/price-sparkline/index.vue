<template>
  <div class="w-full h-full">
    <Line 
      :data="chartData" 
      :options="chartOptions"
      :height="height"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js'

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

// Props
interface Props {
  data: string[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 40
})

// Compute chart data
const chartData = computed(() => {
  const prices = props.data.map(price => parseFloat(price))
  const firstPrice = prices[0]
  const lastPrice = prices[prices.length - 1]
  const trend = lastPrice > firstPrice ? 'success' : lastPrice < firstPrice ? 'danger' : 'default'
  
  return {
    labels: props.data.map((_, i) => i),
    datasets: [{
      data: prices,
      borderColor: getColor(trend),
      backgroundColor: getColor(trend, 0.1),
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  }
})

// Chart options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { point: { radius: 0 } }
}))

// Trend-based colors
function getColor(trend: 'success' | 'danger' | 'default', opacity = 1) {
  const colors = {
    success: `rgba(34,197,94,${opacity})`, // Tailwind green-500
    danger: `rgba(239,68,68,${opacity})`,  // Tailwind red-500
    default: `rgba(107,114,128,${opacity})` // Tailwind gray-500
  }
  return colors[trend]
}
</script>
