<script setup>
import { ref, onMounted } from "vue"
import { ShoppingBagIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, ChevronDownIcon, HomeIcon } from '@heroicons/vue/24/outline'
import { useHeaderMenuStore } from "../stores/headerMenu"

const showMenu = ref(false)
const menuStore = useHeaderMenuStore()

onMounted(() => {
  menuStore.fetchMenus()
})

function getLink(item) {
  if (item.link) return item.link
  if (item.linkable_id) return '/page/' + item.linkable_id
  return "#"
}
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-[Vazirmatn]" dir="rtl">
    <div class="flex flex-row items-center justify-between py-2 px-4 md:px-8 md:py-4">
      <div class="flex flex-col justify-center w-1/3 items-center" dir="ltr">
        <span class="font-bold text-xl tracking-widest leading-none">ATLAS</span>
        <span class="text-sm font-light leading-none">MODE</span>
      </div>
      <!-- اسکلتون و منوی داینامیک دسکتاپ -->
      <nav class="hidden md:flex items-center justify-center gap-6 text-gray-800 text-base font-sm w-1/3">
        <template v-if="menuStore.loading">
          <span v-for="i in 4" :key="i" class="h-6 w-20 bg-gray-200 rounded animate-shine"></span>
        </template>
        <template v-else-if="menuStore.menus.length">
          <a
            v-for="item in menuStore.menus"
            :key="item.id"
            :href="getLink(item)"
            class="hover:text-black flex items-center"
          >
            {{ item.title }}
            <ChevronDownIcon v-if="item.children && item.children.length" class="w-4 h-4 mt-0.5" />
          </a>
        </template>
      </nav>
      <div class="flex items-center justify-center gap-3 w-1/3" dir="ltr">
        <button class="hover:text-black">
          <ShoppingBagIcon class="w-6 h-6" />
        </button>
        <button class="hover:text-black">
          <HeartIcon class="w-6 h-6" />
        </button>
        <button class="hover:text-black">
          <UserIcon class="w-6 h-6" />
        </button>
        <button class="hover:text-black border-l border-gray-400 pl-3">
          <MagnifyingGlassIcon class="w-6 h-6" />
        </button>
        <button class="md:hidden" @click="showMenu = true">
          <Bars3Icon class="w-7 h-7" />
        </button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showMenu" class="fixed z-[200] top-0 left-0 w-full h-full bg-black/40 flex">
        <div class="bg-white w-4/5 max-w-xs h-full p-6 pt-8 flex flex-col gap-6" dir="rtl">
          <button @click="showMenu = false" class="mb-6 text-right w-full">
            <span class="text-2xl">&#8592;</span>
          </button>
          <template v-if="menuStore.loading">
            <span v-for="i in 5" :key="i" class="h-6 w-36 bg-gray-200 rounded animate-shine"></span>
          </template>
          <template v-else-if="menuStore.menus.length">
            <a
              v-for="item in menuStore.menus"
              :key="item.id"
              :href="getLink(item)"
              class="flex items-center gap-2 mb-2 text-lg font-semibold"
              @click="showMenu = false"
            >
              <span class="h-2 w-2 rounded-full bg-black"></span> {{ item.title }}
            </a>
          </template>
        </div>
        <div class="flex-1" @click="showMenu = false"></div>
      </div>
    </transition>
  </header>
  <div class="h-16 md:h-20"></div>
  <nav class="fixed bottom-0 left-0 w-full flex items-center justify-between px-3 py-2 bg-white shadow-2xl border-t border-gray-200 md:hidden z-40" dir="rtl">
    <a href="#" class="flex flex-col items-center justify-center gap-1 text-gray-700">
      <UserIcon class="w-6 h-6" />
      <span class="text-xs mt-0.5">پروفایل</span>
    </a>
    <a href="#" class="flex flex-col items-center justify-center gap-1 text-gray-700">
      <ShoppingBagIcon class="w-6 h-6" />
      <span class="text-xs mt-0.5">سبد خرید</span>
    </a>
    <a href="#" class="flex flex-col items-center justify-center gap-1 text-gray-700">
      <Bars3Icon class="w-6 h-6" />
      <span class="text-xs mt-0.5">دسته بندی ها</span>
    </a>
    <a href="#" class="flex flex-col items-center justify-center gap-1 text-black font-bold">
      <HomeIcon class="w-6 h-6" />
      <span class="text-xs mt-0.5">صفحه اصلی</span>
    </a>
  </nav>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
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
