import Vue from 'vue'
import router from './router'
import store from './store'
import i18n from './lang/index.js'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
//import './mock'
import './utils/boost'
import './utils/create-api'
import App from './App'


let vm=new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
})
vm.$mount('#app')