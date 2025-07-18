<script setup>
// ==============================
// Imports
// ==============================
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/home_products";
import ProductSlider from "../../components/homeComponents/ProductSlider.vue";

// ==============================
// Store Instance
// ==============================
/**
 * Store instance to handle categories and products data.
 */
const store = useProductsStore();

// ==============================
// Lifecycle
// ==============================
/**
 * On component mount, fetch categories and their products from store.
 */
onMounted(() => {
  store.fetchCategories();
});
</script>

<template>
  <div class="w-full flex flex-col gap-16" dir="rtl">
    <!-- ==============================
         Loading State (Show Loading Sliders)
         ============================== -->
    <template v-if="store.categoriesLoading">
      <!-- Render two loading sliders as skeletons -->
      <ProductSlider
        v-for="i in 2"
        :key="i"
        title="در حال بارگذاری..."
        :products="[]"
        :loading="true"
      />
    </template>
    <!-- ==============================
         Loaded State (Show Category Sliders)
         ============================== -->
    <template v-else>
      <!-- Render a ProductSlider for each category -->
      <ProductSlider
        v-for="cat in store.categories"
        :key="cat.id"
        :title="cat.title"
        :products="cat.products || []"
        :loading="false"
        :link="`/category/${cat.id}`"
      />
    </template>
  </div>
</template>
