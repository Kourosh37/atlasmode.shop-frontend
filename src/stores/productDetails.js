// stores/product.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  // --- Main product state ---
  const loading = ref(true) // Whether product is loading
  const notFound = ref(false) // If product is not found

  // Product basic info
  const productTitle = ref('')
  const productImages = ref([])
  const relatedProducts = ref([])
  const productCategories = ref([])
  const productPrice = ref(0)
  const productsDiscountPercent = ref(0)
  const productDiscountDeadline = ref('')
  const productQuantity = ref(0)
  const productAvailibilityStatus = ref('')
  const productSizeCharts = ref([])
  const productVarities = ref([]) // All varities (combinations of size, design...)

  /**
   * Find the attribute name for size (for flexible product types).
   * e.g., "sizePants", "sizeClothes", etc.
   * @returns {string}
   */
  function getSizeAttrName() {
    return (
      productVarities.value?.[0]?.attributes?.find((a) =>
        ['sizePants', 'sizeClothes', 'sizeShoes'].includes(a.name)
      )?.name || 'sizePants'
    )
  }

  /**
   * Unique available designs ("tarh") for this product
   * @returns {Array}
   */
  const uniqueDesigns = computed(() => {
    const designs = productVarities.value
      .map(variety =>
        variety.attributes?.find(attr => attr.name === 'tarh')?.pivot?.value
      )
      .filter(Boolean)
    // Remove duplicates (using Set)
    return [...new Set(designs)]
  })

  /**
   * For a given design, get available unique sizes
   * @param {string} design
   * @returns {Array}
   */
  function availableSizesForDesign(design) {
    const sizeAttrName = getSizeAttrName()
    const sizes = productVarities.value
      .filter(
        variety =>
          variety.attributes?.some(
            attr => attr.name === 'tarh' && attr.pivot?.value === design
          ) && variety.quantity > 0 // Only show available
      )
      .map(variety =>
        variety.attributes?.find(attr => attr.name === sizeAttrName)?.pivot?.value
      )
      .filter(Boolean)
    return [...new Set(sizes)]
  }

  /**
   * For a given design+size, return available quantity in stock
   * @param {string} design
   * @param {string|number} size
   * @returns {number}
   */
  function maxQuantityForDesignAndSize(design, size) {
    const sizeAttrName = getSizeAttrName()
    const foundVariety = productVarities.value.find(
      v =>
        v.attributes?.some(attr => attr.name === sizeAttrName && attr.pivot?.value === size) &&
        v.attributes?.some(attr => attr.name === 'tarh' && attr.pivot?.value === design)
    )
    return foundVariety ? foundVariety.quantity : 0
  }

  /**
   * For a given design+size, return variety id (for cart)
   * @param {string} design
   * @param {string|number} size
   * @returns {number|null}
   */
  function findVariety(design, size) {
    const sizeAttrName = getSizeAttrName()
    const foundVariety = productVarities.value.find(
      v =>
        v.attributes?.some(attr => attr.name === sizeAttrName && attr.pivot?.value === size) &&
        v.attributes?.some(attr => attr.name === 'tarh' && attr.pivot?.value === design)
    )
    return foundVariety ? foundVariety.id : null
  }

  /**
   * Final price after discount (computed)
   * @returns {number}
   */
  const finalPrice = computed(() => {
    return productPrice.value * (1 - productsDiscountPercent.value / 100)
  })

  /**
   * Format number with Persian comma separators
   * @param {number} num
   * @returns {string}
   */
  function numberFormat(num) {
    if (!num) return '0'
    return Number(num).toLocaleString('fa-IR')
  }

  /**
   * Fetch product details from API
   * @param {string|number} productId
   */
  async function fetchProduct(productId) {
    loading.value = true
    notFound.value = false
    try {
      const res = await axios.get(
        `https://api.atlasmode.shop/v1/front/products/${productId}?version=new2`
      )
      const p = res.data.data.product
      if (!p) {
        notFound.value = true
        return
      }
      // Fill all main product fields
      productTitle.value = p.title
      productImages.value = p.images
      relatedProducts.value = res.data.data.relatedProducts
      productCategories.value = p.categories
      productPrice.value = p.price
      productsDiscountPercent.value = p.discount
      productDiscountDeadline.value = p.discount_until
      productQuantity.value = p.total_quantity
      productAvailibilityStatus.value = p.status
      productSizeCharts.value = p.size_charts
      productVarities.value = p.varieties || []
    } catch (e) {
      notFound.value = true
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset product state (useful before loading a new product)
   */
  function resetProduct() {
    productTitle.value = ''
    productImages.value = []
    relatedProducts.value = []
    productCategories.value = []
    productPrice.value = 0
    productsDiscountPercent.value = 0
    productDiscountDeadline.value = ''
    productQuantity.value = 0
    productAvailibilityStatus.value = ''
    productSizeCharts.value = []
    productVarities.value = []
    loading.value = false
    notFound.value = false
  }




  // --- Expose state, computed, and methods ---
  return {
    // State
    loading,
    notFound,
    productTitle,
    productImages,
    relatedProducts,
    productCategories,
    productPrice,
    productsDiscountPercent,
    productDiscountDeadline,
    productQuantity,
    productAvailibilityStatus,
    productSizeCharts,
    productVarities,

    // Computed
    uniqueDesigns,
    finalPrice,

    // Actions / Methods
    fetchProduct,
    resetProduct,
    availableSizesForDesign,
    maxQuantityForDesignAndSize,
    findVariety,
    numberFormat,
    getSizeAttrName,
  }
})
