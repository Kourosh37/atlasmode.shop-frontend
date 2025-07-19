<template>
  <div class="col-span-1 flex flex-col gap-4">
    <!-- Gallery Title -->
    <span class="font-extrabold text-lg text-gray-800 mb-2 border-b pb-1 border-amber-400">
      تصاویر
    </span>

    <!-- Main Image Display with Zoom Button -->
    <div class="relative w-full overflow-hidden rounded-xl shadow-md border border-gray-200 bg-white">
      <img
        :src="mainImage"
        alt="Main product image"
        class="w-full max-h-[400px] object-contain bg-white"
      />

      <!-- Zoom Button on Main Image -->
      <button
        class="absolute top-3 left-3 z-10 bg-white rounded-full p-2 shadow hover:bg-amber-700 group transition-colors"
        @click="openZoom(mainImage)"
        type="button"
      >
        <svg class="w-7 h-7 text-amber-700 group-hover:text-white transition-colors"
             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- Thumbnails Gallery -->
    <div class="mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-400">
      <div class="flex flex-nowrap gap-3 pb-1 min-w-full">
        <div
          v-for="image in productStore.productImages"
          :key="image.url"
          class="relative flex-shrink-0 aspect-square group cursor-pointer rounded-xl overflow-hidden border border-gray-300 hover:border-amber-500 transition-all duration-200 w-20 h-20"
          @click="mainImage = image.url"
        >
          <img
            :src="image.url"
            alt="Thumbnail"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </div>
    </div>

    <!-- Image Zoom Modal -->
<div
  v-if="zoomImage"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
  @click="zoomImage = null"
>
  <div class="relative" @click.stop style="direction: ltr">
    <!-- Magnifier Toggle Button -->
    <button
      class="absolute top-3 right-3 z-30 bg-white rounded-full p-2 shadow-xl hover:bg-amber-700 transition-colors group"
      @click="magnifierEnabled = !magnifierEnabled"
      type="button"
    >
      <svg
        v-if="!magnifierEnabled"
        class="w-7 h-7 text-amber-700 group-hover:text-white transition-colors"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
      </svg>
      <svg
        v-else
        class="w-7 h-7 text-white bg-amber-700 rounded-full p-1 group-hover:text-white transition-colors"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
      </svg>
    </button>

    <!-- Zoomed Image & Magnifier Glass -->
    <div
      class="rounded-2xl shadow-2xl border-4 border-amber-600 relative overflow-hidden"
      style="max-width: 80vw; max-height: 80vh"
      ref="zoomImgContainer"
      @mousemove="magnifierEnabled ? handleMagnifier($event) : null"
      @mouseleave="hideMagnifier"
    >
      <img
        :src="zoomImage"
        ref="zoomImg"
        class="max-w-[80vw] max-h-[80vh] object-contain select-none"
        draggable="false"
      />

      <!-- Magnifier glass -->
      <div
        v-if="magnifierEnabled && magnifier.show"
        :style="{
          position: 'absolute',
          pointerEvents: 'none',
          top: magnifier.y + 'px',
          left: magnifier.x + 'px',
          width: magnifier.size + 'px',
          height: magnifier.size + 'px',
          borderRadius: '50%',
          boxShadow: '0 4px 24px #0005',
          overflow: 'hidden',
          border: '3px solid #f59e0b',
          zIndex: 20,
          background: `url(${zoomImage}) no-repeat`,
          backgroundSize: magnifier.bgSize,
          backgroundPosition: magnifier.bgPos,
        }"
      ></div>
    </div>

    <!-- Close Button -->
    <button
      class="absolute top-3 left-3 z-40 bg-white rounded-full p-2 shadow-xl hover:bg-amber-700 transition-colors group"
      @click.stop="zoomImage = null"
      type="button"
    >
      <svg class="w-7 h-7 text-amber-700 group-hover:text-white transition-colors"
           fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>
  </div>
</div>

  </div>
</template>


<script setup>
// ==============================
// Imports
// ==============================
import { ref } from "vue";
import { useProductStore } from "../../stores/productDetails";

// ==============================
// Store Instance
// ==============================
/**
 * Store for current product details and images.
 */
const productStore = useProductStore();

// ==============================
// States for Zoom and Magnifier
// ==============================
/**
 * The url of the image currently zoomed (modal open).
 * @type {import('vue').Ref<string|null>}
 */
const zoomImage = ref(null);
const mainImage = ref(productStore.productImages[0]?.url || "");


/**
 * Is magnifier (zoom glass) enabled.
 * @type {import('vue').Ref<boolean>}
 */
const magnifierEnabled = ref(false);

/**
 * Magnifier state (visibility, position, size, bg, etc).
 * @type {import('vue').Ref<Object>}
 */
const magnifier = ref({
  show: false,
  x: 0,
  y: 0,
  size: 180,
  bgSize: "",
  bgPos: "",
});

/**
 * Refs for zoomed image and its container.
 */
const zoomImg = ref(null);
const zoomImgContainer = ref(null);

// ==============================
// Methods
// ==============================
/**
 * Open the zoom modal for given image url.
 * Also resets magnifier state.
 * @param {string} url
 */
function openZoom(url) {
  zoomImage.value = url;
  magnifierEnabled.value = false;
  hideMagnifier();
}

/**
 * Handles magnifier glass movement and sets its background.
 * @param {MouseEvent} e
 */
function handleMagnifier(e) {
  const img = zoomImg.value;
  const rect = zoomImgContainer.value.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const width = img.width;
  const height = img.height;
  const size = magnifier.value.size;
  const zoom = 2.2;
  // Calculate position so magnifier is always inside the image
  let x = mx - size / 2;
  let y = my - size / 2;
  x = Math.max(0, Math.min(x, width - size));
  y = Math.max(0, Math.min(y, height - size));
  const bgX = -(mx * zoom - size / 2);
  const bgY = -(my * zoom - size / 2);
  magnifier.value = {
    show: true,
    x,
    y,
    size,
    bgSize: `${width * zoom}px ${height * zoom}px`,
    bgPos: `${bgX}px ${bgY}px`,
  };
}

/**
 * Hide the magnifier glass.
 */
function hideMagnifier() {
  magnifier.value.show = false;
}
</script>
