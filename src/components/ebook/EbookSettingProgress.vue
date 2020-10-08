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
                           @change="onProgressChange($event.target.value)"
                           @input="onProgressInput($event.target.value)"
                           :value="progress"
                           :disabled="!bookAvailable"
                           ref="progress">
                    <div class="progress-icon-wrapper" @click="nextSection()">
                        <span class="icon-forward"></span>
                    </div>
                </div>
                <div class="text-wrapper">
                    <span class="progress-section-text">{{getSectionName}}</span>
                    <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
                </div>
            </div>
        </div>
</template>

<script>
    import { ebookMixin } from "../../utils/mixin.js";

    export default {
        mixins:[ebookMixin],
        data(){
            return{

            }
        },
        methods:{
            //拖动进度条结束后触发的事件
            onProgressChange(progress){
                this.setProgress(progress).then(()=>{
                    this.displayProgress()
                    this.updateProgressBg()
                })
            },
            //拖动进度条时的事件
            onProgressInput(progress){
                this.setProgress(progress).then(()=>{
                    this.updateProgressBg()
                })
            },
            //渲染进度条对应的cfi
            displayProgress() {
                const cfi = this.currentBook.locations.cfiFromPercentage(this.progress/100);
                //console.log(cfi);
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
                //console.log(sectionInfo)
                if(sectionInfo&&sectionInfo.href){
                    this.display(sectionInfo.href)
                }
            }
        },
        updated() {
            //初始化时设置进度条的背景颜色
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
        z-index: 190;
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
                    /*-webkit-appearance: none--覆盖默认样式*/
                    -webkit-appearance: none;
                    height: px2rem(2);
                    max-width: 0 px2rem(10);
                    &:focus {
                        outline: none;
                    }
                    /*小手柄的样式*/
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
