import { defineStore } from "pinia";

export const useNewProductsStore = defineStore("newProducts", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNewProducts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("https://api.atlasmode.shop/v1/front/new-products?version=new2");
        const data = await res.json();
        this.products = data?.data?.response?.new_products || [];
      } catch (err) {
        this.error = err;
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
