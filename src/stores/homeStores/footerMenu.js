import { defineStore } from 'pinia';

export const useFooterMenuStore = defineStore('footerMenu', {
  state: () => ({
    menus: [],
    loading: false,
  }),
  actions: {
    async fetchMenus() {
      this.loading = true;
      try {
        const res = await fetch('https://api.atlasmode.shop/v1/all/menus/footer?version=new2');
        const data = await res.json();
        this.menus = data?.data?.menus || [];
      } catch (e) {
        this.menus = [];
      }
      this.loading = false;
    },
  },
});
