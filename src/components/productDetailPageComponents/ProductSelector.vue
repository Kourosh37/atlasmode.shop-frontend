<template>
  <div class="flex flex-col gap-6">
    <!-- ==============================
         Design Selector
         ============================== -->
    <div class="flex flex-col gap-1 w-full max-w-[240px]">
      <label class="text-sm text-gray-600">طرح</label>
      <select
        v-model="selectedDesign"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
      >
        <option
          v-for="design in productStore.uniqueDesigns"
          :key="design"
          :value="design"
        >
          {{ design }}
        </option>
      </select>
    </div>

    <!-- ==============================
         Size Selector
         ============================== -->
    <div class="flex flex-col gap-1">
      <label class="text-sm text-gray-600">سایز</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in productStore.availableSizesForDesign(selectedDesign)"
          :key="size"
          :class="[
            'px-4 py-1 text-sm border rounded-md',
            selectedSize === size
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          ]"
          @click="selectSize(size)"
          type="button"
        >
          {{ size }}
        </button>
      </div>
      <span
        v-if="productStore.availableSizesForDesign(selectedDesign).length === 0"
        class="text-xs text-red-500 font-medium mt-1"
      >
        سایز موجود نیست
      </span>
    </div>

    <!-- ==============================
         Quantity Selector
         ============================== -->
    <div class="flex flex-col gap-1">
      <label class="text-sm text-gray-600">تعداد</label>
      <div class="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 bg-white w-fit">
        <button
          class="w-7 h-7 flex items-center justify-center text-lg rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-400"
          @mousedown="startChange('inc')"
          @mouseup="stopChange"
          @mouseleave="stopChange"
          @touchstart.prevent="startChange('inc')"
          @touchend="stopChange"
          :disabled="selectedCount >= maxQuantityForSelectedSizeAndDesign || maxQuantityForSelectedSizeAndDesign === 0"
          type="button"
        >+</button>

        <span class="w-6 text-center text-base select-none">{{ selectedCount }}</span>

        <button
          class="w-7 h-7 flex items-center justify-center text-lg rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-400"
          @mousedown="startChange('dec')"
          @mouseup="stopChange"
          @mouseleave="stopChange"
          @touchstart.prevent="startChange('dec')"
          @touchend="stopChange"
          :disabled="selectedCount <= 1"
          type="button"
        >−</button>
      </div>
      <div v-if="maxQuantityForSelectedSizeAndDesign === 0" class="text-xs text-red-500 mt-1 font-medium">
        ناموجود
      </div>
      <div v-else class="text-xs text-gray-500 mt-1">
        حداکثر: {{ maxQuantityForSelectedSizeAndDesign }}
      </div>
    </div>

    <!-- ==============================
         Confirm Button
         ============================== -->
    <div>
      <button
        @click="confirmSelection"
        :disabled="!selectedDesign || !selectedSize || maxQuantityForSelectedSizeAndDesign === 0 || selectedCount < 1"
        class="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 self-start"
        type="button"
      >
        تایید انتخاب
      </button>
    </div>

    <!-- ==============================
         Selections List
         ============================== -->
    <SelectionsList
      v-if="cartSelections.length > 0"
      :cart-selections="cartSelections"
      :cart-total="cartTotal"
      @remove-selection="removeSelection"
      @add-to-cart="addToCart"
    />
  </div>
</template>




<script setup>
// ==============================
// Imports & Components
// ==============================
import { ref, computed, watch, onMounted } from "vue";
import { useProductStore } from "../../stores/productDetails";
import SelectionsList from "./SelectionsList.vue";

// ==============================
// Props (Optional: initial selections)
// ==============================
const props = defineProps({
  initialSelections: Array,
});

// ==============================
// Store Instance
// ==============================
/**
 * Product store instance containing all designs, sizes, and price logic.
 */
const productStore = useProductStore();

// ==============================
// Local State for Selection
// ==============================
const selectedDesign = ref("");
const selectedSize = ref("");
const selectedCount = ref(1);

/**
 * Array of all user selections for cart review.
 * @type {import('vue').Ref<Array>}
 */
