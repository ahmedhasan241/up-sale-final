<template>
  <div v-if="visible" style="width: 200px;background: #000;" class="text-center fixed top-5 right-5 max-w-xs bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500" :class="{'opacity-0': !visible}">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 3000, // Default display time (3 seconds)
  },
});

const visible = ref(false);

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
});
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
}
</style>
