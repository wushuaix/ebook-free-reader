//将px转化为rem
export function px2rem(px) {
    const ratio = 375 / 10
    return px / ratio
}
//根据当前rem缩放比例计算当前真实的像素
export function realPx(px) {
    const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
    return px * (maxWidth / 375)
}
