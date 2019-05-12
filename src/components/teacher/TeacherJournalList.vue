<template>
    <v-layout wrap align-content-start>
        <tool-tip-btn @click="form.open = !form.open"
                      active_icon = "add"
                      active_text = "Добавить"
                      :active = "form.open"
                      class="ma-0 mr-1"></tool-tip-btn>
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
                    no-data-text=""
            >
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
                                    <v-text-field label="Имя журнала"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form.data.name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-menu
                                            ref="menu"
                                            v-model="form.datePicker"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="form.data.year"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="form.data.year"
                                                    label="Picker in menu"
                                                    prepend-icon="event"
                                                    readonly
                                                    :rules="rules.name"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.data.year" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="form.datePicker = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="$refs.menu.save(form.data.year)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
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
        name: "TeacherJournalList",

        components:{
            InfiniteLoading,
            NavigationNotFound,
            ToolTipBtn,
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

        props: {
            user_id: {
                type: String,
            }
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
                datePicker: false,
                data: {
                    name: "",
                    year: new Date().toISOString().substr(0, 10),
                },
                _id: ""
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
                return this.$store.getters.journalListByOwner(this.id);
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

            id() {
               return this.user_id || this.$store.getters.authUser;
            },

            //конфигурация таблицы
            headers(){
                return(
                    [
                        { text: "Название", align: "left", value: "name", sortable: true },
                        { text: "Дата создания", align: "left", value: "year", sortable: true },
                        { text: "Держатель", align: "left", value: "owner", sortable: false },
                        { text: "", align: "left", value: "", sortable: false }
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
                this.$store.dispatch("getTeacherJournalList", { id: this.id }).then(() =>this.loaded = true);
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
                    this.$router.push({name: "journal", params: {id}});
                }
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
            },

            apply() {
                if (this.form.valid) {
                    if (!this.form._id) {
                        this.addJournal();
                    } else {
                        this.editJournal();
                    }
                }
            },

            addJournal() {
                this.$store.dispatch("addJournal",
                    {
                        ...this.form.data,
                        year: new Date(this.form.data.year),
                        owner: this.id
                    })
                    .then(this.cancel);
            },

            editJournal() {
                this.$store.dispatch("editJournal",
                    {
                        ...this.form.data,
                        year: new Date(this.form.data.year),
                        owner: this.id,
                        _id: this.form._id
                    })
                    .then(this.cancel);
            },

            removeJournal(id) {
                this.$store.dispatch("delJournal", { id });
            },

            startEditJournal({ name, year, _id }) {
                this.openForm();
                let data = this.form.data;
                data.name = name;
                data.year = new Date(year).toISOString().substr(0, 10);
                this.form._id = _id;
            }
        }
    };
</script>
