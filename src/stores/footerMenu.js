import { defineStore } from 'pinia'

/**
 * Footer Menu Store
 * Handles loading and storage of footer navigation menu links.
 * - Fetches menu items from backend API.
 * - Exposes loading state and menu array.
 */
export const useFooterMenuStore = defineStore('footerMenu', {
  // ================================
  // State
  // ================================
  state: () => ({
    menus: [],     // List of footer menu items (array of objects from API)
    loading: false // Is footer menu currently loading?
  }),

  // ================================
  // Actions
  // ================================
  actions: {
    /**
     * Fetches footer menu items from backend API.
     * Handles loading state and API errors.
     * Sets menu list to empty on error.
     */
    async fetchMenus() {
      this.loading = true
      try {
        const res = await fetch('https://api.atlasmode.shop/v1/all/menus/footer?version=new2')
        const data = await res.json()
        this.menus = data?.data?.menus || []
      } catch (e) {
        // If fetch fails, set menus to empty array
        this.menus = []
      }
      this.loading = false
    }
  }
})
