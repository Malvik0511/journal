<template>
    <layout :toolbar="false">
        <template slot="content">
            <v-layout justify-center align-center>
                <v-flex xs12 sm6 md5 lg3>
                    <auth></auth>
                </v-flex>
            </v-layout>
        </template>
    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import Auth from "../components/auth/Auth";

    export default {

        name: "LoginView",

        components:{
            Layout,
            Auth
        },

        methods:{
            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        }

    }

</script>