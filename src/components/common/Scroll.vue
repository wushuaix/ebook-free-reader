<template>
    <div class="scroll-wrapper"
         :class="{'no-scroll': ifNoScroll}"
         @scroll.passive="handleScroll"
         ref="scrollWrapper"
    >
        <slot></slot>
    </div>
</template>

<script>
    import { realPx } from '../../utils/utils'

    export default {
        props: {
            top: {
                type: Number,
                default: 0
            },
            bottom: {
                type: Number,
                default: 0
            },
            ifNoScroll: {
                type: Boolean,
                default: false
            },
            initPosition: {
                type: Object,
                default: () => {
                    return {
                        x: 0,
                        y: 0
                    }
                }
            }
        },
        methods: {
            handleScroll(e) {
                //获取页面滚动的距离:滚动条顶部到页面顶部的这段距离
                const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
                this.$emit('onScroll', offsetY)
            },
            scrollTo(x, y) {
                this.$refs.scrollWrapper.scrollTo(x, y)
            },
            //重新计算滚动条的高度
            refresh() {
                if (this.$refs.scrollWrapper) {
                    //window.innerHeight返回窗口的文档高度(不包含滚动条),window.innerWidth返回窗口文档的宽度(包含滚动条)
                    this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px'
                    this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
                }
            }
        },
        mounted() {
            this.refresh()
            this.$nextTick(() => {
                setTimeout(() => {
                    this.scrollTo(realPx(this.initPosition.x), realPx(this.initPosition.y))
                }, 1)
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";

    .scroll-wrapper {
        position: relative;
        z-index: 100;
        width: 100%;
        overflow-x:hidden;
        overflow-y:scroll;
        /*-webkit-overflow-scrolling:touch:解决移动端卡顿问题*/
        -webkit-overflow-scrolling:touch;
        &::-webkit-scrollbar{
            display:none
        }
        &.no-scroll {
            overflow: hidden;
        }
    }
</style>
