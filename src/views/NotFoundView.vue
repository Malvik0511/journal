<template>
    <layout>
        <template slot="content">
            <v-layout>
                <navigation-not-found></navigation-not-found>
            </v-layout>
        </template>
    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import NavigationNotFound from "../components/navigation/navigationNotFound/NavigationNotFound";

    export default {

        name: "MainView",

        components:{
            Layout,
            NavigationNotFound
        },

        methods:{
            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        }

    }

</script>