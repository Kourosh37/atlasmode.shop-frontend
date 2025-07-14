<template>
  <!-- Loading Spinner -->
  <div
    v-if="loading"
    class="flex flex-col items-center justify-center w-full h-60 bg-white/70 backdrop-blur rounded-2xl p-8"
  >
    <svg
      class="animate-spin h-12 w-12 text-gray-500 drop-shadow-lg mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-30"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span
      class="text-gray-600 font-semibold text-lg tracking-wide animate-pulse"
    >
      در حال بارگذاری...
    </span>
  </div>

  <!-- Not Found message if product does not exist -->
  <div
    v-else-if="notFound"
    class="flex flex-col items-center justify-center min-h-[60vh]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-24 w-24 text-rose-400 mb-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
      />
    </svg>
    <h2 class="text-3xl font-bold text-rose-500 mb-2">محصول یافت نشد</h2>
    <p class="text-gray-600 text-lg">
      محصول مورد نظر وجود ندارد یا حذف شده است.
    </p>
  </div>

  <!-- Product Details Section -->
  <div v-else dir="rtl">
    <!-- Product Details Card -->
<div
  class="bg-white w-full max-w-4xl mx-auto rounded-2xl shadow-xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-7 items-start"
>
  <!-- Images Sidebar -->
  <div class="col-span-1 flex flex-col gap-4">
    <span class="font-bold text-gray-800 mb-2">تصاویر:</span>
    <div class="flex flex-row md:flex-col gap-4 md:gap-2">
      <div
        v-for="image in productImages"
        :key="image.url"
        class="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-amber-50 hover:ring-4 hover:ring-amber-500 transition-all w-28 h-28 md:w-full md:h-32"
        @click="openZoom(image.url)"
      >
        <img
          :src="image.url"
          alt="Product image"
          class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
        />
        <div
          class="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
        >
          <svg
            class="w-8 h-8 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Details Section -->
  <div class="col-span-2 flex flex-col gap-6">
    <!-- Title -->
    <h2 class="text-2xl md:text-3xl font-extrabold text-amber-900 text-center md:text-right mb-2">
      {{ productTitle }}
    </h2>
    <!-- Price & Status Row -->
    <div class="flex flex-wrap gap-4 items-center justify-center md:justify-start">
      <!-- Price Box -->
      <div class="flex flex-col gap-1 bg-amber-50 border-r-4 border-amber-700 rounded-lg px-6 py-4 min-w-[140px] shadow-inner">
        <span class="text-base font-bold text-gray-700">قیمت:</span>
        <span class="text-xl font-black text-emerald-700">{{ numberFormat(productPrice) }} تومان</span>
        <template v-if="productsDiscountPercent > 0">
          <span class="text-xs text-gray-500">تخفیف: {{ productsDiscountPercent }}٪</span>
          <span class="text-xs text-rose-600">مهلت تخفیف: {{ productDiscountDeadline || '-' }}</span>
          <span class="text-base font-bold text-green-700">قیمت نهایی: {{ numberFormat(finalPrice) }} تومان</span>
        </template>
      </div>
      <!-- Status Box -->
      <div class="flex flex-col gap-1 bg-gray-100 border-r-4 border-gray-400 rounded-lg px-5 py-4 min-w-[100px] shadow-inner">
        <span class="text-base font-bold">وضعیت:</span>
        <span :class="productAvailibilityStatus === 'available' ? 'text-green-700' : 'text-gray-500'">
          {{ productAvailibilityStatus === "available" ? "موجود" : "ناموجود" }}
        </span>
        <span class="text-xs text-gray-500 mt-2">تعداد: {{ productQuantity }}</span>
      </div>
    </div>

    <!-- Categories -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="font-bold text-gray-800">دسته‌بندی‌ها:</span>
      <ul class="flex gap-2 flex-wrap">
        <li
          v-for="cat in productCategories"
          :key="cat.id"
          class="bg-amber-100 rounded-xl px-3 py-0.5 text-xs md:text-sm text-amber-800 font-semibold shadow"
        >
          {{ cat.title }}
        </li>
      </ul>
    </div>

    <!-- Size Chart + Size/Variety/Quantity: in a row -->
    <div class="flex flex-col md:flex-row gap-5 items-center md:items-end w-full mt-1">
      <!-- Size Chart Modal Button -->
      <button
        class="bg-gradient-to-l from-amber-800 to-amber-500 hover:from-amber-900 hover:to-amber-700 text-white px-4 py-2 rounded-xl shadow-xl font-bold tracking-wider transition-all text-base min-w-[120px]"
        @click="showSizeModal = true"
        type="button"
      >
        جدول سایز
      </button>

      <!-- Size Select (Available Sizes) -->
      <div class="flex flex-col gap-1 min-w-[120px]">
        <label class="font-bold text-gray-800 mb-1">سایز:</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in availableSizes"
            :key="size"
            :class="[
              'rounded-xl px-4 py-1 font-bold border-2 transition-all text-sm shadow-sm min-w-[50px]',
              selectedSize === size
                ? 'bg-amber-500 border-amber-700 text-white scale-105'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-amber-50'
            ]"
            @click="selectSize(size)"
            type="button"
          >
            {{ size }}
          </button>
        </div>
        <span
          v-if="availableSizes.length === 0"
          class="text-rose-600 font-bold text-xs mt-1"
          >سایز موجود نیست</span
        >
      </div>

      <!-- Variety Select -->
      <div class="flex flex-col gap-1 min-w-[120px]">
        <label class="font-bold text-gray-800 mb-1">طرح:</label>
        <select
          v-model="selectedVarity"
          class="border-2 border-amber-600 rounded-lg px-2 py-1 outline-none focus:ring-2 ring-amber-500 transition-all bg-white text-gray-800 font-semibold text-sm"
        >
          <option
            v-for="varity in productVarities"
            :key="varity.id"
            :value="varity.id"
          >
            {{ varity.attributes?.[0]?.pivot?.value || "طرح بدون نام" }}
          </option>
        </select>
      </div>

      <!-- Quantity Selector -->
      <div class="flex flex-col gap-1 min-w-[105px]">
        <label class="font-bold text-gray-800 mb-1">تعداد:</label>
        <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-2 py-1 w-fit">
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-amber-500 hover:text-white transition-colors text-xl font-bold disabled:bg-gray-100 disabled:text-gray-400"
            @mousedown="startChange('inc')"
            @mouseup="stopChange"
            @mouseleave="stopChange"
            @touchstart.prevent="startChange('inc')"
            @touchend="stopChange"
            :disabled="selectedCount >= productQuantity || productQuantity === 0"
            type="button"
            aria-label="اضافه کردن"
          >+</button>
          <span class="w-7 text-center font-bold text-base select-none">{{ selectedCount }}</span>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-amber-500 hover:text-white transition-colors text-xl font-bold disabled:bg-gray-100 disabled:text-gray-400"
            @mousedown="startChange('dec')"
            @mouseup="stopChange"
            @mouseleave="stopChange"
            @touchstart.prevent="startChange('dec')"
            @touchend="stopChange"
            :disabled="selectedCount <= 1"
            type="button"
            aria-label="کم کردن"
          >-</button>
        </div>
        <div v-if="productQuantity === 0" class="text-xs text-rose-500 font-bold mt-1">
          ناموجود
        </div>
        <div v-else class="text-xs text-gray-500 mt-1">
          حداکثر: {{ productQuantity }}
        </div>
      </div>
    </div>
  </div>
