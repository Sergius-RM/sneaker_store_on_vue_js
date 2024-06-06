<script setup>
import { onMounted, inject, reactive, watch, ref } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')

// создаем переменную для массива данных items, реактивные
const items = ref([]) // ref превращает любую переменную в объект --{ value: [] }

/* Filters START */
// группирование переменных
const filters = reactive({
  sortBy: 'title', // базово выводим по список по названию
  searchQuery: ''
})

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}
const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 500)
/* Filters END */

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

/* Favorite START */
const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://fda4c2beb25a7a80.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })

    // console.log(items.value)
  } catch (err) {
    console.log(err)
  }
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
        item
      }
      item.isFavorite = true
      const { data } = await axios.post(`https://fda4c2beb25a7a80.mokky.dev/favorites`, obj)
      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://fda4c2beb25a7a80.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }
    const { data } = await axios.get(`https://fda4c2beb25a7a80.mokky.dev/items`, { params })

    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))
  } catch (err) {
    console.log(err)
  }
}
/* Favorite END */

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})
// сортировка по парамтерам
watch(filters, fetchItems)

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})
</script>

<template>
  <div class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-bold">Все кроссовки</h1>

    <div class="flex items-center gap-4">
      <select
        @change="onChangeSelect"
        class="py-2 px-3 border border-gray-200 focus:border-gray-400 rounded-md focus:outline-none"
      >
        <option value="title">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>
      <div class="relative">
        <input
          @input="onChangeSearchInput"
          type="text"
          class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/search.svg" />
        </div>
      </div>
    </div>
  </div>

  <CardList :items="items" @addToFavorite="addToFavorite" @addToCart="onClickAddPlus" />
</template>
