<template>
  <!-- Loading spinner if products are loading or not ready yet -->
  <div v-if="showLoading" class="py-16 text-center">
    <div class="flex justify-center mb-4">
      <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
    <div class="text-gray-400 text-lg mb-6">... در حال بارگذاری محصولات</div>
  </div>

  <!-- Product grid -->
  <div v-else>
    <div v-if="productList && productList.length"
      :class="[
        'grid gap-5',
        grid === 2 && 'grid-cols-1 sm:grid-cols-2',
        grid === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      ]"
    >
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
// Pure Pinia store-based product list
import ProductCard from '../ProductCard.vue'
import { useProductsPageStore } from '../../stores/productsPageStore'
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'

// Get store instance (all state comes from here)
const store = useProductsPageStore()

// If your grid layout is global, keep it in the store; otherwise, inject or use local (per parent)
const grid = inject('grid', 2) // fallback 2, or move to store if you want it globally

// Compute current product list from store's current page
const productList = computed(() =>
  store.productsByPage[store.currentPage] || []
)

// Loading state (true if products are loading or not fetched yet)
const showLoading = computed(() =>
  store.isProductsLoading || store.isInitialLoading || productList.value == null
)

// Navigate to product detail
const router = useRouter()
function goToProduct(id) {
  router.push(`/products/${id}`)
}
</script>
