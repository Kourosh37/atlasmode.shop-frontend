<template>
  <aside
    class="w-full md:w-1/4 bg-white rounded-2xl shadow-xl p-5 h-fit min-w-[310px]"
    dir="rtl"
  >
    <div class="flex items-center justify-between mb-3">
      <span class="font-bold text-lg">فیلتر جستجو</span>
      <!-- Filter icon -->
      <svg
        class="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L15 12.414V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 9 21v-8.586L3.293 6.707A1 1 0 0 1 3 6V4z"
        />
      </svg>
    </div>
    <hr class="mb-5" />

    <form @submit.prevent="store.applyFilters" class="flex flex-col gap-6">
      <!-- Category Dropdown -->
      <div>
        <label class="block mb-1 text-xs font-bold text-gray-700"
          >دسته بندی ها</label
        >
        <select
          v-model="store.filters.categoryId"
          class="w-full rounded-xl border px-3 py-2 text-sm text-gray-500 bg-gray-50 focus:ring-2 focus:ring-primary-600"
        >
          <option value="">دسته بندی مورد نظر را انتخاب کنید</option>
          <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
            {{ cat.title }}
          </option>
        </select>
      </div>

      <!-- Title Input -->
      <div>
        <label class="block mb-1 text-xs font-bold text-gray-700">عنوان</label>
        <input
          type="text"
          v-model="store.filters.title"
          class="w-full rounded-xl border px-3 py-2 text-sm text-gray-700 bg-gray-50"
          placeholder="عنوان جستجو را بنویسید"
        />
      </div>

      <!-- Size Multi-Select -->
      <div>
        <div
          @click="store.ui.sizeOpen = !store.ui.sizeOpen"
          class="flex items-center cursor-pointer select-none"
        >
          <svg
            :class="store.ui.sizeOpen ? 'rotate-180' : ''"
            class="w-4 h-4 ml-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span class="font-bold text-gray-700 text-base">سایز</span>
        </div>
        <transition name="fade">
          <div
            v-show="store.ui.sizeOpen"
            class="grid grid-cols-3 gap-2 mt-3 pr-3"
          >
            <label
              v-for="size in store.sizes"
              :key="size.id"
              class="flex items-center gap-1 cursor-pointer text-gray-600 text-sm"
            >
              <input
                type="checkbox"
                v-model="store.filters.sizes"
                :value="size.value"
                class="accent-primary-600 rounded"
              />
              <span>{{ size.value }}</span>
            </label>
          </div>
        </transition>
      </div>

      <!-- Color Multi-Select -->
      <div>
        <div
          @click="store.ui.colorOpen = !store.ui.colorOpen"
          class="flex items-center cursor-pointer select-none"
        >
          <svg
            :class="store.ui.colorOpen ? 'rotate-180' : ''"
            class="w-4 h-4 ml-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span class="font-bold text-gray-700 text-base">رنگ</span>
        </div>
        <transition name="fade">
          <div v-show="store.ui.colorOpen" class="grid grid-cols-3 gap-4 mt-3">
            <div
              v-for="color in store.colors"
              :key="color.id"
              class="flex flex-col items-center cursor-pointer"
              @click="toggleColor(color)"
            >
              <div
                :class="[
                  'w-14 h-8 rounded-xl border mb-1 flex items-center justify-center shadow transition-all',
                  isColorSelected(color)
                    ? 'border-primary-500 ring-2 ring-primary-300'
                    : 'border-gray-200',
                ]"
                :style="{
                  background: color.gradient ? color.gradient : color.value,
                }"
              >
                <img
                  v-if="color.image"
                  :src="color.image"
                  :alt="color.title"
                  class="w-full h-full rounded-xl object-cover"
                />
              </div>
              <span
                class="text-xs font-medium mt-0.5"
                :class="isColorSelected(color) ? 'text-primary-600' : ''"
              >
                {{ color.title }}
              </span>
            </div>
          </div>
        </transition>
        <!-- Show selected colors as tags below -->
        <div
          class="flex flex-wrap mt-2 gap-1"
          v-if="store.filters.colors.length"
        >
          <!--
  Stylish tag for each selected color filter
  - Bold, rounded, with subtle shadow and smooth hover effect
  - Remove button (×) animates on hover
  - Ready for dynamic color background if you want in future
