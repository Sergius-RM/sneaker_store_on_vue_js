<script setup>
import { onMounted, inject, reactive, watch, ref } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(`https://fda4c2beb25a7a80.mokky.dev/favorites`)
    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
})
</script>
<template>
  <div class="mb-10">
    <h1 class="text-3xl font-bold">Избранное</h1>
  </div>
  <CardList :items="favorites" is-favorites />
</template>
