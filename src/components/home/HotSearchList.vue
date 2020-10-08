<template>
    <transition name="hot-search-move">
        <scroll class="hot-search-wrapper"
                :top="52"
                @onScroll="onScroll"
                ref="scroll">
            <hot-search
                    :label="$t('home.hotSearch')"
                    :btn="$t('home.change')"
                    :hotSearch="searchList.hotSearch">
            </hot-search>
            <div class="line"></div>
            <hot-search
                    :label="$t('home.historySearch')"
                    :btn="$t('home.clear')"
                    :hotSearch="searchList.historySearch">
            </hot-search>
        </scroll>
    </transition>
</template>

<script>
    import HotSearch from "./HotSearch";
    import {storeHomeMixin} from '../../utils/mixin';
    import Scroll from "../common/Scroll";
    export default {
        mixins:[storeHomeMixin],
        data(){
            return{
                searchList:{
                    hotSearch:[
                        {
                            type:1,
                            text:'Office365',
                            num:'1.8万'
                        },
                        {
                            type:1,
                            text:'ProGit',
                            num:'1.1万'
                        },
                        {
                            type:1,
                            text:'TeachingToleranceInAGlobalized',
                            num:'1.3万'
                        },
                        {
                            type:1,
                            text:'Corporate Data Quality',
                            num:'1.4万'
                        },
                        {
                            type:1,
                            text:'Verrechnungspreise',
                            num:'4.4万'
                        },

                    ],
                    historySearch:[
                        {
                            type:2,
                            text:'Computer Science'
                        },
                        {
                            type:1,
                            text:'Building the Infrastructure for Cloud Security'
                        },
                        {
                            type:2,
                            text:'ePub'
                        },
                        {
                            type:2,
                            text:'api'
                        },
                        {
                            type:2,
                            text:'vue'
                        },
                        {
                            type:2,
                            text:'Java'
                        },
                        {
                            type:1,
                            text:'ComputerVisionMetrics'
                        },
                        {
                            type:2,
                            text:'Environment'
                        },
                        {
                            type:2,
                            text:'python'
                        },
                        {
                            type:2,
                            text:'HTML5'
                        },
                        {
                            type:1,
                            text:'Office365'
                        },

                    ]
                }

            }
        },
        components:{
            HotSearch,
            Scroll
        },
        methods:{
            onScroll(offsetY){
                this.setHotSearchOffsetY(offsetY)
            },
            reset(){
                this.$refs.scroll.scrollTo(0,0)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";
    .hot-search-wrapper{
        width: 100%;
        height: 100%;
        background: white;
        .line{
            width: 100%;
            height: 0;
            border-top:px2rem(1) solid #eee;
            margin: px2rem(10) 0;
        }
    }
</style>