// stores/productsPageStore.js
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import axios from 'axios'

export const useProductsPageStore = defineStore('productsPageStore', () => {
  // Simple refs for UI/loading/data
  const isLoadingInit = ref(true)
  const isLoadingProducts = ref(false)
  const errorMessage = ref('')

  // Lists from API
  const categoryList = ref([])
  const colorList = ref([])
  const sizeList = ref([])
  const minPrice = ref(0)
  const maxPrice = ref(0)
  const pageFirst = ref(1)
  const pageLast = ref(1)
  const pageCurrent = ref(1)
  const productPages = ref({})

  // All filter fields in one reactive object
  const filter = reactive({
    category_id: '',
    title: '',
    sizes: [],
    colors: [], // Array of color objects from API (not strings)
    available: 0,
    min_price: 0,
    max_price: 0,
    sort: ''
  })

  // Pages array for pagination controls
  const pages = computed(() =>
    Array.from({ length: pageLast.value - pageFirst.value + 1 }, (_, i) => pageFirst.value + i)
  )

  // Initialize all data and lists
  const initStore = async () => {
    isLoadingInit.value = true
    errorMessage.value = ''
    try {
      await Promise.all([
        fetchCategories(),
        fetchColors(),
        fetchSizesAndInitPrices(),
      ])
      // Set filter price to range
      filter.min_price = minPrice.value
      filter.max_price = maxPrice.value
      await applyFilters()
    } catch (err) {
      errorMessage.value = 'Error loading data!'
    } finally {
      isLoadingInit.value = false
    }
  }

  // Fetch category list from API
  const fetchCategories = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/get-categories?version=new2')
    categoryList.value = res.data[0]?.children ?? []
  }

  // Fetch color list from API (object structure as-is)
  const fetchColors = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/color-ranges?version=new2')
    colorList.value = (res.data.data?.colorRanges ?? []).map(color => ({
      ...color,
      gradient: color.gradient || '',
      image: color.image || '',
      value: color.value || color.hex || color.title
    }))
    // No change needed: API returns array of objects
  }

  // Fetch sizes and set min/max price
  const fetchSizesAndInitPrices = async () => {
    const res = await axios.get('https://api.atlasmode.shop/v1/front/products?version=new2&page=1')
    sizeList.value = res.data.data?.attributes?.values ?? []
    minPrice.value = res.data.data?.priceFilter?.min_price ?? 0
    maxPrice.value = res.data.data?.priceFilter?.max_price ?? 0
    pageFirst.value = 1
    pageLast.value = res.data.data?.products?.last_page ?? 1
    pageCurrent.value = res.data.data?.products?.current_page ?? 1
  }

  // Main filter API call
  const applyFilters = async () => {
    isLoadingProducts.value = true
    errorMessage.value = ''
    // Convert filter.colors (array of objects) to comma-separated values for API
    const params = {
      version: 'new2',
      page: 1,
      category_id: filter.category_id || '',
      color: Array.isArray(filter.colors)
        ? filter.colors.map(c => c.value).join(',')
        : '',
      size: Array.isArray(filter.sizes) ? filter.sizes.join(',') : filter.sizes || '',
      title: filter.title || '',
      available: filter.available || 0,
      min_price: filter.min_price || minPrice.value || 0,
      max_price: filter.max_price || maxPrice.value || 0,
      sort: filter.sort || '',
      flash_id: ''
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
    })
    try {
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      minPrice.value = data.priceFilter?.min_price ?? 0
      maxPrice.value = data.priceFilter?.max_price ?? 0
      filter.min_price = Math.max(filter.min_price, minPrice.value)
      filter.max_price = Math.min(filter.max_price, maxPrice.value)
      pageFirst.value = 1
      pageLast.value = data.products?.last_page ?? 1
      pageCurrent.value = data.products?.current_page ?? 1
      productPages.value = { [pageCurrent.value]: data.products?.data ?? [] }
    } catch (err) {
      errorMessage.value = 'Error fetching products!'
    } finally {
      isLoadingProducts.value = false
    }
  }

  // Pagination logic
  const handlePageChange = async (page) => {
    if (productPages.value[page]) {
      pageCurrent.value = page
      return
    }
    isLoadingProducts.value = true
    errorMessage.value = ''
    try {
      const params = {
        version: 'new2',
        page,
        category_id: filter.category_id || '',
        color: Array.isArray(filter.colors)
          ? filter.colors.map(c => c.value).join(',')
          : '',
        size: Array.isArray(filter.sizes) ? filter.sizes.join(',') : filter.sizes || '',
        title: filter.title || '',
        available: filter.available || 0,
        min_price: filter.min_price || minPrice.value || 0,
        max_price: filter.max_price || maxPrice.value || 0,
        sort: filter.sort || '',
        flash_id: ''
      }
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
      })
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      productPages.value[page] = data.products?.data ?? []
      pageCurrent.value = page
      pageLast.value = data.products?.last_page ?? pageLast.value
    } catch (err) {
      errorMessage.value = 'Error loading this page!'
    } finally {
      isLoadingProducts.value = false
    }
  }

  // Return state and methods for use in your components
  return {
    isLoadingInit,
    isLoadingProducts,
    errorMessage,
    categoryList,
    colorList,
    sizeList,
    minPrice,
    maxPrice,
    pageFirst,
    pageLast,
    pageCurrent,
    productPages,
    pages,
    filter,
    initStore,
    applyFilters,
    handlePageChange
  }
})
