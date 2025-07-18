import { createRouter, createWebHistory } from "vue-router";

// ==========================
// Page Components
// ==========================
import IndexPage from "../pages/index.vue";
import ProductsPage from "../pages/products.vue";
import ProductDetailsPage from "../pages/ProductDetails.vue";

// ==========================
// Route Definitions
// ==========================
const routes = [
  {
    path: "/",
    component: IndexPage,
    // Optionally: name: 'Home',
  },
  {
    path: "/products",
    component: ProductsPage,
    // Optionally: name: 'Products',
  },
  {
    path: "/products/:id",
    name: "ProductDetails",
    component: ProductDetailsPage,
    props: true, // Route param as prop
  },
];

// ==========================
// Router Instance
// ==========================
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
