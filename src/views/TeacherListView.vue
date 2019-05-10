<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
                <filter-field @setFilterStr="setFilterStr"
                              :height="36"
                              class="align-self-center justify-end"
                              placeholder="Фамилия преподавателя"></filter-field>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout>
                <teacher-list></teacher-list>
            </v-layout>
        </template>

    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import TeacherList from "../components/flight/TeacherList";
    import FilterField from "../components/filter/filterField/FilterField";

    export default {

        name: "TeacherListView",

        components:{
            Layout,
            TeacherList,
            FilterField
        },

        methods:{
            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        }

    }

</script>