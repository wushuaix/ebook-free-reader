<template>
    <transition name="fade">
        <div class="slide-content-wrapper" v-show="settingVisible===3 && menuVisible">
            <transition name="slide-right">
                <!--  加v-if可以使动画流畅显示出来,transition动画具有叠加效果-->
                <div class="content" v-if="settingVisible===3">
                    <div class="content-page-wrapper" v-if="bookAvailable">
                        <div class="content-page">
                            <component :is="currentTab===1?content:bookmark"></component>
                        </div>
                        <div class="content-page-tab">
                            <div class="content-page-tab-item"
                                 :class="{'selected':currentTab===1}"
                                 @click="selectTab(1)"
                            >
                                {{$t('book.navigation')}}
                            </div>
                            <div class="content-page-tab-item"
                                 @click="selectTab(2)"
                                 :class="{'selected':currentTab===2}"
                            >
                                {{$t('book.bookmark')}}
                            </div>
                        </div>
                    </div>
                    <div class="content-empty" v-else>
                        <ebook-loading></ebook-loading>
                    </div>
                </div>
            </transition>
            <div class="content-bg" @click="hide()"></div>
        </div>
    </transition>
</template>

<script>
    import {ebookMixin} from "../../utils/mixin";
    import EbookSlideContents from "./EbookSlideContents";
    import EbookBookmark from './EbookSlideBookmark';
    import EbookLoading from "./EbookLoading"
    export default {
        mixins:[ebookMixin],
        components:{
            EbookLoading
        },
        data(){
            return{
                currentTab:1,
                content:EbookSlideContents,
                bookmark:EbookBookmark
            }
        },
        methods:{
            hide(){
                this.hideTitleAndMenu()
            },
            selectTab(key){
                this.currentTab=key
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global.scss";
    .slide-content-wrapper{
        position:absolute;
        top:0;
        left: 0;
        z-index: 350;
        width: 100%;
        height: 100%;
        display: flex;
        .content{
            flex:0 0 85%;
            width: 85%;
            height: 100%;
            .content-page-wrapper{
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                .content-page{
                    flex:1;
                    width:100%;
                    overflow: hidden;
                };
                .content-page-tab{
                    display: flex;
                    flex:0 0 px2rem(48);
                    width: 100%;
                    height: px2rem(48);
                    .content-page-tab-item {
                        width: 50%;
                        font-size: px2rem(16);
                        @include center;
                    }
                };
            }
            .content-empty{
                width: 100%;
                height: 100%;
                @include center
            }
        };
        .content-bg{
            flex:0 0 15%;
            width: 15%;
            height: 100%;
        }
    };
</style>
