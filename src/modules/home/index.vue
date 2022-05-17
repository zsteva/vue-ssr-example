<template>
    <div>        
        <router-link to="/about">Go to About page</router-link>
        <users-list :users="users"></users-list>
        <books-list :books="books"></books-list>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import UsersList from './components/users-list/index.vue';
    import BooksList from './components/books-list/index.vue';

    export default {
        name: 'Home',

        metaInfo: {
            title: 'Vue SSR Simple Setup Home',
            meta: [
                { name: 'description', content: 'Home page description' }
            ]
        },

        components: {
            UsersList,
            BooksList,
        },

        computed: {
            ...mapGetters({
                users: 'users',
                books: 'books',
            })
        },

        // Server-side only
        // This will be called by the server renderer automatically
        serverPrefetch () {
            // return the Promise from the action
            // so that the component waits before rendering
            return this.getUsers()
                .then(() => {
                    return this.getBooks();
                });
        },

        // Client-side only
        mounted () {
            // If we didn't already do it on the server, we fetch the users
            if (!this.users.length) {
                this.getUsers();
            }
            if (!this.books.length) {
                this.getBooks();
            }
        },

        methods: {
            getUsers () {
                return this.$store.dispatch('getUsers');
            },
            getBooks() {
                return this.$store.dispatch('getBooks');
            }
        }
    };
</script>
