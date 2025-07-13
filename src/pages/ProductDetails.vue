<template>
  <div class="bg-gray-50 min-h-screen flex flex-col items-center py-8 px-2">
    <div v-if="product" class="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row-reverse overflow-hidden">

      <!-- Product Gallery & Thumbnails -->
      <div class="flex flex-col md:w-1/2 p-8 items-center">
        <div class="w-full flex flex-col md:flex-row-reverse items-center gap-6">
          <!-- Main Image -->
          <div class="flex-1 flex flex-col items-center">
            <img
              :src="selectedImage"
              class="w-72 h-72 md:w-96 md:h-96 rounded-2xl shadow object-contain bg-gray-100 border"
              :alt="product.title"
            />
            <!-- Gallery Dots -->
            <div class="flex justify-center gap-1 mt-3">
              <button v-for="(img, idx) in product.images" :key="img.id"
                @click="selectImage(img.conversions?.lg || img.url)"
                class="w-2.5 h-2.5 rounded-full"
                :class="{'bg-gray-600': selectedImage === (img.conversions?.lg || img.url), 'bg-gray-300': selectedImage !== (img.conversions?.lg || img.url)}"
              ></button>
            </div>
          </div>
          <!-- Thumbnails Vertical -->
          <div class="flex flex-col items-center gap-3 overflow-y-auto max-h-80 ml-4">
            <img
              v-for="img in product.images"
              :key="img.id"
              :src="img.conversions?.sm || img.url"
              :alt="product.title"
              @click="selectImage(img.conversions?.lg || img.url)"
              class="w-20 h-20 rounded-xl border-2 cursor-pointer object-cover"
              :class="{'border-gray-800': selectedImage === (img.conversions?.lg || img.url), 'border-gray-300': selectedImage !== (img.conversions?.lg || img.url)}"
            />
          </div>
        </div>
      </div>

      <!-- Product Info & Actions -->
      <div class="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
        <!-- Breadcrumbs (optional, static for now) -->
        <div class="text-sm text-gray-400 mb-2 font-medium text-right">
          {{ product.breadcrumbs?.join(' ، ') || 'دسته‌بندی' }}
        </div>
        <h1 class="text-2xl md:text-3xl font-bold mb-2 text-gray-900 text-right">{{ product.title }}</h1>
        <!-- Price and discount -->
        <div class="flex flex-row-reverse items-center gap-2 mb-2">
          <span class="text-lg font-semibold text-red-600">
            {{ finalPrice.value.toLocaleString() }} تومان
          </span>
          <span v-if="hasDiscount" class="text-base text-gray-400 line-through mr-3">
            {{ product.price.value.toLocaleString() }} تومان
          </span>
        </div>
        <hr class="my-4" />

        <!-- Size Chart Button -->
        <button class="border px-5 py-1.5 rounded bg-gray-100 text-gray-700 font-medium mb-3 hover:bg-gray-200 transition">
          جدول سایز
        </button>

        <!-- Variant/Attribute selection -->
        <div v-if="varieties.length" class="mb-3">
          <label class="block mb-1 text-gray-700 font-medium">انتخاب طرح</label>
          <select
            v-model="selectedVarietyId"
            class="block w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          >
            <option disabled value="">طرح</option>
            <option v-for="variety in varieties" :key="variety.id" :value="variety.id">
              {{ getAttributeTitle(variety) }}
            </option>
          </select>
        </div>

        <!-- Color Ranges (optional) -->
        <div v-if="product.color_ranges && product.color_ranges.length" class="mb-5">
          <div class="mb-2 text-gray-700 font-medium">رنگ‌بندی:</div>
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="color in product.color_ranges"
              :key="color.id"
              class="flex flex-col items-center cursor-pointer"
            >
              <img
                :src="color.image"
                :alt="color.title"
                class="w-8 h-8 rounded-full border-2 border-gray-300 shadow"
              />
              <span class="text-xs mt-1 text-gray-700">{{ color.title }}</span>
            </div>
          </div>
        </div>

        <!-- Quantity selector -->
        <div class="flex items-center mb-5">
          <span class="text-gray-700 ml-3">تعداد :</span>
          <div class="flex items-center border rounded-lg w-28">
            <button
              @click="decrement"
              :disabled="quantity <= 1"
              class="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
            >-</button>
            <span class="flex-1 text-center font-medium">{{ quantity }}</span>
            <button
              @click="increment"
              :disabled="quantity >= currentStock"
              class="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
            >+</button>
          </div>
          <span v-if="currentStock < 10" class="mr-3 text-xs text-red-500">موجودی محدود</span>
        </div>

        <!-- Add to Cart Button -->
        <button
          class="w-full py-3 bg-gray-900 hover:bg-gray-800 transition rounded-lg text-white font-bold text-base flex items-center justify-center gap-2"
        >
          <span>افزودن به سبد خرید</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 0 0 7 17h10a1 1 0 0 0 .95-.68l3.24-7.03a1 1 0 0 0-.23-1.09l-6-7A1 1 0 0 0 14.5 2h-4a1 1 0 0 0-1 1v1z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Product Specs -->
    <div v-if="specs.length" class="w-full max-w-4xl mt-14 bg-white rounded-2xl shadow p-6">
      <div class="flex items-center justify-start gap-6 border-b mb-4">
        <span class="text-lg font-bold border-b-2 border-gray-800 pb-2 text-gray-900">مشخصات</span>
        <span class="text-lg font-medium text-gray-400 pb-2">نظرات کاربران</span>
      </div>
      <table class="w-full text-sm text-right">
        <tbody>
          <tr v-for="(item, idx) in specs" :key="idx" :class="{'bg-gray-50': idx%2==1}">
            <td class="p-3 font-medium text-gray-700">{{ item.value }}</td>
            <td class="p-3 text-gray-500">{{ item.key }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      <span class="mr-3 text-gray-500">در حال دریافت اطلاعات...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
const props = defineProps({ id: [String, Number] })

const product = ref(null)
const varieties = ref([])
const selectedVarietyId = ref('')
const selectedImage = ref('')
const quantity = ref(1)
const specs = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`https://api.atlasmode.shop/v1/front/products/${props.id}?version=new2`)
    const data = await res.json()
    product.value = data.data.product
    varieties.value = product.value.varieties || []
    selectedVarietyId.value = varieties.value[0]?.id || ''
    selectedImage.value = product.value.images[0]?.conversions?.lg || product.value.images[0]?.url || ''
    // Fill specifications from API if available, else leave empty
    if (product.value.specifications && product.value.specifications.length) {
      specs.value = product.value.specifications.map(s => ({
        key: s.title,
        value: s.value,
      }))
    } else {
      // Fallback: Add whatever static/fake specs you want if not available
      specs.value = []
    }
    loading.value = false
  } catch (e) {
    loading.value = false
    alert('خطا در دریافت اطلاعات محصول')
  }
})

