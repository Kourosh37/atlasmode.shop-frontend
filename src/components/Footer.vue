<template>
  <footer class="bg-gray-100 rounded-t-2xl mt-8 py-8 px-4 shadow-inner">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <h3 class="font-bold text-lg mb-2 text-right">درباره ما</h3>
        <p class="text-gray-600 text-sm mb-3 text-right">
          فروشگاه اطلس مد؛ عرضه‌کننده انواع پوشاک زنانه با تضمین کیفیت و ارسال سریع.
        </p>
        <div class="flex gap-3 justify-end">
          <a href="https://instagram.com/atlasmode.shop" target="_blank" class="hover:text-pink-600 transition">اینستاگرام</a>
          <a href="mailto:info@atlasmode.shop" class="hover:text-pink-600 transition">ایمیل</a>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-lg mb-2 text-right">راهنما</h3>
        <ul class="space-y-2 text-right">
          <li v-for="item in menus" :key="item.id">
            <a
              :href="item.link ? item.link : `/page/${item.linkable_id}`"
              class="text-gray-700 hover:text-pink-600 transition"
              :target="item.new_tab ? '_blank' : '_self'"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-lg mb-2 text-right">ارتباط با ما</h3>
        <ul class="text-sm text-gray-600 text-right">
          <li>تلفن: ۰۹۱۲۱۲۳۴۵۶۷</li>
          <li>آدرس: تهران، خیابان مثال، پلاک ۱</li>
        </ul>
      </div>
    </div>
    <div class="mt-8 text-center text-xs text-gray-400">تمام حقوق برای اطلس مد محفوظ است © 2025</div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
const menus = ref([]);

onMounted(async () => {
  const res = await fetch("https://api.atlasmode.shop/v1/all/menus/footer?version=new2");
  const data = await res.json();
  menus.value = data.data.menus;
});
</script>
