import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    loading: false,
    posts: [],
    mostViews: [],
    category: [],
  }),
  actions: {
    async fetchPosts() {
      this.loading = true
      try {
        const res = await axios.get('https://api.atlasmode.shop/v1/front/posts?version=new2')
        if (res.data && res.data.success) {
          this.posts = res.data.data.posts?.data || []
          this.mostViews = res.data.data.mostViews || []
          this.category = res.data.data.category || []
        }
      } catch (e) {
      }
      this.loading = false
    }
  }
})