function selectImage(url) {
  selectedImage.value = url
}

const getAttributeTitle = (variety) => {
  // Usually the first attribute is the variant/طرح (may need customization based on data)
  return variety.attributes && variety.attributes.length
    ? variety.attributes[0]?.pivot?.value || 'بدون طرح'
    : 'بدون طرح'
}

const currentVariety = computed(() => varieties.value.find(v => v.id === selectedVarietyId.value) || varieties.value[0] || {})

const currentStock = computed(() => currentVariety.value?.quantity ?? (product.value?.total_quantity ?? 99))

function increment() {
  if (quantity.value < currentStock.value) quantity.value++
}
function decrement() {
  if (quantity.value > 1) quantity.value--
}

const finalPrice = computed(() => {
  // If selected variety has final price, show it, else show main product price
  if (currentVariety.value && currentVariety.value.final_price) return +currentVariety.value.final_price
  if (product.value?.major_final_price?.amount) return +product.value.major_final_price.amount
  return product.value?.price || 0
})
const hasDiscount = computed(() =>
  (product.value?.discount || 0) > 0 ||
  (product.value?.major_discount_amount || 0) > 0
)

// Watch for variety change to reset quantity and image if available
watch(selectedVarietyId, (newId) => {
  quantity.value = 1
  // If this variety has images, show its image
  const v = varieties.value.find(x => x.id === newId)
  if (v && v.images && v.images.length) {
    selectedImage.value = v.images[0].conversions?.lg || v.images[0].url
  } else {
    selectedImage.value = product.value.images[0]?.conversions?.lg || product.value.images[0]?.url || ''
  }
})

</script>
