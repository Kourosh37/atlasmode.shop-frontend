import { createRouter, createWebHistory } from "vue-router";

// import pages components
import index from "../pages/index.vue";
import products from "../pages/products.vue";

const routes = [
  { path: "/", component: index },
  { path: "/products", component: products }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
