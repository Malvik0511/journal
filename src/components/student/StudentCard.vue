<template>
    <Card :title="'Ученик'"
          :item="student"></Card>
</template>

<script>
    import Card from "../common/card/Card"

    export default {
        name: "StudentCard",

        components: {
            Card
        },


        props: {
            student_id:{
                type: String,
                required: true
            }
        },

        computed: {
            student() {
                const user = this.$store.getters.studentById(this.student_id);
                const prepairUser = {

                };
                prepairUser.Имя = user.firstName;
                prepairUser.Фамилия = user.lastName;
                prepairUser.Родитель = user.parents;

                return prepairUser;
            }
        }
    };
</script>