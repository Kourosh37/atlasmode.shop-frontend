<template>
  <!-- ==============================
       Pagination (With Animation)
       ============================== -->
  <div v-if="visiblePages.length > 0" class="flex justify-center mt-8 gap-2">
    <!-- Previous Page Button -->
    <button
      :disabled="store.currentPage === 1"
      @click="store.goToPage(store.currentPage - 1)"
      class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed select-none"
      aria-label="صفحه قبل"
    >‹</button>

    <!-- Animated Page Buttons (Transition Group) -->
    <transition-group
      name="pagination-fade"
      tag="div"
      class="flex gap-2"
      appear
    >
      <template v-for="(item) in pageItems" :key="item.key">
        <!-- Ellipsis -->
        <span
          v-if="item.type === 'ellipsis'"
          class="w-9 h-9 flex items-center justify-center text-gray-400 select-none"
        >...</span>
        <!-- Page Button -->
        <button
          v-else
          @click="store.goToPage(item.page)"
          :class="[
            'w-9 h-9 rounded-xl border flex items-center justify-center font-bold transition-all duration-150 select-none',
            store.currentPage === item.page
              ? 'bg-gray-700 border-primary-600 text-white shadow text-lg scale-150 mx-2'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
          ]"
          :disabled="store.currentPage === item.page"
          aria-current="page"
        >
          {{ item.page }}
        </button>
      </template>
    </transition-group>

    <!-- Next Page Button -->
    <button
      :disabled="store.currentPage === store.pageEnd"
      @click="store.goToPage(store.currentPage + 1)"
      class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed select-none"
      aria-label="صفحه بعد"
    >›</button>
  </div>

  <!-- Loading/Empty State -->
  <div v-else class="flex justify-center mt-8">
    <span class="text-gray-400 text-xs">.................</span>
  </div>
</template>

<script setup>
// ==============================
// Imports & Store
// ==============================
import { computed } from "vue";
import { useProductsPageStore } from "../../stores/productsPageStore";
const store = useProductsPageStore();

// ==============================
// Visible Pages Calculation
// ==============================
/**
 * Array of page numbers/ellipsis to display based on current state.
 * E.g.: [1, '...', 5, 6, 7, '...', 20]
 */
const visiblePages = computed(() => {
  const total = store.paginationPages.length;
  const first = 1;
  const last = store.pageEnd;
  const current = store.currentPage;

  // If total pages <= 7, show all
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let pages = [];
  let start = Math.max(current - 2, first + 1);
  let end = Math.min(current + 2, last - 1);

  if (current <= first + 2) {
    start = first + 1;
    end = first + 5;
  }
  if (current >= last - 2) {
    start = last - 5;
    end = last - 1;
  }

  pages.push(first);
  if (start > first + 1) pages.push('...');
  for (let i = start; i <= end; i++) if (i > first && i < last) pages.push(i);
  if (end < last - 1) pages.push('...');
  pages.push(last);

  return pages;
});

/**
 * Array for rendering: { type: 'page'|'ellipsis', page?, key }
 */
const pageItems = computed(() =>
  visiblePages.value.map((item, idx) =>
    item === '...'
      ? { type: 'ellipsis', key: `ellipsis_${idx}` }
      : { type: 'page', page: item, key: `page_${item}` }
  )
);
</script>

<style scoped>
/* ==============================
   Fade/Scale Animation For Pagination
   ============================== */
.pagination-fade-enter-active, .pagination-fade-leave-active {
  transition: all 0.35s cubic-bezier(.4,0,.2,1);
}
.pagination-fade-enter-from, .pagination-fade-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(20px);
}
.pagination-fade-leave-active {
  position: absolute;
}
</style>
