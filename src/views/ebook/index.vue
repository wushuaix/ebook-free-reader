<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-setting-font-popup></ebook-setting-font-popup>
  </div>
</template>
<script>
import EbookReader from "../../components/ebook/EbookReader.vue";
import EbookTitle from "../../components/ebook/EbookTitle.vue";
import EbookMenu from "../../components/ebook/EbookMenu.vue";
import EbookSettingFontPopup from '../../components/ebook/EbookSettingFontPopup.vue'
import {getReadTime, saveReadTime} from "../../untils/localStorage";
import {ebookMixin} from "../../untils/mixin";

export default {
  mixins:[ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookSettingFontPopup
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
</style>
