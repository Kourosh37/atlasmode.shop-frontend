<template>
  <div v-if="isLoading" class="py-16 text-center text-gray-400 text-lg animate-pulse">
    در حال دریافت محصولات...
  </div>
  <div v-else>
    <div v-if="productList && productList.length"
      :class="[
        'grid gap-5',
        grid === 2 && 'grid-cols-1 sm:grid-cols-2',
        grid === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      ]">
      <ProductCard v-for="p in productList" :key="p.id" :product="p" />
    </div>
    <div v-else class="py-14 text-center text-gray-300 text-lg">
      محصولی یافت نشد.
    </div>
  </div>
</template>

<script setup>
import ProductCard from '../ProductCard.vue';
import { inject } from 'vue';
const productList = inject('productList');
const grid = inject('grid');
const isLoading = inject('isLoading');
</script>
