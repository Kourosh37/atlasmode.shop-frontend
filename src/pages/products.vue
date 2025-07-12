<template>
  <div class="max-w-7xl mx-auto py-8 px-2 md:px-6">
    <div class="flex flex-col md:flex-row-reverse gap-6">
      <!-- Filter Sidebar -->
      <aside class="w-full md:w-1/4 bg-white rounded-2xl shadow-xl p-5 h-fit min-w-[310px]" dir="rtl">
        <!-- Filter Title -->
        <div class="flex items-center justify-between mb-3">
          <span class="font-bold text-lg">فیلتر جستجو</span>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L15 12.414V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 9 21v-8.586L3.293 6.707A1 1 0 0 1 3 6V4z" />
          </svg>
        </div>
        <hr class="mb-5" />
        <form @submit.prevent="handleFilter" class="flex flex-col gap-6">
          <!-- Category Dropdown -->
          <div>
            <label class="block mb-1 text-xs font-bold text-gray-700">دسته بندی ها</label>
            <select v-model="localFilter.category_id"
              class="w-full rounded-xl border px-3 py-2 text-sm text-gray-500 bg-gray-50 focus:ring-2 focus:ring-primary-600">
              <option value="">دسته بندی مورد نظر را انتخاب کنید</option>
              <option v-for="cat in store.categoryList" :key="cat.id" :value="cat.id">
                {{ cat.title }}
              </option>
            </select>
          </div>
          <!-- Title Input -->
          <div>
            <label class="block mb-1 text-xs font-bold text-gray-700">عنوان</label>
            <input type="text" v-model="localFilter.title"
              class="w-full rounded-xl border px-3 py-2 text-sm text-gray-700 bg-gray-50"
              placeholder="عنوان جستجو را بنویسید" />
          </div>
          <!-- Size Multi-Select -->
          <div>
            <div @click="sizeOpen = !sizeOpen" class="flex items-center cursor-pointer select-none">
              <svg :class="sizeOpen ? 'rotate-180' : ''" class="w-4 h-4 ml-1 transition-transform duration-200"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
              <span class="font-bold text-gray-700 text-base">سایز</span>
            </div>
            <transition name="fade">
              <div v-show="sizeOpen" class="grid grid-cols-3 gap-2 mt-3 pr-3">
                <label v-for="size in store.sizeList" :key="size.id"
                  class="flex items-center gap-1 cursor-pointer text-gray-600 text-sm">
                  <input type="checkbox" v-model="localFilter.sizes" :value="size.value"
                    class="accent-primary-600 rounded" />
                  <span>{{ size.value }}</span>
                </label>
              </div>
            </transition>
          </div>
          <!-- Color Multi-Select -->
          <div>
            <div @click="colorOpen = !colorOpen" class="flex items-center cursor-pointer select-none">
              <svg :class="colorOpen ? 'rotate-180' : ''" class="w-4 h-4 ml-1 transition-transform duration-200"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
              <span class="font-bold text-gray-700 text-base">رنگ</span>
            </div>
            <transition name="fade">
              <div v-show="colorOpen" class="grid grid-cols-3 gap-4 mt-3">
                <div v-for="color in store.colorList" :key="color.id"
                  class="flex flex-col items-center cursor-pointer" @click="toggleColor(color.value)">
                  <div :class="[
                    'w-14 h-8 rounded-xl border mb-1 flex items-center justify-center shadow transition-all',
                    localFilter.colors.includes(color.value)
                      ? 'border-primary-500 ring-2 ring-primary-300'
                      : 'border-gray-200',
                  ]" :style="{ background: color.gradient ? color.gradient : color.value }">
                    <img v-if="color.image" :src="color.image" :alt="color.title"
                      class="w-full h-full rounded-xl object-cover" />
                  </div>
                  <span class="text-xs font-medium mt-0.5"
                    :class="localFilter.colors.includes(color.value) ? 'text-primary-600' : ''">
                    {{ color.title }}
                  </span>
                </div>
              </div>
            </transition>
            <div class="flex flex-wrap mt-2 gap-1" v-if="localFilter.colors.length">
              <span v-for="color in selectedColors" :key="color.id"
                class="flex items-center gap-1 px-2 py-1 border border-primary-500 rounded-xl text-xs bg-gray-50">
                <span class="w-3 h-3 rounded-full border block"
                  :style="{ background: color.gradient ? color.gradient : color.value }"></span>
                {{ color.title }}
                <span class="cursor-pointer text-red-400 hover:text-red-700 ml-1"
                  @click.stop="removeColor(color.value)">×</span>
              </span>
            </div>
          </div>
          <!-- Only Available Products Toggle -->
          <div>
            <label class="flex items-center gap-2 cursor-pointer select-none text-base text-gray-700 justify-between">
              <span>فقط کالاهای موجود</span>
              <span class="relative inline-flex items-center">
                <input type="checkbox" v-model="localFilter.available" true-value="1" false-value="0"
                  class="sr-only peer" />
                <div class="w-11 h-6 rounded-full transition bg-gray-200 peer-checked:bg-gray-500"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5 border border-gray-300"></div>
              </span>
            </label>
          </div>
          <!-- Price Range Sliders -->
          <div>
            <label class="block mb-1 text-xs font-bold text-gray-700">قیمت ها</label>
            <div class="flex flex-col gap-1">
              <input type="range" v-model.number="localFilter.min_price"
                :min="store.minPrice"
                :max="localFilter.max_price || store.maxPrice"
                step="10000"
                class="w-full accent-primary-600" />
              <input type="range" v-model.number="localFilter.max_price"
                :min="localFilter.min_price || store.minPrice"
                :max="store.maxPrice"
                step="10000"
                class="w-full accent-primary-600" />
              <!-- Current prices (reactive) -->
              <div class="flex justify-between text-xs text-gray-700 mt-2">
                <span>
                  حداقل: <span class="font-bold">{{ Number(localFilter.min_price).toLocaleString() }}</span> تومان
                </span>
                <span>
                  حداکثر: <span class="font-bold">{{ Number(localFilter.max_price).toLocaleString() }}</span> تومان
                </span>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>از قیمت: {{ store.minPrice.toLocaleString() }} تومان</span>
                <span>تا قیمت: {{ store.maxPrice.toLocaleString() }} تومان</span>
              </div>
            </div>
          </div>
          <!-- Apply Filters Button -->
          <button type="submit"
            class="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow font-bold text-sm transition-all mt-2">
            اعمال فیلتر
          </button>
        </form>
      </aside>
      <!-- Main Content (Products List) -->
      <main class="flex-1 w-full">
        <!-- Sort & Grid Controls -->
        <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div class="flex items-center gap-4">
            <!-- Sort Dropdown -->
            <div class="flex items-center gap-2" dir="rtl">
              <span class="text-gray-600 text-xs">فیلتر:</span>
              <div class="relative">
                <button
                  @click="showSort = !showSort"
                  class="w-48 text-right border rounded-xl px-3 py-2 bg-white text-gray-700 font-bold flex items-center justify-between"
                  type="button"
                >
                  {{ sortOptions.find(opt => opt.value === localFilter.sort)?.label || 'پربازدید ترین' }}
                  <svg :class="showSort ? 'rotate-180' : ''" class="w-4 h-4 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <ul v-show="showSort" @mouseleave="showSort = false"
                  class="absolute w-full right-0 z-20 mt-2 border bg-white shadow-lg rounded-xl text-sm font-bold py-1"
                  style="min-width: 180px">
                  <li v-for="option in sortOptions" :key="option.value"
                      @click="selectSort(option.value)"
                      :class="[
                        'px-4 py-2 cursor-pointer hover:bg-gray-100 transition',
                        localFilter.sort === option.value ? 'bg-gray-700 text-white' : 'text-gray-900'
                      ]">
                    {{ option.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2" dir="rtl">
            
            <button v-for="g in [2, 3]" :key="g"
              :class="[
                'rounded-lg border text-xs font-bold transition-all flex items-center justify-center',
                grid === g
                  ? 'bg-primary-600 border-primary-600 text-white shadow'
                  : 'bg-white border-gray-200 text-gray-600',
              ]" @click="grid = g" style="width: 40px; height: 40px" :title="`${g} ستونه`">
              <template v-if="g === 2">
                <!-- 2 Columns Grid Icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" class="mx-auto" fill="none">
                  <rect x="4" y="6" width="6" height="12" rx="2"
                    :fill="grid === 2 ? '#fff' : '#6b7280'" />
                  <rect x="14" y="6" width="6" height="12" rx="2"
                    :fill="grid === 2 ? '#fff' : '#6b7280'" />
                </svg>
              </template>
              <template v-else>
                <!-- 3 Columns Grid Icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" class="mx-auto" fill="none">
                  <rect x="3" y="6" width="5.5" height="12" rx="1.5"
                    :fill="grid === 3 ? '#fff' : '#6b7280'" />
                  <rect x="9.75" y="6" width="5.5" height="12" rx="1.5"
                    :fill="grid === 3 ? '#fff' : '#6b7280'" />
                  <rect x="16.5" y="6" width="5.5" height="12" rx="1.5"
                    :fill="grid === 3 ? '#fff' : '#6b7280'" />
                </svg>
              </template>
            </button>
            <span class="text-gray-500 text-xs">نمایش محصولات موجود</span>
            <input type="checkbox" v-model="localFilter.available" true-value="1" false-value="0" />
          </div>
        </div>
        <!-- Product List -->
        <div v-if="store.isLoadingProducts" class="py-16 text-center text-gray-400 text-lg animate-pulse">
          در حال دریافت محصولات...
        </div>
        <div v-else>
          <div v-if="productList && productList.length"
            :class="[
              'grid gap-5',
              grid === 2 && 'grid-cols-1 sm:grid-cols-2',
              grid === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            ]">
            <ProductCard v-for="p in productList" :key="p.id" :product="p" />
          </div>
          <div v-else class="py-14 text-center text-gray-300 text-lg">
            محصولی یافت نشد.
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="store.pages.length > 1" class="flex justify-center mt-8 gap-2">
          <button :disabled="store.pageCurrent === store.pageFirst" @click="changePage(store.pageCurrent - 1)"
            class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed">
            ‹
          </button>
          <button v-for="page in store.pages" :key="page" @click="changePage(page)"
            :class="[
              'w-9 h-9 rounded-xl border flex items-center justify-center font-bold transition-all',
              store.pageCurrent === page
                ? 'bg-primary-600 border-primary-600 text-white shadow'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
            ]">
            {{ page }}
          </button>
          <button :disabled="store.pageCurrent === store.pageLast" @click="changePage(store.pageCurrent + 1)"
            class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed">
            ›
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductsPageStore } from "../stores/productsPageStore";
import ProductCard from "../components/ProductCard.vue";

