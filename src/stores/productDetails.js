import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

/**
 * useProductStore
 * Centralized store for handling a single product's full detail page.
 * - Loads product by ID, manages loading/not found, images, price, variants, etc.
 * - Exposes helpers for design/size selection logic, price formatting, etc.
 */
export const useProductStore = defineStore('product', () => {
  // ========================
  // State
  // ========================
  /** Loading status for the product details fetch */
  const loading = ref(true)
  /** Product not found (404) flag */
  const notFound = ref(false)

  // Product main info and relations
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
  const productVarities = ref([]) // All possible variations (design + size)
  const productSpecifications = ref({}) // New: product specifications as { label: value }

  // ========================
  // Getters / Computed
  // ========================

  /**
   * Get the attribute name used for size, depending on product type.
   * (Useful for clothing/shoes/pants, etc.)
   * @returns {string} e.g. "sizePants"
   */
  function getSizeAttrName() {
    return (
      productVarities.value?.[0]?.attributes?.find((a) =>
        ['sizePants', 'sizeClothes', 'sizeShoes'].includes(a.name)
      )?.name || 'sizePants'
    )
  }

  /**
   * All unique available designs ("tarh") for this product.
   * Used for design selector UI.
   * @type {import('vue').ComputedRef<string[]>}
   */
  const uniqueDesigns = computed(() => {
    const designs = productVarities.value
      .map(variety =>
        variety.attributes?.find(attr => attr.name === 'tarh')?.pivot?.value
      )
      .filter(Boolean)
    return [...new Set(designs)] // Remove duplicates
  })

  /**
   * For a given design, get unique sizes available (in stock).
   * @param {string} design
   * @returns {string[]}
   */
  function availableSizesForDesign(design) {
    const sizeAttrName = getSizeAttrName()
    const sizes = productVarities.value
      .filter(
        variety =>
          variety.attributes?.some(
            attr => attr.name === 'tarh' && attr.pivot?.value === design
          ) && variety.quantity > 0 // Only available
      )
      .map(variety =>
        variety.attributes?.find(attr => attr.name === sizeAttrName)?.pivot?.value
      )
      .filter(Boolean)
    return [...new Set(sizes)]
  }

  /**
   * For a given design+size, return available quantity in stock.
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
   * For a given design+size, return the full variety object (for cart/selection).
   * @param {string} design
   * @param {string|number} size
   * @returns {object|null}
   */
  function findVariety(design, size) {
    const sizeAttrName = getSizeAttrName()
    return productVarities.value.find(
      v =>
        v.attributes?.some(attr => attr.name === sizeAttrName && attr.pivot?.value === size) &&
        v.attributes?.some(attr => attr.name === "tarh" && attr.pivot?.value === design)
    ) || null
  }

  /**
   * Final price after discount (computed).
   * @type {import('vue').ComputedRef<number>}
   */
  const finalPrice = computed(() => {
    return productPrice.value * (1 - productsDiscountPercent.value / 100)
  })

  /**
   * Format a number with Persian comma separators.
   * @param {number} num
   * @returns {string}
   */
  function numberFormat(num) {
    if (!num) return '0'
    return Number(num).toLocaleString('fa-IR')
  }

  // ========================
  // Actions / Methods
  // ========================

  /**
   * Fetch full product details from API by product ID.
   * Populates all state fields, or sets notFound if missing.
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
      productSpecifications.value = p.specifications

    } catch (e) {
      notFound.value = true
    } finally {
      loading.value = false // loading finishes after ALL fields are parsed
    }
  }

  /**
   * Reset all product state to defaults (before loading a new product).
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
    productSpecifications.value = {}
    loading.value = false
    notFound.value = false
  }

  // ========================
  // Expose state, computed, methods
  // ========================
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
    productSpecifications,

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
