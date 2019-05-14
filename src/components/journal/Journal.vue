<template>
    <v-layout wrap align-content-start>
        <v-flex xs12 class = "py-2 text-xs-center"><h2>Журнал {{journal.name}}</h2></v-flex>
        <v-layout align-center justify-space-beetween>
            <template v-if="!admin">
                <tool-tip-btn @click="form2.open = !form2.open"
                              active_icon = "add"
                              active_text = "Урок"
                              data-prevent
                              :active = "form2.open"
                              class="ma-0 mr-1"></tool-tip-btn>
                <tool-tip-btn @click="form1.open = !form1.open"
                              data-prevent
                              active_icon = "add"
                              active_text = "Ученика"
                              :active = "form1.open"
                              class="ma-0 mr-4"></tool-tip-btn>
            </template>
            <interval-picker @update="updateInterval"></interval-picker>
        </v-layout>
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
                <template v-slot:headers="props">
                    <tr>
                        <th v-if="!admin">
                        </th>
                        <th class="text-xs-left">
                            Ученик
                        </th>
                        <th class="text-xs-left pointer"
                            v-for="header in props.headers"
                            :key="header.id">
                            <span @click="toLesson(header.id)">{{ header.text }}</span>
                            <template v-if="!admin">
                                <tool-tip-btn :round="true"
                                              @click="startEditLesson(header.id)"
                                              data-prevent
                                              sm
                                              active_icon = "edit"
                                              active_text = "Редактировать"
                                              :active = "form1.open"
                                              class="ma-0 mr-1"></tool-tip-btn>
                                <tool-tip-btn :round="true"
                                              @click="removeLesson(header.id)"
                                              data-prevent
                                              sm
                                              active_icon = "clear"
                                              active_text = "Удалить"
                                              :active = "false"
                                              class="ma-0 mr-1"></tool-tip-btn>
                            </template>
                        </th>
                    </tr>
                </template>
                <template slot="items"
                          slot-scope="props">
                    <tr class="pointer">
                        <td v-if="!admin">
                            <tool-tip-btn :round="true"
                                          @click="startEditStudent(props.item._id)"
                                          data-prevent
                                          active_icon = "edit"
                                          active_text = "Редактировать"
                                          :active = "form1.open"
                                          class="ma-0 mr-1"></tool-tip-btn>
                            <tool-tip-btn :round="true"
                                          @click="removeStudent(props.item._id)"
                                          data-prevent
                                          active_icon = "clear"
                                          active_text = "Удалить"
                                          :active = "false"
                                          class="ma-0 mr-1"></tool-tip-btn>
                        </td>
                        <td class=""
                            @click="toStudent(props.item._id)"
                            data-prevent>{{ props.item.firstName }} {{ props.item.lastName }}</td>
                        <td class="" v-for="(lesson, i) in lessons"
                            :key="i"
                            data-prevent
                            @click="toggleVisit({ studentId: props.item._id, lessonId: lesson._id })">
                            {{props.item.misses && props.item.misses.includes(lesson._id) ? "Н" : ""}}
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
        <v-dialog v-if="form1.open" persistent v-model="form1.open" max-width="500px">
            <v-card>
                <v-form v-model="form1.valid" ref="form1">
                    <v-card-title>
                        <span class="headline">Данные ученика</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="Имя"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form1.data.firstName"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Фамилия"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form1.data.lastName"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Полное Имя Родителя"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form1.data.parents"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="white primary--text" @click="cancel(1)">Отмена</v-btn>
                        <v-btn color="primary" :disabled="!form1.valid" @click="apply(1)">Добавить</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-if="form2.open" persistent v-model="form2.open" max-width="500px">
            <v-card>
                <v-form v-model="form2.valid" ref="form2">
                    <v-card-title>
                        <span class="headline">Информация об уроке</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="Название Урока"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form2.data.name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Описание"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form2.data.description"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-menu
                                            ref="menu"
                                            v-model="form2.datePicker"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="form2.data.date"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="form2.data.date"
                                                    label="Picker in menu"
                                                    prepend-icon="event"
                                                    readonly
                                                    :rules="rules.name"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form2.data.date" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="form2.datePicker = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="$refs.menu.save(form2.data.date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="white primary--text" @click="cancel(2)">Отмена</v-btn>
                        <v-btn color="primary" :disabled="!form2.valid" @click="apply(2)">Добавить</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import NavigationNotFound from "../navigation/navigationNotFound/NavigationNotFound";
    import { roles } from "../../modules/constant";
    import ToolTipBtn from "../../components/common/toolTipBtn/ToolTipBtn";
    import IntervalPicker from "../../components/common/interval-picker/IntervalPicker"

    export default {
        name: "Journal",

        components:{
            InfiniteLoading,
            NavigationNotFound,
            ToolTipBtn,
            IntervalPicker
        },

        props: {
            journal_id: {
                type: String,
                required: true
            }
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
            form1: {
                open: false,
                valid: false,
                data: {
                    firstName: "",
                    lastName: "",
                    parents: "",
                },
                _id: ""
            },
            form2: {
                open: false,
                valid: false,
                datePicker: false,
                data: {
                    name: "",
                    description: "",
                    date: new Date().toISOString().substr(0, 10),
                },
                _id: ""
            },
            interval: {
                start:"",
                stop: "",
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
            journal() {
                return this.$store.getters.journalById(this.journal_id) || {};
            },

            admin() {
                return this.$store.getters.authUserIsAdmin;
            },
            /**
             * список рейсов
             * @returns {default.computed.flightList|(function())|getters.flightList|Array}
             */
            list(){
                return this.journal.students || [];
            },

            lessons() {
                let les = (this.journal.lessons || [])
                    .sort((a, b) => new Date(a.date) - new Date(b.date))

                if (this.interval.start) les = les.filter(item => new Date(item.date) >=  new Date(this.interval.start * 1000));
                if (this.interval.stop) les = les.filter(item => new Date(item.date) <= new Date(this.interval.stop * 1000));

                return les;
            },
            /**
             * список рейсов с учетом фильтров
             * @returns {*}
             */
            filtredList(){
                return this.list
                    .filter(item => item.lastName.indexOf(this.filterWord) !== -1)
                    .sort((a, b) => {
                        const first = a.lastName.toLowerCase(),
                            second = b.lastName.toLowerCase();
                        return first < second ? -1 : 1
                    });
            },
            /**
             * список рейсов с учетом пагинации
             */
            resultList(){
                return this.filtredList
                    .slice(0, this.pageLength * this.flightListPage < this.list.length ?
                       this.pageLength * this.flightListPage : this.list.length);
            },

            filterWord(){
                return this.$store.getters.filterWord;
            },

            //конфигурация таблицы
            headers(){
                return [
                    ...(this.journal.lessons || [])
                        .filter(item => new Date(item.date) >=  new Date(this.interval.start * 1000))
                        .filter(item => new Date(item.date) <= new Date(this.interval.stop * 1000))
                        .map(item => (
                    {
                        text: item.date,
                        align: "left",
                        value: "",
                        id: item._id,
                        sortable: false
                    }
                ))]
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

            clearForm(n) {
                this.$refs[`form${n}`].reset();
            },

            closeForm(n) {
                this[`form${n}`].open = false;
            },

            openForm(n) {
                this[`form${n}`].open = true;
            },

            cancel(n){
                this.clearForm(n);
                this.closeForm(n);
                this[`form${n}`]._id = "";
            },

            apply(n) {
                if (this[`form${n}`].valid) {
                    this.editJournal(n);
                }
            },

            startEditStudent(id){
                const user = this.list.find(item => item._id === id)
                let form = this.form1,
                    data = form.data;

                form._id = user._id;
                data.firstName = user.firstName;
                data.lastName = user.lastName;
                data.parents = user.parents;

                this.openForm(1);
            },

            startEditLesson(id){
                const lesson = this.lessons.find(item => item._id === id);
                let form = this.form2,
                    data = form.data;

                form._id = lesson._id;
                data.name = lesson.name;
                data.description = lesson.description;
                data.date = new Date(lesson.date).toISOString().substr(0, 10);

                this.openForm(2);
            },

            editJournal(n) {
                let journal = { ...this.journal },
                    form = { ...this[`form${n}`] };
                if (n === 1) {
                    if (!form._id) {
                        journal.students.push(form.data);
                    } else {
                        const index = journal.students.findIndex(student => student._id === form._id);
                        if (index !== -1) {
                            journal.students.splice(index, 1, { ...form.data, _id: form._id});
                        }
                    }
                } else {
                    if (!form._id) {
                        journal.lessons.push(form.data);
                    } else {
                        const index = journal.lessons.findIndex(lesson => lesson._id === form._id);
                        if (index !== -1) {
                            journal.lessons.splice(index, 1, { ...form.data, _id: form._id});
                        }
                    }
                }

                this.$store.dispatch("editJournal", journal)
                    .then(() => this.cancel(n));
            },

            removeStudent(id) {
                let journal = { ...this.journal };
                const index = journal.students.findIndex(student => student._id === id);

                if (index !== -1) {
                    journal.students.splice(index, 1);
                }

                this.$store.dispatch("editJournal", journal);
            },

            removeLesson(id) {
                let journal = { ...this.journal };
                const index = journal.lessons.findIndex(lesson => lesson._id === id);

                if (index !== -1) {
                    journal.lessons.splice(index, 1);
                }

                this.$store.dispatch("editJournal", journal);
            },

            toggleVisit({ studentId, lessonId }) {
                if (!this.admin){
                    const journal = { ...this.journal },
                        students = journal.students,
                        stId = students.findIndex(st => st._id === studentId);


                    if (stId !== -1) {
                        const student = students[stId];
                        const index = student.misses.findIndex(item => item === lessonId);
                        if (index === -1) {
                            student.misses.push(lessonId);
                        } else {
                            student.misses.splice(index, 1);
                        }

                        journal.students.splice(stId, 1, student);
                        this.$store.dispatch("editJournal", journal);
                    }
                }
            },

            updateInterval({ field, val }) {
                if (field in this.interval){
                    this.interval[field] = val;
                }
            },
            /**
             * к рейсу
             * @param id
             */
            toStudent(id){
                this.$router.push({name: "student", params: { id }});
            },

            toLesson(id){
                this.$router.push({name: "lesson", params: { id }});
            },

        }
    };
</script>
