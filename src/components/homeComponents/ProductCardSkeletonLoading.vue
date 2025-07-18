<template>
  <!-- ==============================
       Product Skeleton Card
       ============================== -->
  <div
    class="bg-white rounded-2xl shadow relative flex flex-col items-center min-w-[220px] h-[430px] overflow-hidden"
  >
    <!-- Product Image Skeleton -->
    <div class="w-full h-64 bg-gray-200 animate-shine rounded-2xl"></div>

    <!-- Product Info Skeleton (Title, Subtitle, Price, etc.) -->
    <div class="px-6 pt-4 w-full">
      <div class="w-24 h-7 bg-gray-200 rounded mb-3 animate-shine"></div>
      <div class="w-16 h-5 bg-gray-200 rounded mb-2 animate-shine"></div>
      <div class="w-24 h-6 bg-gray-200 rounded mb-1 animate-shine"></div>
    </div>

    <!-- Product Colors Skeleton -->
    <div class="flex gap-2 px-6 mt-2 w-full justify-center">
      <!-- Display 7 color skeleton circles -->
      <div
        v-for="j in 7"
        :key="j"
        class="w-7 h-7 bg-gray-200 rounded-full animate-shine"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* ==============================
   Skeleton Loading Shine Animation
   ============================== */
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
