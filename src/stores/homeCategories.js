import { defineStore } from 'pinia';

export const useHomeCategoriesStore = defineStore('homeCategories', {
  state: () => ({
    categories: [],
    loading: false,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await fetch('https://api.atlasmode.shop/v1/front/home?version=new2');
        const data = await res.json();
        this.categories = data?.data?.response?.show_in_home_categories || [];
      } catch (e) {
        this.categories = [];
      }
      this.loading = false;
    },
  },
});
