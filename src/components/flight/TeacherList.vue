<template>
    <v-flex v-if = "paginationfiltredFlightList.length || !loaded"
            xs12 >
        <v-data-table
                dark
                :headers="headers"
                :items="paginationfiltredFlightList"
                :loading = "!loaded"
                hide-actions
                must-sort
                no-data-text=""
        >
            <template slot="items"
                      slot-scope="props">
                <tr @click="toFlight(props.item.thread.uid)"
                        class="pointer">
                    <td class="">{{ filterDistId === "arrival" ? props.item.arrival :  props.item.departure }}</td>
                    <td class="">{{ props.item.thread.short_title }}</td>
                    <td class="">{{ props.item.thread.number }}</td>
                    <td class="">{{ props.item.thread.carrier.title }}</td>
                </tr>
            </template>
        </v-data-table>
        <infinite-loading @infinite="infiniteHandler"
                          force-use-infinite-wrapper="body"
                          v-if = "paginationfiltredFlightList.length &&
                            paginationfiltredFlightList.length !== filtredFlightList.length">
            <div slot="spinner">
                <v-progress-circular indeterminate color="primary" :width="3"></v-progress-circular>
            </div>
        </infinite-loading>
    </v-flex>
    <navigation-not-found v-else
                          :text="notFound.text"
                          :advice = "notFound.advice"
                          :back_page_btn="false"></navigation-not-found>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import NavigationNotFound from "../navigation/navigationNotFound/NavigationNotFound";

    export default {
        name: "TeacherList",

        components:{
            InfiniteLoading,
            NavigationNotFound
        },

        watch:{
            filterDistId(){
                this.getFlights();
            }
        },

        mounted(){
           this.getFlights();
           //активируем скроллтоп
           this.$store.commit("SET_SCROLL_TOP", { active: true });
        },

        beforeDestroy(){
            //деактивируем скроллтоп
            this.$store.commit("SET_SCROLL_TOP");
        },

        updated(){
            //заставляем скроллтоп обновиться
            this.$store.commit("SET_NEED_UPDATE", true);
        },

        data: () => ({
            //признак того что загрузка завершена
            loaded: false,
            pageLength: 25,
            notFound:{
                text: "Рейсов не найдено",
                advice: "Попробуйте поменять критерии поиска"
            }
        }),

        computed: {
            /**
             * список рейсов
             * @returns {default.computed.flightList|(function())|getters.flightList|Array}
             */
            flightList(){
                return this.$store.getters.flightList(this.filterDistId);
            },
            /**
             * список рейсов с учетом фильтров
             * @returns {*}
             */
            filtredFlightList(){
                return this.flightList
                    .filter(flight => !this.filterDelay || flight.is_fuzzy === this.filterDelay)
                    .filter(flight => flight.thread.number.indexOf(this.filterWord) !== -1);
            },
            /**
             * список рейсов с учетом пагинации
             */
            paginationfiltredFlightList(){
                return this.filtredFlightList
                    .slice(0, this.pageLength * this.flightListPage < this.flightList.length ?
                        this.pageLength * this.flightListPage : this.flightList.length);
            },
            /**
             * Состояние фильтра задержанных рейсов
             * @returns {default.computed.filterDelay|(function())|getters.filterDelay}
             */
            filterDelay(){
                return this.$store.getters.filterDelay;
            },
            /**
             * вылет прилет
             * @returns {default.computed.filterDistId|(function())|getters.filterDistId}
             */
            filterDistId(){
                return this.$store.getters.filterDistId;
            },
            /**
             * слово фильтр
             * @returns {default.computed.filterWord|(function())|getters.filterWord}
             */
            filterWord(){
                return this.$store.getters.filterWord;
            },
            /**
             * текущая страница пагинации
             * @returns {default.computed.flightListPage|(function())|getters.flightListPage}
             */
            flightListPage(){
                return this.$store.getters.flightListPage;
            },

            //конфигурация таблицы
            headers(){
                return(
                    [   this.filterDistId === "arrival" ?
                            { text: "Прибытие", align: "left", value: "arrival", sortable: true }:
                            { text: "Отправление", align: "left", value: "departure", sortable: true },
                        { text: "Направление", align: "left", value: "to", sortable: false },
                        { text: "Рейс", align: "left", value: "flight", sortable: false },
                        { text: "Авиакомпания", align: "left", value: "company", sortable: true },
                    ]
                )
            }
        },

        methods: {
            /**
             * запрос рейсов
             */
            getFlights(){
                this.loaded = false;
                if (this.filterDistId === "departure"){
                    this.$store.dispatch("getDepartureList")
                        .finally(() => this.loaded = true);
                } else {
                    this.$store.dispatch("getArrivaleList")
                        .finally(() => this.loaded = true);
                }
            },
            /**
             * оьработка подгрузки
             * @param $state
             */
            infiniteHandler($state){
                if (this.paginationfiltredFlightList.length < this.filtredFlightList.length){
                    this.$store.commit("NEXT_FLIGHT_LIST_PAGE");
                    $state.loaded();
                } else {
                    $state.complete();
                }
            },
            /**
             * к рейсу
             * @param id
             */
            toFlight(id){
                this.$router.push({name: this.filterDistId, params: { id } });
            }
        }
    };
</script>
