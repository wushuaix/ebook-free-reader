<template>
    <div class="store">
        <keep-alive>
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