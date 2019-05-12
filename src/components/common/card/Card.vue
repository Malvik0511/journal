<template>
    <v-layout class="card">
        <v-flex xs12 sm6 offset-sm3>
            <v-card dark>
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">{{ title }}</h3>
                    </div>
                </v-card-title>
                <v-card-text v-for="(value, name) in item" :key="name">
                    {{name}} : {{value}}
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>

    export default {
        name: "Card",

        props: {
            title: {
                type: String,
                default: "Заголовок"
            },
            item: {
                type: Object,
                required: true
            }
        },
    };
</script>