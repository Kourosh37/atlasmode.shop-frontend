import { defineStore } from 'pinia'

/**
 * Header Menu Store
 * Manages the state and loading for top navigation/header menus.
 * - Fetches menu items from backend API.
 * - Handles loading state and error fallback.
 */
export const useHeaderMenuStore = defineStore('headerMenu', {
  // ============================
  // State
  // ============================
  state: () => ({
    menus: [],      // Header menu items (array of objects from API)
    loading: false  // Is header menu currently loading?
  }),

  // ============================
  // Actions
  // ============================
  actions: {
    /**
     * Fetch header menu items from backend API.
     * Updates 'menus' and 'loading' state.
     * On failure, sets menus to empty array.
     */
    async fetchMenus() {
      this.loading = true
      try {
        const res = await fetch('https://api.atlasmode.shop/v1/all/menus/header?version=new2')
        const data = await res.json()
        this.menus = data?.data?.menus || []
      } catch {
        this.menus = []
      }
      this.loading = false
    }
  }
})
