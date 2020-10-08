<template>
    <div class="store-shelf">
        <shelf-title :title="shelfCategory.title">
        </shelf-title>
        <scroll :top="0"
                class="store-shelf-scroll-wrapper"
                :bottom="scrollBottom"
                ref="scroll"
                v-if="ifShowList"
                @onScroll="onScroll">
            <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
        </scroll>
        <div class="store-shelf-empty-view" v-else>
            {{$t('shelf.groupNone')}}
        </div>
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
        computed:{
            ifShowList(){
                return this.shelfCategory.itemList&&this.shelfCategory.itemList.length>0
            }
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
            this.getCategoryList(this.$route.query.title)
            this.setCurrentType(2)
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
        .store-shelf-scroll-wrapper{
            position: absolute;
            left: 0;
            top: 0;
            z-index: 101;
        }
        .store-shelf-empty-view{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            font-size: px2rem(14);
            color: #333;
            @include center
        }
    }
</style>