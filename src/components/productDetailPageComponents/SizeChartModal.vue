<template>
  <!-- ==============================
       Size Chart Modal
       ============================== -->
  <div v-if="show" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div
      class="bg-white rounded-2xl px-4 py-7 w-full max-w-3xl shadow-xl relative animate-fadeIn flex flex-col"
      style="max-height: 85vh"
    >
      <!-- Close Button -->
      <button
        class="absolute top-4 left-4 text-gray-500 hover:text-rose-500"
        @click="$emit('close')"
        aria-label="بستن"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <!-- Modal Title -->
      <h2 class="text-2xl font-extrabold text-center mb-6">
        راهنمای انتخاب سایز
      </h2>
      <!-- Chart List, Scrollable -->
      <div class="overflow-y-auto px-2" style="max-height: 65vh">
        <div
          v-for="sc in productStore.productSizeCharts"
          :key="sc.id"
          class="mb-10"
        >
          <!-- Chart Title -->
          <div class="font-bold text-right mb-3 text-base text-amber-800">
            {{ sc.title }}
          </div>
          <!-- Size Table -->
          <div class="overflow-x-auto">
            <table class="w-full min-w-[400px] border-separate border-spacing-0 rounded-xl shadow bg-white text-gray-800">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-center">
                  <th
                    v-for="(title, idx) in JSON.parse(sc.chart)[0]"
                    :key="'h' + idx"
                    class="py-3 px-4 border-b border-gray-200 font-semibold text-base"
                  >
                    {{ title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td
                    v-for="(size, idx) in JSON.parse(sc.chart)[1]"
                    :key="'d' + idx"
                    class="py-2 px-4 border-b border-gray-100 text-base"
                  >
                    <span v-if="size">
                      {{ size }}
                    </span>
                    <span v-else class="flex items-center justify-center gap-1">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
                      </svg>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ==============================
// Imports & Store
// ==============================
import { useProductStore } from "../../stores/productDetails";

/**
 * Props:
 * - show: Boolean, controls modal visibility.
 */
const props = defineProps(['show']);

/**
 * Product store: contains size charts and product data.
 */
const productStore = useProductStore();
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.38, 1.15, 0.7, 1);
}
</style>
