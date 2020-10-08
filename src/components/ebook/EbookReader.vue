<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="ebook-reader-mask"
             @click="onMaskClick"
             @touchmove="move"
             @touchend="moveEnd"
             @mousedown.left="onMouseEnter"
             @mousemove.left="onMouseMove"
             @mouseup.left="onMouseEnd"
        ></div>
    </div>
</template>
<script>
    import Epub from "epubjs";
    import { ebookMixin } from "../../utils/mixin.js";
    import {saveFontFamily,
        getFontFamily,
        getFontSize,
        saveFontSize,
        getTheme,
        saveTheme,
        getLocation
    }
        from "../../utils/localStorage.js";
    import {flatten} from "../../utils/book";
    import {getLocalForage} from "../../utils/localForage";
    global.ePub = Epub;
    export default {
        mixins: [ebookMixin],
        methods: {
            //1-鼠标进入
            //2-鼠标机内后的移动
            //3-鼠标从移动状态松手
            //4-鼠标还原
            onMouseEnter(e){
                this.mouseState=1;
                this.mouseStartTime=e.timeStamp;
                e.preventDefault();
                e.stopPropagation()
            },
            onMouseMove(e){
                if(this.mouseState===1){
                    this.mouseState=2
                }else if(this.mouseState===2){
                    let offsetY=0;
                    if(this.firstOffsetY){
                        offsetY=e.clientY-this.firstOffsetY;
                        this.setOffsetY(offsetY)
                    }else{
                        this.firstOffsetY=e.clientY
                    }
                }
                e.preventDefault();
                e.stopPropagation()
            },
            onMouseEnd(e){
                if(this.mouseState===2){
                    this.setOffsetY(0);
                    this.firstOffsetY=null;
                    this.mouseState=3
                }else{
                    this.mouseState=4
                }
                const time=e.timeStamp-this.mouseStartTime
                if(time<200){
                    this.mouseState=4
                }
                e.preventDefault();
                e.stopPropagation()
            },
            move(e){
                let offsetY=0;
                if(this.firstOffsetY){
                    offsetY=e.changedTouches[0].clientY-this.firstOffsetY;
                    this.setOffsetY(offsetY)
                }else{
                    this.firstOffsetY=e.changedTouches[0].clientY
                }
                e.preventDefault();
                e.stopPropagation()
            },
            moveEnd(e){
                this.setOffsetY(0);
                this.firstOffsetY=null;
            },
            onMaskClick(e){
                if(this.mouseState&&(this.mouseState===2||this.mouseState===3)){
                    return
                }
                const offsetX=e.offsetX;
                const width=window.innerWidth;
                if(offsetX>0&&offsetX<width*0.3){
                    this.prevPage()
                }else if(offsetX>0&&offsetX>width*0.7){
                    this.nextPage()
                }else{
                    this.toggleShowTitleAndMenu()
                }
            },
            //rendition.prev(): Go to the next "page" in the rendition，返回一个Promise对象
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev().then(()=>{
                        this.refreshLocation()
                    });
                    this.hideTitleAndMenu();
                }
            },
            //rendition.next(): Go to the previous "page" in the rendition，返回一个Promise对象
            nextPage() {
                if (this.rendition) {
                    this.rendition.next().then(()=>{
                        this.refreshLocation()
                    });
                    this.hideTitleAndMenu();
                }
            },
            //此函数用于点击电子书页面切换标题和菜单栏的显示与否
            toggleShowTitleAndMenu() {
                if (this.setMenuVisible) {
                    this.setSettingVisible(-1);
                }
                this.setMenuVisible(!this.menuVisible);
                this.setFontFamilyVisible(false);
            },
            //此函数用于渲染服务器拿到的电子书
            //初始化手势操作
            initGesture(){
                this.rendition.on("touchstart", event => {
                    this.touchStartX = event.changedTouches[0].clientX;
                    this.touchStartTime = event.timeStamp;
                });
                this.rendition.on('touchend', event => {
                    const offsetX = event.changedTouches[0].clientX - this.touchStartX
                    const time = event.timeStamp - this.touchStartTime
                    if (time < 500 && offsetX > 40) {
                        this.prevPage()
                    } else if (time < 500 && offsetX < -40) {
                        this.nextPage()
                    } else {
                        this.toggleShowTitleAndMenu()
                    }
                    event.preventDefault()
                    event.stopPropagation()
                })
            },
            //初始化主题
            initTheme(){
                //从localStorage中读取主题数据
                let defaultTheme=getTheme(this.fileName);
                //判断是否能取到localStorage中的主题
                if(!defaultTheme){
                    defaultTheme=this.themeList[0].name;
                    saveTheme(this.fileName,defaultTheme)
                }
                //保存到Vuex中
                this.setDefaultTheme(defaultTheme);
                //注册主题
                this.themeList.forEach(theme=>{
                    this.rendition.themes.register(theme.name,theme.style)
                });
                //设置主题
                this.rendition.themes.select(defaultTheme)
            },
            //初始化字体
            initFontFamily(){
                let font=getFontFamily(this.fileName);
                if(!font){
                    saveFontFamily(this.fileName,this.defaultFontFamily)
                }else{
                    this.rendition.themes.font(font);
                    this.setDefaultFontFamily(font)
                }
            },
            //初始化字号
            initFontSize(){
                let fontSize=getFontSize(this.fileName);
                if(!fontSize){
                    saveFontSize(this.fileName,this.defaultFontSize)
                }else{
                    this.rendition.themes.fontSize(fontSize);
                    this.setDefaultFontSize(fontSize)
                }
            },
            initRendition(){
                //book.renderTo:Sugar to render a book to an element,return:rendition
                this.rendition = this.book.renderTo("read", {
                    width: innerWidth,
                    height: innerHeight,
                    method: "default",
                    //flow:'scrolled'表示一直拖动页面显示
                });
                //本地存储获取电子书的名称
                const location=getLocation(this.fileName);
                //对电子书的主题\字体\字号\全局样式\读取进度进行渲染显示
                this.display(location,()=>{
                    this.initFontFamily();
                    this.initFontSize();
                    this.refreshLocation()
                });
                //采用rendition中的钩子函数注册web字体
                this.rendition.hooks.content.register(contents=>{
                    Promise.all([
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)])
                })
            },
            //解析电子书封面链接和基本信息
            parseBook(){
                this.book.loaded.cover.then(cover=>{
                    //this.book.archive:处理从Epub文档中解压缩请求文件的操作,createUrl:从未归档项创建Url
                    if(cover){
                        this.book.archive.createUrl(cover).then(url=>{
                            this.setCover(url);
                        })
                    }
                });
                this.book.loaded.metadata.then(metadata=>{
                    this.setMetadata(metadata)
                });
                this.book.loaded.navigation.then(nav=>{
                    const navItem=flatten(nav.toc);
                    //console.log(navItem)

                    function find(item,level=0) {
                        return !item.parent?level:find(navItem.filter(parentItem=>
                            parentItem.id===item.parent)[0],++level)
                    }
                    navItem.forEach(item=>{
                        item.level=find(item)
                    })
                    this.setNavigation(navItem)
                })
            },
            //初始化电子书
            initEpub(url) {
                this.book = new Epub(url);
                this.setCurrentBook(this.book);
                this.initRendition();
                this.initGesture();
                this.parseBook();
                this.book.ready.then(()=>{
                    //locations:Find Locations for a Book; locations.generate:Load all of sections
                    // in the book to generate locations
                    //参数:chars` **int** how many chars to split on,Return: **[object]** locations
                    //分页算法，获取分页信息后，bookAvaiable设置为true
                    return this.book.locations.generate(750*(window.innerWidth/
                        375)*(getFontSize(this.fileName)/16))
                }).then(locations=>{
                    this.navigation.forEach(item=>{
                        item.pagelist=[]
                    });
                    locations.forEach(item=>{
                        const loc=item.match(/\[(.*)\]!/)[1];
                        this.navigation.forEach(nav=>{
                            if(nav.href){
                                const href=nav.href.match(/^(.*)\.html$/)[1];
                                if(href===loc){
                                    nav.pagelist.push(item)
                                }
                            }
                        });
                        let currentPage=1;
                        this.navigation.forEach((nav,index)=>{
                            if(index===0){
                                nav.page=1
                            }else{
                                nav.page=currentPage
                            }
                            currentPage+=nav.pagelist.length+1
                        })
                    });
                    this.setPagelist(locations)
                    this.setBookAvailable(true);
                    //分页完成后调用refreshLocation(),显示电子书刷新后的进度值
                    this.refreshLocation()
                });
            }
        },
        //页面元素挂载时通过路由设置this.fileName
        mounted() {
            const books=this.$route.params.fileName.split('|')
            const fileName=books[1]
            getLocalForage(fileName,(err,blob)=>{
                if(!err&&blob){
                    this.setFileName(books.join('/')).then(()=>{
                        this.initEpub(blob)
                    })
                }else {
                    this.setFileName(this.$route.params.fileName.split("|").join("/")).then(
                        () => {
                            const url = process.env.VUE_APP_EPUB_URL+"/" + this.fileName + ".epub";
                            this.initEpub(url);
                            this.initTheme()
                            this.initGlobalStyle()
                        }
                    );
                }
            })
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/global.scss";
    .ebook-reader{
        width:100%;
        hight:100%;
        overflow: hidden;
        .ebook-reader-mask{
            position: absolute;
            z-index: 150;
            top:0;
            left: 0;
            background: transparent;
            width: 100%;
            height: 100%;
        }
    }
</style>
