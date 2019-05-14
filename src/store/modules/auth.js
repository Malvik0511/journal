import RequestApi from "../../modules/requestApi";
import { roles } from "../../modules/constant"
/**
 * Фильтры рейсов
 */
const state = {
    //авторизованный пользователь
    auth:{
        user: null
    },
};

const mutations = {
    // комит авторизации
    SET_USER_AUTH(state, val) {
        state.auth.user =  val;
    },
    // комит логаута
    SET_USER_UNAUTH(state) {
        state.auth.user = null;
    }
};

const getters = {
    // текущий авторизованный пользователь
    authUser: state => {
        return state.auth.user;
    },
    // проверка аторизованного пользователя на админа
    authUserIsAdmin: state => {
        return state.auth.user && state.auth.user.role === roles.ADMIN;
    },
};

const actions = {
    logIn({ commit }, params) {
        const url = 'user/login';
        return RequestApi.request({body: params, additional: {url, showErr: true}})
            .then(user => commit("SET_USER_AUTH", user))
    },

    LogOut({ commit }) {
        const url = 'user/logout';
        return RequestApi.request({ additional: {url} })
            .then(user => commit("SET_USER_UNAUTH", user))
    },
    //получает пользователя из сессии
    getSessionUser({ commit }) {
        const url = 'user/current';
        const method = 'GET';
        return RequestApi.request({body: {}, additional: {url, method}})
            .then(user => commit("SET_USER_AUTH", user));
    },
};

export default {
    state,
    mutations,
    getters,
    actions
};