</div>


    <!-- Size Chart Modal -->
    <div
      v-if="showSizeModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div
        class="bg-white rounded-2xl px-4 py-7 w-full max-w-3xl shadow-xl relative animate-fadeIn flex flex-col"
        style="max-height: 85vh"
      >
        <button
          class="absolute top-4 left-4 text-gray-500 hover:text-rose-500"
          @click="showSizeModal = false"
        >
          <svg
            class="w-7 h-7"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-extrabold text-center mb-6">
          راهنمای انتخاب سایز
        </h2>
        <div class="overflow-y-auto px-2" style="max-height: 65vh">
          <div v-for="sc in productSizeCharts" :key="sc.id" class="mb-10">
            <div class="font-bold text-right mb-3 text-base text-amber-800">
              {{ sc.title }}
            </div>
            <div class="overflow-x-auto">
              <table
                class="w-full min-w-[400px] border-separate border-spacing-0 rounded-xl shadow bg-white text-gray-800"
              >
                <thead>
                  <tr class="bg-gray-100 text-gray-700 text-center">
                    <th
                      v-for="(title, idx) in JSON.parse(sc.chart)[0]"
                      :key="'h' + idx"
                      class="py-3 px-4 border-b border-gray-200 font-semibold text-base"
                    >
                      {{ title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="text-center">
                    <td
                      v-for="(size, idx) in JSON.parse(sc.chart)[1]"
                      :key="'d' + idx"
                      class="py-2 px-4 border-b border-gray-100 text-base"
                    >
                      <span v-if="size">
                        {{ size }}
                      </span>
                      <span
                        v-else
                        class="flex items-center justify-center gap-1"
                      >
                        <svg
                          class="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Zoom Modal with Magnifier Feature -->
    <div
      v-if="zoomImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click="zoomImage = null"
    >
      <div class="relative" @click.stop style="direction: ltr">
        <button
          class="absolute top-3 right-3 z-30 bg-white rounded-full p-2 shadow-xl hover:bg-amber-500 transition-colors"
          @click="magnifierEnabled = !magnifierEnabled"
          type="button"
        >
          <svg
            v-if="!magnifierEnabled"
            class="w-7 h-7 text-amber-700"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-else
            class="w-7 h-7 text-white bg-amber-700 rounded-full p-1"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              stroke-linecap="round"
            />
          </svg>
        </button>
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
              boxShadow: '0 2px 18px #0003',
              overflow: 'hidden',
              border: '3px solid #eab308',
              zIndex: 20,
              background: `url(${zoomImage}) no-repeat`,
              backgroundSize: magnifier.bgSize,
              backgroundPosition: magnifier.bgPos,
            }"
          ></div>
        </div>
        <button
          class="absolute top-3 left-3 z-40 bg-white rounded-full p-2 shadow-xl hover:bg-rose-500 transition-colors group"
          @click.stop="zoomImage = null"
          type="button"
        >
          <svg
            class="w-7 h-7 text-rose-500 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Related Products Slider -->
    <ProductSlider
      v-if="relatedProducts.length > 0 && relatedProducts !== null"
      title="محصولات مشابه"
      :products="relatedProducts"
      :loading="loading"
      link="/products"
    />
  </div>
</template>
<script setup>
// Import Vue composition functions and dependencies
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ProductSlider from "../components/homeComponents/ProductSlider.vue";

// Props (product id from parent or route)
const props = defineProps(["id"]);

// Loading and notFound state
const loading = ref(true);
const notFound = ref(false); // Will be true if product is not found

// Product fields
const productTitle = ref("");
const productImages = ref([]);
const relatedProducts = ref([]);
const productCategories = ref([]);
const productPrice = ref(0);
const productsDiscountPercent = ref(0);
const productDiscountDeadline = ref("");
const productQuantity = ref(0);
const productAvailibilityStatus = ref("");
const productSizeCharts = ref([]);
const productVarities = ref([]);
const selectedVarity = ref("");
const showSizeModal = ref(false);
const zoomImage = ref(null);

// ---- Extracted Sizes State ----
const availableSizes = ref([]);
const selectedSize = ref("");

// Helper: Guess the attribute name for size for any category
function getSizeAttrName() {
  // You can enhance this if you support more types
  return (
    productVarities.value?.[0]?.attributes?.find((a) =>
      ["sizePants", "sizeClothes", "sizeShoes"].includes(a.name)
    )?.name || "sizePants"
  );
}

// Magnifier logic for image modal
const magnifierEnabled = ref(false);
const magnifier = ref({
  show: false,
  x: 0,
  y: 0,
  size: 180,
  bgSize: "",
  bgPos: "",
});
const zoomImg = ref(null);
const zoomImgContainer = ref(null);

// Helper: Format number with Persian commas
function numberFormat(num) {
  if (!num) return 0;
  return Number(num).toLocaleString("fa-IR");
}

// Computed: Final price after discount
const finalPrice = computed(() => {
  return productPrice.value * (1 - productsDiscountPercent.value / 100);
});

// Fetch product data when component mounts
onMounted(async () => {
  try {
    const res = await axios.get(
      `https://api.atlasmode.shop/v1/front/products/${props.id}?version=new2`
    );
    const p = res.data.data.product;
    if (!p) {
      notFound.value = true;
      return;
    }
    // Fill product data
    productTitle.value = p.title;
    productImages.value = p.images;
    relatedProducts.value = res.data.data.relatedProducts;
    productCategories.value = p.categories;
    productPrice.value = p.price;
    productsDiscountPercent.value = p.discount;
    productDiscountDeadline.value = p.discount_until;
    productQuantity.value = p.total_quantity;
    productAvailibilityStatus.value = p.status;
    productSizeCharts.value = p.size_charts;
    productVarities.value = p.varieties || [];
    selectedVarity.value = productVarities.value?.[0]?.id || "";

    // --- Extract available sizes: Only varieties with quantity > 0 and unique sizes ---
    const sizeAttrName = getSizeAttrName();
    const sizes = [];
    for (const variety of productVarities.value) {
      if (variety.quantity > 0) {
        const sizeAttr = variety.attributes?.find(
          (attr) => attr.name === sizeAttrName
        );
        if (sizeAttr?.pivot?.value) sizes.push(sizeAttr.pivot.value);
      }
    }
    availableSizes.value = [...new Set(sizes)];
    selectedSize.value = availableSizes.value[0] || "";
  } catch (e) {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

// Handle size select
function selectSize(size) {
  selectedSize.value = size;
}

// Magnifier effect handlers
function handleMagnifier(e) {
  const img = zoomImg.value;
  const rect = zoomImgContainer.value.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const width = img.width;
  const height = img.height;
  const size = magnifier.value.size;
  const zoom = 2.2;
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
function hideMagnifier() {
  magnifier.value.show = false;
}
function openZoom(url) {
  zoomImage.value = url;
  magnifierEnabled.value = false;
  hideMagnifier();
}

// Counter logic for quantity selector with hold
const selectedCount = ref(1);
let interval = null;
let timeout = null;
function incrementQuantity() {
  if (selectedCount.value < productQuantity.value) {
    selectedCount.value++;
  }
}
function decrementQuantity() {
  if (selectedCount.value > 1) {
    selectedCount.value--;
  }
}
function startChange(type) {
  stopChange();
  if (
    (type === "inc" &&
      (selectedCount.value >= productQuantity.value ||
        productQuantity.value === 0)) ||
    (type === "dec" && selectedCount.value <= 1)
  ) {
    return;
  }
  type === "inc" ? incrementQuantity() : decrementQuantity();
  timeout = setTimeout(() => {
    interval = setInterval(() => {
      if (type === "inc") {
        if (selectedCount.value < productQuantity.value) {
          incrementQuantity();
        }
      } else {
        if (selectedCount.value > 1) {
          decrementQuantity();
        }
      }
    }, 90);
  }, 400);
}
function stopChange() {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.38, 1.15, 0.7, 1);
}
::-webkit-scrollbar {
  width: 8px;
  background: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  background: #eab308;
  border-radius: 4px;
}
</style>
