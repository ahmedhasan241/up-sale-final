<template>
  <div class="gift-card-wrapper relative">
    <!-- Lock Overlay -->
    <div v-if="isDisabled" class="background-overlay-gift">
      <div
        class="lock-icon absolute top-3 right-3 h-4 md:!h-6 w-4 md:!w-6 rounded-full bg-gray-200 bg-opacity-50 flex items-center justify-center"
      >
        <Icon name="material-symbols:lock-outline-sharp" class="!text-white text-[10px] md:!text-[14px]" />
      </div>
    </div>

    <!-- Card Content -->
    <Card
      class="cursor-pointer p-2 h-full !w-full !rounded-lg transition-all duration-300 hover:shadow-lg card-shadow-gift"
      @click="toggleOverlay(gift)"
    >
      <!-- Card Header -->
      <template #header>
        <div class="w-full gift-image-card h-24 mb-2 relative card-image">
          <span
            v-if="discount > 0"
            class="discount-badge absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full"
          >
            خصم {{ discount }}%
          </span>
          <img class="object-contain h-full mx-auto" :alt="gift.name_ar" :src="gift.image" />
        </div>
      </template>

      <!-- Card Title -->
      <template #title>
        <div class="flex flex-col gap-2">
          <h2
            class="text-black font-almarai text-[14px] font-medium leading-[14.4px] tracking[-0.02em] text-center"
          >
            {{ gift.name_ar }}
          </h2>
          <div class="flex flex-row justify-center gap-2 mt-1 !h-4">
            <p class="font-almarai text-[12px] font-bold">
              <span>{{ gift.price }}</span>
              <span class="text-[10px] mx-1">ر.س</span>
            </p>
            <p
              v-if="gift.price_before_discount"
              class="font-almarai text-[12px] text-gray-400 font-bold line-through"
            >
              <span>{{ gift.price_before_discount }}</span>
              <span class="text-[10px] mx-1">ر.س</span>
            </p>
          </div>
        </div>
      </template>
    </Card>

    <div
    v-if="selectedGifts.some((item) => item.id === gift.id)" 
    class="absolute top-0 left-0 w-full h-full background-overlay  cursor-pointer   flex items-center justify-center rounded-lg  "
       @click="toggleOverlay(gift)"
  >

  </div>
    <!-- Overlay for Selected Card -->
    <div
      v-if="isOverlayVisible"
      class="absolute top-0 left-0 w-full h-full background-overlay flex flex-col gap-2 items-center justify-center rounded-lg"
    >
      <img v-if="addedSuccessfully" class="w-28 h-24" src="../assets/images/success.svg" alt="" />
      <button
        v-if="!addedSuccessfully"
        @click="selectGift(gift)"
        class="bg-white flex gap-2 items-center justify-center text-black py-2 rounded-lg w-[120px] text-[12px] font-normal leading-[14.4px] tracking-[-0.02em] hover:bg-gray-200"
      >
        <Icon name="material-symbols:shopping-cart-outline" class="w-4 h-4" />
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

              <img
         
             :src="gift?.image"
             class="image-cover "
             alt=""
           />
     
            </div>
            
            <div class="gift-info">
              <h2 class="gift-title">
                  {{gift?.name_ar}}
              </h2>
              <p class="gift-desc">
                  {{ gift?.description }}
              </p>
            </div>       
 
        
  
 
              <div  class="gift-price-contain">
                  <h2 class="gift-price">
                      <span> {{gift?.price}} </span> <span> ر.س </span>
                  </h2>
              <h2 class="gift-price-before">
               <span> {{gift?.price_before_discount}} </span> <span> ر.س </span>
              </h2>
              <button @click="addGift(gift)" class="btn-add-gift">
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

// Props
const props = defineProps({
  gift: {
    type: Object,
    required: true,
  },
  toggleSelectGifts:{
    type:Function,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  selectedGifts: {
    type: Array,
  }
});



// Reactive States
const isOverlayVisible = ref(false);
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


// const isGiftManuallySelected = ref(false);

// Computed property for gift selection
// const giftSelected = computed(() => {
//   if (isGiftManuallySelected.value === false && props.selectedGifts.some((item) => item.id !== props.gift.id) ) return false;
//   return props.selectedGifts.some((item) => item.id === props.gift.id);
// });

// Watcher for selectedGifts
watch(
  () => props.selectedGifts, // Watch the selectedGifts array directly
  (newSelectedGifts) => {
    if (newSelectedGifts.length === 0) {
      isOverlayVisible.value = false;
      addedSuccessfully.value = false;
      isDialogVisible.value = false;
      // isGiftManuallySelected.value = false; // Reset manual selection
    }
  },
  { deep: true } // Ensure deep watching for array changes
);
// Computed property for discount percentage
const discount = computed(() => {
  if (
    props.gift.price_before_discount &&
    props.gift.price &&
    props.gift.price_before_discount > props.gift.price
  ) {
    const discountValue =
      ((props.gift.price_before_discount - props.gift.price) / props.gift.price_before_discount) * 100;
    return Math.round(discountValue); // Return rounded percentage
  }
  return 0; // No discount if conditions are not met
});

// Toggle Overlay
const toggleOverlay = (gift) => {
  if (!props.isSelected) {
    isOverlayVisible.value = true;
  } else {
    props.toggleSelectGifts(gift); 

    addedSuccessfully.value = false;
  }
};
const addGift = (gift) => {
  isDialogVisible.value = false;
        isOverlayVisible.value = false;
        props.toggleSelectGifts(gift);  
};
// Handle Selection
const selectGift = (gift) => {
  addedSuccessfully.value = true;
  setTimeout(() => {
    props.toggleSelectGifts(gift);  
    isOverlayVisible.value = false;
  }, 1000);
};
</script>

<style scoped>
.gift-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.background-overlay-gift {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 8px;
}

.background-overlay {
  background-color: rgba(0, 0, 0, 0.3) !important;
  z-index: 15;
}

.lock-icon {
  z-index: 20;
}

.card-shadow-gift {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}
.gift-image-card .discount-badge {
  position: absolute;
  width: 55px;
  height: 20px;
  top: 3px;
  right: 0px;
  background-color: #000;
  color: white;
  border: 1px solid #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 5;
  font-family: "Almarai";
  font-size: 8px;
  font-weight: 400;
}

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

.gift-info {

  direction: ltr !important;
  margin: 12px 20px !important;
}
.gift-info .gift-title {

  font-size: 16px;
  font-weight: 700;
  line-height: 19.2px;
  letter-spacing: -0.02em;
  text-align: right;
  
}
.gift-info .gift-desc{
  color: rgba(107, 107, 107, 1);

  font-size: 12px;
  font-weight: 700;
  line-height: 19.2px;
  text-align: right;

  margin:  12px  0 !important;
  
  
}
.gift-price-contain {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  padding: 12px 20px !important;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.15);

  width: 100% !important
}
.gift-price-contain  .gift-price{
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
.gift-price-contain  .gift-price-before{
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
.gift-price-contain  .btn-add-gift{

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
