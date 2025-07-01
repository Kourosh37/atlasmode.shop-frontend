<template>
  <div class="mb-8">
    <h2 class="text-lg font-bold mb-4 text-right">آخرین مطالب بلاگ</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-white rounded-2xl shadow p-4 flex flex-col"
      >
        <img
          v-if="post.image"
          :src="post.image.url"
          :alt="post.title"
          class="w-full h-40 object-cover rounded-xl mb-3"
        />
        <span class="font-semibold mb-2 text-right block">{{ post.title }}</span>
        <p class="text-gray-500 text-sm mb-2 text-right line-clamp-3">
          {{ post.summary }}
        </p>
        <router-link
          :to="`/blog/${post.slug}`"
          class="text-pink-600 text-xs mt-auto self-end hover:underline"
        >
          ادامه مطلب →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const posts = ref([]);

onMounted(async () => {
  const res = await fetch("https://api.atlasmode.shop/v1/front/posts?version=new2");
  const data = await res.json();
  posts.value = data.data.posts.data;
});
</script>
