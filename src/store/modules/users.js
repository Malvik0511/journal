import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //текущие фильтры
    userList:[]
};

const mutations = {
    SET_USER_LIST(state, val) {
        state.userList =  val;
    },

    CLEAR_USER_LIST (state) {
        state.userList = [];
    }
};

const getters = {
    // текущий фильтр задержки рейса
    userList: state => {
        return state.userList;
    },

    userById: state => id => {
        return state.userList.find(user => user._id === id)
    }
};

const actions = {
    getUserList({ commit }) {
        const url = 'users';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(users => commit("SET_USER_LIST", users));
    },

    addUser({ dispatch }, params) {
        const url = 'users/add';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(users => dispatch("getUserList", users));
    },

    delUser({ dispatch }, params) {
        const url = 'users/del';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(users => dispatch("getUserList", users));
    },

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