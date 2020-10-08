import { mapGetters, mapActions } from 'vuex'
import {addCss, removeAllCss,getReadTimeByMinute,themeList} from "./book";
import {getBookmark, saveLocation,getBookShelf, saveBookShelf} from "./localStorage"
import {shelf} from "../api/store";
import {appendAddToShelf,computedId,removeAddFromShelf} from "./store";

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
        },
        getSectionName(){
            if(this.section){
                //获取章节信息
                const sectionInfo=this.currentBook.section(this.section);
                if (sectionInfo&&sectionInfo.href&&this.currentBook&&this.currentBook.navigation
                    &&this.currentBook.navigation.get(sectionInfo.href)) {
                    //获取章节的名字
                    return this.currentBook.navigation.get(sectionInfo.href).label
                }
            }
            return ''
            // return this.section?this.navigation[this.section][0].label:''
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
                if(currentLocation&&currentLocation.start){
                    //currentLocation()返回对象中有start对象,start对象中cfi属性,记录电子书中的位置
                    const startCfi=currentLocation.start.cfi;
                    //locations.percentageFromCfi:Get a percentage position in locations from an EpubCFI,Returns [number]
                    const progress=this.currentBook.locations.percentageFromCfi(startCfi);
                    //设置刷新后的进度值
                    this.setProgress(Math.floor(progress*100));
                    //设置刷新后的章节值
                    this.setSection(currentLocation.start.index);
                    //本地持久化存储刷新后的值
                    saveLocation(this.fileName,startCfi);
                    const bookmark=getBookmark(this.fileName)
                    if(bookmark){
                        if(bookmark.some(item=>item.cfi===startCfi)){
                            this.setIsBookmark(true)
                        }else{
                            this.setIsBookmark(false)
                        }
                    }else{
                        this.setIsBookmark(false)
                    }
                    if(this.pagelist){
                        const totalPage=this.pagelist.length;
                        const currentPage=currentLocation.start.location;
                        if(currentPage&&currentPage>0){
                            this.setPaginate(currentPage+'/'+totalPage)
                        }else{
                            this.setPaginate('')
                        }
                    }else{
                        this.setPaginate('')
                    }
                }
        },
        //此函数用于渲染当前电子书
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
        },
        hideTitleAndMenu(){
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
            this.setFontFamilyVisible(false)
        },
        getReadTimeText(){
            return this.$t('book.haveRead').replace('$1',getReadTimeByMinute(this.fileName))
        }
    }
}

export const storeHomeMixin={
    computed: {
        ...mapGetters([
            'offsetY',
            'hotSearchOffsetY',
            'flapCardVisible'])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible']),
        showBookDetail(book){
            this.$router.push({
                path:'/store/detail',
                query:{
                   fileName:book.fileName,
                   category:book.categoryText
                }
            })
        }
    }
}

export const storeShelfMixin={
    computed:{
        ...mapGetters([
            'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible',
            'offsetY',
            'shelfCategory',
            'currentType'
        ])
    },
    methods:{
        ...mapActions([
            'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible',
            'setOffsetY',
            'setShelfCategory',
            'setCurrentType'
        ]),
        getCategoryList(title){
            this.getShelfList().then(()=>{
                const categoryList=this.shelfList.filter(book=>
                    book.type===2&&book.title===title)[0]
                this.setShelfCategory(categoryList)
            })
        },
        getShelfList(){
            let shelfList=getBookShelf()
            if(!shelfList){
                shelf().then(response=>{
                    if(response.status===200&&response.data&&response.data.bookList){
                        shelfList=appendAddToShelf(response.data.bookList)
                        saveBookShelf(shelfList)
                        return this.setShelfList(shelfList)
                    }
                })
            }else{
                return this.setShelfList(shelfList)
            }
        },
        moveOutOfGroup(f){
            this.setShelfList(this.shelfList.map(book=>{
                if (book.type===2&&book.itemList){
                    book.itemList=book.itemList.filter(subBook=>!subBook.selected)
                }
                return book
            })).then(()=>{
                const list=computedId(appendAddToShelf([].concat
                (removeAddFromShelf(this.shelfList),...this.shelfSelected)))
                this.setShelfList(list).then(()=>{
                    this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
                    if(f) f()
                })
            })
        }
    }
}

