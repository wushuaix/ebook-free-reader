const book = {
    state: {
        fileName: '',
        menuVisible: false,
        settingVisible: -1, //-1:不显示，0：字号，1、主题，2：进度，3：目录
        defaultFontSize: 16,
        currentBook: null,
        defaultFontFamily: "Default",
        fontFamilyVisible: false,
    },
    mutations: {
        'SET_FILENAME': (state, fileName) => {
            state.fileName = fileName
        },
        'SET_MENUVISIBLE': (state, menuVisible) => {
            state.menuVisible = menuVisible
        },
        'SET_SETTINGVISIBLE': (state, settingVisible) => {
            state.settingVisible = settingVisible
        },
        'SET_DEFAULTFONTSIZE': (state, defaultFontSize) => {
            state.defaultFontSize = defaultFontSize
        },
        'SET_CURRENTBOOK': (state, currentBook) => {
            state.currentBook = currentBook
        },
        'SET_DEFAULTFONTFAMILY': (state, defaultFontFamily) => {
            state.defaultFontFamily = defaultFontFamily
        },
        'SET_FONTFAMILYVISIBLE': (state, fontFamilyVisible) => {
            state.fontFamilyVisible = fontFamilyVisible
        },
    }
}
export default book