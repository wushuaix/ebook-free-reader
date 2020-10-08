import Vue from 'vue'
import VueRouter from 'vue-router'
import EbookIndex from './views/ebook/index.vue'
import EBookReader from './components/ebook/EbookReader.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/store'
    },
    {
        path: '/ebook',
        component: EbookIndex,
        children: [{
            path: ':fileName',
            component: EBookReader
        }]
    },
    {
        path: '/store',
        component: () =>
            import ('./views/store/index.vue'),
        redirect: '/store/shelf',
        children: [{
                path: 'home',
                component: () =>
                    import ('./views/store/StoreHome.vue'),
                meta: {
                    keepAlive: true // true 表示需要使用缓存, false表示不需要被缓存
                }
            },
            {
                path: 'list',
                component: () =>
                    import ('./views/store/StoreList.vue')
            },
            {
                path: 'detail',
                component: () =>
                    import ('./views/store/StoreDetail.vue')
            },
            {
                path: 'shelf',
                component: () =>
                    import ('./views/store/StoreShelf.vue')
            },
            {
                path: 'category',
                component: () =>
                    import ('./views/store/StoreCategory.vue')
            },
            {
                path: 'speaking',
                component: () =>
                    import ('./views/store/StoreSpeaking.vue')
            }
        ]
    },

]

const router = new VueRouter({
    routes
})

export default router