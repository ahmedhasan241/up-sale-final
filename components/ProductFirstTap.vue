<script setup>
defineProps({
  card: Object,
  selected: String|Number
});
</script>

<template>
<div>
  <div class="flex flex-row align-middle justify-start gap-4 mb-4">
    <h2 class="font-almarai text-[16px] font-semibold leading-[19.2px] text-right my-auto">
      {{ selected.name_ar }}
    </h2>
    <span class="number-purchases">


        <Icon name="ic:twotone-local-fire-department" class="icon" />
     

      <span class="purchase-info text-xs">
        تم شراءه <span class="purchase-count">{{ selected.number_of_purchases }}</span> مره
      </span>
    </span>
    <span class="number-stock">
      <span class="purchase-info text-xs">
        المتبقى <span class="purchase-count">{{ selected.stock }}</span> 
      </span>
    </span>
  </div>
  <div
      v-if="selected.description"
      class="description"
      v-html="selected.description"
  ></div>
  <div class="mt-4 flex justify-center" v-else>
    <h2 class="text-lg text-black text-bold">لا يوجد تفاصيل</h2>
  </div>
</div>
</template>

<style scoped>
.number-stock {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  color: rgb(170, 3, 3);
  padding: 4px 8px;
  background-color: rgba(128, 128, 128, 0.138);
  border-radius: 8px;
}
.number-purchases  {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  color: rgb(11, 134, 81);
  padding: 4px 8px;
  background-color: rgba(11, 134, 81, 0.138);
  border-radius: 8px;
}
.number-purchases .icon {
  font-size: 20px;
}

</style>