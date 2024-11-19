<script setup>
const props = defineProps({
  card: Object,
  selected: String|Number
});

const calculateDiscount = (price, priceBeforeDiscount) => {
  const priceNum = parseFloat(price);
  const priceBeforeDiscountNum = parseFloat(priceBeforeDiscount);

  if (!priceBeforeDiscountNum || priceBeforeDiscountNum <= priceNum) return 0;

  return Math.round(((priceBeforeDiscountNum - priceNum) / priceBeforeDiscountNum) * 100);
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
</script>

<template>
  <Card
      :class="{
              'border-black border-[2px] bg-white  scale-110': selected === card.id, // Highlight selected card
              'border-white border-[2px] bg-white opacity-30': selected !== card.id, // Default card styling
            }"
      class="cursor-pointer p-2 !w-[180px]  mt-2  !h-[180px] card-shadow   !rounded-lg  product-card"
  >
    <template #header>
      <div class="w-full h-[96px] mb-2 card-image relative">
                <span
                    class="discount-badge"
                    v-if="calculateDiscount(card.price, card.price_before_discount)"
                >
                  خصم
                  {{ calculateDiscount(card.price, card.price_before_discount) }}%
                </span>
        <img
            class=" h-full mx-auto object-contain"
            alt="product image"
            :src="card.cover"
        />
      </div>
    </template>
    <template #title>
      <div class=" flex flex-row justify-between">
        <h2  class="font-almarai text-[14px] font-normal leading-[22.4px] text-right">{{ truncateText(card.name_ar, 25) }}</h2>
        <div class="flex flex-row gap-1 items-center">
          <h1 class="font-almarai text-[8px] font-bold leading-[9.6px]">{{card.avg_rating}}</h1>
          <Icon name="material-symbols:kid-star-sharp" class="w-[10px] h-[10px]"/>

        </div>
      </div>
    </template>
    <template #content>
      <div class="flex flex-row gap-2">
        <p class="product-price font-bold">{{ card.price }} ريال</p>
        <p
            v-if="card.price_before_discount"
            class="product-price line-through text-gray-500"
        >
          {{ card.price_before_discount }} ريال
        </p>
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">

</style>