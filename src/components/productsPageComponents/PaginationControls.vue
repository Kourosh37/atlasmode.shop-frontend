<template>
 
<div v-if="pages.length > 0" class="flex justify-center mt-8 gap-2">
    <button :disabled="pageCurrent.value === pageFirst.value" @click="changePage(pageCurrent.value - 1)"
      class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed">
      ‹
    </button>
    <button v-for="page in pages" :key="page" @click="changePage(page)"
      :class="[
        'w-9 h-9 rounded-xl border flex items-center justify-center font-bold transition-all',
        pageCurrent.value === page
          ? 'bg-primary-600 border-primary-600 text-white shadow'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
      ]">
      {{ page }}
    </button>
    <button :disabled="pageCurrent.value === pageLast.value" @click="changePage(pageCurrent.value + 1)"
      class="w-9 h-9 rounded-xl border bg-white flex items-center justify-center text-gray-500 font-bold hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed">
      ›
    </button>
  </div>
  <div v-else class="flex justify-center mt-8">
    <span class="text-gray-400 text-xs">.................</span>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const pages = inject('pages');
const pageCurrent = inject('pageCurrent');
const pageFirst = inject('pageFirst');
const pageLast = inject('pageLast');
const changePage = inject('changePage');
</script>
