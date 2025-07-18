import { defineStore } from "pinia";
import axios from "axios";

/**
 * Products Store
 * Centralizes all product/fetch logic for homepage and featured sections.
 * - Manages loading, error, and data for product highlights (discounts, most sales, new, categories)
 */
export const useProductsStore = defineStore("products", {
  // ========================
  // State
  // ========================
  state: () => ({
    categories: [],            // Home page product categories (with featured products)
    categoriesLoading: false,  // Loading state for home categories

    discountProducts: [],      // Most discounted products
    discountLoading: false,    // Loading state for discount products

    mostSalesProducts: [],     // Top selling products
    mostSalesLoading: false,   // Loading state for most sales
    mostSalesError: null,      // Error for most sales fetch

    newProducts: [],           // Newest products
    newLoading: false,         // Loading state for new products
    newError: null,            // Error for new products fetch
  }),

  // ========================
  // Actions
  // ========================
  actions: {
    /**
     * Fetches homepage product categories.
     * Updates loading state and resets categories on error.
     */
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

    /**
     * Fetches most discounted products (uses axios for demonstration).
     * Updates loading state and resets products on error.
     */
    async fetchDiscountProducts() {
      this.discountLoading = true;
      try {
        const { data } = await axios.get(
          "https://api.atlasmode.shop/v1/front/most-discounts?version=new2"
        );
        this.discountProducts = data.data.response.mostDiscount;
      } catch (e) {
        this.discountProducts = [];
      }
      this.discountLoading = false;
    },

    /**
     * Fetches most sold products.
     * Updates error and loading states.
     */
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

    /**
     * Fetches newest products.
     * Updates error and loading states.
     */
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
