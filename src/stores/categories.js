import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
  }),
  getters: {
    mainCategories: (state) => {
      if (!state.categories.length) return []
      return state.categories[0]?.children?.filter(cat => cat.image) || []
    }
  },
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const { data } = await axios.get("https://api.atlasmode.shop/v1/front/get-categories?version=new2")
        this.categories = data
        console.log("categories:", this.categories)
      } catch (e) {
        console.error("Error fetching categories:", e)
      }
      this.loading = false
    }
  }
})
