<template>
  <div
    v-if="loading"
    class="flex flex-col items-center justify-center w-full h-60 bg-white/70 backdrop-blur rounded-2xl p-8"
  >
    <svg
      class="animate-spin h-12 w-12 text-gray-500 drop-shadow-lg mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-30"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span class="text-gray-600 font-semibold text-lg tracking-wide"
      >Loading...</span
    >
  </div>

  <div
    v-else
    
  >
  <div class="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      {{ productTitle }}
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="image in productImages"
        :key="image.url"
        class="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-50"
      >
        <img
          :src="image.url"
          alt="Product image"
          class="object-cover w-full h-36 transition-transform duration-200 hover:scale-105"
        />
      </div>
    </div>
  </div>
    
    <ProductSlider
    title="محصولات مشابه"
    :products="relatedProducts"
    :loading="loading"
    link="/products"
  />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ProductSlider from '../components/homeComponents/ProductSlider.vue'

const props = defineProps(["id"]);

const loading = ref(true);

const productTitle = ref("");
const productImages = ref([]);
const relatedProducts = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get(
      `https://api.atlasmode.shop/v1/front/products/${props.id}?version=new2`
    );
    productTitle.value = res.data.data.product.title;
    productImages.value = res.data.data.product.images;
    relatedProducts.value = res.data.data.relatedProducts;
  } catch (e) {
    apiResponse.value = "Error loading data";
  } finally {
    loading.value = false;
  }
});
</script>
