<script setup>
import { onMounted, ref } from "vue";
import { useCategoryStore } from "../stores/categories";

const categoryStore = useCategoryStore();

onMounted(() => {
  if (!categoryStore.categories.length) categoryStore.fetchCategories();
});

const loadedImages = ref({});

function handleImageLoad(id) {
  loadedImages.value = { ...loadedImages.value, [id]: true };
}
</script>

<template>
  <!-- Loading Skeleton -->
  <div
    v-if="categoryStore.loading"
    class="flex w-full gap-4 md:gap-8 px-2 md:px-6 py-4 md:py-6 overflow-x-auto justify-center md:justify-center"
    style="scroll-snap-type: x mandatory;"
    dir="rtl"
  >
    <div
      v-for="i in 5"
      :key="i"
      class="min-w-[140px] md:min-w-[230px] w-36 md:w-60 h-40 md:h-64 bg-gray-200 rounded-xl flex-shrink-0 animate-shine"
    ></div>
  </div>

  <!-- Cards -->
  <div
    v-else
    class="flex w-full gap-4 md:gap-8 px-2 md:px-6 py-4 md:py-6 overflow-x-auto justify-center md:justify-center"
    style="scroll-snap-type: x mandatory;"
    dir="rtl"
  >
    <template v-if="categoryStore.mainCategories.length">
      <div
        v-for="cat in categoryStore.mainCategories"
        :key="cat.id"
        class="bg-white rounded-xl shadow-lg min-w-[140px] md:min-w-[230px] w-36 md:w-60 h-40 md:h-64 flex flex-col items-center justify-end p-2 md:p-3 hover:shadow-2xl transition-shadow duration-200 cursor-pointer snap-start flex-shrink-0"
      >
        <div
          v-if="cat.image && !loadedImages[cat.id]"
          class="w-full h-24 md:h-40 bg-gray-200 rounded-xl mb-2 md:mb-4 animate-shine"
        ></div>
        <img
          v-if="cat.image"
          :src="cat.image.url"
          :alt="cat.title"
          loading="lazy"
          class="w-full h-24 md:h-40 object-cover rounded-xl mb-2 md:mb-4 transition-opacity duration-700"
          :class="{ 'opacity-0': !loadedImages[cat.id], 'opacity-100': loadedImages[cat.id], 'absolute': !loadedImages[cat.id] }"
          @load="handleImageLoad(cat.id)"
        />
        <span class="font-bold text-base md:text-lg text-center mt-auto">{{ cat.title }}</span>
      </div>
    </template>
    <span v-else class="text-gray-400 mx-auto">No Categories Found!</span>
  </div>
</template>

<style scoped>
@keyframes shine {
  0% {
    transform: translateX(-80%);
  }
  100% {
    transform: translateX(120%);
  }
}
.animate-shine {
  position: relative;
  overflow: hidden;
}
.animate-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 70%;
  height: 100%;
  background: linear-gradient(90deg, #e5e7eb 0%, #f4f4f5 50%, #e5e7eb 100%);
  animation: shine 1.3s linear infinite;
  z-index: 1;
  pointer-events: none;
}
</style>
