import { defineStore } from "pinia";
import axios from "axios";

export const useDiscountProductsStore = defineStore("discountProducts", {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchDiscountProducts() {
      this.loading = true;
      try {
        const { data } = await axios.get("https://api.atlasmode.shop/v1/front/most-discounts?version=new2");
        this.products = data.data.response.mostDiscount;
      } finally {
        this.loading = false;
      }
    },
  },
});
