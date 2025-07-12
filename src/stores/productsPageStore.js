// stores/productsPageStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useProductsPageStore = defineStore('productsPageStore', () => {
  // State
  const isLoadingInit = ref(true)
  const isLoadingProducts = ref(false)
  const errorMessage = ref('')
  const categoryList = ref([])
  const colorList = ref([])
  const sizeList = ref([])
  const minPrice = ref(0)
  const maxPrice = ref(0)
  const pageFirst = ref(1)
  const pageLast = ref(1)
  const pageCurrent = ref(1)
  const productPages = ref({})
  const pages = computed(() =>
    Array.from({ length: pageLast.value - pageFirst.value + 1 }, (_, i) => pageFirst.value + i)
  )

  // Initialize all data on mount
  const initStore = async () => {
    isLoadingInit.value = true
    errorMessage.value = ''
    try {
      await fetchCategories()
      await fetchColors()
      await fetchSizes()
      await applyFilters({})
    } catch {
      errorMessage.value = 'Error loading data!'
    } finally {
      isLoadingInit.value = false
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get(
      'https://api.atlasmode.shop/v1/front/get-categories?version=new2'
    )
    categoryList.value = res.data[0]?.children ?? []
  }

  // Fetch colors
  const fetchColors = async () => {
    const res = await axios.get(
      'https://api.atlasmode.shop/v1/front/color-ranges?version=new2'
    )
    colorList.value = (res.data.data?.colorRanges ?? []).map(color => ({
      ...color,
      gradient: color.gradient || '', // optional gradient
      image: color.image || '',       // image URL
      value: color.value || color.hex || color.title // for filter value
    }))
  }

  // Fetch sizes & initial price info
  const fetchSizes = async () => {
    const res = await axios.get(
      'https://api.atlasmode.shop/v1/front/products?version=new2&page=1'
    )
    sizeList.value = res.data.data?.attributes?.values ?? []
    minPrice.value = res.data.data?.priceFilter?.min_price ?? 0
    maxPrice.value = res.data.data?.priceFilter?.max_price ?? 0
    pageFirst.value = res.data.data?.products?.from ?? 1
    pageLast.value = res.data.data?.products?.last_page ?? 1
  }

  // Fetch products by filters
  const applyFilters = async (filters) => {
    isLoadingProducts.value = true
    errorMessage.value = ''
    // Compose query params
    let params = {
      version: 'new2',
      page: 1,
      category_id: filters.category_id || '',
      color: filters.color || '',
      size: filters.size || '',
      title: filters.title || '',
      available: filters.available || 0,
      min_price: filters.min_price || 0,
      max_price: filters.max_price || 0,
      sort: '',
      flash_id: ''
    }
    // Remove empty fields
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key]
    })
    try {
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      minPrice.value = data.priceFilter?.min_price ?? 0
      maxPrice.value = data.priceFilter?.max_price ?? 0
      pageFirst.value = data.products?.from ?? 1
      pageLast.value = data.products?.last_page ?? 1
      pageCurrent.value = data.products?.current_page ?? 1
      productPages.value = { [pageCurrent.value]: data.products?.data ?? [] }
    } catch {
      errorMessage.value = 'Error fetching products!'
    } finally {
      isLoadingProducts.value = false
    }
  }

  // Fetch a specific page (with latest filters)
  const handlePageChange = async (page) => {
    if (productPages.value[page]) {
      pageCurrent.value = page
      return
    }
    isLoadingProducts.value = true
    errorMessage.value = ''
    try {
      // TODO: Store the last filter in the store and use it here as well
      // For now, we fetch with just the page number
      const params = { version: 'new2', page }
      const res = await axios.get('https://api.atlasmode.shop/v1/front/products', { params })
      const data = res.data.data
      productPages.value[page] = data.products?.data ?? []
      pageCurrent.value = page
    } catch {
      errorMessage.value = 'Error loading this page!'
    } finally {
      isLoadingProducts.value = false
    }
  }

  return {
    // state
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
    // actions
    initStore,
    applyFilters,
    handlePageChange
  }
})
