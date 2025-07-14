<template>
  <!-- Loading Spinner -->
  <div
    v-if="loading"
    class="flex flex-col items-center justify-center w-full h-60 bg-white/70 backdrop-blur rounded-2xl p-8"
  >
    <!-- Loading spinner icon -->
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
      class="bg-white p-6 w-full max-w-4xl mx-auto rounded-2xl shadow-xl flex flex-col gap-7"
    >
      <!-- Product Title -->
      <h2 class="text-3xl font-black text-amber-900 text-center tracking-tight">
        {{ productTitle }}
      </h2>

      <!-- Price & Status Row -->
      <div class="flex flex-wrap justify-between items-center gap-4">
        <!-- Price Box -->
        <div
          class="flex flex-col gap-2 bg-amber-50 border-r-4 border-amber-700 rounded-lg px-6 py-4 min-w-[180px] shadow-inner"
        >
          <span class="text-base font-bold text-gray-700">قیمت:</span>
          <span class="text-2xl font-black text-emerald-700"
            >{{ numberFormat(productPrice) }} تومان</span
          >
          <!-- Show discount info only if discount exists -->
          <template v-if="productsDiscountPercent > 0">
            <span class="text-sm text-gray-500"
              >تخفیف: {{ productsDiscountPercent }}٪</span
            >
            <span class="text-xs text-rose-600"
              >مهلت تخفیف: {{ productDiscountDeadline || "-" }}</span
            >
            <span class="text-lg font-bold text-green-700"
              >قیمت نهایی: {{ numberFormat(finalPrice) }} تومان</span
            >
          </template>
        </div>
        <!-- Status Box -->
        <div
          class="flex flex-col gap-1 bg-gray-100 border-r-4 border-gray-400 rounded-lg px-5 py-4 min-w-[130px] shadow-inner"
        >
          <span class="text-base font-bold">وضعیت:</span>
          <span
            :class="
              productAvailibilityStatus === 'available'
                ? 'text-green-700'
                : 'text-gray-500'
            "
          >
            {{
              productAvailibilityStatus === "available" ? "موجود" : "ناموجود"
            }}
          </span>
          <span class="text-xs text-gray-500 mt-2"
            >تعداد: {{ productQuantity }}</span
          >
        </div>
      </div>

      <!-- Categories List -->
      <div>
        <span class="font-bold text-gray-800">دسته‌بندی‌ها:</span>
        <ul class="flex gap-2 flex-wrap mt-2">
          <li
            v-for="cat in productCategories"
            :key="cat.id"
            class="bg-amber-100 rounded-xl px-4 py-1 text-sm text-amber-800 font-semibold shadow"
          >
            {{ cat.title }}
          </li>
        </ul>
      </div>

      <!-- Size Chart Button -->
      <div>
        <button
          class="bg-gradient-to-l from-amber-800 to-amber-500 hover:from-amber-900 hover:to-amber-700 text-white px-5 py-3 rounded-xl shadow-xl font-bold tracking-wider transition-all text-lg"
          @click="showSizeModal = true"
        >
          مشاهده جدول سایز
        </button>
      </div>

      <!-- Product Varieties Selector -->
      <div class="flex flex-col gap-2 mt-2">
        <label class="font-bold text-gray-800 mb-1">انتخاب طرح:</label>
        <select
          v-model="selectedVarity"
          class="border-2 border-amber-600 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-amber-500 transition-all bg-white text-gray-800 font-semibold"
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

      <div class="flex flex-col gap-2 mt-2 w-fit">
        <label class="font-bold text-gray-800 mb-1">تعداد:</label>
        <div
          class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 w-fit"
        >
          <!-- Plus button -->
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-amber-500 hover:text-white transition-colors text-2xl font-bold disabled:bg-gray-100 disabled:text-gray-400"
            @mousedown="startChange('inc')"
            @mouseup="stopChange"
            @mouseleave="stopChange"
            @touchstart.prevent="startChange('inc')"
            @touchend="stopChange"
            :disabled="
              selectedCount >= productQuantity || productQuantity === 0
            "
            type="button"
            aria-label="اضافه کردن"
          >
            +
          </button>

          <!-- Display count -->
          <span class="w-8 text-center font-bold text-lg select-none">{{
            selectedCount
          }}</span>

          <!-- Minus button -->
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-amber-500 hover:text-white transition-colors text-2xl font-bold disabled:bg-gray-100 disabled:text-gray-400"
            @mousedown="startChange('dec')"
            @mouseup="stopChange"
            @mouseleave="stopChange"
            @touchstart.prevent="startChange('dec')"
            @touchend="stopChange"
            :disabled="selectedCount <= 1"
            type="button"
            aria-label="کم کردن"
          >
            -
          </button>
        </div>
        <div
          v-if="productQuantity === 0"
          class="text-xs text-rose-500 font-bold mt-1"
        >
          ناموجود
        </div>
        <div v-else class="text-xs text-gray-500 mt-1">
          حداکثر قابل سفارش: {{ productQuantity }}
        </div>
      </div>

      <!-- Product Images Grid -->
      <div>
        <span class="font-bold text-gray-800">تصاویر:</span>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-4">
          <!-- Image Card with zoom (magnifier) -->
          <div
            v-for="image in productImages"
            :key="image.url"
            class="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-amber-50 hover:ring-4 hover:ring-amber-500 transition-all"
            @click="openZoom(image.url)"
          >
            <img
              :src="image.url"
              alt="Product image"
              class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
            />
            <!-- Magnifier Icon on image -->
            <div
              class="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
            >
              <svg
                class="w-12 h-12 text-white drop-shadow-lg"
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
        <!-- Close Button for size modal -->
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
                      {{ size }}
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
        <!-- Magnifier Toggle Button -->
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
        <!-- Main Image with magnifier effect -->
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
          <!-- Magnifier Circle -->
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
        <!-- Close Button for image modal -->
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
    // If product does not exist, set notFound
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
  } catch (e) {
    // On API error, show Not Found page
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

// Magnifier effect handlers
function handleMagnifier(e) {
  const img = zoomImg.value;
  const rect = zoomImgContainer.value.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const width = img.width;
  const height = img.height;

  // Magnifier size and zoom factor
  const size = magnifier.value.size;
  const zoom = 2.2; // magnifier zoom factor

  // Prevent overflow of magnifier
  let x = mx - size / 2;
  let y = my - size / 2;
  x = Math.max(0, Math.min(x, width - size));
  y = Math.max(0, Math.min(y, height - size));

  // Calculate background position for magnifier
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

// Hide magnifier when mouse leaves the image
function hideMagnifier() {
  magnifier.value.show = false;
}

// Open image in zoom modal, disable magnifier initially
function openZoom(url) {
  zoomImage.value = url;
  magnifierEnabled.value = false;
  hideMagnifier();
}

// ----------------------------------------------
// Counter logic for quantity selector with hold
// ----------------------------------------------
const selectedCount = ref(1);
let interval = null;
let timeout = null;

// Increase quantity (max: productQuantity)
function incrementQuantity() {
  if (selectedCount.value < productQuantity.value) {
    selectedCount.value++;
  }
}

// Decrease quantity (min: 1)
function decrementQuantity() {
  if (selectedCount.value > 1) {
    selectedCount.value--;
  }
}

// Start hold-to-change (for mouse/touch hold)
function startChange(type) {
  stopChange(); // Clear previous timers for safety
  // If at bounds, do nothing
  if (
    (type === "inc" &&
      (selectedCount.value >= productQuantity.value ||
        productQuantity.value === 0)) ||
    (type === "dec" && selectedCount.value <= 1)
  ) {
    return;
  }
  // First change is instant
  type === "inc" ? incrementQuantity() : decrementQuantity();
  // After a short delay, start rapid changing
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
    }, 90); // Repeat speed (ms)
  }, 400); // Initial hold delay (ms)
}

// Stop hold-to-change on mouse/touch up/leave
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
/* Fade in animation for modals */
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

/* Custom scrollbar style for modals */
::-webkit-scrollbar {
  width: 8px;
  background: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  background: #eab308;
  border-radius: 4px;
}
</style>
