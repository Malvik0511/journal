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
            //преобразование объекта студента в представление для карточки студента
            student() {
                const user = this.$store.getters.studentById(this.student_id);
                const prepairUser = {

                };

                prepairUser.Имя = user.firstName;
                prepairUser.Фамилия = user.lastName;
                prepairUser.Родитель = user.parents;
                prepairUser.Адрес = user.address;
                prepairUser.Телефон = user.phone;
                prepairUser.Медосмотр = user.medical ? "+" :  "-";

                return prepairUser;
            }
        }
    };
</script>