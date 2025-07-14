<template>
  <div class="bg-amber-50 border-amber-200 border mt-2 p-4 rounded-2xl shadow-lg max-w-4xl">
    <h3 class="font-bold text-lg text-amber-800 mb-3 flex items-center gap-2">
      <svg class="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" /></svg>
      انتخاب‌های شما
    </h3>
    <ul>
      <li
        v-for="(item, idx) in cartSelections"
        :key="item.design + '-' + item.size"
        class="flex items-center justify-between gap-4 border-b border-amber-200 last:border-0 py-3"
      >
        <div>
          <span class="font-bold text-gray-900">{{ productStore.productTitle }}</span>
          <span class="text-amber-700 px-2">| طرح:</span>
          <span class="font-semibold">{{ item.design }}</span>
          <span class="text-amber-700 px-2">| سایز:</span>
          <span class="font-semibold">{{ item.size }}</span>
          <span class="text-amber-700 px-2">| تعداد:</span>
          <span class="font-semibold">{{ item.count }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-700 font-bold">{{ productStore.numberFormat(item.totalPrice) }} تومان</span>
          <button
            class="text-rose-600 hover:bg-rose-100 rounded-full p-2 transition"
            @click="$emit('remove-selection', idx)"
            title="Remove"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </li>
    </ul>
    <div class="flex justify-between mt-4 items-center">
      <div class="text-lg font-bold text-emerald-900">
        مجموع: {{ productStore.numberFormat(cartTotal) }} تومان
      </div>
      <button
        class="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-xl font-bold shadow-xl transition-all"
        @click="$emit('add-to-cart')"
        type="button"
      >
        افزودن به سبد خرید
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from "../../stores/productDetails";
const props = defineProps(["cartSelections", "cartTotal"]);
const productStore = useProductStore();
</script>