-->
          <!--
  Stylish tag for each selected color filter
  - Light border, bold pill shape, subtle shadow
  - Centered remove icon (SVG)
-->
          <span
            v-for="color in store.filters.colors"
            :key="color.id"
            class="flex items-center gap-2 px-1 py-1 rounded-full text-base border-1 border-gray-400 bg-white shadow-xl transition-all duration-200 hover:bg-primary-50 hover:border-primary-400 group mb-3 mt-2 select-none"
          >
            <!-- Color name -->
            <span class="pr-1">{{ color.title }}</span>

            <!-- Remove button with centered SVG icon -->
            <span
              class="flex items-center justify-center rounded-full w-7 h-7 ml-1 cursor-pointer bg-red-50 text-red-500 transition-all duration-200 group-hover:bg-red-500 group-hover:text-white hover:scale-110 shadow border border-red-200"
              @click.stop="removeColor(color.id)"
              title="Remove"
            >
              <!-- SVG Trash Icon (centered, 16x16) -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0h8l-1.3 12.09A2 2 0 0 1 15.01 21H8.99a2 2 0 0 1-1.99-1.91L6 7z"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>

      <!-- Only Available Products Toggle -->
      <div>
        <label
          class="flex items-center gap-2 cursor-pointer select-none text-base text-gray-700 justify-between"
        >
          <span>فقط کالاهای موجود</span>
          <span class="relative inline-flex items-center">
            <input
              type="checkbox"
              v-model="store.filters.available"
              true-value="1"
              false-value="0"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 rounded-full transition bg-gray-400 peer-checked:bg-black"
            ></div>
            <div
              class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5 border border-gray-300"
            ></div>
          </span>
        </label>
      </div>

      <!-- Price Range Slider -->
      <div>
        <label class="block mb-1 text-xs font-bold text-gray-700"
          >قیمت ها</label
        >
        <VueSlider
          v-model="store.filters.priceRange"
          :min="store.priceMin"
          :max="store.priceMax"
          :interval="10000"
          :dot-size="20"
          :tooltip="'none'"
          :enable-cross="false"
          :direction="'rtl'"
          :reverse="true"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span
            >از قیمت:
            {{ store.filters.priceRange[0]?.toLocaleString() }} تومان</span
          >
          <span
            >تا قیمت:
            {{ store.filters.priceRange[1]?.toLocaleString() }} تومان</span
          >
        </div>
      </div>

      <!-- Submit Filter Button -->
      <button
        type="submit"
        class="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow font-bold text-sm transition-all mt-2"
      >
        اعمال فیلتر
      </button>
    </form>
  </aside>
</template>

<script setup>
// 100% store-driven filter sidebar
import { useProductsPageStore } from "../../stores/productsPageStore";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

const store = useProductsPageStore();

/**
 * Toggle color selection (adds or removes color from store.filters.colors)
 * This operates entirely on the store, no local state
 */
function toggleColor(colorObj) {
  const idx = store.filters.colors.findIndex((c) => c.id === colorObj.id);
  if (idx > -1) {
    // Remove from filter
    store.filters.colors.splice(idx, 1);
  } else {
    // Add whole color object (from API)
    store.filters.colors.push(colorObj);
  }
}

/**
 * Remove a color from selected colors (from its id)
 */
function removeColor(colorId) {
  const idx = store.filters.colors.findIndex((c) => c.id === colorId);
  if (idx > -1) {
    store.filters.colors.splice(idx, 1);
  }
}

/**
 * Checks if color is selected by id (used for UI highlight)
 */
function isColorSelected(colorObj) {
  return store.filters.colors.some((c) => c.id === colorObj.id);
}
</script>

<style>
.vue-slider-rail {
  background: #ddd !important;
}
.vue-slider-process {
  background: #000 !important;
}
.vue-slider-dot {
  border: 2px solid #000 !important;
  border-radius: 100% !important;
}
</style>
