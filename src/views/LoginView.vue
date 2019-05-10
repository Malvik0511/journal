<template>
    <layout :toolbar="false">
        <template slot="content">
            <v-layout justify-center align-center>
                <auth></auth>
            </v-layout>
        </template>
    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import NavigationNotFound from "../components/navigation/navigationNotFound/NavigationNotFound";
    import Auth from "../components/auth/Auth"

    export default {

        name: "LoginView",

        components:{
            Layout,
            NavigationNotFound,
            Auth
        },

        methods:{
            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        }

    }

</script>