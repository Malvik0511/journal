<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
                <filter-field @setFilterStr="setFilterStr"
                              :height="36"
                              class="align-self-center justify-end"
                              placeholder="Название журнала"></filter-field>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <v-flex xs12>
                    <router-view :user_id="userId"></router-view>
                </v-flex>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import FilterField from "../components/filter/FilterField";

    export default {

        name: "TeacherView",

        components:{
            Layout,
            FilterField
        },

        data:() => ({
            loaded: false
        }),

        computed: {
            userId() {
                return this.$route.params.id || this.$store.getters.authUser._id;
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