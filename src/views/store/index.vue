<template>
    <div class="store">
<!--        include里面是组件的名字,非路由名称-->
        <keep-alive include="StoreHome">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";
    .store{
        width: 100%;
        height: 100%;
        background: white;
    }
</style>