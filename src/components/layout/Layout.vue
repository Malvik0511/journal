<template>
    <v-app id="app" class="layout">
        <v-toolbar :fixed="true"
                   :height="100"
                   v-if="toolbar"
                   class="layout__toolbar"
                   app flat>
                <v-layout>
                    <v-flex align-self-center xs4 sm2 md1>
                        <h2 @click="$router.push('/')"
                            class="pointer">Journal</h2>
                    </v-flex>
                    <v-flex class="px-2">
                        <slot name="toolbar"></slot>
                    </v-flex>
                    <tool-tip-btn @click="logOut"
                                  active_icon = "exit_to_app"
                                  active_text = "Выход"
                                  :active="false"
                                  class="ma-0 mr-1 outline"></tool-tip-btn>
                </v-layout>
        </v-toolbar>
        <!--Основной контент-->
        <v-content class="layout__content">
            <v-layout :fill-height="contentFillHeight" class="px-4 pb-4">
                <slot name="content"></slot>
                <v-layout class = "layout__block_fixed" column>
                    <updater class="order-xs1"></updater>
                    <navigation-scroll-top class="order-xs2"></navigation-scroll-top>
                </v-layout>
            </v-layout>
        </v-content>
        <!--всплывашка-->
        <pop-up></pop-up>
    </v-app>
</template>

<script>
    import "./layout.css";
    import NavigationScrollTop from "../navigation/navigationScrollTop/NavigationScrollTop";
    import PopUp from "../common/popUp/popUp";
    import Updater from "../common/updater/Updater";
    import ToolTipBtn from "../common/toolTipBtn/ToolTipBtn";

    export default {
        name: "Layout",

        components:{
            NavigationScrollTop,
            PopUp,
            Updater,
            ToolTipBtn
        },

        props: {
            // блок с основным контентом во всю высоту экрана
            contentFillHeight: {
                type: Boolean,
                default: true
            },
            toolbar: {
                type: Boolean,
                default: true
            }
        },

        methods: {
            logOut() {
                this.$store.dispatch("LogOut")
                    .then(() => this.$router.push({name: "login"}));
            }
        }
    };
</script>
