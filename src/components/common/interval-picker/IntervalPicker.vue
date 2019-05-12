<template>
    <v-layout row wrap class="interval-picker" align-center>
                <span class="pl-1 pr-3">Интервал:</span>
            <v-flex>
                <v-layout>
            <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px">
                <template v-slot:activator="{ on }">
                    <v-text-field
                            class = "mr-3"
                            dark
                            v-model="start"
                            label="С:"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker @input="updateStart"
                               :value="start"
                               first-day-of-week="1"
                               :max="stop"></v-date-picker>
            </v-menu>
            <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px">
                <template v-slot:activator="{ on }">
                    <v-text-field dark
                            v-model="stop"
                            label="До:"
                            prepend-icon="event"
                            readonly
                            v-on="on"></v-text-field>
                </template>
                <v-date-picker @input="updateStop"
                               first-day-of-week="1"
                               :value="stop"
                               :min="start"></v-date-picker>
            </v-menu>
                </v-layout>
            </v-flex>
    </v-layout>
</template>

<script>
    import "./interval-picker.css";

    export default {
        name: "IntervalPicker",

        data: () => ({
            start: new Date().toISOString().substr(0, 10),
            stop: new Date().toISOString().substr(0, 10),
            today: new Date().toISOString().substr(0, 10),
            menu: false,
            menu2: false,
        }),

        computed: {
        },

        methods: {
            updateStart(start = this.start) {
                const val = parseInt(new Date(start).getTime()/1000);
                this.menu = false;
                this.start = start;
                this.$emit("update", { field: 'start', val });
            },

            updateStop(stop = this.stop) {
                const val = parseInt(new Date(stop).getTime()/1000);
                this.menu2 = false;
                this.stop = stop;
                this.$emit("update", { field: 'stop', val });
            },

            init(){
                this.start = this.$store.getters.usersStatisticStart ?
                    new Date(this.$store.getters.usersStatisticStart * 1000).toISOString().substr(0, 10):
                    new Date(parseInt(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
                this.stop = this.$store.getters.usersStatisticStop ?
                    new Date(this.$store.getters.usersStatisticStop * 1000).toISOString().substr(0, 10):
                    new Date().toISOString().substr(0, 10);

                this.updateStart();
                this.updateStop();
            }
        },

        created() {
            this.init();
        }
    };
</script>
