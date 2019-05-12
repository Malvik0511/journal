<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <v-flex xs12>
                    <router-view :lesson_id="lessonId"></router-view>
                </v-flex>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";

    export default {

        name: "LessonView",

        components:{
            Layout,
        },

        data:() => ({
            loaded: false
        }),

        computed: {
            lessonId() {
                return this.$route.params.id;
            }
        },

        methods:{
            init() {
                this.loaded = false;
                this.$store.dispatch("getJournalList")
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