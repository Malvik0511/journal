const state = {
  // вкл./выкл. popup
  popupInfoActive: false,
  // текст сообщения
  popupInfoText: "",
  // background popup
  popupInfoColor: "",
  // Timeout для закрытия всплывашки
  popupInfoTimeout: 3000
};

const mutations = {
  // вкл./выкл. popup
  SET_POPUP_INFO_ACTIVE(state, val) {
    state.popupInfoActive = val;
  },
  // смена текста сообщения
  SET_POPUP_INFO_TEXT(state, val) {
    state.popupInfoText = val;
  },
  // смена background
  SET_POPUP_INFO_COLOR(state, val) {
    state.popupInfoColor = val;
  },
  // смена Timeout
  SET_POPUP_INFO_TIMEOUT(state, val) {
    state.popupInfoTimeout = val;
  },
  // чистка параметров popup
  CLEAR_POPUP_INFO(state) {
    state.popupInfoActive = false;
    state.popupInfoText = "";
    state.popupInfoColor = "";
    state.popupInfoTimeout = 3000;
  }
};

const actions = {
  // открывает всплывашку с переданными параметрами
  popupInfoOpen({ commit }, params) {
    if (params.timeout) commit("SET_POPUP_INFO_TIMEOUT", params.timeout);
    if (params.text) commit("SET_POPUP_INFO_TEXT", params.text);
    if (params.color) commit("SET_POPUP_INFO_COLOR", params.color);

    commit("SET_POPUP_INFO_ACTIVE", true);
  }
};

const getters = {
  // вкл./выкл. popup
  popupInfoActive: state => {
    return state.popupInfoActive;
  },
  // текст сообщения
  popupInfoText: state => {
    return state.popupInfoText;
  },
  // background popup
  popupInfoColor: state => {
    return state.popupInfoColor;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
