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
export default {
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookSettingFontPopup
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
</style>