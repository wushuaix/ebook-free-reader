<template>
    <div class="ebook-bookmark" ref="ebookBookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" :style="isFixed?fixedStyle:{}">
            <book-mark :color="color" :width="15" :height="35" ref="bookmark"></book-mark>
        </div>
    </div>
</template>

<script>
    import BookMark from "../common/BookMark";
    import {realPx} from "../../utils/utils";
    import {ebookMixin} from "../../utils/mixin";
    import {getBookmark,saveBookmark} from "../../utils/localStorage";

    const BLUE='#346cbc';
    const WHITE='#fff';
    export default {
        mixins:[ebookMixin],
        data(){
            return{
                text:'',
                color:WHITE,
                isFixed:false
            }
        },
        components:{
            BookMark
        },
        watch:{
            offsetY(v){
                if(!this.bookAvailable||this.menuVisible||this.settingVisible>=0){
                   return
                }
                if(v>=this.height&&v<this.threshold){
                    this.setIsBookmark(false);
                    //状态2:未到达临界状态
                    this.beforeThreshold(v)
                }else if(v>=this.threshold){
                    //状态3:超越临界状态
                    this.afterThreshold(v)
                }else if(v>0&&v<this.height){
                    //状态1:
                    this.beforeHeight()
                }else if(v===0){
                    this.restore()
                }
            },
            isBookmark(isBookmark){
                this.isFixed=isBookmark
                if(isBookmark){
                    this.color=BLUE
                }else{
                    this.color=WHITE;
                }
            }
        },
        computed:{
            height() {
                return realPx(35)
            },
            threshold() {
                return realPx(55)
            },
            fixedStyle(){
                return {
                    position:'fixed',
                    top:0,
                    right:`${(window.innerWidth-this.$refs.ebookBookmark.clientWidth)/2}px`
                }
            }
        },
        methods:{
            removeBookmark(){
                const currentLocation = this.currentBook.rendition.currentLocation()
                const cfi = currentLocation.start.cfi
                this.bookmark=getBookmark(this.fileName)
                if (this.bookmark) {
                    this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
                    saveBookmark(this.fileName, this.bookmark)
                }
                this.setIsBookmark(false)
            },
            addBookmark(){
                this.bookmark=getBookmark(this.fileName);
                if(!this.bookmark){
                    this.bookmark=[]
                }
                const currentLocation=this.currentBook.rendition.currentLocation();
                //epubcfi(/6/12[x_item5]!/4/2/12/1:0)
                const cfibase=currentLocation.start.cfi.replace(/!.*/,'')
                const cfistart=currentLocation.start.cfi.replace(/.*!/,'').replace(/\)$/,'')
                const cfiend=currentLocation.end.cfi.replace(/.*!/,'').replace(/\)$/,'')
                const cfirange=`${cfibase}!,${cfistart},${cfiend})`;
                this.currentBook.getRange(cfirange).then(range=>{
                    const text=range.toString().replace(/\s\s/g,'')
                    this.bookmark.push({
                        cfi:currentLocation.start.cfi,
                        text:text
                    })
                    this.setIsBookmark(true)
                    saveBookmark(this.fileName,this.bookmark)
                })
            },
            //状态4:归位
            restore(){
                setTimeout(()=>{
                    this.$refs.ebookBookmark.style.top=`${-this.height}px`
                    this.$refs.iconDown.style.transform='rotate(0deg)'
                },200)
                if(this.isFixed){
                    this.setIsBookmark(true)
                    this.addBookmark()
                }else{
                    this.setIsBookmark(false)
                    this.removeBookmark()
                }
            },
            //状态3:超越临界状态
            afterThreshold(v){
                this.$refs.ebookBookmark.style.top=`${-v}px`;
                if(this.isBookmark){
                    this.text=this.$t('book.releaseDeleteMark');
                    this.color=WHITE;
                    this.isFixed=false
                }else{
                    this.text=this.$t('book.releaseAddMark');
                    this.color=BLUE;
                    this.isFixed=true
                }
                this.text=this.$t('book.releaseAddMark');
                this.color=BLUE;
                const iconDown=this.$refs.iconDown;
                if (iconDown.style.transform===''||
                    iconDown.style.transform==='rotate(0deg)'){
                    iconDown.style.transform='rotate(180deg)'
                }
                this.isFixed=true
            },
            //状态2:未到达临界状态
            beforeThreshold(v){
                this.$refs.ebookBookmark.style.top=`${-v}px`;
                this.beforeHeight()
                const iconDown=this.$refs.iconDown;
                if (iconDown.style.transform==='rotate(180deg)'){
                    iconDown.style.transform='rotate(0deg)'
                }
            },
            //状态1:未超过书签的高度
            beforeHeight(){
                if(this.isBookmark){
                    this.text=this.$t('book.pulldownDeleteMark');
                    this.color=BLUE;
                    this.isFixed=true
                }else{
                    this.text=this.$t('book.pulldownAddMark');
                    this.color=WHITE;
                    this.isFixed=false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global.scss";
    .ebook-bookmark{
        position: absolute;
        top: px2rem(-35);
        left: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(35);
        .ebook-bookmark-text-wrapper{
            position: absolute;
            display: flex;
            bottom: 0;
            right: px2rem(45);
            .ebook-bookmark-down-wrapper{
                font-size: px2rem(14);
                color: white;
                transition: all 0.2s linear;
                @include center;
            }
            .ebook-bookmark-text{
                font-size: px2rem(14);
                color: white;
            }
        }
        .ebook-bookmark-icon-wrapper{
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: px2rem(15);
        }
    }
</style>