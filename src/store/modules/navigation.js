/**
 * Состояние всплывашки с опопвещениями после изменения данных на странице
 * Находится в BaseLayout
 */
const state = {
  // настройка скроллтопа
  scrollTop: {
    //нужно ли запустить проверку обновления
    needUpdate: false,
    //внутри чего скролится
    scrollContainer: null,
    //дом элемент куда скролим
    target: "body",
    //активность
    active: false,
    //модификатор класса
    classModify: ""
  }
};

const mutations = {
  //настройка скроллтопа
  SET_SCROLL_TOP(state, props) {
    let needUpdate =
        props && props.needUpdate !== undefined ? props.needUpdate : false,
      scrollContainer =
        props && props.scrollContainer !== undefined
          ? props.scrollContainer
          : null,
      target = (props && props.target) || "body",
      active = props && props.active !== undefined ? props.active : false,
      classModify =
        props && props.classModify !== undefined ? props.classModify : false;
    state.scrollTop = {
      needUpdate,
      scrollContainer,
      target,
      active,
      classModify
    };
  },
  // тригер апдейта
  SET_NEED_UPDATE(state, val) {
    if (state.scrollTop.needUpdate !== val) state.scrollTop.needUpdate = val;
  }
};

const getters = {
  scrollTopneedUpdate: state => {
    return state.scrollTop.needUpdate;
  },

  scrollTopContainer: state => {
    return state.scrollTop.scrollContainer;
  },

  scrollTopTarget: state => {
    return state.scrollTop.target;
  },

  scrollTopActive: state => {
    return state.scrollTop.active;
  },

  scrollTopClassModify: state => {
    return state.scrollTop.classModify;
  }
};

export default {
  state,
  mutations,
  getters
};
