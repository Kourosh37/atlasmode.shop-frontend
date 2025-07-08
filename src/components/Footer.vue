<script setup>
import { onMounted } from "vue";
import { useFooterMenuStore } from "../stores/footerMenu";
import { Icon } from "@iconify/vue";

const store = useFooterMenuStore();

onMounted(() => {
  store.fetchMenus();
});
</script>

<template>
  <footer class="bg-[#f4f7fb] py-14 mt-16 border-t border-gray-200" dir="rtl">
    <div class="container mx-auto max-w-7xl px-2 flex flex-col gap-12 md:flex-row md:gap-0 md:justify-between">
      <!-- ستون اول: خبرنامه و شبکه اجتماعی -->
      <div class="w-full md:w-1/3 flex flex-col items-center gap-8 md:gap-6 mb-6 md:mb-0">
        <div class="bg-white/90 rounded-2xl shadow p-6 w-full max-w-sm mx-auto flex flex-col gap-3">
          <div class="font-extrabold text-lg text-gray-700 text-center">عضویت در خبرنامه</div>
          <div class="text-sm text-gray-500 text-center mb-2">با عضویت از <span class="text-indigo-600 font-semibold">تخفیف‌ها</span> و <span class="text-pink-500 font-semibold">مطالب ویژه</span> با خبر شو!</div>
          <form class="flex mt-2" @submit.prevent>
            <input class="flex-1 rounded-s-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none px-4 py-2 text-sm" type="email" placeholder="ایمیل شما..." required />
            <button class="rounded-e-xl bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 text-sm font-bold shadow ml-1">عضویت</button>
          </form>
        </div>
        <div class="flex gap-3 mt-2">
          <a href="https://instagram.com/" target="_blank" rel="noopener" class="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition flex items-center justify-center group">
            <Icon icon="mdi:instagram" class="w-7 h-7 group-hover:text-pink-500 transition" />
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener" class="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition flex items-center justify-center group">
            <Icon icon="ic:baseline-whatsapp" class="w-7 h-7 group-hover:text-green-500 transition" />
          </a>
          <a href="mailto:atlasmodeposhtiban@gmail.com" class="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition flex items-center justify-center group">
            <Icon icon="mdi:email-outline" class="w-7 h-7 group-hover:text-blue-400 transition" />
          </a>
        </div>
      </div>
      <!-- جداکننده عمودی -->
      <div class="hidden md:block h-44 w-px bg-gray-200 mx-8"></div>
      <!-- ستون دوم: اطلاعات تماس و آدرس -->
      <div class="w-full md:w-1/3 flex flex-col gap-6">
        <div class="flex flex-col gap-3 bg-white/90 rounded-2xl shadow p-6">
          <div class="flex items-center gap-2 text-base font-bold text-gray-700">
            <Icon icon="mdi:phone-outline" class="w-6 h-6 text-indigo-500" />
            شماره تماس
          </div>
          <div class="ltr text-gray-600 text-sm font-mono select-all pr-8">09309113333</div>
        </div>
        <div class="flex flex-col gap-3 bg-white/90 rounded-2xl shadow p-6">
          <div class="flex items-center gap-2 text-base font-bold text-gray-700">
            <Icon icon="mdi:map-marker-outline" class="w-6 h-6 text-pink-500" />
            آدرس فروشگاه
          </div>
          <div class="text-gray-600 text-sm">
            استان گلستان، گرگان، شهرک شهید شهریار، شهریار ۴، فرعی اول، دست راست، درب مشکی
          </div>
        </div>
        
      </div>
      <!-- جداکننده عمودی -->
      <div class="hidden md:block h-44 w-px bg-gray-200 mx-8"></div>
      <!-- ستون سوم: منوها -->
      <div class="w-full md:w-1/3 flex flex-col items-center md:items-end gap-8 md:gap-0">
        <div class="w-full bg-white/90 rounded-2xl shadow p-6 flex flex-col gap-5">
          <span class="font-bold text-lg text-gray-700 mb-2">صفحات سایت</span>
          <div class="flex flex-wrap gap-3 justify-center md:justify-end">
            <template v-if="!store.loading && store.menus.length">
              <a
                v-for="item in store.menus"
                :key="item.id"
                :href="'/page/' + item.linkable_id"
                class="px-3 py-1 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition"
              >
                {{ item.title }}
              </a>
            </template>
            <template v-else>
              <span class="h-6 w-20 bg-gray-200 animate-pulse rounded-xl"></span>
              <span class="h-6 w-20 bg-gray-200 animate-pulse rounded-xl"></span>
              <span class="h-6 w-20 bg-gray-200 animate-pulse rounded-xl"></span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- کپی‌رایت -->
    <div class="container mx-auto max-w-7xl text-center text-xs text-gray-500 pt-8 mt-10 border-t border-gray-200">
      تمامی حقوق این سایت متعلق به <span class="font-bold text-gray-600">اطلس مد</span> می‌باشد. | طراحی با ❤️ توسط <span class="text-indigo-500 font-bold">شتاب</span>
    </div>
  </footer>
</template>
