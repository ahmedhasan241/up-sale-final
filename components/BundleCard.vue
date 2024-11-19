<template>
    <div class="relative  cursor-pointer">
        <Card
        class="p-2 !w-full !h-[98%] mt-1 !relative !rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg"

        @click="toggleOverlay(bundle)"
      >
        <!-- Card Content -->
        <template #header>
          <div class="w-full h-20 mb-2 card-image relative">
            <img
              class="w-full mx-auto object-contain"
              alt="product image"
              :src="bundle.cover"
            />
          </div>
        </template>
      
        <template #title>
          <div class="!h-12 flex flex-col justify-start text-start gap-1">
            <h2 class="text-black text-[12px] font-normal leading-[14.4px] tracking[-0.02em]">
              {{ bundle.name_ar }}
            </h2>
            <h2 class="text-[10px] font-normal leading-[12px] text-[#6B6B6B]">
              {{ truncateText(bundle.description, 30) }}
            </h2>
          </div>
        </template>
      
        <template #content>
          <div class="flex flex-row gap-2 mt-1 !h-4">
            <p class="font-almarai text-[14px] font-bold leading-[14.4px]">
              {{ bundle.price }}
              <span class="font-almarai text-[10px] font-bold leading-[9.6px]">ر.س</span>
            </p>
            <p
              v-if="bundle.price_before_discount"
              class="font-almarai text-[12px] font-medium leading-[14.4px] line-through text-gray-500"
            >
              {{ bundle.price_before_discount }}
              <span class="font-almarai text-[8px] font-medium leading-[9.6px]">ر.س</span>
            </p>
          </div>
        </template>
      
        <!-- Overlay for Selected Card -->

      </Card>
      
  
      <!-- Overlay div, shown when the card is clicked -->

      <div
      v-if="isBundleSelected(bundle)" 
      class="absolute top-0 left-0 w-full h-full background-overlay    flex items-center justify-center rounded-lg  "
         @click="toggleOverlay(bundle)"
    >

    </div>
      <div
        v-if="isOverlayVisible"
        class="absolute top-0 left-0 w-full h-full background-overlay flex flex-col gap-2  items-center justify-center rounded-lg"
      >

      <img   class="w-28 h-24"    v-if="addedSuccessfully" src="../assets/images/success.svg" alt="">
        <button
          @click="selectBundle(bundle)"
          v-if="!addedSuccessfully"
          class="bg-white flex  gap-2  items-center justify-center text-black  py-2 rounded-lg w-[120px]  text-[12px] font-normal leading-[14.4px] tracking-[-0.02em] hover:bg-gray-200"
        >
        <Icon
        name="material-symbols:shopping-cart-outline"
        class="w-4 h-4"
      />
          <span>اضافة للسله</span>
       
        </button>

        <v-dialog
        v-model="isDialogVisible" 
               v-if="!addedSuccessfully"
        transition="dialog-top-transition"
        max-width="500px"
        min-height="450px"
        class="dialog-contain"
      >
        <!-- Activator Slot -->
        <template v-slot:activator="{ props: activatorProps }">
          <button
            v-bind="activatorProps"
            class="bg-white flex gap-1 items-center justify-center text-black  py-2 rounded-lg w-[120px] text-[12px] font-normal leading-[14.4px] tracking-[-0.02em] hover:bg-gray-200"
            @click="openDialog" 
          >
            <Icon name="clarity:eye-show-line" class="w-4 h-4" />
            <span>عرض التفاصيل</span>
          </button>
        </template>
  
        <!-- Dialog Content -->
        <template v-slot:default="{ isActive }">
          <v-card>
        
            <div class="cover-contain"  >
            <v-container             v-if="bundle?.slider && bundle?.slider?.length > 0">
 
                <v-carousel
    
                  v-model="currentSlide"
                  hide-delimiters
                  :continuous="true"
                  :show-arrows="false"
                  class="custom-carousel "
                >
            
                  <v-carousel-item
                    v-for="(card, index) in bundle?.slider"
                    :key="index"
                    class="!min-h-full"
                  >
                    <v-img :src="card" class="mx-auto image-width" alt="" />
                  </v-carousel-item>
                </v-carousel>
            
       
                <div class="pagination-container">
                  <span
                    v-for="(card, index) in bundle?.slider"
                    :key="index"
                    @click="currentSlide = index"
                    :class="['pagination-dot', { active: currentSlide === index }]"
                  ></span>
                </div>
              </v-container>
         
                <img
                v-else
               :src="bundle?.cover"
               class="image-cover "
               alt=""
             />
       
              </div>
              
              <div class="bundle-info">
                <h2 class="bundle-title">
                    {{bundle?.name_ar}}
                </h2>
                <p class="bundle-desc">
                    {{ bundle?.description }}
                </p>
              </div>       
   
          
    
   
                <div  class="bundle-price-contain">
                    <h2 class="bundle-price">
                        <span> {{bundle?.price}} </span> <span> ر.س </span>
                    </h2>
                <h2 class="bundle-price-before">
                 <span> {{bundle?.price_before_discount}} </span> <span> ر.س </span>
                </h2>
                <button @click="addBundle(bundle)" class="btn-add-bundle">
                    اضف الى السله
                </button>
              </div>
        
          </v-card>
        </template>
      </v-dialog>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const currentSlide = ref(0)
  // Define props
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper-bundle.css'
  import { Pagination } from 'swiper/modules'
  const props = defineProps({
    bundle: Object,
    selectedBundles: Array,
    toggleSelectBundle: Function,
  });

  const isBundleSelected = (bundle) => {
  return props.selectedBundles.some(item => item.id === bundle.id);
};
  const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
  // State to manage the overlay visibility
  const isOverlayVisible = ref(false);
  const isSelected = ref(false);
  const addedSuccessfully = ref(false);
  watch(isOverlayVisible, (newValue) => {
  if (newValue === true ) {
    setTimeout(() => {
      if (isDialogVisible.value === false) {
        isOverlayVisible.value = false; // Set it back to false after 2 seconds
      }
  
    }, 2000); // 2 seconds
  }
});




  const isDialogVisible = ref(false);

