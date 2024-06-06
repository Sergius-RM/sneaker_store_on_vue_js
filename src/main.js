import './assets/main.css'

import {
    createApp
} from 'vue'
import {
    autoAnimatePlugin
} from '@formkit/auto-animate/vue'
import {
    createRouter,
    createWebHistory
} from 'vue-router'
import App from './App.vue'

// создаем переменную ждя гененрации приложения
const app = createApp(App)

import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'

const routes = [{
        path: '/',
        name: Home,
        component: Home
    },
    {
        path: '/favorites',
        name: Favorites,
        component: Favorites
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// через эту переменную подключаем другие библиотеки и генерируем приложение
app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')