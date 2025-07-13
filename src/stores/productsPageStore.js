import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import axios from 'axios'

export const useProductsPageStore = defineStore('productsPage', () => {
  // --- Loading & error state ---
  const isInitialLoading = ref(true)
  const isProductsLoading = ref(false)
  const error = ref('')

  // --- API-driven lists/data ---
  const categories = ref([])
  const colors = ref([])
  const sizes = ref([])
  const priceMin = ref(0)
  const priceMax = ref(0)
  const pageStart = ref(1)
  const pageEnd = ref(1)
  const currentPage = ref(1)
  const productsByPage = ref({})

  // --- UI state for sidebar collapses, etc. ---
  // This allows the sidebar to be 100% store-driven, no local state in the component
  const ui = reactive({
    sizeOpen: true,
    colorOpen: true,
  })

  // --- Filter state (including priceRange) ---
  // priceRange is an array [min, max], synced with slider and filters
  const filters = reactive({
    categoryId: '',
    title: '',
    sizes: [],
    colors: [], // Array of color objects (from API)
    available: 0,
    priceRange: [0, 0], // Will be set after fetch
    sort: '',
  })

  // --- Computed for pagination pages ---
  const paginationPages = computed(() =>
    Array.from({ length: pageEnd.value - pageStart.value + 1 }, (_, i) => pageStart.value + i)
  )

  // --- Sync priceRange with fetched min/max ---
  // After fetching prices, always update filter's priceRange accordingly
  watch([priceMin, priceMax], ([min, max]) => {
    if (filters.priceRange[0] !== min || filters.priceRange[1] !== max) {
      filters.priceRange = [min, max]
    }
  })

  // --- API fetchers ---
  const fetchCategories = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/get-categories?version=new2')
    categories.value = res.data[0]?.children ?? []
  }

  const fetchColors = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/color-ranges?version=new2')
    colors.value = (res.data.data?.colorRanges ?? []).map(color => ({
      ...color,
      gradient: color.gradient || '',
      image: color.image || '',
      value: color.value || color.hex || color.title
    }))
  }

  const fetchSizesAndInitPrices = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/products?version=new2&page=1')
    sizes.value = res.data.data?.attributes?.values ?? []
    priceMin.value = res.data.data?.priceFilter?.min_price ?? 0
    priceMax.value = res.data.data?.priceFilter?.max_price ?? 0
    pageStart.value = 1
    pageEnd.value = res.data.data?.products?.last_page ?? 1
    currentPage.value = res.data.data?.products?.current_page ?? 1
    // Sync filter priceRange
    filters.priceRange = [priceMin.value, priceMax.value]
  }

  // --- Main initializer ---
  const init = async () => {
    isInitialLoading.value = true
    error.value = ''
    try {
      await Promise.all([
        fetchCategories(),
        fetchColors(),
        fetchSizesAndInitPrices(),
      ])
      // Set initial price range filter to min/max
      filters.priceRange = [priceMin.value, priceMax.value]
      await fetchProductsWithFilters()
    } catch (err) {
      error.value = 'Error loading data!'
    } finally {
      isInitialLoading.value = false
    }
  }

  // --- Helper: build query params from store.filters (and priceRange) ---
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

  // --- Fetch products based on filters ---
  const fetchProductsWithFilters = async () => {
    isProductsLoading.value = true
    error.value = ''
    const params = buildFilterParams(1)
    // Remove empty keys
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
    })
    try {
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      priceMin.value = data.priceFilter?.min_price ?? 0
      priceMax.value = data.priceFilter?.max_price ?? 0
      // Sync filter price range after new fetch
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

  // --- Main handler for filter form (called by sidebar) ---
  const applyFilters = async () => {
    await fetchProductsWithFilters()
  }

  // --- Pagination handler ---
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

  // --- Expose everything for component use ---
  return {
    // UI + API state
    isInitialLoading,
    isProductsLoading,
    error,

    // Data
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

    // Sidebar UI state
    ui,

    // Filters
    filters,

    // Main methods
    init,
    applyFilters,
    goToPage,
  }
})
