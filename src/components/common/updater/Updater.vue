<template>
    <v-btn  v-if = "shouldShow"
            class = "updater ma-0 pa-0"
            @click="update"
            :loading="loaded"
            color="#235087">
        <v-icon class="white--text">update</v-icon>
    </v-btn>
</template>

<script>

    export default {
        name: "Updater",

        data: () => ({
            //показывать ли элемент
            shouldShow: false,
            //переменная интервала проверки
            checkInterval: null,
            //интервал обновления
            checkIntervalTime: 1 * 60 * 1000,
            //статус загрузки данных
            loaded: false
        }),

        watch:{
            filterDistId(){
                this.restartCheck();
            }
        },

        computed: {
            /**
             * ограничение на скачивание
             * @returns {default.computed.flightUpdateInterval|(function())|getters.flightUpdateInterval}
             */
            flightUpdateInterval(){
                return this.$store.getters.flightUpdateInterval;
            },
            /**
             * выбранное направление
             * @returns {default.computed.filterDistId|(function())|default.watch.filterDistId|getters.filterDistId}
             */
            filterDistId(){
                return this.$store.getters.filterDistId;
            },
            /**
             * время последнего обновления
             * @returns {*|exports.list|list|*[]|VListInstance|HTMLElement}
             */
            flightLastUpdate(){
                return this.$store.getters.flightLastUpdate(this.filterDistId);
            }
        },

        mounted(){
            this.startCheck();
        },

        beforeDestroy(){
            this.stopCheck();
        },

        methods: {
            /**
             * обновить данные
             */
            update(){
                this.loaded = true;
                if (this.filterDistId === "departure"){
                    this.$store.dispatch("getDepartureList")
                        .then(this.restartCheck)
                        .finally(() => this.loaded = false);
                } else {
                    this.$store.dispatch("getArrivaleList")
                        .then(this.restartCheck)
                        .finally(() => this.loaded = false);
                }
            },
            /**
             * начинаем проверку необходимости показать кнопку обновления
             */
            startCheck(){
                this.tryToSetShow();
                this.checkInterval = setInterval(this.tryToSetShow, this.checkIntervalTime);
            },
            /**
             * останавливаем проверку
             */
            stopCheck(){
                clearInterval(this.checkInterval)
                this.checkInterval = null;
            },
            /**
             * перезапускаем проверку
             */
            restartCheck(){
                this.stopCheck();
                this.startCheck();
            },
            /**
             * прячем или показываем кнопку
             */
            tryToSetShow(){
                if(this.flightLastUpdate && new Date().getTime() - this.flightLastUpdate > this.flightUpdateInterval) {
                    this.shouldShow = true;
                    this.stopCheck()
                } else {
                    this.shouldShow = false;
                }
            }
        }
    };

</script>