import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/', // should be set based on env
});

const getUsers = () => instance.get('/users');

const getBooks = () => instance.get('/books');

export default {
    getUsers,
    getBooks
};

