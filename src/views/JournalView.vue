<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
                <filter-field @setFilterStr="setFilterStr"
                              :height="36"
                              class="align-self-center justify-end"
                              placeholder="Фамилия ученика"></filter-field>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <v-flex xs12>
                    <router-view :journal_id="journalId"></router-view>
                </v-flex>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import FilterField from "../components/filter/FilterField";

    export default {

        name: "JournalView",

        components:{
            Layout,
            FilterField
        },

        data:() => ({
            loaded: false
        }),

        computed: {
            journalId() {
                return this.$route.params.id
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