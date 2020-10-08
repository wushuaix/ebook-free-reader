<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>
<script>
import EbookReader from "../../components/ebook/EbookReader.vue";
import EbookTitle from "../../components/ebook/EbookTitle.vue";
import EbookMenu from "../../components/ebook/EbookMenu.vue";
import EbookBookmark from "../../components/ebook/EbookBookmark";
import {getReadTime, saveReadTime} from "../../utils/localStorage";
import {ebookMixin} from "../../utils/mixin";
import EbookHeader from "../../components/ebook/EbookHeader";
import EbookFooter from "../../components/ebook/EbookFooter";

export default {
  mixins:[ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  mounted(){
    this.startLoopReadTime()
  },
  beforeDestroy(){
    if(this.task){
      clearInterval(this.task)
    }
  },
  methods:{
    startLoopReadTime(){
      let readTime=getReadTime(this.fileName);
      if(!readTime){
        readTime=0
      }
      this.task=setInterval(()=>{
        readTime++
        if(readTime%30===0){
          saveReadTime(this.fileName,readTime)
        }
      },1000)
    },
    move(v){
      this.$refs.ebook.style.top=v+'px'
    },
    restore(){
      this.$refs.ebook.style.top=0;
      this.$refs.ebook.style.transition="all 0.2s linear"
      //需要在动画执行完毕后清除动画,否则会造成后续下拉动作不流畅
      setTimeout(()=>{
        this.$refs.ebook.style.transition=''
      },200)
    }
  },
  watch:{
    //监听鼠标或者手势移动的值
    offsetY(v){
      if(!this.menuVisible&&this.bookAvailable){
        if(v>0){
          this.move(v)
        }else if(v===0){
          this.restore()
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
  .ebook{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>
