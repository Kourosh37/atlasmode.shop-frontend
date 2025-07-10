<template>
  <!-- Use a single transition for both loading and content -->
  <transition name="fade" mode="out-in">
    <!-- Loading overlay (shown when loadingInit is true) -->
    <div v-if="loadingInit" key="loading" class="fixed inset-0 z-50 bg-black/40 flex flex-col justify-center items-center">
      <div class="flex flex-col items-center gap-5">
        <svg class="animate-spin h-14 w-14 text-amber-400 drop-shadow-xl" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="text-2xl font-bold text-amber-500 drop-shadow">Loading Kourosh Shop...</span>
      </div>
    </div>

    <!-- Main content (shown when loadingInit is false) -->
    <div v-else key="main" class="px-2 md:px-10 py-8 bg-gradient-to-tr from-amber-50 via-rose-100 to-violet-100 min-h-screen">
      

      <!-- Categories and Colors -->
      <section class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Categories -->
        <div>
          <span class="font-bold text-gray-700">Categories:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="cat in categories"
              :key="cat.id"
              class="px-4 py-1.5 rounded-xl bg-white shadow hover:bg-amber-100 transition-all duration-150 cursor-pointer text-sm font-semibold text-violet-600"
            >
              {{ cat.title }}
            </span>
          </div>
        </div>
        <!-- Colors -->
        <div>
          <span class="font-bold text-gray-700">Colors:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="c in colors"
              :key="c.id"
              class="px-4 py-1.5 rounded-xl border border-amber-400 bg-gradient-to-r from-white to-amber-50 shadow hover:bg-amber-50 transition-all duration-150 cursor-pointer text-sm font-semibold text-rose-500"
            >
              {{ c.title }}
            </span>
          </div>
        </div>
      </section>

      <!-- Price and Sizes -->
      <section class="mb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <!-- Max Price -->
        <div class="bg-gradient-to-r from-violet-100 to-amber-100 rounded-2xl shadow-lg p-6 flex flex-col items-center scale-100 hover:scale-105 transition duration-150">
          <span class="font-semibold text-gray-700 mb-2">Max Price</span>
          <span class="text-2xl font-extrabold text-amber-600 drop-shadow">{{ max_price }} <span class="text-base font-light">تومان</span></span>
        </div>
        <!-- Min Price -->
        <div class="bg-gradient-to-l from-amber-100 to-violet-100 rounded-2xl shadow-lg p-6 flex flex-col items-center scale-100 hover:scale-105 transition duration-150">
          <span class="font-semibold text-gray-700 mb-2">Min Price</span>
          <span class="text-2xl font-extrabold text-violet-600 drop-shadow">{{ min_price }} <span class="text-base font-light">تومان</span></span>
        </div>
        <!-- Sizes -->
        <div class="col-span-2 flex flex-col gap-2">
          <span class="font-bold text-gray-700">Sizes:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="s in sizes"
              :key="s.id"
              class="px-3 py-1.5 rounded-xl bg-white shadow border border-rose-200 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all duration-100"
            >
              {{ s.value }}
            </span>
          </div>
        </div>
      </section>

      <!-- Pagination info -->
      <section class="flex justify-between items-center mb-6">
        <span class="text-gray-700">First Page: <span class="font-bold text-amber-600">{{ firstPage }}</span></span>
        <span class="text-gray-700">Last Page: <span class="font-bold text-violet-600">{{ lastPage }}</span></span>
      </section>

      <!-- Grid Control Switcher -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span class="text-gray-700 font-bold text-base mr-2">Grid:</span>
        <button
          v-for="g in [2,3,4]"
          :key="g"
          :class="[
            'px-3 py-2 rounded-xl transition-all shadow font-bold border hover:scale-110 duration-200',
            grid === g ? 'bg-gradient-to-r from-violet-500 to-amber-400 text-white scale-110 shadow-lg border-amber-300' : 'bg-white text-violet-600 border-violet-200 hover:bg-amber-50'
          ]"
          @click="grid = g"
        >
          <span class="flex items-center gap-1">
            <svg v-for="i in g" :key="i" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><rect width="20" height="20" rx="4"></rect></svg>
            <span class="ml-1 text-xs font-normal text-gray-500 hidden sm:inline">{{ g }} col</span>
          </span>
        </button>
      </div>

      <!-- Pagination Buttons -->
      <div class="flex flex-wrap gap-3 justify-center mb-10">
        <button
          v-for="page in pages"
          :key="page"
          :class="[
            'w-10 h-10 rounded-full shadow-lg font-bold transition-all duration-200 border-2 border-violet-100 hover:scale-110 hover:border-amber-400',
            activePage === page
              ? 'bg-gradient-to-br from-amber-400 to-violet-500 text-white border-amber-500 scale-110'
              : 'bg-white text-violet-500'
          ]"
          @click="handlePageClick(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- Product grid for the active page -->
      <section>
        <!-- Loading spinner when fetching products for a page -->
        <transition name="fade">
          <div v-if="loadingProducts" class="flex flex-col items-center justify-center h-72">
            <svg class="animate-spin h-14 w-14 text-violet-400 mb-3" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="text-lg font-bold text-violet-500 drop-shadow animate-pulse">Loading Products...</span>
          </div>
          <div v-else>
            <div v-if="products[activePage]?.length">
              <div class="mb-4 flex items-center gap-2 justify-center">
                <span class="text-amber-700 font-extrabold text-lg drop-shadow">Products Page {{ activePage }}</span>
                <span class="text-gray-400 text-xs">(Count: {{ products[activePage].length }})</span>
              </div>
              <div
                :class="[
                  'gap-6 transition-all duration-300',
                  grid === 2 ? 'grid grid-cols-1 md:grid-cols-2' : '',
                  grid === 3 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : '',
                  grid === 4 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''
                ]"
              >
                <product-card v-for="p in products[activePage]" :key="p.id" :product="p" />
              </div>
            </div>
            <div v-else class="text-center text-rose-400 py-16 text-xl font-bold animate-pulse">
              No products found.
            </div>
          </div>
        </transition>
        
      </section>

      <!-- Error message -->
      <transition name="fade">
        <div
          v-if="error"
          class="fixed bottom-6 left-6 bg-gradient-to-br from-rose-100 to-amber-100 text-rose-600 p-4 rounded-2xl shadow-xl z-50 text-lg font-bold border-l-8 border-rose-400 animate-shake"
        >
          {{ error }}
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ProductCard from "../components/ProductCard.vue";

