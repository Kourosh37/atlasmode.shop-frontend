import { defineStore } from "pinia";
import axios from "axios";

export const useProductsStore = defineStore("products", {
  state: () => ({
    categories: [],
    categoriesLoading: false,

    discountProducts: [],
    discountLoading: false,

    mostSalesProducts: [],
    mostSalesLoading: false,
    mostSalesError: null,

    newProducts: [],
    newLoading: false,
    newError: null,
  }),

  actions: {
    // دسته‌بندی‌ها
    async fetchCategories() {
      this.categoriesLoading = true;
      try {
        const res = await fetch("https://api.atlasmode.shop/v1/front/home?version=new2");
        const data = await res.json();
        this.categories = data?.data?.response?.show_in_home_categories || [];
      } catch (e) {
        this.categories = [];
      }
      this.categoriesLoading = false;
    },

    // محصولات تخفیف‌دار
    async fetchDiscountProducts() {
      this.discountLoading = true;
      try {
        const { data } = await axios.get("https://api.atlasmode.shop/v1/front/most-discounts?version=new2");
        this.discountProducts = data.data.response.mostDiscount;
      } catch (e) {
        this.discountProducts = [];
      }
      this.discountLoading = false;
    },

    // پرفروش‌ترین‌ها
    async fetchMostSalesProducts() {
      this.mostSalesLoading = true;
      this.mostSalesError = null;
      try {
        const res = await fetch("https://api.atlasmode.shop/v1/front/most-sales?version=new2");
        const data = await res.json();
        this.mostSalesProducts = data?.data?.response?.mostSales || [];
      } catch (err) {
        this.mostSalesError = err;
        this.mostSalesProducts = [];
      }
      this.mostSalesLoading = false;
    },

    // جدیدترین‌ها
    async fetchNewProducts() {
      this.newLoading = true;
      this.newError = null;
      try {
        const res = await fetch("https://api.atlasmode.shop/v1/front/new-products?version=new2");
        const data = await res.json();
        this.newProducts = data?.data?.response?.new_products || [];
      } catch (err) {
        this.newError = err;
        this.newProducts = [];
      }
      this.newLoading = false;
    },
  },
});
