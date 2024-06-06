<script setup>
import { ref } from 'vue'

const emit = defineEmits(['onClickRemove'])

defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number
})

const isClose = ref(false)
</script>

<template>
  <div
    class="relative flex flex-col w-full border border-slate-100 rounded-xl mb-5 p-4 cursor-pointer transition hover:shadow-xl"
  >
    <div class="flex items-center justify-between mb-5">
      <img :src="imageUrl" class="w-1/3 h-fit mr-5" alt="Sneaker" />
      <div class="text-xs">
        <p class="mb-2">{{ title }}</p>

        <div class="flex justify-between items-center">
          <span class="font-bold">{{ price }} $</span>
          <img
            class="opacity-40 hover:opacity-100"
            @click="emit('onClickRemove')"
            src="/close.svg"
            alt="Close"
          />
        </div>
      </div>
    </div>
  </div>
</template>
