<template>
  <!-- ==============================
       Product Grid/List With Loading
       ============================== -->
  <!-- Loading spinner if products are loading or not ready yet -->
  <div v-if="showLoading" class="py-16 text-center">
    <div class="flex justify-center mb-4">
      <svg
        class="animate-spin h-8 w-8 text-primary mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
    <div class="text-gray-400 text-lg mb-6">... در حال بارگذاری محصولات</div>
  </div>

  <!-- Product grid -->
  <div v-else>
    <div
      v-if="productList && productList.length"
      :class="[
        'grid gap-5',
        grid === 2 && 'grid-cols-1 sm:grid-cols-2',
        grid === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      ]"
    >
      <!-- Single Product Card -->
      <ProductCard
        v-for="p in productList"
        :key="p.id"
        :product="p"
        @click="goToProduct(p.id)"
      />
    </div>
    <!-- No products found -->
    <div v-else class="py-14 text-center text-gray-300 text-lg">
      محصولی یافت نشد
    </div>
  </div>
</template>

<script setup>
// ==============================
// Imports & Store
// ==============================
import ProductCard from '../ProductCard.vue'
import { useProductsPageStore } from '../../stores/productsPageStore'
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'

// Get the products store (all list/filter state from here)
const store = useProductsPageStore()

// Grid columns: can be injected (by parent), or set global in store
const grid = inject('grid', 2) // fallback: 2-column grid, override via provide

// The product list for current page (always from store, paginated)
const productList = computed(() =>
  store.productsByPage[store.currentPage] || []
)

// Loading state: true if loading or data not ready
const showLoading = computed(() =>
  store.isProductsLoading || store.isInitialLoading || productList.value == null
)

// Navigate to product detail page
const router = useRouter()
function goToProduct(id) {
  router.push(`/products/${id}`)
}
</script>
