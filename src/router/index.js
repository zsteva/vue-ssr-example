import Vue from 'vue';
import Router from 'vue-router';
import About from '../pages/about.vue';
import Home from '../pages/home.vue';

Vue.use(Router);

export function createRouter () {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: Home,
                name: 'home'
            },
            {
                path: '/about',
                component: About,
                name: 'about'
            },
        ]
    });
};
