<template>
        <div class="setting-wrapper" v-show="menuVisible&&settingVisible===2">
            <div class="setting-progress">
                <div class="read-time-wrapper">
                    <span class="read-time-text">{{getReadTimeText()}}</span>
                    <span class="icon-forward"></span>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-icon-wrapper" @click="prevSection()">
                        <span class="icon-back"></span>
                    </div>
                    <input class="progress" type="range"
                           max="100"
                           min="0"
                           step="1"
                           @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)"
                           :value="progress"
                           :disabled="!bookAvailable"
                           ref="progress">
                    <div class="progress-icon-wrapper" @click="nextSection()">
                        <span class="icon-forward"></span>
                    </div>
                </div>
                <div class="text-wrapper">
                    <span class="progress-section-text">{{getSectionName}}</span>
                    <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
                </div>
            </div>
        </div>
</template>

<script>
    import { ebookMixin } from "../../untils/mixin.js";
    import {getReadTime} from "../../untils/localStorage";
    export default {
        mixins:[ebookMixin],
        computed:{
            getSectionName(){
                if(this.section){
                    const sectionInfo=this.currentBook.section(this.section)
                    if (sectionInfo&&sectionInfo.href) {
                        return this.currentBook.navigation.get(sectionInfo.href).label
                    }
                }
            }
        },
        data(){
            return{

            }
        },
        methods:{
            //监控阅读电子书时展示和更新进度条
            onProgressChange(progress){
                this.setProgress(progress).then(()=>{
                    this.displayProgress()
                    this.updateProgressBg()
                })
            },
            //更新显示电子书的进度条背景
            onProgressInput(progress){
                this.setProgress(progress).then(()=>{
                    this.updateProgressBg()
                })
            },
            //此函数应用于渲染当前进度条的内容,渲染结束并更新当前进度
            displayProgress() {
                const cfi = this.currentBook.locations.cfiFromPercentage(this.progress/100);
                this.display(cfi)
            },
            //用于更新进度条的样式
            updateProgressBg(){
                this.$refs.progress.style.backgroundSize=`${this.progress}% 100%`
            },
            //用于设置并渲染前一章节内容
            prevSection(){
                if(this.section>0&&this.bookAvailable){
                    this.setSection(this.section-1).then(()=>{
                        this.displaySection()
                    })
                }
            },
            //用于设置并渲染后一章节内容
            nextSection(){
                if(this.section<this.currentBook.spine.length-1&&this.bookAvailable){
                    this.setSection(this.section+1).then(()=>{
                        this.displaySection()
                    })
                }
            },
            //section: Gets a Section of the Book from the Spine,Alias for `book.spine.get`
            //渲染当前章节的内容
            displaySection(){
                const sectionInfo=this.currentBook.section(this.section);
                if(sectionInfo&&sectionInfo.href){
                    this.display(sectionInfo.href)
                }
            },
            getReadTimeText(){
                return this.$t('book.haveRead').replace('$1',this.getReadTimeByMinute())
            },
            getReadTimeByMinute(){
                const readTime=getReadTime(this.fileName)
                if(!readTime){
                    return 0
                }else{
                    return Math.ceil(readTime/60)
                }
            }
        },
        updated() {
            this.updateProgressBg()
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global.scss";
    .setting-wrapper {
        position: absolute;
        bottom: px2rem(48);
        left: 0;
        z-index: 101;
        width: 100%;
        height: px2rem(90);
        background: white;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
        .setting-progress {
            position: relative;
            width: 100%;
            height: 100%;
            .read-time-wrapper{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: px2rem(40);
                font-size: px2rem(12);
                @include center;
            };
            .progress-wrapper {
                width: 100%;
                height: 100%;
                @include center;
                padding: 0 px2rem(15);
                box-sizing: border-box;
                .progress-icon-wrapper{
                    font-size: px2rem(20);
                };
                .progress {
                    width: 100%;
                    -webkit-appearance: none;
                    height: px2rem(2);
                    max-width: 0 px2rem(10);
                    &:focus {
                        outline: none;
                    }
                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: px2rem(20);
                        width: px2rem(20);
                        border-radius: 50%;
                        background: white;
                        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
                        border: px2rem(1) solid #ddd;
                    }
                }
            }
            .text-wrapper {
                position: absolute;
                left: 0;
                bottom: px2rem(10);
                width: 100%;
                color: #333;
                font-size: px2rem(12);
                @include center;
                padding: 0 px2rem(15);
                box-sizing: border-box;
                .progress-section-text{
                    @include ellipsis;
                }
            }
        }
    }
</style>
