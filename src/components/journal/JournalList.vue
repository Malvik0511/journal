<template>
    <v-layout wrap align-content-start>
        <v-flex v-if = "resultList.length || !loaded"
                xs12 >
            <v-layout>
            </v-layout>
            <v-data-table
                    dark
                    :headers="headers"
                    :items="resultList"
                    :loading = "!loaded"
                    hide-actions
                    must-sort
                    no-data-text="">
                <template slot="items"
                          slot-scope="props">
                    <tr @click="toJournal(props.item.id)"
                        class="pointer">
                        <td class="">{{ props.item.name }}</td>
                        <td class="">{{ props.item.year.slice(0,10) }}</td>
                        <td class="">{{ props.item.ownerName }}</td>
                    </tr>
                </template>
            </v-data-table>
            <infinite-loading @infinite="infiniteHandler"
                              force-use-infinite-wrapper="body"
                              v-if = "resultList.length &&
                            resultList.length !== filtredList.length">
                <div slot="spinner">
                    <v-progress-circular indeterminate color="primary" :width="3"></v-progress-circular>
                </div>
            </infinite-loading>
        </v-flex>
        <navigation-not-found v-else
                              :text="notFound.text"
                              :advice = "notFound.advice"
                              :back_page_btn="false"></navigation-not-found>
    </v-layout>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import NavigationNotFound from "../navigation/navigationNotFound/NavigationNotFound";
    import { roles } from "../../modules/constant";

    export default {
        name: "TeacherList",

        components:{
            InfiniteLoading,
            NavigationNotFound,
        },

        mounted(){
            this.init();
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
            roles,
            notFound:{
                text: "Журналы не найдены",
                advice: null
            },
            form: {
                open: false,
                valid: false,
                data: {
                    firstName: "",
                    lastName: "",
                    login:"",
                    password: "",
                    _id: ""
                },
                mainTeacher: false
            },
            rules: {
                name: [v => !!v || ""],
                login: [v => !!v || ""],
                password: [
                    v => !!v || "",
                    v =>
                        v && v.search(/[а-яА-ЯёЁ]/g) === -1 || "в пароле не должно быть кириллицы"
                ]
            },
        }),

        computed: {
            /**
             * список рейсов
             * @returns {default.computed.flightList|(function())|getters.flightList|Array}
             */
            list(){
                return this.$store.getters.journalList;
            },
            /**
             * список рейсов с учетом фильтров
             * @returns {*}
             */
            filtredList(){
                return this.list
                    .filter(item => item.name.indexOf(this.filterWord) !== -1);
            },
            /**
             * список рейсов с учетом пагинации
             */
            resultList(){
                return this.filtredList
                    .slice(0, this.pageLength * this.flightListPage < this.list.length ?
                        this.pageLength * this.flightListPage : this.list.length)
                    .map(item => {
                        const owner = this.$store.getters.userById(item.owner);
                        if (owner) {
                            const ownerName = owner.lastName + " " + owner.firstName;
                            return { ...item, ownerName};
                        }

                        return item;

                    })
            },

            filterWord(){
                return this.$store.getters.filterWord;
            },

            //конфигурация таблицы
            headers(){
                return(
                    [
                        { text: "Название", align: "left", value: "name", sortable: true },
                        { text: "Дата создания", align: "left", value: "year", sortable: true },
                        { text: "Держатель", align: "left", value: "owner", sortable: false },
                    ]
                )
            }
        },

        methods: {
            /**
             * запрос рейсов
             */
            init(){
                this.loaded = false;
                this.$store.dispatch("getJournalList").then(() =>this.loaded = true);
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
            toJournal(){

            },
        }
    };
</script>
