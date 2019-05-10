/**
 * Работа с рейсами
 */
import CommonService from "../../modules/CommonService";

const state = {
    //список рейсов и номер страниц для бесконечной прокрутки
    flight: {
        list:{
            arrival:{},
            departure:{},
        },
        listPage: 1,
        updateInterval: 5  * 60 * 1000,
        lastUpdate:{
            arrival: null,
            departure: null,
        }
    },
};

const mutations = {
    /**
     * устанавливает номер страницы для скролла
     * @param state
     * @param val
     * @constructor
     */
    SET_FLIGHT_LIST_PAGE(state, val){
        state.flight.listPage = val;
    },
    /**
     * установка списка рейсов
     * @param state
     * @param data
     * @param direct
     * @constructor
     */
    SET_FLIGHT_LIST(state, { data, direct }){
        state.flight = { ...state.flight, list: { ...state.flight.list, [direct]: data } }
    },
    /**
     * следующая страница
     * @param state
     * @constructor
     */
    NEXT_FLIGHT_LIST_PAGE(state){
        state.flight.listPage++;
    },
    /**
     * обновление счетзчика следующей загрузки
     * @param state
     * @param direct
     * @constructor
     */
    SET_LAST_UPDATE(state, direct){
        state.flight = { ...state.flight, lastUpdate: { ...state.flight.lastUpdate, [direct]: new Date().getTime() } }
    }
};

const actions = {
    // запрос к API - отправка письма
    getDepartureList({ commit, getters, dispatch }){
        return new Promise((resolve, reject) => {
            const direct = "departure";
            if (!getters.flightLastUpdate(direct) ||
                new Date().getTime() - getters.flightLastUpdate(direct) > getters.flightUpdateInterval){
                CommonService.request({ url: `/flight/${direct}`})
                    .then(data => {
                        commit("SET_FLIGHT_LIST", { data, direct });
                        commit("SET_LAST_UPDATE", direct)
                        resolve()
                    })
                    .catch(() => {
                        //показываем предупреждение
                        dispatch("popupInfoOpen", {
                            text: "Не удалось получить список рейсов",
                            color: "red"
                        });
                        reject();
                    });
            } else {
                resolve();
            }

        });
    },

    getArrivaleList({ commit, getters, dispatch }){
        return new Promise((resolve, reject) => {
            const direct = "arrival";
            if (!getters.flightLastUpdate(direct) ||
                new Date().getTime() - getters.flightLastUpdate(direct) > getters.flightUpdateInterval) {
                CommonService.request({url: `/flight/${direct}`})
                    .then(data => {
                        commit("SET_FLIGHT_LIST", { data, direct });
                        commit("SET_LAST_UPDATE", direct)
                        resolve();
                    })
                    .catch(() => {
                        //показываем предупреждение
                        dispatch("popupInfoOpen", {
                            text: "Не удалось получить список рейсов",
                            color: "red"
                        });
                        reject();
                    });
            } else {
                resolve();
            }
        });
    }
};

const getters = {
    /**
     * возвращает список рейсов
     * @param state
     * @returns {exports.list|list|*[]|VListInstance|HTMLElement}
     */
    flightList: state => direct => {
        return state.flight.list[direct].schedule || [];
    },
    /**
     * возвращает последнее время загрузки рейсов
     * @param state
     * @returns {exports.list|list|*[]|VListInstance|HTMLElement}
     */
    flightLastUpdate: state => direct => {
        return state.flight.lastUpdate[direct];
    },
    /**
     * возвращает количество страниц
     * @param state
     * @returns {*|number}
     */
    flightListPage:state => {
        return state.flight.listPage;
    },
    /**
     * возвращает рейс по id и направлению
     * @param state
     * @returns {function(*): T}
     */
    flight: (state, getters)=> ({ id, direct }) => {
        return getters.flightList(direct).find(item => item.thread.uid === id);
    },
    /**
     * период обновления данных из апи
     * @param state
     * @returns {number|*}
     */
    flightUpdateInterval:(state) => {
        return state.flight.updateInterval;
    }


}

export default {
    state,
    mutations,
    actions,
    getters
};
