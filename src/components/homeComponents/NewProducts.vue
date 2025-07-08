<script setup>
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/products"; // مسیر را نسبت به پروژه‌ات تنظیم کن
import ProductSlider from "./ProductSlider.vue";

const store = useProductsStore();

onMounted(() => {
  store.fetchNewProducts();
});
</script>

<template>
  <ProductSlider
    title="جدیدترین محصولات اطلس"
    :products="store.newProducts"
    :loading="store.newLoading"
    link="/products"
  />
</template>
