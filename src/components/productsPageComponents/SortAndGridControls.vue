<script setup>
// ==============================
// Imports & Store
// ==============================
import { computed, inject } from 'vue'
import { useProductsPageStore } from '../../stores/productsPageStore'

// Import grid layout from provide/inject, fallback is 2
const grid = inject('grid', 2)

const store = useProductsPageStore()

// ==============================
// Sort Options (Static)
// ==============================
/**
 * Array of sort options. You can also fetch from the store if needed.
 */
const sortOptions = [
  { value: '', label: 'پربازدید ترین' },
  { value: 'low_to_high', label: 'ارزان ترین' },
  { value: 'high_to_low', label: 'گران ترین' },
  { value: 'most_sales', label: 'پرفروش ترین' },
  { value: 'latest', label: 'جدید ترین' },
  { value: 'special', label: 'ویژه' }
]

// ==============================
// Dropdown Open/Close State
// ==============================
/**
 * Controls visibility of the sort dropdown (can move to store for global UI state).
 */
const showSort = computed({
  get: () => store.ui.showSort ?? false,
  set: v => { store.ui.showSort = v }
})

// ==============================
// Current Sort Label
// ==============================
/**
 * Computes label for the selected sort option.
 */
const selectedSortLabel = computed(() => {
  return sortOptions.find(opt => opt.value === store.filters.sort)?.label || 'پربازدید ترین'
})

// ==============================
// Sort Change Handler
// ==============================
/**
 * Called when a sort is selected; updates store and applies filters.
 * @param {string} value
 */
function selectSort(value) {
  store.filters.sort = value
  store.ui.showSort = false
  store.applyFilters()
}

// ==============================
// Available Only Toggle Handler
// ==============================
/**
 * Toggle "available only" filter checkbox.
 * @param {Event} event
 */
function toggleAvailable(event) {
  store.filters.available = event.target.checked ? 1 : 0
  store.applyFilters()
}
</script>

<template>
  <!-- ==============================
       Sort, Grid, and Availability Controls
       ============================== -->
  <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
    <!-- Sort Dropdown -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2" dir="rtl">
        <span class="text-gray-600 text-xs">فیلتر:</span>
        <div class="relative">
          <button
            @click="showSort = !showSort"
            class="w-48 text-right border rounded-xl px-3 py-2 bg-white text-gray-700 font-bold flex items-center justify-between"
            type="button"
          >
            {{ selectedSortLabel }}
            <svg :class="showSort ? 'rotate-180' : ''"
              class="w-4 h-4 ml-1 transition-transform duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <ul v-show="showSort" @mouseleave="showSort = false"
            class="absolute w-full right-0 z-20 mt-2 border bg-white shadow-lg rounded-xl text-sm font-bold py-1"
            style="min-width: 180px">
            <li v-for="option in sortOptions" :key="option.value"
                @click="selectSort(option.value)"
                :class="[
                  'px-4 py-2 cursor-pointer hover:bg-gray-100 transition',
                  store.filters.sort === option.value ? 'bg-gray-700 text-white' : 'text-gray-900'
                ]">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Grid Switcher & Available Only Toggle -->
    <div class="flex items-center gap-2" dir="rtl">
      <!-- 2-column grid button -->
      <button
        :class="[
          'rounded-lg border text-xs font-bold transition-all flex items-center justify-center',
          grid === 2
            ? 'bg-black text-white shadow border-black'
            : 'bg-gray-200 text-black border-gray-200',
        ]"
        @click="$emit('update:grid', 2)"
        style="width: 28px; height: 28px; padding: 0"
        title="2 ستونه"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" class="mx-auto" fill="none">
          <rect x="5" y="3" width="4" height="14" rx="1.1"
            :fill="grid === 2 ? '#fff' : '#000'" />
          <rect x="10" y="3" width="4" height="14" rx="1.1"
            :fill="grid === 2 ? '#fff' : '#000'" />
        </svg>
      </button>
      <!-- 3-column grid button -->
      <button
        :class="[
          'rounded-lg border text-xs font-bold transition-all flex items-center justify-center',
          grid === 3
            ? 'bg-black text-white shadow border-black'
            : 'bg-gray-200 text-black border-gray-200',
        ]"
        @click="$emit('update:grid', 3)"
        style="width: 28px; height: 28px; padding: 0"
        title="3 ستونه"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" class="mx-auto" fill="none">
          <rect x="3" y="3" width="4" height="14" rx="1"
            :fill="grid === 3 ? '#fff' : '#000'" />
          <rect x="8" y="3" width="4" height="14" rx="1"
            :fill="grid === 3 ? '#fff' : '#000'" />
          <rect x="13" y="3" width="4" height="14" rx="1"
            :fill="grid === 3 ? '#fff' : '#000'" />
        </svg>
      </button>
      <!-- Available Only Checkbox -->
      <span class="text-gray-500 text-xs">نمایش محصولات موجود</span>
      <input
        type="checkbox"
        :checked="store.filters.available === 1"
        @change="toggleAvailable"
      />
    </div>
  </div>
</template>
