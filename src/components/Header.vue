<script setup>
import { ref, onMounted } from "vue";
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/vue/24/outline";
import { useHeaderMenuStore } from "../stores/headerMenu";
import logo from "../assets/logo.svg";

const showMenu = ref(false);
const megaMenuOpen = ref(false);
const megaMenuTimeout = ref(null);
const menuStore = useHeaderMenuStore();

onMounted(() => {
  menuStore.fetchMenus();
});

function getLink(item) {
  if (item.link) return item.link;
  if (item.linkable_id) return "/page/" + item.linkable_id;
  return "#";
}

function openMegaMenu() {
  clearTimeout(megaMenuTimeout.value);
  megaMenuOpen.value = true;
}
function closeMegaMenu() {
  megaMenuTimeout.value = setTimeout(() => {
    megaMenuOpen.value = false;
  }, 75);
}
</script>

<template>
  <header
    class="px-[10%] fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-[Vazirmatn]"
    dir="rtl"

  >
    <div
      class="flex flex-row items-center justify-between py-2  md:py-4"
    >
      <div class="flex items-center w-1/5" >
        <img :src="logo" alt="" class="w-32" />
      </div>
      <!-- Nav Desktop -->
      <nav
        class="hidden md:flex items-center justify-center gap-6 text-gray-800 text-base font-sm w-3/5"
      >
        <template v-if="menuStore.loading">
          <span
            v-for="i in 4"
            :key="i"
            class="h-6 w-20 bg-gray-200 rounded animate-shine"
          ></span>
        </template>
        <template v-else-if="menuStore.menus.length">
          <template
            v-for="item in menuStore.menus"
            :key="item.id"
          >
            <div
              class="relative group"
              @mouseenter="item.title === 'لباس زنانه' && openMegaMenu()"
              @mouseleave="closeMegaMenu()"
            >
              <a
                :href="getLink(item)"
                class="flex items-center relative transition font-bold hover:text-indigo-600"
                @mouseleave="item.title === 'لباس زنانه' && closeMegaMenu()"
              >
                {{ item.title }}
                <ChevronDownIcon
                  v-if="item.children && item.children.length"
                  class="w-4 h-4 mx-0.5 group-hover:text-fuchsia-600 transition"
                />
                <span
                  class="absolute right-0 left-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-l from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-right"
                ></span>
              </a>

              <!-- CENTERED MODAL LIKE TOOLTIP -->
              <transition name="fade">
                <div
                  v-if="
                    item.title === 'لباس زنانه' &&
                    megaMenuOpen &&
                    item.children &&
                    item.children.length
                  "
                  class="fixed inset-0 z-[99] flex items-center justify-center"
                  @mouseenter="openMegaMenu"
                  @mouseleave="closeMegaMenu"
                >
                  <div
                    class="bg-white rounded-xl shadow-2xl p-8 w-[90vw] max-w-3xl max-h-[80vh] overflow-auto border border-gray-200"
                    dir="rtl"
                    @mouseleave="closeMegaMenu"
                  >
                    <h3 class="text-xl font-bold mb-4 text-indigo-700">
                      لباس زنانه
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <a
                        v-for="child in item.children"
                        :key="child.id"
                        :href="getLink(child)"
                        class="block text-gray-800 hover:text-fuchsia-600 transition text-base font-semibold border-b pb-1"
                      >
                        {{ child.title }}
                      </a>
                    </div>
                  </div>
                </div>
              </transition>
              <!-- ✅ END TOOLTIP -->
            </div>
          </template>
        </template>
      </nav>

      <!-- Icons Desktop -->
      <div class="flex items-center justify-start gap-3 w-1/5" dir="ltr">
        <button class="group transition relative">
          <ShoppingBagIcon
            class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500 group-hover:drop-shadow-[0_2px_8px_rgba(99,102,241,0.22)] group-hover:animate-glow"
          />
        </button>
        <button class="group transition relative">
          <HeartIcon
            class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-fuchsia-500 group-hover:drop-shadow-[0_2px_8px_rgba(236,72,153,0.20)] group-hover:animate-glow"
          />
        </button>
        <button class="group transition relative">
          <UserIcon
            class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-600 group-hover:drop-shadow-[0_2px_8px_rgba(6,182,212,0.18)] group-hover:animate-glow"
          />
        </button>
        <button
          class="hover:text-black border-l border-gray-400 pl-3 group transition relative"
        >
          <MagnifyingGlassIcon
            class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500 group-hover:drop-shadow-[0_2px_8px_rgba(251,146,60,0.20)] group-hover:animate-glow"
          />
        </button>
        <button
          class="md:hidden group transition relative"
          @click="showMenu = true"
        >
          <Bars3Icon
            class="w-7 h-7 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-600 group-hover:drop-shadow-[0_2px_8px_rgba(99,102,241,0.15)] group-hover:animate-glow"
          />
        </button>
      </div>
    </div>

    <!-- Mobile Menu (Drawer) -->
    <transition name="fade">
      <div
        v-if="showMenu"
        class="fixed z-[200] top-0 left-0 w-full h-full bg-black/40 flex"
      >
        <div
          class="bg-white w-4/5 max-w-xs h-full p-6 pt-8 flex flex-col gap-6"
          dir="rtl"
        >
          <button
            @click="showMenu = false"
            class="mb-6 text-right w-full group"
          >
            <span
              class="text-2xl transition-all duration-300 group-hover:text-indigo-500 group-hover:scale-110"
              >&#8592;</span
            >
          </button>
          <template v-if="menuStore.loading">
            <span
              v-for="i in 5"
              :key="i"
              class="h-6 w-36 bg-gray-200 rounded animate-shine"
            ></span>
          </template>
          <template v-else-if="menuStore.menus.length">
            <a
              v-for="item in menuStore.menus"
              :key="item.id"
              :href="getLink(item)"
              class="flex items-center gap-2 mb-2 text-lg font-semibold transition group relative hover:text-indigo-600"
              @click="showMenu = false"
            >
              <span
                class="h-2 w-2 rounded-full bg-black group-hover:bg-gradient-to-r group-hover:from-fuchsia-500 group-hover:to-indigo-500 transition"
              ></span>
              {{ item.title }}
              <span
                class="absolute right-0 left-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-l from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-right"
              ></span>
            </a>
          </template>
        </div>
        <div class="flex-1" @click="showMenu = false"></div>
      </div>
    </transition>
  </header>

  <div class="h-16 md:h-20"></div>

  <!-- Bottom Nav Mobile -->
  <nav
    class="fixed bottom-0 left-0 w-full flex items-center justify-between px-3 py-2 bg-white shadow-2xl border-t border-gray-200 md:hidden z-40"
    dir="rtl"
  >
    <a
      href="#"
      class="flex flex-col items-center justify-center gap-1 text-gray-700 group transition"
    >
      <UserIcon
        class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-600 group-hover:drop-shadow-[0_2px_8px_rgba(6,182,212,0.18)] group-hover:animate-glow"
      />
      <span class="text-xs mt-0.5 group-hover:text-cyan-600 transition"
        >پروفایل</span
      >
    </a>
    <a
      href="#"
      class="flex flex-col items-center justify-center gap-1 text-gray-700 group transition"
    >
      <ShoppingBagIcon
        class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500 group-hover:drop-shadow-[0_2px_8px_rgba(99,102,241,0.18)] group-hover:animate-glow"
      />
      <span class="text-xs mt-0.5 group-hover:text-indigo-500 transition"
        >سبد خرید</span
      >
    </a>
    <a
      href="#"
      class="flex flex-col items-center justify-center gap-1 text-gray-700 group transition"
    >
      <Bars3Icon
        class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-fuchsia-600 group-hover:drop-shadow-[0_2px_8px_rgba(236,72,153,0.18)] group-hover:animate-glow"
      />
      <span class="text-xs mt-0.5 group-hover:text-fuchsia-600 transition"
        >دسته بندی ها</span
      >
    </a>
    <a
      href="#"
      class="flex flex-col items-center justify-center gap-1 text-black font-bold group transition"
    >
      <HomeIcon
        class="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-700 group-hover:drop-shadow-[0_2px_8px_rgba(99,102,241,0.22)] group-hover:animate-glow"
      />
      <span class="text-xs mt-0.5 group-hover:text-indigo-700 transition"
        >صفحه اصلی</span
      >
    </a>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes shine {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
.animate-shine {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 400% 100%;
  animation: shine 1.5s linear infinite;
}
@keyframes glow {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
  50% {
    box-shadow: 0 0 12px 3px rgba(99, 102, 241, 0.16);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
.group-hover\:animate-glow:hover {
  animation: glow 1s infinite;
}
.group:hover > span,
.group:focus > span {
  opacity: 1 !important;
  transform: scaleX(1) !important;
}
</style>
