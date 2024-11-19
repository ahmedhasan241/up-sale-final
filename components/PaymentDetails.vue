<template>
    <div class="px-2 !mb-24 rounded-lg payment-details">
      <div class="flex justify-center items-center py-4">
        <h3 class="details-title">
          تفاصيل الفاتورة
        </h3>
      </div>
      <v-divider></v-divider>
      
      <div class="!px-3">
        <div class="py-4">
          <div class="flex flex-col gap-3">
            <!-- Selected Card -->
            <div class="grid grid-cols-2">
              <div>
                <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
                  {{ selectedCardData.name_ar }}
                </h2>
              </div>
              <div class="flex justify-end">
                <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
                  {{ selectedCardData.price }} ر.س
                </h2>
              </div>
            </div>
  
            <!-- Selected Bundles -->
            <div
              v-for="bundle in selectedBundles"
              :key="bundle.id"
              class="bundles-selected"
            >
              <div class="grid grid-cols-2 bundle">
                <div class="flex justify-start items-center">
                  <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
                    {{ bundle.name_ar }}
                  </h2>
                </div>
                <div class="flex justify-end gap-2 items-center">
                  <div>
                    <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px] mr-2">
                      {{ bundle.price }} ر.س
                    </h2>
                  </div>
                  <div class="rounded-lg bg-red-100 !h-[26px] mt-2 !w-[26px] flex justify-center items-center">
                    <button
                      @click="removeBundle(bundle.id)"
                      class="text-red-600 mt-1 h-6 w-6"
                      aria-label="Remove Bundle"
                    >
                      <Icon name="material-symbols:delete-outline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Selected Gifts -->
            <div v-if="selectedGifts.length > 0 && !isDisabled">
              <div
                v-for="gift in selectedGifts"
                :key="gift.id"
                class="grid grid-cols-2 gift py-3  items-center"
              >
                <div class="flex justify-start items-center">
                  <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
                    {{ gift.name_ar }}
                  </h2>
                </div>
                <div class="flex justify-end gap-2 items-center">
                  <div v-if="gift.id !== 'has_free_shipping'" class="flex flex-col items-center gap-0">
                    <div>
                      <h2
                        v-if="gift.id !== 'has_discount'"
                        class="text-black font-almarai text-[9px] md:text-[10px] font-bold leading-[14.4px]"
                      >
                        {{ gift.price }} <span>ر.س</span>
                      </h2>
                      <h2
                        v-if="gift.id === 'has_discount'"
                        class="text-black font-almarai text-[9px] md:text-[10px] font-bold leading-[14.4px]"
                      >
                        {{ discountAmount.name }}
                      </h2>
                    </div>
                    <div v-if="gift.id !== 'has_discount'">
                      <h2 class="line-through text-gray-500 font-almarai text-[9px] md:text-[10px] font-bold leading-[14.4px]">
                        {{ gift.price_before_discount }} ر.س
                      </h2>
                    </div>
                  </div>
                  <div class="rounded-lg bg-red-100 !h-[26px] mt-2 my-auto !w-[26px] flex justify-center items-center">
                    <button @click="removeGift(gift.id)" class="text-red-600 mt-1 h-6 w-6" aria-label="Remove Gift">
                      <Icon name="material-symbols:delete-outline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Delivery Section -->
          <div>
            <div v-if="showDelivery && !selectedGifts.some(gift => gift.id === 'has_free_shipping')" class="flex flex-row justify-between pt-1 pb-[10px]">
              <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right">
                التوصيل
              </h2>
              <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right">
                {{ selectedCityData.price }} ر.س
              </h2>
            </div>
          </div>
        </div>
      </div>
  
      <v-divider></v-divider>
  
      <!-- Total Section -->
      <div v-if="!hasDiscountInGifts" class="grid grid-cols-2 px-3 py-3">
        <div>
          <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
            الإجمالى
          </h2>
        </div>
        <div class="flex justify-end">
          <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
            {{ totalOrderPrice }} ر.س
          </h2>
        </div>
      </div>
      <div v-if="hasDiscountInGifts" class="grid grid-cols-2 px-3 py-3">
        <div>
          <h2 class="text-black line-through font-almarai text-[12px] font-bold leading-[14.4px]">
            قبل الخصم
          </h2>
        </div>
        <div class="flex justify-end">
          <h2 class="text-black font-almarai line-through text-[12px] font-bold leading-[14.4px]">
            {{ totalOrderPrice }} ر.س
          </h2>
        </div>
      </div>
      <div v-if="hasDiscountInGifts" class="grid grid-cols-2 px-3 py-3">
        <div>
          <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
            بعد الخصم
          </h2>
        </div>
        <div class="flex justify-end">
          <h2 class="text-black font-almarai text-[12px] font-bold leading-[14.4px]">
            {{ totalOrderPriceAfterDiscount }} ر.س
          </h2>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentDetails',
    props: {
      selectedCardData: Object,
      selectedBundles: Array,
      selectedGifts: Array,
      discountAmount: Object,
      selectedCityData: Object,
      totalOrderPrice: Number,
      totalOrderPriceAfterDiscount:Number,
      hasDiscountInGifts: Boolean,
      showDelivery: Boolean,
      isDisabled: Boolean,
      removeBundle: Function,
      removeGift: Function
    }
  }
  </script>

  <style scoped>
.dialog-contain {
    direction: rtl !important;
}
</style>
  