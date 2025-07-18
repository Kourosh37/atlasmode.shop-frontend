<script setup>
/**
 * Home.vue
 * Main entry point for home page sections (composition only).
 * 
 * - Imports all hero and product slider components (lazy load if needed for bigger projects)
 * - Only composition, no business logic/state here.
 * 
 * You can wrap sections with <section> if you want better semantics/SEO.
 */

// Section components (each isolated and self-documented)
import HeroSlider from "../components/homeComponents/HeroSlider.vue";
import Categories from "../components/homeComponents/Categories.vue";
import DiscountProducts from "../components/homeComponents/DiscountProducts.vue";
import MostSalesProducts from "../components/homeComponents/MostSales.vue";
import NewProducts from "../components/homeComponents/NewProducts.vue";
import PostSlider from "../components/homeComponents/PostsSlider.vue";
import HomeCategorySliders from "../components/homeComponents/HomeCategorySliders.vue";
</script>

<template>
  <!--
    Home Page Layout
    Each section is a fully isolated component.
    Add padding/margins or wrap in <main> as needed.
  -->
  <HeroSlider />
  <Categories />
  <DiscountProducts />
  <MostSalesProducts />
  <NewProducts />
  <HomeCategorySliders />
  <PostSlider />
</template>
