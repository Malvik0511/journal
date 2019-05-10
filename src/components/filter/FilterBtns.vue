<template>
    <v-layout justify-start>
            <tool-tip-btn v-for="btn in distbBtns"
                    @click = "setDistFilter(btn.id)"
                    :active_icon = "btn.icon"
                    :active_text = "btn.name"
                    :active = "btn.id === activeDistId"
                    class="ma-0 mr-1"
                    :key="btn.id"></tool-tip-btn>
            <tool-tip-btn @click="setDelayFilter"
                    active_icon = "timer_off"
                    active_text = "Задержанные"
                    :active = "filterDelay"
                    class="ma-0 mr-1"></tool-tip-btn>
    </v-layout>
</template>

<script>
    import ToolTipBtn from "../common/toolTipBtn/ToolTipBtn";
    import { flightIcons } from "../../modules/constant";

    export default {
        name: "FiterBtns",

        components:{
            ToolTipBtn
        },

        computed: {
            /**
             * экраны до 600
             * @returns {boolean}
             */
            xs() {
                return this.$vuetify.breakpoint.name === "xs";
            },
            /**
             * эбольшие экраны
             * @returns {boolean}
             */
            lg(){
                return ["xl", "lg"].includes(this.$vuetify.breakpoint.name);
            },
            /**
             * кнопки направлений
             * @returns {*}
             */
            distbBtns(){
                return this.$store.getters.filterDistItems.map(item => ({...item, icon: flightIcons[item.id]}));
            },
            /**
             * текущее направление
             * @returns {default.computed.filterDistId|getters.filterDistId|default.watch.filterDistId}
             */
            activeDistId(){
                return this.$store.getters.filterDistId;
            },
            /**
             * фильтр задержки
             * @returns {default.computed.filterDelay|(function())|getters.filterDelay}
             */
            filterDelay(){
                return this.$store.getters.filterDelay;
            }

        },

        methods: {
            /**
             * установка направления
             * @param id
             */
            setDistFilter(id){
                this.$store.commit("SET_DIST_FILTER", id);
            },
            /**
             * установка фильтра задержки
             */
            setDelayFilter(){
                this.$store.commit("SET_DELAY_FILTER", !this.filterDelay);
            }
        }
    };
</script>
