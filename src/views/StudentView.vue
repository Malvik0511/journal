<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <v-flex xs12 v-if="loaded">
                    <router-view :student_id="studentId"></router-view>
                </v-flex>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";

    export default {

        name: "StudentView",

        components:{
            Layout,
        },

        data:() => ({
            loaded: false
        }),

        computed: {
            studentId() {
                return this.$route.params.id
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