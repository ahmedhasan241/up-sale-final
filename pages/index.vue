<template>
    <div class="swiper-container">
      <swiper
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        class="my-swiper"
      >
        <swiper-slide>
          <img src="https://via.placeholder.com/800x400?text=Slide+1" />
        </swiper-slide>
        <swiper-slide>
          <img src="https://via.placeholder.com/800x400?text=Slide+2" />
        </swiper-slide>
        <swiper-slide>
          <img src="https://via.placeholder.com/800x400?text=Slide+3" />
        </swiper-slide>
      </swiper>
  
      <!-- Custom pagination outside swiper -->
      <div class="custom-pagination"></div>
    </div>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper-bundle.css'
  import { Pagination } from 'swiper/modules'
  </script>
  
  <style scoped>
  /* The container around swiper */
  .swiper-container {
    position: relative;
    width: 100%;
  }
  
  /* Swiper itself */
  .my-swiper {
    width: 100%;
    height: 400px;
  }
  
  /* Custom pagination styles */
  .custom-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* Adjust this margin to move the dots further from the swiper */
  }
  
  .swiper-pagination-bullet {
    background-color: #007bff;
    width: 12px;
    height: 12px;
    margin: 0 6px;
    opacity: 1;
  }
  
  .swiper-pagination-bullet-active {
    background-color: #ff5733;
  }
  </style>
  