<script setup>
import { onMounted } from "vue";
import { useProductsStore } from "../../stores/home_products"; // مسیرت رو نسبت به پروژه خودت تنظیم کن
import ProductSlider from "./ProductSlider.vue";

const store = useProductsStore();

onMounted(() => {
  store.fetchMostSalesProducts();
});
</script>

<template>
  <ProductSlider
    title="پرفروش‌ترین‌های اطلس"
    :products="store.mostSalesProducts"
    :loading="store.mostSalesLoading"
    link="/products"
  />
</template>
