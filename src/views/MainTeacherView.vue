<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
                <filter-field @setFilterStr="setFilterStr"
                              :height="36"
                              class="align-self-center justify-end"
                              :placeholder="placeholder"></filter-field>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <navigation-main-teacher></navigation-main-teacher>
                <v-flex xs12 v-if="loaded">
                    <router-view></router-view>
                </v-flex>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import FilterField from "../components/filter/filterField/FilterField";
    import NavigationMainTeacher from "../components/navigation/navigationMainTeacher/NavigationMainTeacher"

    export default {

        name: "MainTeacherView",

        data:() => ({
            loaded: false
        }),

        components:{
            Layout,
            FilterField,
            NavigationMainTeacher
        },

        computed: {
            placeholder(){
                return this.$route.name === "teachers" ? "Фамилия преподавателя" : "Название журнала";
            }
        },

        methods:{
            init() {
                this.loaded = false;
                this.$store.dispatch("getUserList")
                    .finally(() => this.loaded = true);
            },

            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        },

        created() {
            this.init();
        }

    }

</script>