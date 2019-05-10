<template>
    <v-snackbar v-model="popupInfoActive"
                :timeout="timeout"
                :color="color"
                top
                right>
        <v-layout align-center pr-4>
            <v-flex class="font-weight-medium">{{ text }}</v-flex>
        </v-layout>
        <v-btn  @click="popupInfoActive = false"
                icon absolute right>
            <v-icon>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: "PopUp",

        computed:{
            popupInfoActive: {
                get: function() {
                    return this.$store.getters.popupInfoActive;
                },
                set: function() {
                    this.$store.commit("CLEAR_POPUP_INFO");
                }
            },
            /**
             * время действия
             * @returns {number}
             */
            timeout(){
                return this.$store.getters.popupInfoTimeout;
            },
            /**
             * цвет
             * @returns {string|getters.popupInfoColor}
             */
            color(){
                return this.$store.getters.popupInfoColor;
            },
            /**
             * сообщение
             * @returns {string|getters.popupInfoText}
             */
            text(){
                return this.$store.getters.popupInfoText;
            }
        },
    };
</script>
