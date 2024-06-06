<script setup>
import { ref, watch, provide, computed } from 'vue'
import axios from 'axios'

import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

/* Cart START */
const cart = ref([])

const drawerOpen = ref(false)

const isCreatingOrders = ref(false)

const cartEmpty = computed(() => cart.value.length === 0)

const cartButtonDisabled = computed(() => isCreatingOrders.value || cartEmpty.value)

const closeDrawer = () => {
  drawerOpen.value = false
}
const openDrawer = () => {
  drawerOpen.value = true
}

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))

const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}
const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const createOrder = async () => {
  try {
    isCreatingOrders.value = true
    const { data } = await axios.post(`https://fda4c2beb25a7a80.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: totalPrice.value
    })
    cart.value = []
    return data
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrders.value = false
  }
}

// сохраняем добавленные в корзину товары в localStorage, чтобы они не пропадали при перезагрузке страницы
watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})
/* Cart END */
</script>

<template>
  <Drawer
    v-if="drawerOpen"
    :totalPrice="totalPrice"
    :vatPrice="vatPrice"
    @createOrder="createOrder"
    :buttonDisabled="cartButtonDisabled"
  />

  <div class="bg-white w-3/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20">
    <Header :totalPrice="totalPrice" @openDrawer="openDrawer" />

    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