const store = useProductsPageStore();
const grid = ref(2);

const sortOptions = [
  { value: "", label: "پربازدید ترین" },
  { value: "low_to_high", label: "ارزان ترین" },
  { value: "high_to_low", label: "گران ترین" },
  { value: "most_sales", label: "پرفروش ترین" },
  { value: "latest", label: "جدید ترین" },
  { value: "special", label: "ویژه" }
];

const showSort = ref(false);

const localFilter = ref({
  category_id: "",
  title: "",
  sizes: [],
  colors: [],
  available: 0,
  min_price: 0,
  max_price: 0,
  sort: ""
});
const sizeOpen = ref(true);
const colorOpen = ref(true);

const productList = computed(() => store.productPages[store.pageCurrent] || []);
const selectedColors = computed(() =>
  store.colorList.filter((color) =>
    localFilter.value.colors.includes(color.value)
  )
);

function toggleColor(val) {
  const idx = localFilter.value.colors.indexOf(val);
  if (idx === -1) localFilter.value.colors.push(val);
  else localFilter.value.colors.splice(idx, 1);
}
function removeColor(val) {
  localFilter.value.colors = localFilter.value.colors.filter((c) => c !== val);
}

function selectSort(value) {
  localFilter.value.sort = value;
  showSort.value = false;
  handleFilter();
}

const handleFilter = async () => {
  await store.applyFilters({
    ...localFilter.value,
    color: localFilter.value.colors.join(","),
    size: localFilter.value.sizes.join(","),
    min_price: localFilter.value.min_price || store.minPrice,
    max_price: localFilter.value.max_price || store.maxPrice,
    sort: localFilter.value.sort
  });
};

const changePage = async (page) => {
  await store.handlePageChange(page);
};

onMounted(() => {
  store.initStore();
  localFilter.value.min_price = store.minPrice;
  localFilter.value.max_price = store.maxPrice;
});
</script>

<style>
.bg-primary-600 {
  background-color: #3b82f6;
}
.border-primary-500 {
  border-color: #2563eb;
}
.text-primary-600 {
  color: #2563eb;
}
.ring-primary-300 {
  box-shadow: 0 0 0 2px #93c5fd;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
input[type="range"]::-webkit-slider-thumb {
  background: #000;
}
</style>
