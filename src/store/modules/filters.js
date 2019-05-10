/**
 * Фильтры рейсов
 */
const state = {
    //текущие фильтры
    filters:{
        distId: "arrival",
        delay: false,
        word:""
    },
    //возможные направления
    dist: [
        { id: "departure", name: "Вылет"},
        { id: "arrival", name: "Прилет"},
    ],
};

const mutations = {
    /**
     * установка фильтра напраления
     * @param state
     * @param val
     * @constructor
     */
    SET_DIST_FILTER(state, val) {
        state.filters.distId = val;
    },
    /**
     * устанавливает фильтр поисковое слово
     * @param state
     * @param val
     * @constructor
     */
    SET_WORD_FILTER(state, val) {
        state.filters.word = val;
    },
    /**
     * установка фильтра задержки рейса
     * @param state
     * @param val
     * @constructor
     */
    SET_DELAY_FILTER(state, val){
        state.filters.delay = val
    },
    /**
     * очистка фильтров
     * @param state
     * @param val
     * @constructor
     */
    CLEAR_FILTERS(state) {
        state.filters.distId = "arrival";
        state.filters.delay = false;
        state.filters.delay = "";
    },
};

const getters = {
    // текущий фильтр направления
    filterDistId: state => {
        return state.filters.distId;
    },
    // текущий фильтр задержки рейса
    filterDelay: state => {
        return state.filters.delay;
    },
    //текущая поисковая фраза
    filterWord: state => {
        return state.filters.word;
    },
    // объект возможных направлений
    filterDistItems: state => {
        return state.dist;
    },
};

export default {
    state,
    mutations,
    getters
};
