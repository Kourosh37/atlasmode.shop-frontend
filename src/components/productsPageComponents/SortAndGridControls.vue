<script setup>
import { inject, computed } from 'vue';

const sortOptions = inject('sortOptions');   // array
const showSort = inject('showSort');         // ref
const localFilter = inject('localFilter');   // ref
const selectSort = inject('selectSort');     // function
const grid = inject('grid');                 // ref

const selectedSortLabel = computed(() => {
  if (!localFilter.value) return 'پربازدید ترین';
  return sortOptions.find(opt => opt.value === localFilter.value.sort)?.label || 'پربازدید ترین';
});
</script>

<template>
  <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
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
                  (localFilter.value && localFilter.value.sort) === option.value ? 'bg-gray-700 text-white' : 'text-gray-900'
                ]">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2" dir="rtl">
      <!-- دکمه ۲ ستونه -->
      <button
        :class="[
          'rounded-lg border text-xs font-bold transition-all flex items-center justify-center',
          grid.value === 2
            ? 'bg-primary-600 border-primary-600 text-white shadow'
            : 'bg-white border-gray-200 text-gray-600',
        ]"
        @click="$emit('update:grid', 2)"
        style="width: 40px; height: 40px"
        title="2 ستونه"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" class="mx-auto" fill="none">
          <rect x="4" y="6" width="6" height="12" rx="2"
            :fill="grid.value === 2 ? '#fff' : '#6b7280'" />
          <rect x="14" y="6" width="6" height="12" rx="2"
            :fill="grid.value === 2 ? '#fff' : '#6b7280'" />
        </svg>
      </button>
      <!-- دکمه ۳ ستونه -->
      <button
        :class="[
          'rounded-lg border text-xs font-bold transition-all flex items-center justify-center',
          grid.value === 3
            ? 'bg-primary-600 border-primary-600 text-white shadow'
            : 'bg-white border-gray-200 text-gray-600',
        ]"
        @click="$emit('update:grid', 3)"
        style="width: 40px; height: 40px"
        title="3 ستونه"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" class="mx-auto" fill="none">
          <rect x="3" y="6" width="5.5" height="12" rx="1.5"
            :fill="grid.value === 3 ? '#fff' : '#6b7280'" />
          <rect x="9.75" y="6" width="5.5" height="12" rx="1.5"
            :fill="grid.value === 3 ? '#fff' : '#6b7280'" />
          <rect x="16.5" y="6" width="5.5" height="12" rx="1.5"
            :fill="grid.value === 3 ? '#fff' : '#6b7280'" />
        </svg>
      </button>
      <span class="text-gray-500 text-xs">نمایش محصولات موجود</span>
      <input
        type="checkbox"
        :checked="localFilter.value && localFilter.value.available === 1"
        @change="localFilter.value.available = $event.target.checked ? 1 : 0"
      />
    </div>
  </div>
</template>
