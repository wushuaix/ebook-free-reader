<template>
    <div class="store-shelf">
        <shelf-title :title="$t('shelf.title')" class="shelf-title"></shelf-title>
        <scroll :top="0"
                class="store-shelf-scroll-wrapper"
                :bottom="scrollBottom"
                ref="scroll"
                @onScroll="onScroll">
            <shelf-search></shelf-search>
            <shelf-list :data="shelfList"></shelf-list>
        </scroll>
        <shelf-footer></shelf-footer>
    </div>
</template>

<script>
    import ShelfTitle from "../../components/shelf/ShelfTitle";
    import {storeShelfMixin} from "../../utils/mixin";
    import Scroll from "../../components/common/Scroll";
    import ShelfSearch from "../../components/shelf/ShelfSearch";
    import ShelfList from "../../components/shelf/ShelfList";
    import ShelfFooter from "../../components/shelf/ShelfFooter";


    export default {
        mixins:[storeShelfMixin],
        components:{
            ShelfTitle,
            Scroll,
            ShelfSearch,
            ShelfList,
            ShelfFooter
        },
        data(){
            return{
                scrollBottom:0
            }
        },
        watch:{
            isEditMode(isEditMode){
                this.scrollBottom=isEditMode?48:0
                this.$nextTick(()=>this.$refs.scroll.refresh())
            }
        },
        methods:{
            onScroll(offsetY){
                this.setOffsetY(offsetY)
            }
        },
        mounted() {
            this.getShelfList()
            this.setShelfCategory([])
            this.setCurrentType(1)
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";
    .store-shelf{
        z-index: 100;
        width: 100%;
        height: 100%;
        background: white;
        .shelf.title{
            position: absolute;
            left: 0;
            top: 0;
            z-index: 102;
        }
        .store-shelf-scroll-wrapper{
            position: absolute;
            left: 0;
            top: 0;
            z-index: 101;
        }
    }
</style>