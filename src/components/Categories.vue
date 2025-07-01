<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
    <div
      v-for="category in categories"
      :key="category.id"
      class="bg-white rounded-2xl p-4 shadow hover:shadow-lg cursor-pointer flex flex-col items-center"
    >
      <img
        v-if="category.image"
        :src="category.image.url"
        :alt="category.title"
        class="w-20 h-20 object-cover rounded-full mb-2"
      />
      <span class="font-semibold text-center">{{ category.title }}</span>
      <div v-if="category.children && category.children.length" class="mt-2 w-full">
        <div
          v-for="child in category.children"
          :key="child.id"
          class="text-xs text-gray-500 py-1 text-center border-t border-gray-100"
        >
          {{ child.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const categories = ref([]);

onMounted(async () => {
  const res = await fetch(
    "https://api.atlasmode.shop/v1/front/get-categories?version=new2"
  );
  const data = await res.json();
  categories.value = data;
});
</script>