const loadingInit = ref(true);
const loadingProducts = ref(false);
const error = ref("");
const categories = ref([]);
const colors = ref([]);
const max_price = ref(0);
const min_price = ref(0);
const sizes = ref([]);
const firstPage = ref(1);
const lastPage = ref(1);
const activePage = ref(1);
const products = ref({});
const grid = ref(4);

const pages = computed(() =>
  Array.from({ length: lastPage.value - firstPage.value + 1 }, (_, i) => firstPage.value + i)
);

const fetchCategories = async () => {
  const res = await axios.get(
    "https://api.atlasmode.shop/v1/front/get-categories?version=new2"
  );
  categories.value = res.data[0]?.children ?? [];
};
const fetchColors = async () => {
  const res = await axios.get(
    "https://api.atlasmode.shop/v1/front/color-ranges?version=new2"
  );
  colors.value = res.data.data?.colorRanges ?? [];
};
const fetchProductsAttributes = async () => {
  const res = await axios.get(
    "https://api.atlasmode.shop/v1/front/products?version=new2&page=1&sort=&title=&flash_id=&max_price=0&min_price=0&available=0&category_id="
  );
  const data = res.data.data;
  max_price.value = data.priceFilter?.max_price ?? 0;
  min_price.value = data.priceFilter?.min_price ?? 0;
  sizes.value = data.attributes?.values ?? [];
  firstPage.value = data.products?.from ?? 1;
  lastPage.value = data.products?.last_page ?? 1;
};
const fetchProductsPage = async (page) => {
  if (products.value[page]) return;
  loadingProducts.value = true;
  try {
    const res = await axios.get(
      `https://api.atlasmode.shop/v1/front/products?page=${page}`
    );
    products.value[page] = res.data.data.products.data;
  } catch (err) {
    error.value = "Failed to fetch products for this page!";
  } finally {
    loadingProducts.value = false;
  }
};
const handlePageClick = async (page) => {
  activePage.value = page;
  await fetchProductsPage(page);
};

onMounted(async () => {
  loadingInit.value = true;
  error.value = "";
  try {
    await fetchCategories();
    await fetchColors();
    await fetchProductsAttributes();
    activePage.value = firstPage.value;
    await fetchProductsPage(activePage.value);
  } catch (err) {
    error.value = "Failed to load data! Please try again.";
  } finally {
    loadingInit.value = false;
  }
});
</script>

<style>
@keyframes shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
}
.animate-shake {
  animation: shake 0.8s 1;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .35s cubic-bezier(0.4,0,0.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
