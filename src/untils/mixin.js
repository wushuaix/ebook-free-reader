import { mapGetters, mapActions } from 'vuex'
import { themeList } from "./book.js";
import {addCss, removeAllCss} from "./book";
import {saveLocation} from "./localStorage"

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark'
        ]),
        themeList(){
            return themeList(this)
        }
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark'
        ]),
        //此函数根据当前设置的字体,用于添加全局主题
        initGlobalStyle(){
            removeAllCss()
            switch(this.defaultTheme){
                case 'Default':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
                    break;
                case 'Gold':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
                    break;
                case 'Eye':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
                    break;
                case 'Night':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
                    break;
                default:
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
            }
        },

        //此函数用于保存文章刷新后的进度
        refreshLocation(){
            //currentLocation：Get the Current Location object
            const currentLocation=this.currentBook.rendition.currentLocation();
            //currentLocation()返回对象中有start对象,start对象中cfi属性,记录电子书中的位置
            const startCfi=currentLocation.start.cfi;
            //locations.percentageFromCfi:Get a percentage position in locations from an EpubCFI,Returns [number]
            const progress=this.currentBook.locations.percentageFromCfi(startCfi);
            //设置刷新后的进度值
            this.setProgress(Math.floor(progress*100));
            //设置刷新后的章节值
            this.setSection(currentLocation.start.index);
            //本地持久化存储刷新后的值
            saveLocation(this.fileName,startCfi)
        },
        //此函数用于渲染当前电子书,rendition.display函数:Display a point in the book.The request will be added
        // to the rendering Queue,so it will wait until book is opened, rendering started and all other rendering
        //  tasks have finished to be called.
        // **Parameters**
        // - `target` **[string]
        // Returns **[Promise]
        display(target,cb){
            if(target){
                return this.currentBook.rendition.display(target).then(()=>{
                    //渲染书籍后读取本地存储的值,刷新当前书籍的读取进度,如果有回调函数,执行当前回调函数
                    this.refreshLocation()
                    if(cb) cb()
                })
            }else{
                return this.currentBook.rendition.display().then(()=>{
                    this.refreshLocation()
                })
            }
        }
    }
}
