<template>
  <div class="layout align-center relative filter-field" :style="`height: ${height}px;`">
    <v-text-field
        v-if="openedTextField"
        v-model="filterStr"
        @input="$emit('setFilterStr', filterStr)"
        :height="height"
        :prepend-icon="(prependIcon ? 'search' : '')"
        :append-icon="(appendIcon ? 'search' : '')"
        :append-outer-icon="(appendOuterIcon ? 'search' : '')"
        :solo="solo || openedTextField"
        :placeholder="placeholder"
        :hide-details="true"
        :autofocus="true"
        class="pa-0 ma-0 absolute"
    ></v-text-field>
    <tool-tip-btn round
                  @click="setOpenedTextField"
                  active_icon = "search"
                  active_text = "Завершить поиск"
                  deactive_text="Начать поиск"
                  class="ma-0"
                  :active = "openedTextField"
                  bottom></tool-tip-btn>
  </div>
</template>

<script>
import "./filterField.css";

import ToolTipBtn from "../common/toolTipBtn/ToolTipBtn";

export default {
  name: "FilterField",

  components: {
    ToolTipBtn
  },

  data: () => ({
    filterStr: "",
    openedTextField: false
  }),

  props: {
    // Тип компонента Иконка - при клике на которую открывается интпут
    prependIcon: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: Boolean,
      default: false
    },
    appendOuterIcon: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    solo: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 35
    }
  },

  beforeDestroy(){
    this.setOpenedTextField();
  },

  methods: {
    // отобразить поле для поиска
    setOpenedTextField() {
      this.openedTextField = !this.openedTextField;
      if (!this.openedTextField) {
        this.filterStr = "";
        this.$emit("setFilterStr", this.filterStr);
      }
    }
  }
};
</script>
