<script setup>
import HeroSlider from "../components/homeComponents/HeroSlider.vue";
import Categories from "../components/homeComponents/Categories.vue";
import DiscountProducts from "../components/homeComponents/DiscountProducts.vue";
import mostSalesProducts from "../components/homeComponents/MostSales.vue";
import newProducts from "../components/homeComponents/NewProducts.vue";
import PostSlider from "../components/homeComponents/PostsSlider.vue";
import HomeCategorySliders from "../components/homeComponents/HomeCategorySliders.vue";
import Header from "../components/homeComponents/Header.vue";
import Footer from "../components/homeComponents/Footer.vue";
</script>

<template>
    <Header />

  <HeroSlider />

  <Categories />

  <DiscountProducts />

  <mostSalesProducts />

  <newProducts />

  <HomeCategorySliders />

  <PostSlider />

  <Footer />
  
</template>
