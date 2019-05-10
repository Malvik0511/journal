<template>
    <layout>
        <template slot="content">
            <v-layout>
                <teacher :id="id"></teacher>
            </v-layout>
        </template>
    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import Teacher from "../components/flight/Teacher";

    export default {

        name: "TeacherView",

        components:{
            Layout,
            Teacher
        },

        computed: {
            //id рейса
            id() {
                return this.$route.params.id;
            },
        }
    }

</script>