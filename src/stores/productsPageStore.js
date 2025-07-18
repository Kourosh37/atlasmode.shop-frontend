import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import axios from 'axios'

/**
 * Pinia store: useProductsPageStore
 * Handles ALL products list page state:
 *   - Categories, filters, sorting, pagination, products per page
 *   - Fully store-driven (even filter sidebar UI)
 */
export const useProductsPageStore = defineStore('productsPage', () => {
  // ===========================
  // State
  // ===========================

  /** Global loading for initial page, products, and any API errors */
  const isInitialLoading = ref(true)
  const isProductsLoading = ref(false)
  const error = ref('')

  // API-driven filter values
  /** Product categories (flat or tree, depends on API) */
  const categories = ref([])
  /** All available colors (from API, used in multi-select) */
  const colors = ref([])
  /** All available sizes (from API, used in multi-select) */
  const sizes = ref([])
  /** Min price available (for slider and price filter) */
  const priceMin = ref(0)
  /** Max price available */
  const priceMax = ref(0)

  // Pagination state
  const pageStart = ref(1)
  const pageEnd = ref(1)
  const currentPage = ref(1)
  /** Products list for each page: { [pageNum]: [products] } */
  const productsByPage = ref({})

  /** UI state for filter sidebar (open/close dropdowns) */
  const ui = reactive({
    sizeOpen: true,
    colorOpen: true,
    showSort: false,
  })

  /**
   * Filter state object for all sidebar inputs
   * categoryId: string|number
   * title: string (search query)
   * sizes: string[] (multi-select)
   * colors: object[] (from API, not just values)
   * available: 0|1 (show only available toggle)
   * priceRange: [min, max] (bound to price slider)
   * sort: string (sort type: '', 'latest', 'high_to_low', etc)
   */
  const filters = reactive({
    categoryId: '',
    title: '',
    sizes: [],
    colors: [],
    available: 0,
    priceRange: [0, 0],
    sort: '',
  })

  // ===========================
  // Computed
  // ===========================

  /** List of page numbers for pagination controls */
  const paginationPages = computed(() =>
    Array.from({ length: pageEnd.value - pageStart.value + 1 }, (_, i) => pageStart.value + i)
  )

  // --- Sync priceRange when fetched min/max changes ---
  watch([priceMin, priceMax], ([min, max]) => {
    if (filters.priceRange[0] !== min || filters.priceRange[1] !== max) {
      filters.priceRange = [min, max]
    }
  })

  // ===========================
  // API Fetchers (internal)
  // ===========================

  /**
   * Fetch main product categories
   */
  const fetchCategories = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/get-categories?version=new2')
    categories.value = res.data[0]?.children ?? []
  }

  /**
   * Fetch all color options (for multi-select)
   * Ensures each color has .gradient, .image, .value fields
   */
  const fetchColors = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/color-ranges?version=new2')
    colors.value = (res.data.data?.colorRanges ?? []).map(color => ({
      ...color,
      gradient: color.gradient || '',
      image: color.image || '',
      value: color.value || color.hex || color.title,
    }))
  }

  /**
   * Fetch all available sizes, and initial price min/max
   * Also syncs filter price range and sets initial pagination state.
   */
  const fetchSizesAndInitPrices = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/products?version=new2&page=1')
    sizes.value = res.data.data?.attributes?.values ?? []
    priceMin.value = res.data.data?.priceFilter?.min_price ?? 0
    priceMax.value = res.data.data?.priceFilter?.max_price ?? 0
    pageStart.value = 1
    pageEnd.value = res.data.data?.products?.last_page ?? 1
    currentPage.value = res.data.data?.products?.current_page ?? 1
    filters.priceRange = [priceMin.value, priceMax.value]
  }

  /**
   * Fetch products using current filters (and price slider)
   * Used for first load, and after filter apply
   */
  const fetchProductsWithFilters = async () => {
    isProductsLoading.value = true
    error.value = ''
    const params = buildFilterParams(1)
    // Remove any empty query params (API best practice)
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
    })
    try {
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      priceMin.value = data.priceFilter?.min_price ?? 0
      priceMax.value = data.priceFilter?.max_price ?? 0
      // After every fetch, always sync price range
      filters.priceRange = [
        Math.max(filters.priceRange[0], priceMin.value),
        Math.min(filters.priceRange[1], priceMax.value)
      ]
      pageStart.value = 1
      pageEnd.value = data.products?.last_page ?? 1
      currentPage.value = data.products?.current_page ?? 1
      productsByPage.value = { [currentPage.value]: data.products?.data ?? [] }
    } catch (err) {
      error.value = 'Error fetching products!'
    } finally {
      isProductsLoading.value = false
    }
  }

  // ===========================
  // Main initializer for page
  // ===========================
  /**
   * Fetches categories, colors, sizes, price range, and products
   * Called by page on mount (full reset/init)
   */
  const init = async () => {
    isInitialLoading.value = true
    error.value = ''
    try {
      await Promise.all([
        fetchCategories(),
        fetchColors(),
        fetchSizesAndInitPrices(),
      ])
      filters.priceRange = [priceMin.value, priceMax.value]
      await fetchProductsWithFilters()
    } catch (err) {
      error.value = 'Error loading data!'
    } finally {
      isInitialLoading.value = false
    }
  }

  // ===========================
  // Helpers & Handlers
  // ===========================

  /**
   * Build query params object for API, based on all filters and page
   * @param {number} page
   * @returns {Object}
   */
  function buildFilterParams(page = 1) {
    return {
      version: 'new2',
      page,
      category_id: filters.categoryId || '',
      color: Array.isArray(filters.colors)
        ? filters.colors.map(c => c.value).join(',')
        : '',
      size: Array.isArray(filters.sizes) ? filters.sizes.join(',') : filters.sizes || '',
      title: filters.title || '',
      available: filters.available || 0,
      min_price: filters.priceRange[0] || priceMin.value || 0,
      max_price: filters.priceRange[1] || priceMax.value || 0,
      sort: filters.sort || '',
      flash_id: ''
    }
  }

  /**
   * Called by sidebar filter form; reloads all products using current filters
   */
  const applyFilters = async () => {
    await fetchProductsWithFilters()
  }

  /**
   * Go to a specific pagination page (loads from cache if available)
   * @param {number} page
   */
  const goToPage = async (page) => {
    if (productsByPage.value[page]) {
      currentPage.value = page
      return
    }
    isProductsLoading.value = true
    error.value = ''
    const params = buildFilterParams(page)
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
    })
    try {
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      productsByPage.value[page] = data.products?.data ?? []
      currentPage.value = page
      pageEnd.value = data.products?.last_page ?? pageEnd.value
    } catch (err) {
      error.value = 'Error loading this page!'
    } finally {
      isProductsLoading.value = false
    }
  }

  // ===========================
  // Expose (for components)
  // ===========================
  return {
    // Loading / errors
    isInitialLoading,
    isProductsLoading,
    error,

    // Filter/UI data
    categories,
    colors,
    sizes,
    priceMin,
    priceMax,
    pageStart,
    pageEnd,
    currentPage,
    productsByPage,
    paginationPages,
    ui,
    filters,

    // Main handlers
    init,
    applyFilters,
    goToPage,
  }
})