// Function to open the dialog
const openDialog = () => {
  isDialogVisible.value = true;
};

// Function to close the dialog
const addBundle = (bundle) => {
  isDialogVisible.value = false;
        isOverlayVisible.value = false;
        props.toggleSelectBundle(bundle); 
        isSelected.value = true

  
};
  // Function to toggle the overlay on card click
  const toggleOverlay = (bundle) => {
    if(isSelected.value === false) {
        isOverlayVisible.value = true;
    } else {
        props.toggleSelectBundle(bundle); 
        isSelected.value = false
        addedSuccessfully.value = false;
    }
  
  };
  

  const selectBundle = (bundle) => {
  // Show the "added successfully" message immediately
  addedSuccessfully.value = true;

  // Delay the following actions by 3 seconds (3000 milliseconds)
  setTimeout(() => {
    props.toggleSelectBundle(bundle); 
    isOverlayVisible.value = false; 
    isSelected.value = true;
  }, 1000);
};
  
  </script>
  
  <style scoped>

.cover-contain {
    max-width: 100% !important;
    max-height: 100px !important;
    min-height: 96px !important;
    max-height: 120px !important;
    display: flex;
    justify-content: center;
    background: rgba(241, 241, 241, 1);
padding: 8px !important;
border-radius: 4px ;
margin: 0 20px !important;
}
.cover-contain  .image-cover {
 
    height: 96px !important;
    object-fit: cover !important;
    margin: 0 auto !important;
    
}

.bundle-info {

    direction: ltr !important;
    margin: 12px 20px !important;
}
.bundle-info .bundle-title {
 
    font-size: 16px;
    font-weight: 700;
    line-height: 19.2px;
    letter-spacing: -0.02em;
    text-align: right;
    
}
.bundle-info .bundle-desc{
    color: rgba(107, 107, 107, 1);

    font-size: 12px;
    font-weight: 700;
    line-height: 19.2px;
    text-align: right;

    margin:  12px  0 !important;
    
    
}
.bundle-price-contain {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    padding: 12px 20px !important;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.15);

    width: 100% !important
}
.bundle-price-contain  .bundle-price{
    color: black;
    font-size: 14px;
    font-weight: 700;
    line-height: 16.8px;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
    gap: 4px;
}
.bundle-price-contain  .bundle-price-before{
    color: rgba(140, 140, 140, 1);
    text-decoration: line-through;
    font-size: 14px;
    font-weight: 400;
    line-height: 19.6px;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
    gap: 4px;
    
}
.bundle-price-contain  .btn-add-bundle{
 
    background-color: black;
    color: white;
    cursor: pointer;
    width: 100% !important;    
    background: rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);

    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
padding: 8px ;

border-radius: 8px ;


}

  .background-overlay {

    background-color: rgba(0, 0, 0, 0.3) !important;
  }

  .v-card {
    border-radius: 16px !important;
    padding: 20px 0 0 0 !important;
  }

  /* Carousel container customization */
 .custom-carousel {
    height: 100% !important;
    object-fit: cover !important;
    padding: 0px;
    background: rgba(241, 241, 241, 1);
    border-radius: 6px !important;
  
  }
  
  /* Pagination dots outside the carousel */
   .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
  @media (max-width: 500px) {
   
      .v-container {
        width: 100%;
        padding: 0px !important;
        margin-right: auto;
        margin-left: auto;
    }
  
  }
   .pagination-dot {
    width: 8px;
    height: 8px;
    margin: 0 6px;
    border-radius: 50%;
    background: rgba(217, 217, 217, 1);
  
    cursor: pointer;
  }
  
    .pagination-dot.active {
    background: rgba(0, 0, 0, 1);
    }
    
  </style>
  