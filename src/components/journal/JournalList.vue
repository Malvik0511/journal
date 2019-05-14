<template>
    <v-layout wrap align-content-start>
        <v-flex xs12 class = "py-2 text-xs-center"><h2>Список журналов</h2></v-flex>
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
                    <tr @click="(e) => toJournal(e, props.item._id)"
                        class="pointer">
                        <td class="">{{ props.item.name }}</td>
                        <td class="">{{ props.item.year.slice(0,10) }}</td>
                        <td class="">{{ props.item.ownerName }}</td>
                        <td>
                            <tool-tip-btn :round="true"
                                          data-prevent
                                          @click="startEditJournal(props.item)"
                                          active_icon = "edit"
                                          active_text = "Редактировать"
                                          :active = "form.open"
                                          class="ma-0 mr-1"></tool-tip-btn>
                            <tool-tip-btn :round="true"
                                          data-prevent
                                          @click="removeJournal(props.item._id)"
                                          active_icon = "clear"
                                          active_text = "Удалить"
                                          :active = "false"
                                          class="ma-0 mr-1"></tool-tip-btn>
                        </td>
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
        <v-dialog v-if="form.open" persistent v-model="form.open" max-width="500px">
            <v-card>
                <v-form v-model="form.valid" ref="form">
                    <v-card-title>
                        <span class="headline">Данные журнала</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-select v-model="form.data.owner"
                                              :items="userList"
                                              item-text="lastName"
                                              item-value="_id"
                                              label="Выберите держателя"
                                              return-object
                                              single-line></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="white primary--text" @click="cancel">Отмена</v-btn>
                        <v-btn color="primary" :disabled="!form.valid" @click="apply">Добавить</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import NavigationNotFound from "../navigation/navigationNotFound/NavigationNotFound";
    import ToolTipBtn from "../common/toolTipBtn/ToolTipBtn";
    import { roles } from "../../modules/constant";

    export default {
        name: "TeacherList",

        components:{
            InfiniteLoading,
            NavigationNotFound,
            ToolTipBtn
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
                    owner: "",
                },
                _id: "",
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

            userList() {
                return (this.form.data.owner ?
                    this.$store.getters.userList.filter(item => item._id !== this.form.data.owner) :
                    this.$store.getters.userList)
                    .filter(item => item.role !== roles.ADMIN);
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
                        { text: "", align: "left", value: "", sortable: false },
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
            toJournal(e, id){
                if (!e.target.closest('[data-prevent]')) {
                    this.$router.push({name: "journal", params: {id}})
                }
            },

            removeJournal(id) {
                this.$store.dispatch("delJournal", { id });
            },

            clearForm() {
                this.$refs.form.reset();
            },

            closeForm() {
                this.form.open = false;
            },

            openForm() {
                this.form.open = true;
            },

            cancel(){
                this.clearForm();
                this.closeForm();
                this.form._id ="";
            },

            apply() {
                const journal = { ...this.$store.getters.journalById(this.form._id) };

                journal.owner = this.form.data.owner._id;
                this.$store.dispatch("editJournal", journal)
                    .then(this.cancel);
            },

            startEditJournal({ owner, _id }) {
                this.openForm();
                let data = this.form.data;
                data.owner = owner;
                this.form._id = _id;
            }
        }
    };
</script>
