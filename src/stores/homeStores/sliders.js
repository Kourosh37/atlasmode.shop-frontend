import { defineStore } from 'pinia'
import axios from 'axios'

export const useSliderStore = defineStore('slider', {
  state: () => ({
    slides: [],
    loading: false,
    error: null,
  }),
  getters: {
    desktopSlides: (state) =>
      state.slides.filter((s) => s.status && s.group === 'header'),
    mobileSlides: (state) =>
      state.slides.filter((s) => s.status && s.group === 'header-mobile'),
  },
  actions: {
    async fetchSlides() {
      if (this.loading || this.slides.length) return
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(
          'https://api.atlasmode.shop/v1/front/sliders?version=new2'
        )
        this.slides = data.data.response.sliders
      } catch (err) {
        this.error = err?.message || 'Error fetching sliders!'
      } finally {
        this.loading = false
      }
    },
  },
})
