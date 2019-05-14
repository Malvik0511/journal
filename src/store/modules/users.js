import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //список пользователей
    userList:[]
};

const mutations = {
    //установка списка пользователей
    SET_USER_LIST(state, val) {
        state.userList =  val;
    },
    //чистка списка пользователей
    CLEAR_USER_LIST (state) {
        state.userList = [];
    }
};

const getters = {
    // список пользователей
    userList: state => {
        return state.userList;
    },
    // пользователь по id
    userById: state => id => {
        return state.userList.find(user => user._id === id)
    }
};

const actions = {
    //получить поьзователей
    getUserList({ commit }) {
        const url = 'users';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(users => commit("SET_USER_LIST", users));
    },
    //добавить пользователя
    addUser({ dispatch }, params) {
        const url = 'users/add';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(users => dispatch("getUserList", users));
    },
    //удалить пользователя
    delUser({ dispatch }, params) {
        const url = 'users/del';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(users => dispatch("getUserList", users));
    },
    //редактировать пользователя
    editUser({ dispatch }, params) {
        const url = 'users/edit';
        return RequestApi.request({ body: params, additional: { url,  showErr: true }})
            .then(users => dispatch("getUserList", users));
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};