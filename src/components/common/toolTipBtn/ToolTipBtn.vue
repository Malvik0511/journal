<template>
  <v-tooltip
    :disabled = "!round && !small"
    :top = "top"
    :bottom = "bottom"
    :right = "right"
    :left = "left"
    :small="sm"
    lazy
    class = "toolteep-btn px-0 py-0"
    :class = "round && 'toolteep-btn_round'"
    :content-class ="`toolteep-btn__tooltip-content${class_modify ? '_'+class_modify : ''}`">
    <v-btn
      @click = "$emit('click')"
      slot="activator"
      class="mx-0 my-0"
      :icon="round"
      :class="{'el-active primary--text': active}">
      <v-icon :class="[!round && 'hidden-md-only', round && 'white--text']" :small="sm">{{active ?
        `${active_icon}` :
        (deactive_icon ? deactive_icon: active_icon)}}</v-icon>
      <span v-if = "!round"
            class = "hidden-sm-and-down">{{(active || !deactive_text) ? active_text : deactive_text}}</span>
    </v-btn>
    <span>{{(active || !deactive_text) ? active_text : deactive_text}}</span>
  </v-tooltip>
</template>

<script>
  import "./tooltipBtn.css";

export default {
  name: "ToolTipBtn",

  computed: {
    small() {
      return ["xs", "sm"].includes(this.$vuetify.breakpoint.name);
    },
  },

  props: {
    //круглая кнопка
    round:{
      type: Boolean,
      default: false
    },
    //признак активности
    active: {
      type: Boolean,
      default: false
    },
    //текс в активном состоянии
    active_text: {
      type: String,
      required: true
    },
    //текст в неактивном состоянии
    deactive_text: {
      type: String
    },
    //иконка в активном состоянии
    active_icon: {
      type: String,
      required: true
    },
    //иконка в неактивном состоянии
    deactive_icon: {
      type: String
    },
    //модификатор класса вида _{mod}
    class_modify: {
      type: String,
      default: ""
    },
    //ссылка
    to: {
      type: Object
    },
    //направление тултипа
    right: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: true
    },
    sm: {
      type: Boolean,
      default: false
    }
  }
};
</script>