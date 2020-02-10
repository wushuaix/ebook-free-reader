import Vue from 'vue'
import VueRouter from 'vue-router'
import EbookIndex from './views/ebook/index.vue'
import EBookReader from './components/ebook/EbookReader.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/ebook'
    },
    {
        path: '/ebook',
        component: EbookIndex,
        children: [{
            path: ':fileName',
            component: EBookReader
        }]
    }
]

const router = new VueRouter({
    routes
})

export default router