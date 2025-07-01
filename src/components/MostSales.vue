<template>
  <div>
    <h2 class="text-lg font-bold mb-4 text-right">پرفروش‌ترین محصولات</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl shadow hover:shadow-xl p-4 flex flex-col items-center"
      >
        <img
          :src="product.major_image.url"
          :alt="product.title"
          class="w-28 h-28 object-cover rounded-xl mb-3"
        />
        <span class="font-semibold text-center mb-1">{{ product.title }}</span>
        <span class="text-pink-600 font-bold">{{ product.major_final_price.amount.toLocaleString() }} تومان</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const products = ref([]);

onMounted(async () => {
  const res = await fetch(
    "https://api.atlasmode.shop/v1/front/most-sales?version=new2"
  );
  const data = await res.json();
  products.value = data.data.response.mostSales;
});
</script>
