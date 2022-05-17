<template>
    <div id="app">
        <div class="main">
            <h1>{{title}}</h1>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'App',

        metaInfo: {
            meta: [
                { charset: 'utf-8' },
            ]
        },

        computed: {
            ...mapGetters({
                title: 'title',
            })
        },
    };
</script>


<style lang=scss scoped>

@import './assets/style.scss';

@import './assets/color.scss';


</style>
