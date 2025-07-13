<template>
  <div class="max-w-7xl mx-auto py-8 px-2 md:px-6">
    <div class="flex flex-col md:flex-row-reverse gap-6">
      <!-- Sidebar for filters -->
      <FilterSidebar />
      <main class="flex-1 w-full">
        <!-- Controls for sorting and grid view -->
        <SortAndGridControls :grid="grid" @update:grid="val => grid = val" />
        <!-- Product grid/list -->
        <ProductList :grid="grid" />
        <!-- Pagination -->
        <PaginationControls />
      </main>
    </div>
    <!-- Error message from store -->
    <div v-if="store.error" class="text-red-500 py-4 text-center">
      {{ store.error }}
    </div>
    <!-- Initial loading spinner -->
    <div v-if="store.isInitialLoading" class="flex justify-center items-center py-8">
      <span class="animate-pulse">Loading ...</span>
    </div>
  </div>
</template>

<script setup>
// Import necessary Vue and store tools
import { ref, onMounted } from "vue";
import { useProductsPageStore } from "../stores/productsPageStore";

// Import all page sections/components
import FilterSidebar from "../components/productsPageComponents/FilterSidebar.vue";
import SortAndGridControls from "../components/productsPageComponents/SortAndGridControls.vue";
import ProductList from "../components/productsPageComponents/ProductList.vue";
import PaginationControls from "../components/productsPageComponents/PaginationControls.vue";

// Initialize store instance (all state and actions come from here)
const store = useProductsPageStore();

// Grid layout state (2 or 3 columns, as an example)
const grid = ref(2);

// Run store initialization on component mount
onMounted(() => {
  store.init();
});
</script>
