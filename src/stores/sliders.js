import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Slider store for home page hero/carousel sliders.
 * Fetches and caches both desktop and mobile slides.
 */
export const useSliderStore = defineStore('slider', {
  state: () => ({
    /** All fetched slide objects */
    slides: [],
    /** Loading state for async fetch */
    loading: false,
    /** Any error string from fetching slides */
    error: null,
  }),
  getters: {
    /**
     * Slides for desktop view (group === 'header')
     */
    desktopSlides: (state) =>
      state.slides.filter((s) => s.status && s.group === 'header'),
    /**
     * Slides for mobile view (group === 'header-mobile')
     */
    mobileSlides: (state) =>
      state.slides.filter((s) => s.status && s.group === 'header-mobile'),
  },
  actions: {
    /**
     * Fetch slider images (only runs if not already loaded or loading).
     */
    async fetchSlides() {
      if (this.loading || this.slides.length) return
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(
          'https://api.atlasmode.shop/v1/front/sliders?version=new2'
        )
        // Defensive: Support for possible API changes
        this.slides = data?.data?.response?.sliders ?? []
      } catch (err) {
        this.error = err?.message || 'Error fetching sliders!'
      } finally {
        this.loading = false
      }
    },
  },
})
