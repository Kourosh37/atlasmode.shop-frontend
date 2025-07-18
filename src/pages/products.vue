<template>
  <div class="max-w-7xl mx-auto py-8 px-2 md:px-6">
    <div class="flex flex-col md:flex-row-reverse gap-6">
      <!--
        Sidebar: filter controls (categories, colors, sizes, price, etc)
        100% store-driven: no local state or emit required
      -->
      <FilterSidebar />
      <main class="flex-1 w-full">
        <!--
          Sort and Grid Controls
          - Allows user to change sort (e.g. price, latest)
          - Allows user to switch between 2 or 3 column grid view
        -->
        <SortAndGridControls :grid="grid" @update:grid="val => grid = val" />
        <!--
          Product List/Grid
          - Renders products for current page and grid setting
        -->
        <ProductList :grid="grid" />
        <!--
          Pagination controls (next/prev, jump to page, etc)
        -->
        <PaginationControls />
      </main>
    </div>

    <!--
      Error from store (API/server error, filter failure, etc)
    -->
    <div v-if="store.error" class="text-red-500 py-4 text-center">
      {{ store.error }}
    </div>

    <!--
      Initial global loading state (e.g. while filters/products are being fetched for the first time)
      Should appear only if page is not hydrated yet (prevents double loaders)
    -->
    <div v-if="store.isInitialLoading" class="flex justify-center items-center py-8">
      <span class="animate-pulse">Loading ...</span>
    </div>
  </div>
</template>

<script setup>
/**
 * ProductsPage.vue
 * 
 * - Top-level page component for all products with filter, sort, grid, and pagination.
 * - Relies on Pinia store for all business logic and API state.
 * - Provides grid state to children using Vue provide/inject.
 * 
 * Structure:
 *   - FilterSidebar:      store-driven filter controls (categories, sizes, colors, price, etc)
 *   - SortAndGridControls: sorting and column switcher
 *   - ProductList:        current page’s product grid/list
 *   - PaginationControls: page navigation
 *   - Error/Loading:      UX messages
 */

import { ref, onMounted, provide } from "vue";
import { useProductsPageStore } from "../stores/productsPageStore";

// All sections/components for this page (can be lazy-loaded for big projects)
import FilterSidebar from "../components/productsPageComponents/FilterSidebar.vue";
import SortAndGridControls from "../components/productsPageComponents/SortAndGridControls.vue";
import ProductList from "../components/productsPageComponents/ProductList.vue";
import PaginationControls from "../components/productsPageComponents/PaginationControls.vue";

// Store instance (contains all reactive state/actions for page)
const store = useProductsPageStore();

// Grid layout state: 2 or 3 columns (can be extended to other layouts)
const grid = ref(2);

// On page mount: initialize store (fetch filters, first product page, etc)
onMounted(() => {
  store.init();
});

// Provide grid to child components (injectable as 'grid' in descendants)
provide("grid", grid);
</script>
