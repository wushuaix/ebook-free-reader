import { mapGetters, mapActions } from 'vuex'
export const ebookMixin = {
    computed: {
        ...mapGetters(["fileName",
            "menuVisible",
            "settingVisible",
            "defaultFontSize",
            "currentBook",
            "defaultFontFamily",
            "fontFamilyVisible"
        ])
    },
    methods: {
        ...mapActions(['setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setCurrentBook',
            'setDefaultFontFamily',
            'setFontFamilyVisible'
        ])
    }
}