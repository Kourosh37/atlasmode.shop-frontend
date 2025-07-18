import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Category Store
 * Manages state for all product categories (main + subcategories)
 * - Fetches from backend API
 * - Handles loading state
 * - Provides filtered "mainCategories" (top-level with images) as a getter
 */
export const useCategoryStore = defineStore('categories', {
  // =======================
  // State
  // =======================
  state: () => ({
    categories: [],    // All categories (API format)
    loading: false,    // Fetching state
  }),

  // =======================
  // Getters
  // =======================
  getters: {
    /**
     * Returns only the main (first level) categories that have images.
     * Used for homepage/category cards, etc.
     * @returns {Array} Filtered main categories with image
     */
    mainCategories: (state) => {
      if (!state.categories.length) return []
      // Only categories with image in the first children array
      return state.categories[0]?.children?.filter(cat => cat.image) || []
    }
  },

  // =======================
  // Actions
  // =======================
  actions: {
    /**
     * Fetches all categories from the backend API.
     * Updates loading state and category list.
     */
    async fetchCategories() {
      this.loading = true
      try {
        const { data } = await axios.get(
          "https://api.atlasmode.shop/v1/front/get-categories?version=new2"
        )
        this.categories = data
        // For debugging only - remove in production
        console.log("categories:", this.categories)
      } catch (e) {
        // Handle fetch error (can expand for user-facing error state)
        console.error("Error fetching categories:", e)
      }
      this.loading = false
    }
  }
})
