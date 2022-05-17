import api from '../api';

export const getUsers = ({ commit }) => 
        api.getUsers()
            .then(response => commit('setUsers', response.data));

export const getBooks = ({ commit }) =>
        api.getBooks()
            .then(response => commit('setBooks', response.data));

