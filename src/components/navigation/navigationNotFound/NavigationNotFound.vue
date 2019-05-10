<template>
    <v-layout class="navigation-not-found fixed-center text-xs-center"
              wrap
              column
              align-content-center>
        <v-flex class = "navigation-not-found__text">
            {{text}}
        </v-flex>
        <v-flex class = "navigation-not-found__advice">
            {{advice}}
        </v-flex>
        <tool-tip-btn v-if="back_page_btn"
                      @click="goBack"
                      bottom
                      active_icon = "keyboard_backspace"
                      active_text = "Вернуться назад"
                      :active = "false"
                      class="ma-0 mt-3"></tool-tip-btn>
    </v-layout>
</template>

<script>
    import "./navigationNotFound.css";
    import ToolTipBtn from "../../common/toolTipBtn/ToolTipBtn";

    export default {
        name: "NavigationNotFound",

        components: {
            ToolTipBtn
        },

        props: {
            text: {
                type: String,
                default: "Страница не найдена"
            },
            advice: {
                type: String,
                default: "Попробуте поменять запрос"
            },
            back_page_btn:{
                type: Boolean,
                default: true,
            }
        },

        methods:{
            goBack(){
                this.$router.back();
            }
        }

    };
</script>
