/**
 * Фильтры рейсов
 */
const state = {
    //текущие фильтры
    filters:{
        word:""
    },
};

const mutations = {
    /**
     * устанавливает фильтр поисковое слово
     * @param state
     * @param val
     * @constructor
     */
    SET_WORD_FILTER(state, val) {
        state.filters.word = val;
    },
};

const getters = {
    //текущая поисковая фраза
    filterWord: state => {
        return state.filters.word;
    },
};

export default {
    state,
    mutations,
    getters
};
