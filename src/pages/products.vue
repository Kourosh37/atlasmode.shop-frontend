<template>
  <div class="max-w-7xl mx-auto py-8 px-2 md:px-6">
    <div class="flex flex-col md:flex-row-reverse gap-6">
      <FilterSidebar />
      <main class="flex-1 w-full">
        <SortAndGridControls @update:grid="(g) => grid = g" />
        <ProductList />
        <PaginationControls />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from "vue";
import { useProductsPageStore } from "../stores/productsPageStore";
import FilterSidebar from "../components/productsPageComponents/FilterSidebar.vue";
import SortAndGridControls from "../components/productsPageComponents/SortAndGridControls.vue";
import ProductList from "../components/productsPageComponents/ProductList.vue";
import PaginationControls from "../components/productsPageComponents/PaginationControls.vue";

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

// Provide all states/functions to child components
provide('store', store);
provide('grid', grid);
provide('localFilter', localFilter);
provide('sizeOpen', sizeOpen);
provide('colorOpen', colorOpen);
provide('selectedColors', selectedColors);
provide('showSort', showSort);
provide('sortOptions', sortOptions);
provide('productList', productList);
provide('toggleColor', toggleColor);
provide('removeColor', removeColor);
provide('selectSort', selectSort);
provide('handleFilter', handleFilter);
provide('changePage', changePage);
provide('isLoading', computed(() => store.isLoadingProducts));
provide('pages', computed(() => store.pages));
provide('pageCurrent', computed(() => store.pageCurrent));
provide('pageFirst', computed(() => store.pageFirst));
provide('pageLast', computed(() => store.pageLast));
</script>
