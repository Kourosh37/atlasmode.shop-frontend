import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Posts Store
 * Handles loading, storing, and exposing post data for homepage and blog sections.
 * - Fetches posts, most viewed, and categories from API.
 */
export const usePostsStore = defineStore('posts', {
  // ======================
  // State
  // ======================
  state: () => ({
    loading: false,  // Is data currently loading?
    posts: [],       // List of post objects (main recent posts)
    mostViews: [],   // List of most-viewed post objects
    category: [],    // List of categories for posts
  }),

  // ======================
  // Actions
  // ======================
  actions: {
    /**
     * Fetch all posts (recent), most viewed, and category list.
     * Updates loading state.
     */
    async fetchPosts() {
      this.loading = true
      try {
        const res = await axios.get('https://api.atlasmode.shop/v1/front/posts?version=new2')
        if (res.data && res.data.success) {
          this.posts     = res.data.data.posts?.data || []
          this.mostViews = res.data.data.mostViews || []
          this.category  = res.data.data.category || []
        }
      } catch (e) {
        // You could add error state here if you want to display errors in UI
      }
      this.loading = false
    }
  }
})
