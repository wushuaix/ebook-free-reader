<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>
<script>
    import Epub from "epubjs";
    import { ebookMixin } from "../../untils/mixin.js";
    import {saveFontFamily,
        getFontFamily,
        getFontSize,
        saveFontSize,
        getTheme,
        saveTheme,
        getLocation
    }
        from "../../untils/localStorage.js";
    import {flatten} from "../../untils/book";
    global.ePub = Epub;
    export default {
        mixins: [ebookMixin],
        methods: {
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
                let defaultTheme=getTheme(this.fileName);
                if(!defaultTheme){
                    defaultTheme=this.themeList[0].name;
                    this.setDefaultTheme(defaultTheme);
                    saveTheme(this.fileName,defaultTheme)
                }
                this.themeList.forEach(theme=>{
                    this.rendition.themes.register(theme.name,theme.style)
                });
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
                    method: "default"
                });
                //本地存储获取电子书的名称
                const location=getLocation(this.fileName);
                //对电子书的主题\字体\字号\全局样式\读取进度进行渲染显示
                this.display(location,()=>{
                    this.initTheme();
                    this.initFontFamily();
                    this.initFontSize();
                    this.initGlobalStyle(this.defaultTheme);
                    this.refreshLocation()
                });
                //采用rendition中的钩子函数注册全局样式; hooks:Adds Hook methods to the Rendition prototype
                this.rendition.hooks.content.register(contents=>{
                    Promise.all([ contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)])
                        .then()
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
            initEpub() {
                const url = process.env.VUE_APP_RES_URL+"/epub/" + this.fileName + ".epub";
                this.book = new Epub(url);
                this.setCurrentBook(this.book);
                this.initRendition();
                this.initGesture();
                this.parseBook();
                this.book.ready.then(()=>{
                    //locations:Find Locations for a Book; locations.generate:Load all of sections
                    // in the book to generate locations
                   //参数:chars` **int** how many chars to split on,Return: **[object]** locations
                    return this.book.locations.generate(750*(window.innerWidth/
                        375)*(getFontSize(this.fileName)/16))
                }).then(locations=>{
                    // console.log(locations)
                    this.setBookAvailable(true);
                    //分页完成后调用refreshLocation(),显示电子书刷新后的进度值
                    this.refreshLocation()
                });
            }
        },
        //页面元素挂载时通过路由设置this.fileName
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
