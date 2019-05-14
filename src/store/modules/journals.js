import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //текущие фильтры
    journalList:[]
};

const mutations = {
    //устанавливает список журналов
    SET_JOURNAL_LIST(state, val) {
        state.journalList =  val;
    },
    //чистит список журналов
    CLEAR_JOURNAL_LIST (state) {
        state.journalList = [];
    },
};

const getters = {
    // список журналов
    journalList: state => {
        return state.journalList;
    },
    // список журналов по id gjkmpjdfntkz
    journalListByOwner: state => id => {
        return state.journalList.filter(item => item.owner === id);
    },
    //журнал по Id
    journalById: state => id => {
        return state.journalList.find(item => item._id === id);
    },
    // студент из журнала по id
    studentById: state => id => {
        const journal = state.journalList.find(item => item.students.find(student => student._id === id));
        return journal.students.find(item => item._id === id);
    },
    //урок из журнала по id
    lessonById: state => id => {
        const journal = state.journalList.find(item => item.lessons.find(lesson => lesson._id === id));
        return journal.lessons.find(item => item._id === id);
    }
};

const actions = {
    //получение всего списка журналов
    getJournalList({ commit }) {
        const url = 'journals';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(journals => commit("SET_JOURNAL_LIST", journals));
    },
    //получение журналов по id учителя
    getTeacherJournalList({dispatch}, params) {
        const url = 'journals/by_teacher_id';
        const method = "GET";
        return RequestApi.request({ body: params, additional: { url, method }})
            .then(journals => dispatch("updateJournalList", journals));
    },
    //добавление журнала
    addJournal({ dispatch }, params) {
        const url = 'journals/add';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(journals => dispatch("getJournalList", journals));
    },
    //удаление журнала
    delJournal({ dispatch }, params) {
        const url = 'journals/del';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(journals => dispatch("getJournalList", journals));
    },
    //редактирование журнала
    editJournal({ dispatch }, params) {
        const url = 'journals/edit';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(journals => dispatch("getJournalList", journals));
    },
    //обновление списка журналов
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
            });

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