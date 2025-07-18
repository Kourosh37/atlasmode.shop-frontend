<script setup>
// ==============================
// Imports
// ==============================
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/home_products";
import ProductSlider from "./ProductSlider.vue";

// ==============================
// Store Instance
// ==============================
/**
 * Products store instance for fetching and accessing sales data.
 */
const store = useProductsStore();

// ==============================
// Lifecycle
// ==============================
/**
 * On component mount, fetch the most sold products from the store.
 */
onMounted(() => {
  store.fetchMostSalesProducts();
});
</script>

<template>
  <!-- ==============================
       ProductSlider for Most Sold Products
       ============================== -->
  <ProductSlider
    title="پرفروش‌ترین‌های اطلس"
    :products="store.mostSalesProducts"
    :loading="store.mostSalesLoading"
    link="/products"
  />
</template>
