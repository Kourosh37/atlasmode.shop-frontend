import { defineStore } from "pinia";

export const useMostSalesProductsStore = defineStore("mostSalesProducts", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMostSalesProducts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("https://api.atlasmode.shop/v1/front/most-sales?version=new2");
        const data = await res.json();
        this.products = data?.data?.response?.mostSales || [];
      } catch (err) {
        this.error = err;
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
