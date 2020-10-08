<template>
      <div class="store-home">
        <search-bar></search-bar>
        <flap-card :data="random"></flap-card>
        <keep-alive>
          <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll" id='mainContent'>
          <div class="banner-wrapper">
            <img class="banner-img" :src="banner" :style="{backgroundImg:`url('${banner}')`}"/>
          </div>
          <guess-you-like :data="guessYouLike"></guess-you-like>
          <recommend :data="recommend" :class="recommend"></recommend>
          <featured :data="featured" :class="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
          <div class="category-list-wrapper"
              v-for="(item,index) in categoryList"
              :key="index">
            <category-book :data="item"></category-book>
          </div>
          <category :data="categories" class="category"></category>
        </scroll>
        </keep-alive>
        
      </div> 
</template>

<script>
    import SearchBar from "../../components/home/SearchBar";
    import Scroll from "../../components/common/Scroll";
    import {storeHomeMixin} from "../../utils/mixin";
    import FlapCard from "../../components/home/FlapCard";
    import {home} from "../../api/store"
    import GuessYouLike from "../../components/home/GuessYouLike";
    import Recommend from "../../components/home/Recommend";
    import Featured from "../../components/home/Featured";
    import CategoryBook from "../../components/home/CategoryBook";
    import Category from "../../components/home/Category";

    export default {
        name: "docMng", //为了保存这个路由状态
        activated() {
      　　// keep-alive组件 页面进入的时候设置滚动高度
          document.getElementById("mainContent").scrollTop = this.offsetTop;
        },
      //   deactivated() {
      //     //keep-alive 组件停用时调用（简单理解为组件离开的时候）。
      //     // 获取页面滚动高度，这个钩子有可能会拿不到数据，因为这个钩子执行的慢，可以用beforeRouteLeave代替
      // 　　this.offsetTop = document.getElementById("mainContent").scrollTop?document.getElementById("mainContent").scrollTop:'';
      //   }, 
      　beforeRouteLeave(to, from, next) {
          // 组件离开的时候，获取页面滚动高度 
          this.offsetTop = document.getElementById('mainContent').scrollTop||'';
          next() 
      }, 
        mixins:[storeHomeMixin],
        data(){
            return{
                scrollTop:94,
                random:null,
                banner: '',
                guessYouLike:null,
                recommend:null,
                featured:null,
                categoryList: null,
                categories: null,
                offsetTop: "" //获取滚动位置，下次进来的时候，设置滚动高度为这个值
            }
        },
        components:{
            SearchBar,
            Scroll,
            FlapCard,
            GuessYouLike,
            Recommend,
            Featured,
            CategoryBook,
            Category
        },
        methods:{
            onScroll(offsetY){
                this.setOffsetY(offsetY)
                if (offsetY>0){
                    this.scrollTop=52;
                }else{
                    this.scrollTop=94
                }
                this.$refs.scroll.refresh()
            }
        },
        mounted() {
            home().then(response=>{
                if(response&&response.status===200){
                    const data=response.data
                    const randomIndex=Math.floor(Math.random()*data.random.length)
                    this.random=data.random[randomIndex]
                    this.banner=data.banner
                    this.guessYouLike=data.guessYouLike
                    this.recommend=data.recommend
                    this.featured=data.featured
                    this.categoryList=data.categoryList
                    this.categories=data.categories
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .store-home{
    width: 100%;
    height: 100%;
    .banner-wrapper{
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img{
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend{
      margin: px2rem(20) 0;
    }
    .featured{
      margin: px2rem(20) 0;
    }
    .category-list-wrapper{
      margin: px2rem(20) 0;
    }
  }
</style>