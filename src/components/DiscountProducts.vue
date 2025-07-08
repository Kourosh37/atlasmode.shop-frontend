<script setup>
import { onMounted } from "vue";
import { useProductsStore } from "../stores/products"; // مسیر ایمپورت نسبت به ساختار پروژه‌ات
import ProductSlider from "../components/ProductSlider.vue";

const store = useProductsStore();

onMounted(() => {
  store.fetchDiscountProducts();
});
</script>

<template>
  <ProductSlider
    title="تخفیف‌دارهای اطلس"
    :products="store.discountProducts"
    :loading="store.discountLoading"
    link="/products"
  />
</template>
