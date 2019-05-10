<template>
  <v-btn  v-if = "shouldShow"
          class = "navigation-scroll-top ma-0 pa-0"
          :class = "classModify ? `navigation-scroll-top_${classModify}`: ''"
          @click="$vuetify.goTo(target, options)"
          color="#009bf3">
    <v-icon class="white--text">arrow_upward</v-icon>
  </v-btn>
</template>

<script>
import * as easings from "vuetify/es5/util/easing-patterns";

export default {
  name: "NavigationScrollTop",

  data: () => ({
    duration: 300,
    offset: 0,
    easing: "easeInOutCubic",
    easings: Object.keys(easings),
    //показывает или скрывает компонент
    shouldShow: false,
    //таймаут проверки
    scrollTimeout: null
  }),

  watch: {
    /**
     * внешний тригер проверки видимости
     */
    needUpdate(to, from) {
      if (to && !from) {
        this.tryToCheckVisible();
        this.$store.commit("SET_NEED_UPDATE", false);
      }
    }
  },

  computed: {
    /**
     * настройки скролла
     * @returns {{duration: number, offset: number, easing: string}}
     */
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      };
    },
    /**
     * активность
     * @returns {getters.scrollTopActive}
     */
    active() {
      return this.$store.getters.scrollTopActive;
    },
    /**
     * контейнер скролла
     * @returns {getters.scrollTopContainer}
     */
    scrollContainer() {
      return this.$store.getters.scrollTopContainer;
    },
    /**
     * целевой элемент скрола
     * @returns {getters.scrollTopTarget}
     */
    target() {
      return this.$store.getters.scrollTopTarget;
    },
    /**
     * необходимость проверки видимости
     * @returns {getters.scrollTopneedUpdate}
     */
    needUpdate() {
      return this.$store.getters.scrollTopneedUpdate;
    },
    /**
     * модификатор класса оформление доступно через .navigation-scroll-top_${modificator}
     * @returns {getters.scrollTopClassModify}
     */
    classModify() {
      return this.$store.getters.scrollTopClassModify;
    }
  },

  mounted() {
    document["newscroll"] = () => {
      this.tryToCheckVisible();
    };
    if ("onwheel" in document) {
      document.onwheel = function(e) {
        document["newscroll"](e);
      };
    } else {
      document.onmousewheel = function(e) {
        document["newscroll"](e);
      };
    }

    document.touchmove = function(e) {
      document["newscroll"](e);
    };

    document.onscroll = function(e) {
      document["newscroll"](e);
    };

    window.addEventListener("resize", this.checkVisible);
  },

  methods: {
    /**
     * проверка видимости
     */
    checkVisible() {
      //если активен далее, иначе невидим
      if (this.active) {
        //если прокручен скролл показать
        this.shouldShow =
          this.scrollContainer && document.querySelector(this.scrollContainer)
            ? this.scrollContainer.scrollTop
            : Math.max(
                window.pageYOffset,
                document.documentElement.scrollTop,
                document.body.scrollTop
              );

      } else this.shouldShow = false;
    },
    /**
     * проверяет видимость по таймауту
     * @param delay
     */
    tryToCheckVisible(delay = this.duration) {
      if (!this.scrollTimeout) {
        this.scrollTimeout = setTimeout(() => {
          this.checkVisible();
          this.scrollTimeout = null;
        }, delay);
      }
    }
  }
};
</script>
