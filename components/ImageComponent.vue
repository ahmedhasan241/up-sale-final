<template>
    <div class="relative aspect-square group">
      <!-- Image display with click event -->
      <img :src="image" alt="Thumbnail" class="w-full h-full object-cover cursor-pointer" @click="openDialog" />
      

  
      <!-- Fullscreen Image Dialog -->
      <div v-if="isDialogOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="relative">
          <!-- Fullscreen Image -->
          <img :src="image" alt="Fullscreen" class="max-w-[90%] max-h-[400px] mx-auto  " />
          <!-- Close Button -->
           <img src="@/assets/images/close.svg"  @click="closeDialog" class="absolute cursor-pointer -top-20 right-5 text-white text-4xl" alt="">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isDialogOpen: false,
      };
    },
    methods: {
      openDialog() {
        this.isDialogOpen = true;
      },
      closeDialog() {
        this.isDialogOpen = false;
      },
    },
  };
  </script>
  