<script setup>
// ==============================
// Imports
// ==============================
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/home_products"; // Update path if project structure changes
import ProductSlider from "./ProductSlider.vue";

// ==============================
// Store Instance
// ==============================
/**
 * Products store for managing product-related state and actions.
 */
const store = useProductsStore();

// ==============================
// Lifecycle
// ==============================
/**
 * On component mount, fetch discounted products from the store.
 */
onMounted(() => {
  store.fetchDiscountProducts();
});
</script>

<template>
  <!-- ==============================
       ProductSlider Component
       ============================== -->
  <ProductSlider
    title="تخفیف‌دارهای اطلس"
    :products="store.discountProducts"
    :loading="store.discountLoading"
    link="/products"
  />
</template>
