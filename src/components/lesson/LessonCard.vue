<template>
    <Card :title="'Урок'"
          :item="lesson"></Card>
</template>

<script>
    import Card from "../common/card/Card"

    export default {
        name: "StudentCard",

        components: {
            Card
        },


        props: {
            lesson_id:{
                type: String,
                required: true
            }
        },

        computed: {
            lesson() {
                const lesson = this.$store.getters.lessonById(this.lesson_id);
                const prepairLesson = {};

                prepairLesson.Название = lesson.name;
                prepairLesson.Описание = lesson.description;
                prepairLesson.Дата = new Date(lesson.date).toISOString().substr(0, 10);

                return prepairLesson;
            }
        }
    };
</script>