<script setup>
import { onMounted } from "vue";
import { useProductsStore } from "../stores/products"; // مسیر را نسبت به پروژه تنظیم کن
import ProductSlider from "../components/ProductSlider.vue";

const store = useProductsStore();

onMounted(() => {
  store.fetchCategories();
});
</script>

<template>
  <div class="w-full flex flex-col gap-16" dir="rtl">
    <template v-if="store.categoriesLoading">
      <ProductSlider v-for="i in 2" :key="i"
        title="در حال بارگذاری..."
        :products="[]"
        :loading="true"
      />
    </template>
    <template v-else>
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