const cartSelections = ref(props.initialSelections || []);

// ==============================
// Quantity Button Hold Logic
// ==============================
let interval = null;
let timeout = null;

/**
 * Increment selected count if under limit.
 */
function incrementQuantity() {
  if (selectedCount.value < maxQuantityForSelectedSizeAndDesign.value) {
    selectedCount.value++;
  }
}

/**
 * Decrement selected count if above 1.
 */
function decrementQuantity() {
  if (selectedCount.value > 1) {
    selectedCount.value--;
  }
}

/**
 * Start continuous quantity change on button hold.
 * @param {'inc' | 'dec'} type
 */
function startChange(type) {
  stopChange();
  if (
    (type === "inc" &&
      (selectedCount.value >= maxQuantityForSelectedSizeAndDesign.value ||
        maxQuantityForSelectedSizeAndDesign.value === 0)) ||
    (type === "dec" && selectedCount.value <= 1)
  ) {
    return;
  }
  type === "inc" ? incrementQuantity() : decrementQuantity();
  timeout = setTimeout(() => {
    interval = setInterval(() => {
      if (type === "inc") {
        if (selectedCount.value < maxQuantityForSelectedSizeAndDesign.value) {
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

/**
 * Stop changing quantity on button release.
 */
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

/**
 * Select a size for the current design.
 * @param {string} size
 */
function selectSize(size) {
  selectedSize.value = size;
}

// ==============================
// Computed
// ==============================
/**
 * The maximum available quantity for the selected design & size.
 */
const maxQuantityForSelectedSizeAndDesign = computed(() => {
  return productStore.maxQuantityForDesignAndSize(selectedDesign.value, selectedSize.value);
});

/**
 * Total price for all selected variations.
 */
const cartTotal = computed(() =>
  cartSelections.value.reduce((sum, item) => sum + item.totalPrice, 0)
);

// ==============================
// Watchers
// ==============================
/**
 * When design changes, auto-select the first available size.
 */
watch(selectedDesign, () => {
  selectedSize.value = productStore.availableSizesForDesign(selectedDesign.value)[0] || "";
});

/**
 * Keep selectedCount within valid bounds when design/size changes.
 */
watch([selectedDesign, selectedSize], () => {
  if (selectedCount.value > maxQuantityForSelectedSizeAndDesign.value) {
    selectedCount.value = maxQuantityForSelectedSizeAndDesign.value || 1;
  }
});

// ==============================
// Selection Logic
// ==============================
/**
 * Confirm and add the current selection to cartSelections.
 */
function confirmSelection() {
  const variety = productStore.findVariety(selectedDesign.value, selectedSize.value);
  if (!variety) return;
  const price = productStore.finalPrice;
  // If duplicate, merge counts and prices
  const existingIndex = cartSelections.value.findIndex(
    item => item.design === selectedDesign.value && item.size === selectedSize.value
  );
  if (existingIndex >= 0) {
    const maxQty = variety.quantity;
    const newCount = Math.min(cartSelections.value[existingIndex].count + selectedCount.value, maxQty);
    cartSelections.value[existingIndex].count = newCount;
    cartSelections.value[existingIndex].totalPrice = price * newCount;
  } else {
    cartSelections.value.push({
      design: selectedDesign.value,
      size: selectedSize.value,
      count: selectedCount.value,
      unitPrice: price,
      totalPrice: price * selectedCount.value,
      varietyId: variety.id
    });
  }
  selectedCount.value = 1;
}

/**
 * Remove a selection from cartSelections by index.
 * @param {number} idx
 */
function removeSelection(idx) {
  cartSelections.value.splice(idx, 1);
}

/**
 * Add all selections to the cart (implement your cart logic here).
 */
function addToCart() {
  alert("Selected items added to cart! (implement actual logic)");
}

// ==============================
// On Mounted: set initial design & size
// ==============================
onMounted(() => {
  if (productStore.uniqueDesigns.length > 0) {
    selectedDesign.value = productStore.uniqueDesigns[0];
    selectedSize.value = productStore.availableSizesForDesign(selectedDesign.value)[0] || "";
  }
});
</script>
