<template>
    <navigation-add :nav_list="items"></navigation-add>
</template>

<script>
    import NavigationAdd from "../navigationAdd/NavigationAdd";

    export default {
        name: "NavigationMainTeacher",

        components: {
            NavigationAdd
        },

        data: () => ({}),

        computed: {
            // объект с навигацие на главной вкладке админа
            items() {
                return [
                    {
                        title: "Учителя",
                        route: { name: "teachers" },
                        active: this.$route.name === "teachers"
                    },
                    {
                        title: "Журналы",
                        route: { name: "journals" },
                        active: this.$route.name === "journals"
                    },
                ]
            },
        },
    };
</script>
