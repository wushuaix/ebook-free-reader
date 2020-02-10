<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>
<script>
import Epub from "epubjs";
import { ebookMixin } from "../../untils/mixin.js";
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
        this.hideTitleAndMenu();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
        this.hideTitleAndMenu();
      }
    },
    toggleShowTitleAndMenu() {
      if (this.setMenuVisible) {
        this.setSettingVisible(-1);
      }
      this.setMenuVisible(!this.menuVisible);
      this.setFontFamilyVisible(false);
    },
    hideTitleAndMenu() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    initEpub() {
      const url = "http://192.168.1.5:5000/epub/" + this.fileName + ".epub";
      console.log(url);
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        method: "default"
      });
      this.rendition.display();
      //注册屏幕触控事件
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleShowTitleAndMenu();
        }
        event.preventDefault();
        event.stopPropagation();
      });
      this.rendition.hooks.content.register(contents=>{
        Promise.all([ contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                      contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                      contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)])
               .then(()=>{})
       
      })
    }
  },
  mounted() {
    this.setFileName(this.$route.params.fileName.split("|").join("/")).then(
      () => {
        this.initEpub();
      }
    );
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
</style>