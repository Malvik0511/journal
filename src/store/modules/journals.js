import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //текущие фильтры
    journalList:[]
};

const mutations = {
    SET_JOURNAL_LIST(state, val) {
        state.journalList =  val;
    },

    CLEAR_JOURNAL_LIST (state) {
        state.journalList = [];
    },
};

const getters = {
    // текущий фильтр задержки рейса
    journalList: state => {
        return state.journalList;
    },

    journalListByOwner: state => id => {
        return state.journalList.filter(item => item.owner === id);
    }
};

const actions = {
    getJournalList({ commit }) {
        const url = 'journals';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(journals => commit("SET_JOURNAL_LIST", journals));
    },

    getTeacherJournalList({dispatch}, params) {
        const url = 'journals/by_teacher_id';
        const method = "GET";
        return RequestApi.request({ body: params, additional: { url, method }})
            .then(journals => dispatch("updateJournalList", journals));
    },

    addJournal({ dispatch }, params) {
        const url = 'journals/add';
        return RequestApi.request({ body: params, additional: { url }})
            .then(journals => dispatch("getJournalList", journals));
    },

    delJournal({ dispatch }, params) {
        const url = 'journals/del';
        return RequestApi.request({ body: params, additional: { url }})
            .then(journals => dispatch("getJournalList", journals));
    },

    editJournal({ dispatch }, params) {
        const url = 'journals/edit';
        return RequestApi.request({ body: params, additional: { url }})
            .then(journals => dispatch("getJournalList", journals));
    },


    updateJournalList({getters, commit}, list) {
        if (!getters.journalList.length) {
            commit("SET_JOURNAL_LIST", list)
        } else {
            let journal = getters.journalList
            list.map(item => {
                const index = journal.findIndex(journal => journal._id === item._id);
                if (index !== -1) {
                    journal.splice(index, 1, { ...item });
                } else {
                    journal.push(item);
                }
            })

            commit("SET_JOURNAL_LIST", journal) ;
        }
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};