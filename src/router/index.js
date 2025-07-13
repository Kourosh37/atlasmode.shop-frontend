import { createRouter, createWebHistory } from "vue-router";

// import pages components
import index from "../pages/index.vue";
import products from "../pages/products.vue";
import ProductDetails from '../pages/ProductDetails.vue';

const routes = [
  { path: "/", component: index },
  { path: "/products", component: products },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
