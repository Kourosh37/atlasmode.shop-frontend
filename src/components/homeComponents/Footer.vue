<script setup>
import { onMounted } from "vue";
import { useFooterMenuStore } from "../../stores/homeStores/footerMenu";
import { Icon } from "@iconify/vue";

const store = useFooterMenuStore();

onMounted(() => {
  store.fetchMenus();
});
</script>

<template>
  <footer class="w-full bg-[#f7f7f7] py-8 px-2 md:px-0 mt-10" dir="rtl">
    <div class="container mx-auto max-w-7xl flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0 w-full">
        <div class="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <span class="font-bold text-base text-gray-700">عضویت در خبرنامه</span>
          <div class="text-[15px] text-gray-500 mt-1">با اشتراک خبرنامه هفتگی ما از تخفیف ها، اخبارها و مطالب با خبر شوید.</div>
        </div>
        <div class="flex flex-col gap-2 text-[15px] mt-2">
          <span class="flex items-center gap-2">
            <Icon icon="mdi:email-outline" class="w-5 h-5 text-gray-400" />
            <span>شماره تماس و ایمیل:</span>
          </span>
          <span class="text-gray-500 text-sm flex items-center gap-2">
            <Icon icon="mdi:phone-outline" class="w-5 h-5 text-gray-400" />
            09309113333 /
            <span class="ltr text-gray-500">atlasmodeposhtiban@gmail.com</span>
          </span>
        </div>
        <div class="flex flex-col gap-2 text-[15px] mt-2">
          <span class="flex items-center gap-2">
            <Icon icon="mdi:map-marker-outline" class="w-5 h-5 text-gray-400" />
            <span>آدرس فروشگاه:</span>
          </span>
          <span class="text-gray-500 text-sm">استان گلستان، گرگان، شهرک شهید شهریار، شهریار 4، فرعی اول، دست راست، درب مشکی</span>
        </div>
        <div class="flex items-center gap-6 mt-4">
          <Icon icon="ic:baseline-language" class="h-8 w-8 text-gray-700" />
          <Icon icon="arcticons:enamad" class="h-12 w-12 text-gray-500" />
        </div>
      </div>
      <div class="w-full md:w-1/2 flex flex-col md:justify-between">
        <div class="flex items-center w-full">
          <input class=" border-b px-3 py-2 text-sm w-full max-w-xs focus:outline-none h-9" type="email" placeholder="ایمیل خود را وارد کنید..." />
          <button class="bg-black text-white px-4 py-2 text-sm font-bold h-9">عضویت</button>
        </div>
        <div class="hidden md:flex gap-4 mt-8">
          <a href="https://instagram.com/" target="_blank" rel="noopener" class="text-xl">
            <Icon icon="mdi:instagram" class="w-7 h-7 text-gray-600" />
          </a>
        </div>
        <div class="flex flex-wrap items-center gap-8 text-[15px] mt-4">
          <template v-if="!store.loading && store.menus.length">
            <a v-for="item in store.menus" :key="item.id" :href="'/page/'+item.linkable_id" class="hover:underline min-w-fit">{{ item.title }}</a>
          </template>
          <template v-else>
            <span class="h-6 w-20 bg-gray-200 animate-shine rounded"></span>
            <span class="h-6 w-20 bg-gray-200 animate-shine rounded"></span>
            <span class="h-6 w-20 bg-gray-200 animate-shine rounded"></span>
          </template>
        </div>
        <div class="md:hidden mt-6 flex gap-4">
          <a href="https://instagram.com/" target="_blank" rel="noopener" class="text-xl">
            <Icon icon="mdi:instagram" class="w-7 h-7 text-gray-600" />
          </a>
        </div>
      </div>
      
    </div>
    <div class="container mx-auto max-w-7xl border-t mt-8 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
      <span>تمامی حقوق این سایت مربوط به سایت اطلس مد می باشد.</span>
      <span class="mt-2 md:mt-0">طراحی شده شتاب</span>
    </div>
  </footer>
</template>

<style scoped>
@keyframes shine {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.animate-shine {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 400% 100%;
  animation: shine 1.5s linear infinite;
}
</style>
