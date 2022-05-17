<template>
    <ul>
        <li v-for="book in books">{{book.name}}</li>
    </ul>
</template>

<script>
    export default {
        name: 'BookList',
        props: {
            books: {
                type: Array,
                required: true
            }
        },
    };
</script>
