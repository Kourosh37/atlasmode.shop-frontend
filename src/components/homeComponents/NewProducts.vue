<script setup>
// ==============================
// Imports
// ==============================
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/home_products"; // Adjust path as needed for your project
import ProductSlider from "./ProductSlider.vue";

// ==============================
// Store Instance
// ==============================
/**
 * Products store instance for accessing and managing product data.
 */
const store = useProductsStore();

// ==============================
// Lifecycle
// ==============================
/**
 * On component mount, fetch the latest (new) products.
 */
onMounted(() => {
  store.fetchNewProducts();
});
</script>

<template>
  <!-- ==============================
       ProductSlider for New Products
       ============================== -->
  <ProductSlider
    title="جدیدترین محصولات اطلس"
    :products="store.newProducts"
    :loading="store.newLoading"
    link="/products"
  />
</template>
